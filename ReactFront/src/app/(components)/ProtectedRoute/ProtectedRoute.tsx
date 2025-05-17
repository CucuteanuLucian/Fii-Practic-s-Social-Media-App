'use client';

import { ReactNode, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import api from '@/app/api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/app/constants';

import { jwtDecode } from 'jwt-decode';

interface ProtectedRouteProps {
    children: ReactNode;
}

interface JWTPayload {
    exp: number;
    [key: string]: any;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    const router = useRouter();

    useEffect(() => {
        const auth = async () => {
            const token = localStorage.getItem(ACCESS_TOKEN);
            console.log('Token1:', token);
            if (!token) {
                setIsAuthorized(false);
                router.push('/');
                return;
            }

            const decoded = jwtDecode<JWTPayload>(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            console.log('Token expires at:', tokenExpiration);
            console.log('Current time:', now);

            if (tokenExpiration < now) {
                await refreshToken();
            } else {
                setIsAuthorized(true);
            }
        };

        auth().catch(() => {
            setIsAuthorized(false);
            router.push('/');
        });
    }, []);

    const refreshToken = async () => {
        console.log('Token expired, trying to refresh...');

        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        console.log('Refreshing token using:', refreshToken);

        try {
            const res = await api.post<{ access: string }>('/refresh', { refresh: refreshToken });

            if (res.status === 200 && res.data.access) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                console.log('New token:', res.data.access);

                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
                router.push('/');
            }
        } catch (error) {
            console.error(error);
            setIsAuthorized(false);
            router.push('/');
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return children;
}

export default ProtectedRoute;
