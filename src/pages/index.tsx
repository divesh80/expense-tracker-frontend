import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import Layout from '../components/Layout';
import { CircularProgress, Card, CardContent, Typography, Grid, Box, Modal } from '@mui/material';
import api from '../utils/axios';
import { toast } from 'react-toastify';

const Home = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editExpense, setEditExpense] = useState(null); // To manage edit functionality
    const [isEditModalOpen, setIsEditModalOpen] = useState(false); // To toggle modal visibility
    const router = useRouter();

    // Fetch all expenses for the logged-in user
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

    // Handle creating a new expense
    const handleCreateExpense = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You are not logged in.');
                router.push('/auth');
                return;
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await api.post('/expenses', data);
            toast.success('Expense added successfully!');
            fetchExpenses();
        } catch (err) {
            toast.error('Failed to add expense. Please try again.');
            console.error('Error adding expense:', err);
        }
    };

    // Handle editing an expense
    const handleEditExpense = async (data) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You are not logged in.');
                router.push('/auth');
                return;
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await api.put(`/expenses/${editExpense.id}`, data);
            toast.success('Expense updated successfully!');
            setEditExpense(null);
            setIsEditModalOpen(false);
            fetchExpenses();
        } catch (err) {
            if (err.response?.status === 401) {
                toast.error('Your session has expired. Please log in again.');
                router.push('/auth');
            } else {
                toast.error('Failed to update expense. Please try again.');
            }
            console.error('Error updating expense:', err);
        }
    };

    // Handle deleting an expense
    const handleDeleteExpense = async (id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You are not logged in.');
                router.push('/auth');
                return;
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            await api.delete(`/expenses/${id}`);
            toast.success('Expense deleted successfully!');
            fetchExpenses();
        } catch (err) {
            toast.error('Failed to delete expense. Please try again.');
            console.error('Error deleting expense:', err);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleOpenEditModal = (expense) => {
        setEditExpense(expense);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditExpense(null);
        setIsEditModalOpen(false);
    };

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
                                ₹{expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}
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
                                {expenses[0]?.title || 'N/A'} (₹{expenses[0]?.amount || 0})
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
                            <ExpenseForm onSubmit={handleCreateExpense} />
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
                                <ExpenseList
                                    expenses={expenses}
                                    onEdit={handleOpenEditModal}
                                    onDelete={handleDeleteExpense}
                                />
                            ) : (
                                <Typography variant='body1' color='text.secondary'>
                                    No expenses found. Start by adding a new expense.
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Edit Expense Modal */}
            {/* Edit Expense Modal */}
            <Modal
                open={isEditModalOpen}
                onClose={handleCloseEditModal}
                aria-labelledby='edit-expense-modal'
                aria-describedby='edit-expense-modal-description'
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        maxWidth: 500,
                        width: '100%',
                    }}
                >
                    <Typography id='edit-expense-modal' variant='h6' sx={{ marginBottom: 2 }}>
                        Edit Expense
                    </Typography>
                    <ExpenseForm onSubmit={handleEditExpense} initialData={editExpense} />
                </Box>
            </Modal>
        </Layout>
    );
};

export default Home;
