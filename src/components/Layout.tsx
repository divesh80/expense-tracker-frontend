import React, { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';

const Layout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        router.push('/auth');
    };

    return (
        <>
            <AppBar position='static'>
                <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant='h6' component='div'>
                        Expense Tracker
                    </Typography>
                    <div>
                        <Button color='inherit' onClick={() => router.push('/analytics')}>
                            Analytics
                        </Button>
                        <Button color='inherit' onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <main>{children}</main>
        </>
    );
};

export default Layout;
