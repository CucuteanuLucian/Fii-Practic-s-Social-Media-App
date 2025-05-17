'use client';

import React from 'react';

import { useRouter } from 'next/navigation';

import { Avatar, Button, Container } from '@mui/material';

import Navbar from '../(components)/Navbar';

const ProfilePage: React.FC = () => {
    const router = useRouter();

    const handleLogout = () => {
        router.push('/logout');
    };
    const username = localStorage.getItem('username') || 'No username provided';
    const email = localStorage.getItem('email') || 'No email provided';

    return (
        <div>
            <Navbar />
            <br />
            <br />
            <br />
            <Container
                sx={{ justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
                <b>Profile Page</b>

                <Avatar alt={username} src='/static/images/avatar/1.jpg' sx={{ width: '10vw', height: '10vw' }} />
                <p>
                    <strong>Username: </strong> {username}
                </p>
                <p>
                    <strong>E-mail: </strong> {email}
                </p>
                <Button onClick={handleLogout} variant='contained' color='primary'>
                    Logout
                </Button>
            </Container>
        </div>
    );
};

export default ProfilePage;
