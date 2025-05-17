'use client';

import Link from 'next/link';

import { Button, Container, Typography } from '@mui/material';

const Startpage = () => {
    return (
        <Container>
            <Typography variant='h4' gutterBottom>
                Welcome!
            </Typography>
            <Link href='/login' passHref>
                <Button variant='contained' color='primary'>
                    Login
                </Button>
            </Link>
            <Link href='/register' passHref>
                <Button variant='contained' color='primary'>
                    Register
                </Button>
            </Link>
        </Container>
    );
};

export default Startpage;
