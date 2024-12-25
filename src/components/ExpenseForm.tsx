import React, { useState, useEffect } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Card,
    CardContent,
    Typography,
} from '@mui/material';

interface ExpenseFormProps {
    onSubmit: (data: { title: string; amount: number; date: string; category: string; paymentSource: string }) => void;
    initialData?: { title: string; amount: number; date: string; category: string; paymentSource: string }; // Optional for edit
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onSubmit, initialData }) => {
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [paymentSource, setPaymentSource] = useState('');

    const categories = ['Food', 'Transport', 'Entertainment', 'Clothes', 'Electronics', 'Utilities', 'Lend', 'Others'];
    const paymentSources = ['Credit Card', 'Debit Card', 'Cash', 'UPI-Paytm', 'UPI-GPay', 'UPI-PhonePe', 'UPI-Others'];

    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || '');
            setAmount(initialData.amount.toString() || '');
            setDate(initialData.date || '');
            setCategory(initialData.category || '');
            setPaymentSource(initialData.paymentSource || '');
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ title, amount: parseFloat(amount), date, category, paymentSource });
        if (!initialData) {
            setTitle('');
            setAmount('');
            setDate('');
            setCategory('');
            setPaymentSource('');
        }
    };

    return (
        <Card
            sx={{
                maxWidth: 500,
                margin: 'auto',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                borderRadius: 4,
                background: 'linear-gradient(135deg, #ffffff, #f9f9f9)',
                padding: 3,
            }}
        >
            <CardContent>
                <Typography
                    variant='h5'
                    align='center'
                    gutterBottom
                    sx={{
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: 2,
                    }}
                >
                    {initialData ? 'Edit Expense' : 'Add New Expense'}
                </Typography>
                <Box
                    component='form'
                    onSubmit={handleSubmit}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 3,
                        padding: 2,
                    }}
                >
                    <TextField
                        label='Title'
                        variant='outlined'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: '#1565c0',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#1565c0',
                                },
                            },
                        }}
                    />
                    <TextField
                        label='Amount'
                        variant='outlined'
                        type='number'
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: '#43a047',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#43a047',
                                },
                            },
                        }}
                    />
                    <TextField
                        label='Date'
                        variant='outlined'
                        type='date'
                        InputLabelProps={{ shrink: true }}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                    borderColor: '#6a1b9a',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: '#6a1b9a',
                                },
                            },
                        }}
                    />
                    <FormControl fullWidth required>
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label='Category'
                            sx={{
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ff6f00',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#ff6f00',
                                },
                            }}
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth required>
                        <InputLabel>Payment Source</InputLabel>
                        <Select
                            value={paymentSource}
                            onChange={(e) => setPaymentSource(e.target.value)}
                            label='Payment Source'
                            sx={{
                                borderRadius: 2,
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#0288d1',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                    borderColor: '#0288d1',
                                },
                            }}
                        >
                            {paymentSources.map((source) => (
                                <MenuItem key={source} value={source}>
                                    {source}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant='contained'
                        type='submit'
                        sx={{
                            alignSelf: 'center',
                            backgroundColor: '#1565c0',
                            '&:hover': {
                                backgroundColor: '#0d47a1',
                            },
                            textTransform: 'none',
                            fontWeight: 'bold',
                            paddingX: 5,
                            borderRadius: 2,
                        }}
                    >
                        {initialData ? 'Update Expense' : 'Add Expense'}
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ExpenseForm;
