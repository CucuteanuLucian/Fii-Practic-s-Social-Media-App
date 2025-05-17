'use client';

import { useCallback, useState } from 'react';

import { Transition } from '@headlessui/react';
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export type NotificationType = 'success' | 'error';

export interface Notification {
    id: string;
    type: NotificationType;
    message: string;
}

export const useNotification = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const showNotification = useCallback((type: NotificationType, message: string) => {
        const id = crypto.randomUUID();
        setNotifications((prev) => [...prev, { id, type, message }]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((notification) => notification.id !== id));
        }, 3000);
    }, []);

    const Notification = () => (
        <div className='fixed top-20 right-4 z-50 space-y-4'>
            {notifications.map(({ id, type, message }) => {
                const icon =
                    type === 'success' ? (
                        <CheckCircleIcon className='h-6 w-6 text-green-500 dark:text-green-400' aria-hidden='true' />
                    ) : (
                        <ExclamationCircleIcon className='h-6 w-6 text-red-500 dark:text-red-400' aria-hidden='true' />
                    );

                const bgColor = type === 'success' ? 'bg-green-50 dark:bg-green-900' : 'bg-red-50 dark:bg-red-900';

                const textColor =
                    type === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200';

                return (
                    <Transition key={id} show as='div'>
                        <div className={`rounded-lg shadow-lg ${bgColor}`}>
                            <div className='flex items-center p-4'>
                                <div className='flex-shrink-0'>{icon}</div>
                                <div className={`ml-3 flex-1 text-sm font-medium ${textColor}`}>{message}</div>
                                <button
                                    type='button'
                                    className='ml-4 inline-flex rounded-md bg-transparent text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-gray-300 focus:outline-none dark:hover:text-gray-300 dark:focus:ring-gray-600'
                                    onClick={() =>
                                        setNotifications((prev) =>
                                            prev.filter((notification) => notification.id !== id)
                                        )
                                    }>
                                    <XMarkIcon className='h-5 w-5' aria-hidden='true' />
                                </button>
                            </div>
                        </div>
                    </Transition>
                );
            })}
        </div>
    );

    return { Notification, showNotification };
};
