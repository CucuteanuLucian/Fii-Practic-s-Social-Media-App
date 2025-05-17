'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

const LogoutPage: React.FC = () => {
    const router = useRouter();

    useEffect(() => {
        localStorage.clear();
        router.push('/');
    }, [router]);

    return <p>Logging out...</p>;
};

export default LogoutPage;
