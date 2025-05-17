'use client';

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import api from '@/app/api';
import { Box, Button, Container, TextField, Typography } from '@mui/material';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleRegister = async () => {
        try {
            const response = await api.post('/register', { email, password });
            console.log(response.data);
            if (response.status === 201) {
                router.push('/');
                alert('Registration successful! Please log in.');
            }
        } catch (error) {
            console.error('Register failed:', error);
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
                    Register
                </Typography>
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
                <Button variant='contained' color='primary' fullWidth onClick={handleRegister} sx={{ mt: 2 }}>
                    Register
                </Button>
            </Box>
        </Container>
    );
};

export default Register;
