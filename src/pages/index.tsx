import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import Layout from '../components/Layout';
import { CircularProgress, Card, CardContent, Typography, Grid, Box } from '@mui/material';
import api from '../utils/axios';
import { toast } from 'react-toastify';

const Home = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const fetchExpenses = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You are not logged in. Redirecting to login page.');
                router.push('/auth');
                return;
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await api.get('/expenses');
            setExpenses(response.data);
        } catch (err) {
            toast.error('Failed to fetch expenses. Please try again later.');
            console.error('Error fetching expenses:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Typography
                variant='h3'
                sx={{
                    marginTop: 1,
                    textAlign: 'center',
                    marginBottom: 1,
                    fontWeight: 'bold',
                    color: 'primary.main',
                }}
            >
                Expense Tracker Dashboard
            </Typography>
            <Typography
                variant='subtitle1'
                sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    marginBottom: 2,
                }}
            >
                Track, manage, and analyze your expenses effortlessly.
            </Typography>

            {/* Dashboard Overview */}
            <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant='h6' color='text.secondary'>
                                Total Expenses
                            </Typography>
                            <Typography variant='h5'>
                                ${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant='h6' color='text.secondary'>
                                Total Transactions
                            </Typography>
                            <Typography variant='h5'>{expenses.length}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant='h6' color='text.secondary'>
                                Categories Used
                            </Typography>
                            <Typography variant='h5'>
                                {Array.from(new Set(expenses.map((e) => e.category))).length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant='h6' color='text.secondary'>
                                Last Transaction
                            </Typography>
                            <Typography variant='body1'>
                                {expenses[0]?.title || 'N/A'} (${expenses[0]?.amount || 0})
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content: Form and List */}
            <Grid container spacing={4}>
                {/* Expense Form */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                Add New Expense
                            </Typography>
                            <ExpenseForm
                                onSubmit={async (data) => {
                                    try {
                                        await api.post('/expenses', data);
                                        fetchExpenses();
                                        toast.success('Expense added successfully!');
                                    } catch (err) {
                                        toast.error('Failed to add expense. Please try again.');
                                    }
                                }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Expense List */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ boxShadow: 3 }}>
                        <CardContent>
                            <Typography variant='h6' sx={{ marginBottom: 2 }}>
                                Your Expenses
                            </Typography>
                            {expenses.length ? (
                                <ExpenseList expenses={expenses} />
                            ) : (
                                <Typography variant='body1' color='text.secondary'>
                                    No expenses found. Start by adding a new expense.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Layout>
    );
};

export default Home;
