import React, { useEffect, useState } from 'react';
import {
    PieChart,
    Pie,
    Tooltip,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    BarChart,
    Bar,
    Legend,
} from 'recharts';
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
    Button,
} from '@mui/material';
import { useRouter } from 'next/router';
import api from '../utils/axios';

const Analytics = () => {
    const router = useRouter();
    const [dailyData, setDailyData] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [summary, setSummary] = useState({});
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
                summaryResponse,
                categoryResponse,
                paymentSourceResponse,
            ] = await Promise.all([
                api.get('/analytics/daily-totals'),
                api.get('/analytics/weekly-totals'),
                api.get('/analytics/monthly-totals'),
                api.get('/analytics/summary'),
                api.get('/analytics/category-wise'),
                api.get('/analytics/payment-source-distribution'),
            ]);

            setDailyData(dailyResponse.data.data || []);
            setWeeklyData(weeklyResponse.data.data || []);
            setMonthlyData(monthlyResponse.data.data || []);
            setSummary(summaryResponse.data.data || {});
            setCategoryDistribution(categoryResponse.data.data || []);
            setPaymentSourceDistribution(paymentSourceResponse.data.data || []);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        }
    };

    const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const renderTable = (data, columns, rowNames) => (
        <TableContainer
            component={Paper}
            sx={{
                marginTop: 2,
                borderRadius: 2,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            }}
        >
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                        {columns.map((col, index) => (
                            <TableCell key={index} sx={{ fontWeight: 'bold' }}>
                                {col}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((row, index) => (
                        <TableRow key={index} hover>
                            {rowNames.map((col, colIndex) => (
                                <TableCell key={colIndex}>{row[col] || 'N/A'}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box sx={{ padding: 4 }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                }}
            >
                <Typography variant='h4' fontWeight='bold'>
                    Expense Analytics
                </Typography>
                <Button
                    variant='contained'
                    color='primary'
                    onClick={() => router.push('/')}
                    sx={{ textTransform: 'none' }}
                >
                    Back to Dashboard
                </Button>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ marginBottom: 4 }}>
                {[
                    { label: 'Total Expenses', value: `₹${summary.totalExpenses || 0}` },
                    { label: 'Total Categories', value: summary.totalCategories || 0 },
                    { label: 'Most Spent Category', value: summary.mostSpentCategory || 'N/A' },
                    { label: 'Most Used Payment Source', value: summary.mostUsedPaymentSource || 'N/A' },
                ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
                            <CardContent>
                                <Typography variant='h6'>{item.label}</Typography>
                                <Typography variant='h5' fontWeight='bold' color='primary'>
                                    {item.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Spending by Category */}
            <Box sx={{ marginBottom: 6 }}>
                <Typography variant='h5' sx={{ marginBottom: 2 }} fontWeight='bold'>
                    Spending by Category
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <PieChart width={400} height={400}>
                            <Pie
                                data={categoryDistribution}
                                dataKey='totalAmount'
                                nameKey='category'
                                cx='50%'
                                cy='50%'
                                outerRadius={150}
                                label={(entry) => entry.category}
                            >
                                {categoryDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={randomColor()} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {renderTable(categoryDistribution, ['Category', 'Total Amount'], ['category', 'totalAmount'])}
                    </Grid>
                </Grid>
            </Box>

            {/* Spending by Payment Source */}
            <Box sx={{ marginBottom: 6 }}>
                <Typography variant='h5' sx={{ marginBottom: 2 }} fontWeight='bold'>
                    Spending by Payment Source
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <BarChart width={600} height={300} data={paymentSourceDistribution}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='paymentSource' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey='count' fill='#82ca9d' />
                        </BarChart>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {renderTable(
                            paymentSourceDistribution,
                            ['Payment Source', 'Count'],
                            ['paymentSource', 'count']
                        )}
                    </Grid>
                </Grid>
            </Box>

            {/* Daily Analytics */}
            <Box sx={{ marginBottom: 6 }}>
                <Typography variant='h5' sx={{ marginBottom: 2 }} fontWeight='bold'>
                    Daily Insights
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <LineChart width={600} height={300} data={dailyData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='day' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type='monotone' dataKey='totalAmount' stroke='#8884d8' />
                        </LineChart>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {renderTable(dailyData, ['Day', 'Total Amount'], ['day', 'totalAmount'])}
                    </Grid>
                </Grid>
            </Box>

            {/* Weekly Analytics */}
            <Box sx={{ marginBottom: 6 }}>
                <Typography variant='h5' sx={{ marginBottom: 2 }} fontWeight='bold'>
                    Weekly Insights
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <LineChart width={600} height={300} data={weeklyData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='week' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type='monotone' dataKey='totalAmount' stroke='#82ca9d' />
                        </LineChart>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {renderTable(weeklyData, ['Week', 'Total Amount'], ['week', 'totalAmount'])}
                    </Grid>
                </Grid>
            </Box>

            {/* Monthly Analytics */}
            <Box>
                <Typography variant='h5' sx={{ marginBottom: 2 }} fontWeight='bold'>
                    Monthly Insights
                </Typography>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                        <LineChart width={600} height={300} data={monthlyData}>
                            <CartesianGrid strokeDasharray='3 3' />
                            <XAxis dataKey='month' />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type='monotone' dataKey='totalAmount' stroke='#ffc658' />
                        </LineChart>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {renderTable(monthlyData, ['Month', 'Total Amount'], ['month', 'totalAmount'])}
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Analytics;
