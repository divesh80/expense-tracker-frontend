import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar } from 'recharts';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import api from '../utils/axios';

const Analytics = () => {
    const [dailyData, setDailyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [summary, setSummary] = useState({});
    const [expenseTrends, setExpenseTrends] = useState([]);
    const [categoryDistribution, setCategoryDistribution] = useState([]);
    const [paymentSourceDistribution, setPaymentSourceDistribution] = useState([]);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const [
                dailyResponse,
                weeklyResponse,
                monthlyResponse,
                trendsResponse,
                summaryResponse,
                categoryResponse,
                paymentSourceResponse,
            ] = await Promise.all([
                api.get('/analytics/daily-totals'),
                api.get('/analytics/weekly-totals'),
                api.get('/analytics/monthly-totals'),
                api.get('/analytics/expense-trends'),
                api.get('/analytics/summary'),
                api.get('/analytics/category-wise'),
                api.get('/analytics/payment-source-distribution'),
            ]);

            setDailyData(dailyResponse.data.data || []);
            setWeeklyData(weeklyResponse.data.data || []);
            setMonthlyData(monthlyResponse.data.data || []);
            setExpenseTrends(trendsResponse.data.data || []);
            setSummary(summaryResponse.data.data || {});
            setCategoryDistribution(categoryResponse.data.data || []);
            setPaymentSourceDistribution(paymentSourceResponse.data.data || []);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const renderTable = (data, columns, rowNames) => (
        <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((col, index) => (
                            <TableCell key={index}>{col}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index}>
                            {rowNames.map((col, colIndex) => (
                                <TableCell key={colIndex}>{row[col] || row[col]}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box sx={{ padding: 4 }}>
            <Typography variant='h4' sx={{ marginBottom: 4 }}>
                Expense Analytics
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={2} sx={{ marginBottom: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant='h6'>Total Expenses</Typography>
                            <Typography variant='h5'>${summary.totalExpenses || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant='h6'>Total Categories</Typography>
                            <Typography variant='h5'>{summary.totalCategories || 0}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant='h6'>Most Spent Category</Typography>
                            <Typography variant='h5'>{summary.mostSpentCategory || 'N/A'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant='h6'>Most Used Payment Source</Typography>
                            <Typography variant='h5'>{summary.mostUsedPaymentSource || 'N/A'}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Category Distribution - Pie Chart & Table */}
            <Box sx={{ marginBottom: 6 }}>
                <Typography variant='h5' sx={{ marginBottom: 2 }}>
                    Spending by Category
                </Typography>
                <PieChart width={400} height={400}>
                    <Pie
                        data={categoryDistribution}
                        dataKey='totalAmount'
                        nameKey='category'
                        cx='50%'
                        cy='50%'
                        outerRadius={150}
                        fill='#8884d8'
                        label={(entry) => entry.category}
                    >
                        {categoryDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={randomColor()} />
                        ))}
                    </Pie>
                    <Tooltip />
                </PieChart>
                {renderTable(categoryDistribution, ['Category', 'Total Amount'], ['category', 'totalAmount'])}
            </Box>

            {/* Payment Source Distribution - Bar Chart & Table */}
            <Box sx={{ marginBottom: 6 }}>
                <Typography variant='h5' sx={{ marginBottom: 2 }}>
                    Spending by Payment Source
                </Typography>
                <BarChart width={600} height={300} data={paymentSourceDistribution}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='paymentSource' />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey='count' fill='#82ca9d' />
                </BarChart>
                {renderTable(paymentSourceDistribution, ['PaymentSource', 'Count'], ['paymentSource', 'count'])}
            </Box>

            {/* Daily Analytics - Line Chart & Table */}
            <Box sx={{ marginBottom: 6 }}>
                <Typography variant='h5' sx={{ marginBottom: 2 }}>
                    Daily Insights
                </Typography>
                <LineChart width={600} height={300} data={dailyData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='day' />
                    <YAxis />
                    <Tooltip />
                    <Line type='monotone' dataKey='totalAmount' stroke='#8884d8' />
                </LineChart>
                {renderTable(dailyData, ['Day', 'TotalAmount'], ['day', 'totalAmount'])}
            </Box>

            {/* Weekly Analytics - Line Chart & Table */}
            <Box sx={{ marginBottom: 6 }}>
                <Typography variant='h5' sx={{ marginBottom: 2 }}>
                    Weekly Insights
                </Typography>
                <LineChart width={600} height={300} data={weeklyData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='week' />
                    <YAxis />
                    <Tooltip />
                    <Line type='monotone' dataKey='totalAmount' stroke='#82ca9d' />
                </LineChart>
                {renderTable(weeklyData, ['Week', 'TotalAmount'], ['week', 'totalAmount'])}
            </Box>

            {/* Monthly Analytics - Line Chart & Table */}
            <Box>
                <Typography variant='h5' sx={{ marginBottom: 2 }}>
                    Monthly Insights
                </Typography>
                <LineChart width={600} height={300} data={monthlyData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip />
                    <Line type='monotone' dataKey='totalAmount' stroke='#ffc658' />
                </LineChart>
                {renderTable(monthlyData, ['Month', 'TotalAmount'], ['month', 'totalAmount'])}
            </Box>
        </Box>
    );
};

export default Analytics;
