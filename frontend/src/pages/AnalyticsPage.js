import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// API client configured to talk to your backend
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Your FastAPI backend URL
});

const COLORS = ['#06b6d4', '#14b8a6', '#6366f1', '#ec4899', '#f97316', '#f59e0b', '#84cc16', '#22c55e', '#ef4444', '#3b82f6'];

function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch data from the /analytics endpoint when the component loads
    apiClient.get('/analytics')
      .then(response => {
        setAnalytics(response.data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching analytics data:", err);
        setError('Failed to load analytics data. Is the backend server running?');
        setLoading(false);
      });
  }, []); // The empty array ensures this runs only once

  // Helper to format data for charts
  const formatChartData = (dataObject) => {
    return Object.entries(dataObject).map(([name, value]) => ({ name, value }));
  };

  if (loading) {
    return <div className="text-center p-10 text-xl">Loading Analytics...</div>;
  }

  if (error) {
    return <div className="text-center p-10 text-xl text-red-400">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-4xl font-bold text-center text-cyan-400 mb-10">Product Data Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

        {/* Top Brands Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-teal-300">Top 10 Brands</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={formatChartData(analytics.top_brands)} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis type="number" stroke="#a0aec0" />
              <YAxis type="category" dataKey="name" stroke="#a0aec0" width={120} />
              <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} />
              <Legend />
              <Bar dataKey="value" name="Number of Products" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Materials Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-teal-300">Top 10 Materials</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={formatChartData(analytics.top_materials)} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis type="number" stroke="#a0aec0" />
              <YAxis type="category" dataKey="name" stroke="#a0aec0" width={100} />
              <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} />
              <Legend />
              <Bar dataKey="value" name="Number of Products" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Countries Pie Chart */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl lg:col-span-2">
          <h2 className="text-2xl font-semibold mb-4 text-center text-teal-300">Products by Country of Origin (Top 10)</h2>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={formatChartData(analytics.top_countries)}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {formatChartData(analytics.top_countries).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#2d3748', border: 'none' }} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;