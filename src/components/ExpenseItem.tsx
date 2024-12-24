import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
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
        <Card sx={{ marginBottom: 2 }}>
            <CardContent>
                <Typography variant='h6'>{title}</Typography>
                <Typography color='text.secondary'>Category: {category}</Typography>
                <Typography color='text.secondary'>Payment Source: {paymentSource}</Typography>
                <Typography variant='body2'>Amount: ${amount.toFixed(2)}</Typography>
                <Typography variant='body2'>Date: {new Date(date).toLocaleDateString()}</Typography>
                <div>
                    <IconButton onClick={onEdit}>
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={onDelete}>
                        <DeleteIcon />
                    </IconButton>
                </div>
            </CardContent>
        </Card>
    );
};

export default ExpenseItem;
