import React from 'react';

import { PostProvider } from '@/app/providers/PostProvider';

import PostInput from './PostInput';
import PostsList from './PostsList';

const ViewPosts = () => {
    return (
        <PostProvider>
            <main className='mtb mx-auto mt-[100px] mb-[100px] flex max-w-2xl flex-col justify-center gap-6 px-3 pt-6 font-[family-name:var(--font-geist-sans)] sm:gap-12 sm:px-0 sm:pt-0'>
                <PostInput />
                <PostsList />
            </main>
        </PostProvider>
    );
};

export default ViewPosts;
