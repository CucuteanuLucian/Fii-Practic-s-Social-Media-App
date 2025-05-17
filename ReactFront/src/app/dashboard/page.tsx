import React from 'react';

import HomePage from '@/app/(components)/modules/Home';

import ProtectedRoute from '../(components)/ProtectedRoute/ProtectedRoute';

const Home = () => {
    return (
        <ProtectedRoute>
            <HomePage />
        </ProtectedRoute>
    );
};

export default Home;
