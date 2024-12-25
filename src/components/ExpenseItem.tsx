import React from 'react';
import { Card, CardContent, Typography, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ExpenseItemProps {
    id: string;
    title: string;
    amount: number;
    date: string;
    category: string;
    paymentSource: string;
    onEdit: () => void;
    onDelete: () => void;
}

const ExpenseItem: React.FC<ExpenseItemProps> = ({
    title,
    amount,
    date,
    category,
    paymentSource,
    onEdit,
    onDelete,
}) => {
    return (
        <Card
            sx={{
                marginBottom: 2,
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #f1f8e9, #e3f2fd)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
                },
            }}
        >
            <CardContent>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    {/* Left Section: Details */}
                    <Box>
                        <Typography
                            variant='h6'
                            sx={{
                                fontWeight: 'bold',
                                color: '#1565c0',
                                marginBottom: 1,
                            }}
                        >
                            {title}
                        </Typography>
                        <Typography
                            variant='body2'
                            sx={{
                                color: '#424242',
                                marginBottom: 0.5,
                            }}
                        >
                            Category: <span style={{ fontWeight: 'bold' }}>{category}</span>
                        </Typography>
                        <Typography
                            variant='body2'
                            sx={{
                                color: '#424242',
                                marginBottom: 0.5,
                            }}
                        >
                            Payment Source: <span style={{ fontWeight: 'bold' }}>{paymentSource}</span>
                        </Typography>
                        <Typography
                            variant='h6'
                            sx={{
                                color: '#2e7d32',
                                fontWeight: 'bold',
                                marginBottom: 0.5,
                            }}
                        >
                            ₹{amount.toFixed(2)}
                        </Typography>
                        <Typography
                            variant='body2'
                            sx={{
                                color: '#757575',
                            }}
                        >
                            Date: {new Date(date).toLocaleDateString()}
                        </Typography>
                    </Box>

                    {/* Right Section: Action Buttons */}
                    <Box>
                        <IconButton
                            onClick={onEdit}
                            sx={{
                                color: '#1565c0',
                                '&:hover': {
                                    color: '#0d47a1',
                                },
                            }}
                        >
                            <EditIcon />
                        </IconButton>
                        <IconButton
                            onClick={onDelete}
                            sx={{
                                color: '#d32f2f',
                                '&:hover': {
                                    color: '#b71c1c',
                                },
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ExpenseItem;
