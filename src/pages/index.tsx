import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import Layout from '../components/Layout';
import { Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, Typography } from '@mui/material';
import api from '../utils/axios';
import { toast } from 'react-toastify';

const Home = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingExpense, setEditingExpense] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const router = useRouter();

    const fetchExpenses = async () => {
        try {
            console.log('Fetching expenses...');
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('You are not logged in. Redirecting to login page.');
                router.push('/auth');
                return;
            }

            if (!isTokenValid(token)) {
                toast.error('Session expired. Please log in again.');
                localStorage.removeItem('token');
                router.push('/auth');
                return;
            }

            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

            // Fetch expenses
            const response = await api.get('/expenses');
            console.log('Expenses fetched successfully:', response.data); // Log API response
            setExpenses(response.data); // Update state with fetched data
        } catch (err) {
            console.error('Error fetching expenses:', err);
            toast.error('Failed to fetch expenses. Please try again later.');
        } finally {
            console.log('Fetch expenses complete. Setting loading to false.');
            setLoading(false); // Ensure loading state is cleared
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    const handleDeleteExpense = async (id) => {
        setIsActionLoading(true);
        try {
            await api.delete(`/expenses/${id}`);
            fetchExpenses();
            toast.success('Expense deleted successfully!');
        } catch (err) {
            toast.error('Failed to delete expense. Please try again.');
            console.error('Error deleting expense:', err);
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleSaveEdit = async () => {
        setIsActionLoading(true);
        try {
            await api.put(`/expenses/${editingExpense.id}`, editingExpense);
            setEditingExpense(null);
            fetchExpenses();
            toast.success('Expense updated successfully!');
        } catch (err) {
            toast.error('Failed to update expense. Please try again.');
            console.error('Error updating expense:', err);
        } finally {
            setIsActionLoading(false);
        }
    };

    const isTokenValid = (token) => {
        try {
            const decoded = JSON.parse(atob(token.split('.')[1]));
            return decoded.exp * 1000 > Date.now(); // Check if the token has expired
        } catch {
            return false; // Return false if the token is invalid
        }
    };

    if (loading) {
        return (
            <Layout>
                <Typography variant='h5' sx={{ textAlign: 'center', marginTop: 4 }}>
                    Loading...
                </Typography>
            </Layout>
        );
    }

    return (
        <Layout>
            <Typography variant='h4' sx={{ marginBottom: 4 }}>
                Expense Tracker Dashboard
            </Typography>

            {/* Always Render ExpenseForm */}
            <ExpenseForm
                onSubmit={async (data) => {
                    try {
                        await api.post('/expenses', data);
                        fetchExpenses();
                        toast.success('Expense added successfully!');
                    } catch (err) {
                        toast.error('Failed to add expense. Please try again.');
                        console.error('Error creating expense:', err);
                    }
                }}
            />

            {/* Conditional Rendering for Expenses */}
            {expenses.length ? (
                <ExpenseList expenses={expenses} onEdit={setEditingExpense} onDelete={handleDeleteExpense} />
            ) : (
                <Typography variant='h5' sx={{ textAlign: 'center', marginTop: 4 }}>
                    No expenses found.
                </Typography>
            )}

            {/* Edit Expense Modal */}
            {editingExpense && (
                <Dialog open={true} onClose={() => setEditingExpense(null)}>
                    <DialogTitle>Edit Expense</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            label='Title'
                            value={editingExpense.title}
                            onChange={(e) => setEditingExpense({ ...editingExpense, title: e.target.value })}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            fullWidth
                            label='Amount'
                            type='number'
                            value={editingExpense.amount}
                            onChange={(e) =>
                                setEditingExpense({
                                    ...editingExpense,
                                    amount: parseFloat(e.target.value),
                                })
                            }
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            fullWidth
                            label='Date'
                            type='date'
                            value={new Date(editingExpense.date).toISOString().split('T')[0]}
                            onChange={(e) => setEditingExpense({ ...editingExpense, date: e.target.value })}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            fullWidth
                            label='Category'
                            value={editingExpense.category}
                            onChange={(e) => setEditingExpense({ ...editingExpense, category: e.target.value })}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            fullWidth
                            label='Payment Source'
                            value={editingExpense.paymentSource}
                            onChange={(e) =>
                                setEditingExpense({
                                    ...editingExpense,
                                    paymentSource: e.target.value,
                                })
                            }
                            sx={{ marginBottom: 2 }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditingExpense(null)}>Cancel</Button>
                        <Button onClick={handleSaveEdit} variant='contained' disabled={isActionLoading}>
                            {isActionLoading ? 'Saving...' : 'Save'}
                        </Button>
                    </DialogActions>
                </Dialog>
            )}
        </Layout>
    );
};

export default Home;
