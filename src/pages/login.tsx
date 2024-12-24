/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Box } from '@mui/material';
import api from '../utils/axios';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { phoneNumber, password });
            const { token } = response.data;

            // Save token to localStorage
            localStorage.setItem('token', token);

            // Redirect to home page
            router.push('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', marginTop: 10 }}>
            <Typography variant='h4' sx={{ marginBottom: 4 }}>
                Login
            </Typography>
            {error && (
                <Typography color='error' sx={{ marginBottom: 2 }}>
                    {error}
                </Typography>
            )}
            <form onSubmit={handleLogin}>
                <TextField
                    fullWidth
                    label='Phone Number'
                    variant='outlined'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    sx={{ marginBottom: 2 }}
                    required
                />
                <TextField
                    fullWidth
                    label='Password'
                    type='password'
                    variant='outlined'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ marginBottom: 2 }}
                    required
                />
                <Button fullWidth variant='contained' type='submit'>
                    Login
                </Button>
            </form>
        </Box>
    );
};

export default Login;
