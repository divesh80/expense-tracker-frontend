import React from 'react';
import ExpenseItem from './ExpenseItem';
import { Container, Typography } from '@mui/material';

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
    return (
        <Container sx={{ marginTop: 4 }}>
            <Typography variant='h5' sx={{ marginBottom: 2 }}>
                Your Expenses
            </Typography>
            {expenses.map((expense) => (
                <ExpenseItem
                    key={expense.id}
                    id={expense.id}
                    title={expense.title}
                    amount={expense.amount}
                    date={expense.date}
                    category={expense.category}
                    paymentSource={expense.paymentSource}
                    onEdit={() => onEdit(expense)}
                    onDelete={() => onDelete(expense.id)}
                />
            ))}
        </Container>
    );
};

export default ExpenseList;
