'use client';

import { JSX, useEffect, useState } from 'react';

import { useTheme } from 'next-themes';

interface SwitchOption {
    name: string;
    value: string;
    iconSvg: JSX.Element;
}

const SWITCH_DATA: SwitchOption[] = [
    {
        name: 'Light',
        value: 'light',
        iconSvg: (<svg xmlns="http://www.w3.org/2000/svg" className="size-5" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-5 0h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"></path></svg>),
    },
    {
        name: 'Dark',
        value: 'dark',
        iconSvg: (<svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z"></path></svg>),
    },
];

const ThemeSwitch: React.FC = () => {
    const { theme, setTheme } = useTheme();

    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    return (
        <div className='w-fit'>
            <div className='flex w-auto flex-row justify-center overflow-hidden rounded-full sm:flex-row'>
                {SWITCH_DATA.map((data) => (
                    <button
                        key={data.value}
                        className={`flex items-center gap-2 p-3 text-black dark:text-white ${
                            theme === data.value && mounted ? '' : 'hidden'
                        } cursor-pointer hover:text-purple-600`}
                        onClick={() => {
                            setTheme(data.value === 'light' ? 'dark' : 'light');
                        }}>
                        {data.iconSvg}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ThemeSwitch;
