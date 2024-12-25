import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';

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

    // Populate fields with initialData when editing
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
            // Clear fields only if creating a new expense
            setTitle('');
            setAmount('');
            setDate('');
            setCategory('');
            setPaymentSource('');
        }
    };

    return (
        <Box
            component='form'
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 400, margin: 'auto' }}
        >
            <TextField
                label='Title'
                variant='outlined'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <TextField
                label='Amount'
                variant='outlined'
                type='number'
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />
            <TextField
                label='Date'
                variant='outlined'
                type='date'
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />
            <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select value={category} onChange={(e) => setCategory(e.target.value)} label='Category'>
                    {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>
                            {cat}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <FormControl fullWidth required>
                <InputLabel>Payment Source</InputLabel>
                <Select value={paymentSource} onChange={(e) => setPaymentSource(e.target.value)} label='Payment Source'>
                    {paymentSources.map((source) => (
                        <MenuItem key={source} value={source}>
                            {source}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
            <Button variant='contained' type='submit' sx={{ alignSelf: 'center' }}>
                {initialData ? 'Update Expense' : 'Add Expense'}
            </Button>
        </Box>
    );
};

export default ExpenseForm;
