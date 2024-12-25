import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import Layout from '../components/Layout';
import { CircularProgress, Card, CardContent, Typography, Grid, Box, Modal } from '@mui/material';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import SpendingPopup from './spending-quote';
import { Head } from 'next/document';

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

    const calculateCurrentMonthExpenses = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        return expenses
            .filter((expense) => {
                const expenseDate = new Date(expense.date);
                return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
            })
            .reduce((sum, expense) => sum + expense.amount, 0);
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
            <SpendingPopup />
            <Box sx={{ padding: 4, backgroundColor: '#f7f9fc', minHeight: '100vh' }}>
                <Box
                    sx={{
                        textAlign: 'center',
                        padding: 4,
                        marginBottom: 4,
                        background: 'linear-gradient(135deg, #1e88e5, #43a047)',
                        borderRadius: 3,
                        boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.15)',
                        color: '#ffffff',
                    }}
                >
                    {/* Main Header */}
                    <Typography
                        variant='h3'
                        align='center'
                        sx={{
                            fontWeight: 'bold',
                            letterSpacing: '0.5px',
                            textShadow: '0px 3px 6px rgba(0, 0, 0, 0.3)',
                            marginBottom: 1,
                        }}
                    >
                        Expense Tracker Dashboard
                    </Typography>

                    {/* Subheading */}
                    <Typography
                        variant='subtitle1'
                        align='center'
                        sx={{
                            fontWeight: '300',
                            fontSize: '1.2rem',
                            marginBottom: 3,
                            opacity: 0.9,
                        }}
                    >
                        Track, manage, and analyze your expenses effortlessly.
                    </Typography>
                </Box>

                {/* Dashboard Overview */}
                <Grid container spacing={4} sx={{ marginBottom: 4 }}>
                    {[
                        {
                            title: 'Overall Expenses',
                            value: `₹${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}`,
                        },
                        {
                            title: 'Expenses (This Month)',
                            value: `₹${calculateCurrentMonthExpenses().toFixed(2)}`,
                        },
                        { title: 'Total Transactions', value: expenses.length },
                        // {
                        //     title: 'Categories Used',
                        //     value: Array.from(new Set(expenses.map((e) => e.category))).length,
                        // },
                        {
                            title: 'Last Transaction',
                            value: expenses[0] ? `${expenses[0].title} (₹${expenses[0].amount})` : 'N/A',
                        },
                    ].map((item, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    boxShadow: 3,
                                    padding: 2,
                                    background: '#ffffff',
                                    borderRadius: 2,
                                    borderLeft: `4px solid ${index % 2 === 0 ? '#1e88e5' : '#43a047'}`,
                                    transition: 'transform 0.2s ease-in-out',
                                    '&:hover': {
                                        transform: 'scale(1.05)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant='h6'
                                        sx={{ fontWeight: 'bold', color: '#5f6368', marginBottom: 1 }}
                                    >
                                        {item.title}
                                    </Typography>
                                    <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                                        {item.value}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Main Content: Form and List */}
                <Grid container spacing={4}>
                    {/* Expense Form */}
                    <Grid item xs={12} md={4}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2, background: '#ffffff' }}>
                            <ExpenseForm onSubmit={handleCreateExpense} />
                        </Card>
                    </Grid>

                    {/* Expense List */}
                    <Grid item xs={12} md={8}>
                        <Card sx={{ boxShadow: 3, borderRadius: 2, background: '#ffffff' }}>
                            <CardContent>
                                {expenses.length ? (
                                    <ExpenseList
                                        expenses={expenses}
                                        onEdit={handleOpenEditModal}
                                        onDelete={handleDeleteExpense}
                                    />
                                ) : (
                                    <Typography variant='body1' align='center' color='text.secondary'>
                                        No expenses found. Start by adding a new expense.
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

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
                            bgcolor: '#ffffff',
                            boxShadow: 24,
                            p: 4,
                            borderRadius: 2,
                            maxWidth: 500,
                            width: '100%',
                        }}
                    >
                        <Typography
                            id='edit-expense-modal'
                            variant='h6'
                            align='center'
                            sx={{ marginBottom: 2, color: '#1565c0' }}
                        >
                            Edit Expense
                        </Typography>
                        <ExpenseForm onSubmit={handleEditExpense} initialData={editExpense} />
                    </Box>
                </Modal>
            </Box>
        </Layout>
    );
};

export default Home;
