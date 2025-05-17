'use client';

import React, { createContext, useContext, useState } from 'react';

import { NotificationType, useNotification } from '../(components)/hooks/useNotification';
import { Post } from '../types';
import axios from 'axios';

interface PostContextProps {
    posts: Post[] | null;
    fetchPosts: () => Promise<void>;
    fetchComments: (postId: string) => Promise<void>;
    createPost: (content: string, username: string) => Promise<boolean>;
    updatePost: (id: string, updatedPost: Partial<Pick<Post, 'content' | 'likes'>>) => Promise<boolean>;
    likePost: (id: string) => Promise<boolean>;
    deletePost: (id: string) => Promise<void>;
    error: string | null;
    loading: boolean;
    showNotification: (type: NotificationType, message: string) => void;
    addComment: (postId: string, commentContent: string, username: string) => Promise<void>;
    deleteComment: (commentId: string) => Promise<void>;
}

const PostContext = createContext<PostContextProps | undefined>(undefined);

export const PostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { Notification, showNotification } = useNotification();
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const postsUrl = `${baseUrl}/posts`;
    const commentsUrl = `${baseUrl}/comments`;

    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<Post[]>(postsUrl);
            setPosts(response.data);
            showNotification('success', 'Posts fetched successfully!');
        } catch (err) {
            setPosts([]);
            setError('Failed to fetch posts. Please try again later.');
            showNotification('error', 'Failed to fetch posts. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const createPost = async (content: string, username: string) => {
        setError(null);
        try {
            if (!content || content.trim() === '') {
                throw new Error('Post content cannot be empty.');
            }
            console.log(content);
            console.log(username);
            const response = await axios.post<Post>(postsUrl, { content, username });
            setPosts((prevPosts) => [response.data, ...(prevPosts || [])]);
            showNotification('success', 'Post created successfully!');
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to create post. Please try again.';
            setError(message);
            showNotification('error', message);
            return false;
        }
    };

    const likePost = async (id: string) => {
        setError(null);
        try {
            const {
                data: { likes }
            } = await axios.post<{ likes: number }>(`${postsUrl}/${id}/like`);
            if (!likes) {
                throw new Error('Failed to like post.');
            }
            setPosts((prevPosts) => (prevPosts || []).map((post) => (post.id === id ? { ...post, likes } : post)));
            showNotification('success', 'Post liked successfully!');
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to like post. Please try again.';
            setError(message);
            showNotification('error', message);
            return false;
        }
    };

    const updatePost = async (id: string, updatedPost: Partial<Pick<Post, 'content' | 'likes'>>) => {
        setError(null);
        try {
            if (updatedPost.content && updatedPost.content.trim() === '') {
                throw new Error('Post content cannot be empty.');
            }
            const response = await axios.patch<Post>(`${postsUrl}/${id}`, updatedPost);
            setPosts((prevPosts) =>
                (prevPosts || []).map((post) => (post.id === id ? { ...post, ...response.data } : post))
            );
            showNotification('success', 'Post updated successfully!');
            return true;
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to update post. Please try again.';
            setError(message);
            showNotification('error', message);
            return false;
        }
    };

    const deletePost = async (id: string) => {
        setError(null);
        try {
            await axios.delete(`${postsUrl}/${id}`);
            setPosts((prevPosts) => (prevPosts || []).filter((post) => post.id !== id));
            showNotification('success', 'Post deleted successfully!');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete post. Please try again.';
            setError(message);
            showNotification('error', message);
        }
    };

    const addComment = async (postId: string, commentContent: string, username: string) => {
        setError(null);
        try {
            if (!commentContent || commentContent.trim() === '') {
                throw new Error('Comment content cannot be empty.');
            }
            console.log('==================');
            console.log(username);
            const response = await axios.post(commentsUrl, {
                post_id: postId,
                content: commentContent,
                username: username
            });

            if (!response.data) {
                throw new Error('Failed to add comment.');
            }
            setPosts((prevPosts) =>
                (prevPosts || []).map((post) =>
                    post.id === postId
                        ? {
                              ...post,
                              comments: [response.data, ...(post.comments || [])]
                          }
                        : post
                )
            );

            showNotification('success', 'Comment added successfully!');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to add comment. Please try again.';
            setError(message);
            showNotification('error', message);
        }
    };

    const deleteComment = async (commentId: string) => {
        setError(null);
        try {
            await axios.delete(`${commentsUrl}/${commentId}`);
            setPosts((prevPosts) =>
                (prevPosts || []).map((post) => ({
                    ...post,
                    comments: (post.comments || []).filter((comment) => comment.id !== commentId)
                }))
            );
            showNotification('success', 'Comment deleted successfully!');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to delete comment. Please try again.';
            setError(message);
            showNotification('error', message);
        }
    };
    const fetchComments = async (postId: string) => {
        setError(null);
        try {
            const response = await axios.get(`${postsUrl}/${postId}/comments`);
            const comments = response.data;

            setPosts((prevPosts) =>
                (prevPosts || []).map((post) => (post.id === postId ? { ...post, comments } : post))
            );
            showNotification('success', 'Comments loaded successfully!');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Failed to fetch comments. Please try again.';
            setError(message);
            showNotification('error', message);
        }
    };

    return (
        <PostContext.Provider
            value={{
                posts,
                fetchPosts,
                createPost,
                updatePost,
                deletePost,
                addComment,
                deleteComment,
                likePost,
                showNotification,
                fetchComments,
                error,
                loading
            }}>
            <>
                {children}
                <Notification />
            </>
        </PostContext.Provider>
    );
};

export const usePosts = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePosts must be used within a PostProvider');
    }
    return context;
};
