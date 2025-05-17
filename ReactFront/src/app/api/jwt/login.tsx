import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import api from '@/app/api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/app/constants';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const loginUrl = `${process.env.NEXT_PUBLIC_API_URL}/login`;
            console.log('Login URL:', loginUrl);
            const response = await api.post('/login', { email, password });

            if (response.status === 200) {
                const { access_token, refresh_token, username, email } = response.data;

                localStorage.setItem(ACCESS_TOKEN, access_token);
                localStorage.setItem(REFRESH_TOKEN, refresh_token);
                localStorage.setItem('username', username);
                localStorage.setItem('email', email);

                console.log(username);

                console.log('Login successful, tokens saved in localStorage.');

                router.push('/dashboard');
            } else {
                console.error('Invalid credentials');
            }
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <Container maxWidth='sm'>
            <Box
                display='flex'
                flexDirection='column'
                alignItems='center'
                justifyContent='center'
                height='60vh'
                mt='20vh'
                boxShadow={3}
                borderRadius={2}
                p={4}
                bgcolor='background.paper'>
                <Typography variant='h4' gutterBottom>
                    Login
                </Typography>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleLogin();
                    }}
                    style={{ width: '100%' }}>
                    <TextField
                        label='Email'
                        type='email'
                        fullWidth
                        margin='normal'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label='Password'
                        type='password'
                        fullWidth
                        margin='normal'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 2 }}>
                        Login
                    </Button>
                </form>
            </Box>
        </Container>
    );
};

export default Login;
