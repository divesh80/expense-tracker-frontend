import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useRouter } from 'next/router';

interface LayoutProps {
    children: ReactNode;
    actions?: ReactNode; // Allow dynamic actions in the header
}

const Layout: React.FC<LayoutProps> = ({ children, actions }) => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth');
    };

    return (
        <>
            {/* App Header */}
            <AppBar
                position='static'
                sx={{
                    backgroundColor: '#1f2937', // Neutral dark shade for the header
                    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    {/* App Title */}
                    <Typography
                        variant='h6'
                        onClick={() => router.push('/')}
                        sx={{
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            color: '#ffffff',
                            '&:hover': { color: '#d1d5db' }, // Slight hover effect
                        }}
                    >
                        Expense Tracker
                    </Typography>

                    {/* Header Actions */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        {/* Conditionally Render Analytics Button */}
                        {router.pathname !== '/analytics' && (
                            <Button
                                variant='text'
                                onClick={() => router.push('/analytics')}
                                sx={{
                                    color: '#d1d5db',
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    '&:hover': { color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.1)' }, // Subtle hover effect
                                }}
                            >
                                Analytics
                            </Button>
                        )}
                        {actions}
                        <Button
                            variant='text'
                            onClick={handleLogout}
                            sx={{
                                color: '#d1d5db',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                '&:hover': { color: '#ffffff', backgroundColor: 'rgba(255, 255, 255, 0.1)' }, // Subtle hover effect
                            }}
                        >
                            Logout
                        </Button>
                    </Box>
                </Toolbar>
            </AppBar>

            {/* Main Content */}
            <Box
                component='main'
                sx={{
                    backgroundColor: '#f3f4f6', // Light neutral background for the content
                    color: '#1f2937', // Dark text for contrast
                    padding: 3,
                    minHeight: '100vh',
                }}
            >
                {children}
            </Box>
        </>
    );
};

export default Layout;
