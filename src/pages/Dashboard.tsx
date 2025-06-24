import React, { useEffect } from 'react';
import '../styles/dashboard.css';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import PageHeader from '../components/PageHeader';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface DashboardProps {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard: React.FC<DashboardProps> = ({ sidebarCollapsed, toggleSidebar }) => {
  // Initialize any required data on component mount
  useEffect(() => {
    // You can add initialization logic here if needed
  }, []);

  // Mock summary data
  const summary = {
    totalPatients: 120,
    activeDietPlans: 45,
    completedMeals: 320,
    pendingApprovals: 8,
  };

  // Mock pie chart data (diet categories)
  const pieData = {
    labels: ['Low Carb', 'High Protein', 'Vegan', 'Diabetic', 'Renal', 'Others'],
    datasets: [
      {
        label: 'Diet Categories',
        data: [20, 15, 10, 25, 18, 12],
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Mock bar chart data (diet plan usage per month)
  const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'],
    datasets: [
      {
        label: 'People on Diet Plan',
        data: [10, 15, 12, 18, 20, 22, 19, 25],
        backgroundColor: '#36A2EB',
        borderRadius: 6,
      },
    ],
  };

  return (
    <div className="dashboard">
      <Header sidebarCollapsed={sidebarCollapsed} toggleSidebar={toggleSidebar} />
      <div className="dashboard-main-container">
        <div className="header">
          <PageHeader
            title="Dashboard"
            subtitle="Overview of diet plans, patients, and meal statistics"
          />
        </div>
        <div className="dashboard-summary-cards">
          <div className="summary-card">
            <div className="summary-title">Total Patients</div>
            <div className="summary-value">{summary.totalPatients}</div>
          </div>
          <div className="summary-card">
            <div className="summary-title">Active Diet Plans</div>
            <div className="summary-value">{summary.activeDietPlans}</div>
          </div>
          <div className="summary-card">
            <div className="summary-title">Completed Meals</div>
            <div className="summary-value">{summary.completedMeals}</div>
          </div>
          <div className="summary-card">
            <div className="summary-title">Pending Approvals</div>
            <div className="summary-value">{summary.pendingApprovals}</div>
          </div>
        </div>
        <div className="dashboard-charts-row">
          <div className="dashboard-chart dashboard-pie">
            <h3>Diet Categories</h3>
            <Pie data={pieData} />
          </div>
          <div className="dashboard-chart dashboard-bar">
            <h3>Diet Plan Usage (per month)</h3>
            <Bar 
              data={barData} 
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true } },
              }} 
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
