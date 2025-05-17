'use client';

import { useState } from 'react';

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DeleteModal({
    open,
    setOpen,
    onDelete
}: {
    open: boolean;
    setOpen: (open: boolean) => void;
    onDelete: () => void;
}) {
    return (
        <Dialog open={open} onClose={setOpen} className='relative z-90'>
            <DialogBackdrop className='fixed inset-0 bg-gray-500/75 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in' />

            <div className='fixed inset-0 z-10 w-screen overflow-y-auto'>
                <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
                    <DialogPanel className='light-bg-white_dark-bg-neutral-800 relative transform overflow-hidden rounded-lg text-left shadow-xl data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95'>
                        <div className='light-bg-white_dark-bg-neutral-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4'>
                            <div className='sm:flex sm:items-start'>
                                <div className='light-bg-red-100_dark-bg-red-900 mx-auto flex size-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:size-10'>
                                    <ExclamationTriangleIcon
                                        aria-hidden='true'
                                        className='light-text-red-600_dark-text-red-400 size-6'
                                    />
                                </div>
                                <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                                    <DialogTitle
                                        as='h3'
                                        className='light-text-gray-900_dark-text-gray-100 text-base font-semibold'>
                                        Delete Post
                                    </DialogTitle>
                                    <div className='mt-2'>
                                        <p className='light-text-gray-500_dark-text-gray-400 text-sm'>
                                            Are you sure you want to delete this post? <br /> This action cannot be
                                            undone.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='light-bg-gray-50_dark-bg-neutral-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6'>
                            <button
                                type='button'
                                onClick={onDelete}
                                className='inline-flex w-full cursor-pointer justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto dark:bg-red-700 dark:hover:bg-red-600'>
                                Delete
                            </button>
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
