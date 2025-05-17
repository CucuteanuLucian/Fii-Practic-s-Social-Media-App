'use client';

import { useState } from 'react';

import api from '@/app/api';
import { usePosts } from '@/app/providers/PostProvider';
import { Button, Typography } from '@mui/material';

const PostInput = () => {
    const { createPost } = usePosts();
    const [postContent, setPostContent] = useState('');
    const [charCount, setCharCount] = useState(0);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');

    const handlePostChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setError(value.length > 300 ? 'Character limit exceeded' : '');
        setPostContent(value);
        setCharCount(value.length);
    };

    const handlePostSubmit = async () => {
        if (postContent.trim()) {
            console.log(postContent);
            const storedUsername = localStorage.getItem('username');
            const postCreated = await createPost(postContent, storedUsername || '');
            if (postCreated) {
                setPostContent('');
                setCharCount(0);
            }
        }
    };

    const [postsSentiment, setPostsSentiment] = useState('neutral');

    const fetchPostsSentiment = async () => {
        try {
            const response = await api.get('/posts/sentiments');
            if (response.status === 200) {
                const sentiment = response.data.sentiment['label'];
                setPostsSentiment(sentiment);
            }
        } catch (error) {
            console.error('Failed to fetch comment sentiment:', error);
        }
    };

    return (
        <div className='light-bg-white_dark_bg-neutral-800 mb-8 rounded-lg p-6 shadow-sm'>
            <textarea
                value={postContent}
                onChange={handlePostChange}
                className='post-input mb-4 h-32 w-full resize-none rounded-lg p-6 text-base text-gray-700 placeholder-gray-400 shadow-sm dark:text-white'
                placeholder="What's on your mind?"
            />

            <div className='flex items-center justify-between'>
                <div className='flex gap-1'>
                    <span className={`text-sm text-gray-500 ${error && 'text-red-700'}`}>{charCount}/300</span>
                    <span className={`text-sm ${error ? 'text-red-700' : 'hidden'}`}>{error}</span>
                </div>
                Current Sentiment: <span className='text-purple-600'>{postsSentiment}</span>
                <Button variant='contained' sx={{ height: '3vw', width: '12vw' }} onClick={fetchPostsSentiment}>
                    Run Sentiment Analysis on All Posts
                </Button>
                <button
                    onClick={handlePostSubmit}
                    disabled={!!error || charCount === 0}
                    className='cursor-pointer rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-500'>
                    Post
                </button>
            </div>
        </div>
    );
};

export default PostInput;
