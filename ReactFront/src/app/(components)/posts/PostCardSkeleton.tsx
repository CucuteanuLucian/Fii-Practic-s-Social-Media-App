import { Avatar } from '@mui/material';

const PostCardSkeleton = () => {
    return (
        <div className='light-bg-white_dark_bg-neutral-800 animate-pulse rounded-lg p-6 shadow-sm'>
            {/* Header with user and emotion */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center space-x-2'>
                    {/* User avatar */}
                    {/* User name */}
                    <div className='h-4 w-24 rounded-md bg-gray-300 dark:bg-gray-600'></div>

                    {/* Emotion tag */}
                    <div className='h-6 w-16 rounded-full bg-gray-300 dark:bg-gray-600'></div>
                </div>

                {/* Edit/Delete buttons */}
                <div className='mt-2 flex items-center space-x-2'>
                    <div className='h-4 w-12 rounded-md bg-gray-300 dark:bg-gray-600'></div>
                    <div className='h-4 w-14 rounded-md bg-gray-300 dark:bg-gray-600'></div>
                </div>
            </div>

            {/* Timestamp */}
            <div className='mt-1 h-3 w-32 rounded-md bg-gray-300 dark:bg-gray-600'></div>

            {/* Post content */}
            <div className='my-4'>
                <div className='mb-2 h-4 w-full rounded-md bg-gray-300 dark:bg-gray-600'></div>
                <div className='mb-2 h-4 w-full rounded-md bg-gray-300 dark:bg-gray-600'></div>
                <div className='h-4 w-3/4 rounded-md bg-gray-300 dark:bg-gray-600'></div>
            </div>

            {/* Likes and comments */}
            <div className='mb-4 flex items-center space-x-6'>
                {/* Likes */}
                <div className='flex items-center space-x-2'>
                    <div className='h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600'></div>
                    <div className='h-4 w-4 rounded-md bg-gray-300 dark:bg-gray-600'></div>
                </div>

                {/* Comments */}
                <div className='flex items-center space-x-2'>
                    <div className='h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-600'></div>
                    <div className='h-4 w-4 rounded-md bg-gray-300 dark:bg-gray-600'></div>
                </div>
            </div>
        </div>
    );
};

export default PostCardSkeleton;
