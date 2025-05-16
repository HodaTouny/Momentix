import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiService';
import { useDarkMode } from '../contexts/DarkModeContext';
import { useTranslation } from 'react-i18next';
import { Bar } from 'react-chartjs-2';
import LoadingSpinner from '../components/common/LoadingSpinner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AdminDashboardPage = () => {
  const { currentTheme } = useDarkMode();
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await apiClient.get('/api/dashboard');
      return response.data;
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (error || !data) return <div className="text-center mt-5 text-danger">Failed to load dashboard data</div>;

  const { summaryCards, bookingsPerCategory, eventsPerCategory, revenuePerCategory } = data;

  const cardStyle = {
    backgroundColor: currentTheme.cardBackground,
    color: currentTheme.textPrimary,
    border: `1px solid ${currentTheme.borderColor}`,
    borderRadius: '10px',
    padding: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center'
  };

  const renderChart = (title, list, labelKey, valueKey, color) => (
    <div className="col-md-6 mb-4">
      <div
        style={{
          backgroundColor: currentTheme.cardBackground,
          borderRadius: '10px',
          padding: '1rem',
          border: `1px solid ${currentTheme.borderColor}`,
          color: currentTheme.textPrimary,
        }}
      >
        <h5 className="mb-3">{t(title)}</h5>
        <Bar
          data={{
            labels: list.map(item => item[labelKey]),
            datasets: [{
              label: t(title),
              data: list.map(item => item[valueKey]),
              backgroundColor: color,
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: { mode: 'index', intersect: false },
            },
            scales: {
              x: { ticks: { color: currentTheme.textSecondary } },
              y: { ticks: { color: currentTheme.textSecondary } },
            }
          }}
        />
      </div>
    </div>
  );

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4" style={{ color: currentTheme.textPrimary }}>
        {t('Admin Dashboard')}
      </h2>

      {/* Summary Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-3">
          <div style={cardStyle}>
            <h6>{t('Total Users')}</h6>
            <h3>{summaryCards.totalUsers}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div style={cardStyle}>
            <h6>{t('Total Bookings')}</h6>
            <h3>{summaryCards.totalBookings}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div style={cardStyle}>
            <h6>{t('Total Events')}</h6>
            <h3>{summaryCards.totalEvents}</h3>
          </div>
        </div>
        <div className="col-md-3">
          <div style={cardStyle}>
            <h6>{t('Total Revenue')}</h6>
              <h3>{Number(summaryCards.totalRevenue).toLocaleString()} EGP</h3>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row">
        {renderChart('Bookings per Category', bookingsPerCategory, 'category', 'totalBookings', currentTheme.primary)}
        {renderChart('Events per Category', eventsPerCategory, 'category', 'totalEvents', currentTheme.secondary)}
        {renderChart('Revenue per Category', revenuePerCategory, 'category', 'totalRevenue', currentTheme.primaryHover)}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
