import React from 'react';
import Image from 'next/image';
import { Box, Typography, Card, CardContent, Chip, IconButton, Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Expense {
    id: string;
    title: string;
    amount: number;
    date: string;
    category: string;
    paymentSource: string;
}

interface ExpenseListProps {
    expenses: Expense[];
    onEdit: (expense: Expense) => void;
    onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit, onDelete }) => {
    const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <Box sx={{ marginTop: 4 }}>
            {/* Header Section */}
            <Typography variant='h5' align='center' sx={{ fontWeight: 'bold', marginBottom: 3 }}>
                Your Expenses
            </Typography>

            {/* Total Expenses Summary */}
            {expenses.length > 0 && (
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        background: 'linear-gradient(90deg, #e3f2fd, #bbdefb)',
                        padding: 2,
                        borderRadius: 2,
                        marginBottom: 3,
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                        Total Expenses:
                    </Typography>
                    <Typography variant='h6' sx={{ fontWeight: 'bold', color: '#0d47a1' }}>
                        ₹{totalAmount.toFixed(2)}
                    </Typography>
                </Box>
            )}

            {/* Expense Tiles */}
            <Grid container spacing={3}>
                {expenses.length ? (
                    expenses.map((expense) => (
                        <Grid item xs={12} sm={6} md={4} key={expense.id}>
                            <Card
                                sx={{
                                    backgroundColor: '#f9f9f9',
                                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                                    padding: 2,
                                    borderRadius: 2,
                                    position: 'relative',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-5px)',
                                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.15)',
                                    },
                                }}
                            >
                                <CardContent>
                                    {/* Title and Amount */}
                                    <Typography
                                        variant='h6'
                                        sx={{
                                            fontWeight: 'bold',
                                            marginBottom: 1,
                                            color: '#424242',
                                        }}
                                    >
                                        {expense.title}
                                    </Typography>
                                    <Typography
                                        variant='body1'
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#1b5e20',
                                            marginBottom: 2,
                                        }}
                                    >
                                        ₹{expense.amount.toFixed(2)}
                                    </Typography>

                                    {/* Category and Payment Source */}
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', marginBottom: 1 }}>
                                        <Chip
                                            label={`Category: ${expense.category}`}
                                            sx={{
                                                backgroundColor: '#e8f5e9',
                                                color: '#2e7d32',
                                                fontWeight: '500',
                                            }}
                                        />
                                        <Chip
                                            label={`Payment: ${expense.paymentSource}`}
                                            sx={{
                                                backgroundColor: '#e3f2fd',
                                                color: '#1565c0',
                                                fontWeight: '500',
                                            }}
                                        />
                                    </Box>

                                    {/* Date */}
                                    <Typography variant='body2' sx={{ color: '#757575' }}>
                                        Date: {new Date(expense.date).toLocaleDateString()}
                                    </Typography>
                                </CardContent>

                                {/* Action Buttons */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        display: 'flex',
                                        gap: 1,
                                    }}
                                >
                                    <IconButton
                                        onClick={() => onEdit(expense)}
                                        sx={{
                                            color: '#1565c0',
                                            '&:hover': { color: '#0d47a1' },
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => onDelete(expense.id)}
                                        sx={{
                                            color: '#e53935',
                                            '&:hover': { color: '#c62828' },
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Box sx={{ textAlign: 'center', marginTop: 4, width: '100%' }}>
                        <Image
                            src='/no_expense.jpg'
                            alt='No Expenses'
                            width={150}
                            height={150}
                            style={{ marginBottom: '10px' }}
                        />
                        <Typography variant='body1' color='text.secondary'>
                            No expenses found. Add some to get started!
                        </Typography>
                    </Box>
                )}
            </Grid>
        </Box>
    );
};

export default ExpenseList;
