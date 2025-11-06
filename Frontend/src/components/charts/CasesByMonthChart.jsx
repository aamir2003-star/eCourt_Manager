// Frontend/src/components/charts/CasesByMonthChart.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CasesByMonthChart = ({ data }) => {
  const chartData = data.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    Cases: item.count
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="Cases" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default CasesByMonthChart;