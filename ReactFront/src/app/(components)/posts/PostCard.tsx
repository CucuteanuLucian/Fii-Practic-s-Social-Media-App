'use client';

import React, { useEffect, useState } from 'react';

import { usePosts } from '@/app/providers/PostProvider';
import { Post } from '@/app/types';
import { Avatar } from '@mui/material';

import CommentsModal from '../common/CommentsModal';
import DeleteModal from '../common/DeleteModal';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
    post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
    const { likePost, updatePost, deletePost, addComment, deleteComment, fetchComments } = usePosts();
    const [tempPostContent, setTempPostContent] = React.useState<string>(post.content);
    const [showComments, setShowComments] = React.useState(false);

    const [commentCount, setCommentCount] = React.useState<number>(post.comments?.length ?? 0);
    const [confirmDelete, setConfirmDelete] = React.useState(false);
    const [confirmDeleteComment, setConfirmDeleteComment] = React.useState(false);
    const [showEdit, setShowEdit] = React.useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
        }
    }, []);

    useEffect(() => {
        axios
            .get<Comment[]>(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/posts/${post.id}/comments`)
            .then((res) => {
                if (res.data) {
                    setCommentCount(res.data.length);
                } else {
                    setCommentCount(0);
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    console.log('No comments found for this post');
                    setCommentCount(0);
                } else {
                    console.error('Error fetching comments:', err);
                    setCommentCount(0);
                }
            });
    }, [post.id]);

    const handleToggleComments = async () => {
        if (!showComments) {
            await fetchComments(post.id);
        }
        setShowComments((prev) => !prev);
    };

    const handleOnEdit = async () => {
        if (tempPostContent !== post.content) {
            const updated = await updatePost(post.id, { content: tempPostContent });
            if (updated) {
                setShowEdit(false);
            }
        }
    };

    const handleOnConfirmDelete = () => {
        setConfirmDelete(false);
        deletePost(post.id);
    };

    const handleOnLike = () => {
        likePost(post.id);
    };

    const handleOnCreateComment = (commentContent: string) => {
        addComment(post.id, commentContent, username);
    };

    return (
        <>
            <div className='light-bg-white_dark_bg-neutral-800 rounded-lg p-6 shadow-sm'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                        <span>
                            <Avatar alt={username} sx={{ height: '2vw', width: '2vw' }} />
                        </span>
                        <span className='font-medium text-gray-600 dark:text-white'>{post.username}</span>
                        <div className='lightb-g-gray-100_dark_bg-neutral-700 flex items-center space-x-1 rounded-full px-2 py-1'>
                            <span className='text-xs text-gray-600 capitalize dark:text-white'>
                                {post?.sentiment ?? 'neutral'}
                            </span>
                        </div>
                    </div>

                    <div className='mt-2 flex items-center space-x-2'>
                        <button
                            onClick={() => setShowEdit(true)}
                            className='cursor-pointer text-sm text-blue-600 hover:text-blue-800'>
                            <i className='ri-edit-line'></i> Edit
                        </button>
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className='cursor-pointer text-sm text-red-600 hover:text-red-800'>
                            <i className='ri-delete-bin-line'></i> Delete
                        </button>
                    </div>
                </div>
                <span className='text-sm text-gray-400 dark:text-gray-200'>
                    {formatDistanceToNow(new Date(post.created_at))}
                </span>
                {showEdit ? (
                    <div className='my-4'>
                        <textarea
                            value={tempPostContent}
                            onChange={(e) => setTempPostContent(e.target.value)}
                            className='post-input mb-4 w-full resize-none rounded-lg p-6 text-base text-gray-700 placeholder-gray-400 shadow-sm dark:text-white'
                            placeholder="What's on your mind?"
                        />

                        <div className='flex gap-1'>
                            <button
                                onClick={handleOnEdit}
                                className='cursor-pointer rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-500'>
                                Save
                            </button>
                            <button
                                onClick={() => {
                                    setShowEdit(false);
                                    setTempPostContent(post.content);
                                }}
                                className='light-bg-white_dark-bg-neutral-800 light-text-gray-900_dark-text-gray-100 mt-3 inline-flex w-full cursor-pointer justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto dark:ring-gray-700 dark:hover:bg-neutral-700'>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className='my-4'>
                        <p className='break-words text-gray-700 dark:text-white'>{post.content}</p>
                    </div>
                )}

                <div className='mb-4 flex items-center space-x-6'>
                    <button
                        onClick={handleOnLike}
                        className='hover:text-primary flex cursor-pointer items-center space-x-2 text-gray-500 dark:text-white'>
                        <i className={`ri-heart-${post.likes ? 'fill text-primary' : 'line'} text-xl`}></i>
                        <span>{post.likes}</span>
                    </button>
                    <button
                        onClick={handleToggleComments}
                        className='hover:text-primary flex cursor-pointer items-center space-x-2 text-gray-500 dark:text-white'>
                        <i className='ri-chat-1-line text-xl'></i>
                        <span>{commentCount}</span>
                    </button>
                </div>
            </div>
            <DeleteModal open={confirmDelete} setOpen={setConfirmDelete} onDelete={handleOnConfirmDelete} />
            <CommentsModal
                open={showComments}
                setOpen={setShowComments}
                comments={post.comments ?? []}
                onCreateComment={handleOnCreateComment}
                onDeleteComment={deleteComment}
            />
        </>
    );
};

export default PostCard;
