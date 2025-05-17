'use client';

import { use, useEffect, useState } from 'react';

import api from '@/app/api';
import { Comment } from '@/app/types';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Avatar, Button, Typography } from '@mui/material';

import { formatDistanceToNow, set } from 'date-fns';

const CommentItem = ({
    content,
    created_at,
    username,
    sentiment,
    onDeleteComment
}: {
    content: string;
    created_at: string;
    username: string;
    sentiment: string;
    onDeleteComment: () => void;
}) => {
    return (
        <div className='mb-2 rounded-lg bg-gray-50 p-4 dark:bg-[#2d2d2d]'>
            <div className='mb-2 flex items-center justify-between align-baseline'>
                <div className='mb-2 flex items-center justify-between gap-2'>
                    <span>
                        <Avatar sx={{ height: '2vw', width: '2vw' }} />
                    </span>
                    <span className='font-medium text-gray-600 dark:text-white'>{username}</span>
                    <div className='flex h-6 w-16 items-center justify-center rounded-full bg-gray-300 dark:bg-gray-600'>
                        <span>{sentiment}</span>
                    </div>

                    <span className='text-sm text-gray-400 dark:text-gray-200'>
                        {formatDistanceToNow(new Date(created_at))}
                    </span>
                </div>

                <button onClick={onDeleteComment} className='cursor-pointer text-red-600 hover:text-red-800'>
                    <i className='ri-delete-bin-line'></i>
                </button>
            </div>
            <p className='break-words text-gray-700 dark:text-white'>{content}</p>
        </div>
    );
};
export default function CommentsModal({
    open,
    setOpen,
    comments,
    onCreateComment,
    onDeleteComment
}: {
    comments: Comment[] | null;
    open: boolean;
    setOpen: (open: boolean) => void;
    onCreateComment: (commentContent: string, username: string) => void;
    onDeleteComment: (commentId: string) => void;
}) {
    const [commentContent, setCommentContent] = useState<string>('');
    console.log('Comments prop:', comments);

    const handleCommentSubmit = () => {
        const username = localStorage.getItem('username') || 'anonymous';
        if (commentContent.trim()) {
            onCreateComment(commentContent, username);
            setCommentContent('');
        }
    };

    const [commentsSentiment, setCommentsSentiment] = useState('neutral');

    const fetchCommentsSentiment = async () => {
        try {
            const response = await api.get('/comments/sentiments');
            if (response.status === 200) {
                const sentiment = response.data.all_sentiment['label'];
                setCommentsSentiment(sentiment);
            }
        } catch (error) {
            console.error('Failed to fetch comment sentiment:', error);
        }
    };

    return (
        <Dialog open={open} onClose={setOpen} className='relative z-90'>
            <DialogBackdrop className='fixed inset-0 bg-gray-500/75 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in' />

            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                    <DialogPanel className='light-bg-white_dark-bg-neutral-800 relative transform overflow-hidden rounded-lg text-left shadow-xl data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95'>
                        <div className='light-bg-white_dark-bg-neutral-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                            <div className='sm:items-start, justify-between sm:flex sm:gap-4'>
                                <div className='mt-3 text-center sm:mt-0 sm:text-left'>
                                    <DialogTitle
                                        as='h4'
                                        className='light-text-gray-900_dark-text-gray-100 text-base font-semibold'>
                                        Comments
                                        <br />
                                        Current Sentiment: <span className='text-purple-600'>{commentsSentiment}</span>
                                    </DialogTitle>
                                </div>
                                <Button
                                    variant='contained'
                                    sx={{ height: '3vw', width: '12vw' }}
                                    onClick={fetchCommentsSentiment}>
                                    Run Sentiment Analysis on Comments
                                </Button>
                            </div>
                            <Typography></Typography>
                        </div>
                        <div className=''>
                            <div className='m-4'>
                                <div className='mb-4 flex space-x-4'>
                                    <input
                                        className='comment-input flex-1 rounded-lg bg-gray-100 px-4 py-4 text-sm text-gray-700 dark:bg-[#404040] dark:text-[#e5e5e5]'
                                        placeholder='Write a comment...'
                                        value={commentContent}
                                        onChange={(e) => setCommentContent(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                handleCommentSubmit();
                                            }
                                        }}
                                    />
                                    <button
                                        onClick={handleCommentSubmit}
                                        className='cursor-pointer rounded-lg bg-purple-600 p-4 text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-500'>
                                        <svg
                                            xmlns='http://www.w3.org/2000/svg'
                                            fill='none'
                                            viewBox='0 0 24 24'
                                            strokeWidth={1.5}
                                            stroke='currentColor'
                                            className='size-6'>
                                            <path
                                                strokeLinecap='round'
                                                strokeLinejoin='round'
                                                d='M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5'
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <div
                                    className={`text-center text-gray-500 ${!(comments ?? []).length ? '' : 'hidden'}`}>
                                    No comments yet.
                                </div>
                                <div className='h-[250px] overflow-scroll'>
                                    {(comments ?? []).map((comment) => (
                                        <CommentItem
                                            key={comment.id}
                                            content={comment.content}
                                            created_at={comment.created_at}
                                            username={comment.username}
                                            sentiment={comment.sentiment}
                                            onDeleteComment={() => onDeleteComment(comment.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className='light-bg-gray-50_dark-bg-neutral-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                            <button
                                type='button'
                                data-autofocus
                                onClick={() => setOpen(false)}
                                className='light-bg-white_dark-bg-neutral-800 light-text-gray-900_dark-text-gray-100 mt-3 inline-flex w-full cursor-pointer justify-center rounded-md px-3 py-2 text-sm font-semibold shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto dark:ring-gray-700 dark:hover:bg-neutral-700'>
                                Cancel
                            </button>
                        </div>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
