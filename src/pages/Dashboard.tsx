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

  // Calculate percentages for pie chart
  const totalPatients = pieData.datasets[0].data.reduce((a, b) => a + b, 0);
  const piePercentages = pieData.datasets[0].data.map((count: number) => ((count / totalPatients) * 100));

  // Pie chart options for modern theme and percentage tooltips
  const pieOptions = {
    plugins: {
      legend: {
        display: true,
        position: 'bottom' as const,
        labels: {
          font: { size: 13, weight: 'normal' as const },
          color: '#333',
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 12,
          boxHeight: 12,
          padding: 12,
          generateLabels: function(chart: any) {
            const data = chart.data;
            if (data.labels.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => ({
                text: label,
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].borderColor?.[i] || '#fff',
                lineWidth: 1,
                hidden: false,
                pointStyle: 'circle',
                rotation: 0
              }));
            }
            return [];
          }
        }
      }, 
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw;
            const percent = totalPatients ? ((value / totalPatients) * 100).toFixed(1) : 0;
            return `${label}: ${percent}%`;
          },
        },
        backgroundColor: '#fff',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: '#e3eafc',
        borderWidth: 1,
        padding: 12,
        bodyFont: { size: 14, weight: 'bold' as const },
        titleFont: { size: 14, weight: 'bold' as const },
        displayColors: true,
        boxWidth: 18,
        boxHeight: 18,
        cornerRadius: 8,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
        shadowBlur: 8,
        shadowColor: 'rgba(0,0,0,0.10)',
      },
    },
    cutout: '50%',
    borderRadius: 0,
    borderWidth: 0,
    layout: {
      padding: 15
    },
    animation: {
      animateRotate: true,
      animateScale: true,
    },
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
            <Pie data={pieData} options={pieOptions} />
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
