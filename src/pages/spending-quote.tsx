import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Slide } from '@mui/material';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { quotes } from '../utils/quotes';

const SpendingPopup = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentQuoteIndex, setCurrentQuoteIndex] = useState(() => Math.floor(Math.random() * quotes.length));

    useEffect(() => {
        const showPopup = () => {
            setIsOpen(true);

            // Automatically close the popup after 8 seconds
            setTimeout(() => setIsOpen(false), 8000);
        };

        // Show the popup initially after 3 seconds
        const initialTimeout = setTimeout(showPopup, 3000);

        // Repeatedly show the popup every 15 seconds
        const interval = setInterval(() => {
            setCurrentQuoteIndex(Math.floor(Math.random() * quotes.length));
            showPopup();
        }, 20000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <Slide direction='up' in={isOpen} mountOnEnter unmountOnExit>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    background: 'linear-gradient(135deg, #42a5f5, #66bb6a)',
                    borderRadius: 8,
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                    color: '#ffffff',
                    padding: 2,
                    width: '260px',
                    zIndex: 1000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                {/* Character/Icon */}
                <WalletIcon sx={{ fontSize: 30, color: '#ffffff' }} />

                {/* Quote Text */}
                <Typography
                    variant='body2'
                    align='center'
                    sx={{
                        fontWeight: '500',
                        fontSize: '0.85rem',
                        marginBottom: 1,
                    }}
                >
                    {quotes[currentQuoteIndex]}
                </Typography>

                {/* Dismiss Button */}
                <Button
                    size='small'
                    sx={{
                        backgroundColor: '#ffffff',
                        color: '#42a5f5',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        padding: '4px 12px',
                        fontSize: '0.7rem',
                        '&:hover': { backgroundColor: '#e3f2fd' },
                    }}
                    onClick={handleClose}
                >
                    Dismiss
                </Button>
            </Box>
        </Slide>
    );
};

export default SpendingPopup;
