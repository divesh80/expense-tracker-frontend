/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { TextField, Button, Typography, Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import api from '../utils/axios';
import SpendingPopup from './spending-quote';

const Auth = () => {
    const [mode, setMode] = useState<'login' | 'signup'>('login'); // Toggle between login and signup
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            if (mode === 'signup') {
                // Signup API
                await api.post('/auth/register', { phoneNumber, password });
                alert('Signup successful! Please log in.');
                setMode('login'); // Switch to login after successful signup
            } else {
                // Login API
                const response = await api.post('/auth/login', { phoneNumber, password });
                const { token } = response.data;

                // Save token to localStorage
                localStorage.setItem('token', token);

                // Redirect to home page
                router.push('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <Box sx={{ maxWidth: 400, margin: 'auto', marginTop: 10 }}>
            <SpendingPopup />
            <Typography variant='h4' sx={{ marginBottom: 4 }}>
                {mode === 'login' ? 'Login' : 'Signup'}
            </Typography>
            {error && (
                <Typography color='error' sx={{ marginBottom: 2 }}>
                    {error}
                </Typography>
            )}
            <ToggleButtonGroup
                value={mode}
                exclusive
                onChange={(_, newMode) => setMode(newMode || 'login')}
                sx={{ marginBottom: 4 }}
            >
                <ToggleButton value='login'>Login</ToggleButton>
                <ToggleButton value='signup'>Signup</ToggleButton>
            </ToggleButtonGroup>
            <form onSubmit={handleSubmit}>
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
                    {mode === 'login' ? 'Login' : 'Signup'}
                </Button>
            </form>
        </Box>
    );
};

export default Auth;
