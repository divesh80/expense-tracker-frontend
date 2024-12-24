import { useEffect, useState } from 'react';
import api from '../utils/axios';

export const useExpenses = () => {
    const [expenses, setExpenses] = useState([]);

    const fetchExpenses = async () => {
        const response = await api.get('/expenses');
        setExpenses(response.data);
    };

    useEffect(() => {
        fetchExpenses();
    }, []);

    return { expenses, fetchExpenses };
};
