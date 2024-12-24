import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Expense {
    id: string;
    title: string;
    amount: number;
    date: string;
}

interface ExpenseContextProps {
    expenses: Expense[];
    setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const ExpenseContext = createContext<ExpenseContextProps | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);

    return <ExpenseContext.Provider value={{ expenses, setExpenses }}>{children}</ExpenseContext.Provider>;
};

export const useExpenseContext = () => {
    const context = useContext(ExpenseContext);
    if (!context) {
        throw new Error('useExpenseContext must be used within an ExpenseProvider');
    }
    return context;
};
