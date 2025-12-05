import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PageHeader, Card, StatusBadge } from '../styles/CommonStyles';
import { theme } from '../styles/theme';
import { useToast } from '../contexts/ToastContext';
import { useSettings } from '../contexts/SettingsContext';
import Spinner from './Spinner';
import EmptyState from './EmptyState';
import { DashboardSkeleton } from './LoadingSkeleton';
import { MdBarChart, MdCheckCircle, MdSchedule, MdWarning, MdEdit, MdDownload, MdDescription } from 'react-icons/md';

const DashboardContainer = styled.div`
  font-family: ${theme.fonts.body};
`;

const OverviewSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
  h2 {
    font-size: 18px;
    font-weight: 600;
    color: ${theme.colors.gray900};
    margin: 0 0 ${theme.spacing.lg} 0;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.lg};
`;

const StatCard = styled.div`
  background: white;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.gray200};
  box-shadow: ${theme.shadows.sm};

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #3d3d3d;
  }
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  
  .stat-label {
    font-size: 13px;
    color: ${theme.colors.gray600};
    font-weight: 500;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }
  
  .stat-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    background: ${props => props.$iconBg || theme.colors.gray100};
    color: ${props => props.$iconColor || theme.colors.gray600};
  }
  
  .stat-value {
    font-size: 32px;
    font-weight: 800;
    color: ${theme.colors.textPrimary};
    margin-bottom: 4px;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
  
  .stat-trend {
    font-size: 12px;
    color: ${theme.colors.gray500};

    body.dark-theme & {
      color: #a0a0a0;
    }
  }
`;

const ChartsSection = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const ChartCard = styled(Card)`
  h2 {
    font-size: 18px;
    font-weight: 700;
    color: ${theme.colors.gray900};
    margin: 0 0 8px 0;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
  
  h3 {
    font-size: 15px;
    font-weight: 600;
    color: ${theme.colors.gray700};
    margin: 0 0 ${theme.spacing.lg} 0;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }
`;

const RecentUploadsSection = styled(Card)`
  h2 {
    font-size: 18px;
    font-weight: 700;
    color: ${theme.colors.gray900};
    margin: 0 0 ${theme.spacing.lg} 0;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }

  h3 {
    font-size: 15px;
    font-weight: 600;
    color: ${theme.colors.gray700};
    margin: 0 0 ${theme.spacing.lg} 0;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  
  thead {
    background: ${theme.colors.gray50};

    body.dark-theme & {
      background: #1f1f1f;
    }
  }
  
  th {
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    color: ${theme.colors.gray700};
    border-bottom: 2px solid ${theme.colors.gray200};
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    body.dark-theme & {
      color: #b0b0b0;
      border-bottom-color: #3d3d3d;
    }
  }
  
  td {
    padding: 14px 16px;
    color: ${theme.colors.textPrimary};
    border-bottom: 1px solid ${theme.colors.gray200};

    body.dark-theme & {
      color: #e5e5e5;
      border-bottom-color: #3d3d3d;
    }
  }
  
  tbody tr:hover {
    background: ${theme.colors.gray50};

    body.dark-theme & {
      background: #353535;
    }
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  padding: 6px;
  cursor: pointer;
  color: ${theme.colors.gray600};
  font-size: 16px;
  border-radius: 4px;
  transition: all ${theme.transitions.fast};

  body.dark-theme & {
    color: #b0b0b0;
  }
  
  &:hover {
    background: ${theme.colors.gray100};
    color: ${theme.colors.primarySolid};

    body.dark-theme & {
      background: #3d3d3d;
      color: #a78bfa;
    }
  }
`;

function Dashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { formatDate } = useSettings();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentRecords, setRecentRecords] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser();
    fetchData();
  }, []);

  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/auth/me', {
        headers: { 'x-auth-token': token }
      });
      setUser(res.data);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      setError(null);

      // Fetch data with individual error handling
      const results = await Promise.allSettled([
        axios.get('/api/reports/overview', { headers: { 'x-auth-token': token } }),
        axios.get('/api/reports/recent-permits', { headers: { 'x-auth-token': token } }),
        axios.get('/api/reports/monthly-trends', { headers: { 'x-auth-token': token } })
      ]);

      // Handle stats
      if (results[0].status === 'fulfilled') {
        setStats(results[0].value.data);
      } else {
        console.error('Error fetching stats:', results[0].reason);
        showToast('Failed to load statistics', 'error');
      }

      // Handle recent records
      if (results[1].status === 'fulfilled') {
        setRecentRecords(results[1].value.data);
      } else {
        console.error('Error fetching recent records:', results[1].reason);
        setRecentRecords([]);
      }

      // Handle monthly data
      if (results[2].status === 'fulfilled') {
        setMonthlyData(results[2].value.data);
      } else {
        console.error('Error fetching monthly data:', results[2].reason);
        setMonthlyData([]);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load dashboard data');
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleView = (id) => {
    navigate(`/document/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/data-capture?edit=${id}`);
  };

  const handleDownload = (record) => {
    const permitData = `
Burial Permit: ${record.permitNumber}
Name: ${record.fullName}
Date of Death: ${formatDate(record.dateOfDeath)}
Burial Location: ${record.burialLocation}
Status: ${record.status}
    `;

    const blob = new Blob([permitData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${record.permitNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={<MdWarning size={48} />}
        title="Failed to Load Dashboard"
        description={error}
        action={fetchData}
        actionText="Retry"
      />
    );
  }

  if (!stats) {
    return (
      <EmptyState
        icon={<MdBarChart size={48} />}
        title="No Dashboard Data"
        description="Dashboard data is not available at the moment."
        action={fetchData}
        actionText="Refresh"
      />
    );
  }

  // Transform monthly data for the chart
  const transformChartData = () => {
    if (!monthlyData || monthlyData.length === 0) return { chartData: [], locations: [] };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dataByMonth = {};
    const locations = new Set();

    monthlyData.forEach(item => {
      const monthKey = monthNames[item._id.month - 1];
      if (!dataByMonth[monthKey]) {
        dataByMonth[monthKey] = { month: monthKey };
      }
      dataByMonth[monthKey][item._id.burialLocation] = item.count;
      locations.add(item._id.burialLocation);
    });

    return {
      chartData: Object.values(dataByMonth),
      locations: Array.from(locations)
    };
  };

  const { chartData, locations } = transformChartData();
  const locationColors = ['#6366f1', '#10B981', '#F59E0B', '#8B5CF6'];

  // Detect dark mode
  const isDarkMode = document.body.classList.contains('dark-theme');

  return (
    <DashboardContainer>
      <PageHeader>
        <h1>{user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}</h1>
        <p>Overview</p>
      </PageHeader>

      <OverviewSection>
        <h2>Overview</h2>
        <StatsGrid>
          <StatCard $iconBg="#E0F2FE" $iconColor="#0284C7">
            <div className="stat-header">
              <div className="stat-label">Total Records</div>
              <div className="stat-icon"><MdBarChart size={24} /></div>
            </div>
            <div className="stat-value">{stats.totalRecords?.toLocaleString() || 0}</div>
            <div className="stat-trend">+2% from last month</div>
          </StatCard>

          <StatCard $iconBg="#D1FAE5" $iconColor="#059669">
            <div className="stat-header">
              <div className="stat-label">Verified Records</div>
              <div className="stat-icon"><MdCheckCircle size={24} /></div>
            </div>
            <div className="stat-value">{stats.verifiedRecords?.toLocaleString() || 0}</div>
            <div className="stat-trend">
              {stats.totalRecords > 0
                ? `${Math.round((stats.verifiedRecords / stats.totalRecords) * 100)}% of total records`
                : 'No records yet'}
            </div>
          </StatCard>

          <StatCard $iconBg="#FEF3C7" $iconColor="#D97706">
            <div className="stat-header">
              <div className="stat-label">Pending Records</div>
              <div className="stat-icon"><MdSchedule size={24} /></div>
            </div>
            <div className="stat-value">{stats.pendingRecords?.toLocaleString() || 0}</div>
            <div className="stat-trend">Awaiting verification</div>
          </StatCard>

          <StatCard $iconBg="#E0E7FF" $iconColor="#6366F1">
            <div className="stat-header">
              <div className="stat-label">Uploads This Month</div>
              <div className="stat-icon">📤</div>
            </div>
            <div className="stat-value">{stats.uploadsThisMonth || 0}</div>
            <div className="stat-trend">Current month activity</div>
          </StatCard>
        </StatsGrid>
      </OverviewSection>

      <ChartsSection>
        <ChartCard>
          <h2>Entries by Burial Location / Month</h2>
          <h3>Monthly Permit Entries by Burial Location</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDarkMode ? '#3d3d3d' : theme.colors.gray200}
                />
                <XAxis
                  dataKey="month"
                  stroke={isDarkMode ? '#6d6d6d' : theme.colors.gray600}
                  style={{ fontSize: '13px', fontFamily: theme.fonts.body, fontWeight: 500 }}
                  tick={{ fill: isDarkMode ? '#b0b0b0' : theme.colors.gray700 }}
                />
                <YAxis
                  stroke={isDarkMode ? '#6d6d6d' : theme.colors.gray600}
                  style={{ fontSize: '13px', fontFamily: theme.fonts.body, fontWeight: 500 }}
                  tick={{ fill: isDarkMode ? '#b0b0b0' : theme.colors.gray700 }}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#2d2d2d' : 'white',
                    border: `1px solid ${isDarkMode ? '#3d3d3d' : theme.colors.gray200}`,
                    borderRadius: '8px',
                    padding: '12px',
                    fontFamily: theme.fonts.body,
                    fontSize: '13px',
                    color: isDarkMode ? '#e5e5e5' : theme.colors.gray900,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  cursor={{ fill: isDarkMode ? '#353535' : theme.colors.gray100 }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontFamily: theme.fonts.body,
                    fontSize: '13px',
                    color: isDarkMode ? '#e5e5e5' : theme.colors.gray900
                  }}
                />
                {locations.map((location, index) => (
                  <Bar
                    key={location}
                    dataKey={location}
                    fill={locationColors[index % locationColors.length]}
                    radius={[6, 6, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{
              height: '400px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: isDarkMode ? '#a0a0a0' : theme.colors.gray500,
              backgroundColor: isDarkMode ? '#1f1f1f' : theme.colors.gray50,
              borderRadius: '8px'
            }}>
              <div style={{ marginBottom: '16px' }}><MdBarChart size={48} color="#9ca3af" /></div>
              <div style={{ fontSize: '16px', fontWeight: 500 }}>No data available for chart</div>
            </div>
          )}
        </ChartCard>
      </ChartsSection>

      <RecentUploadsSection>
        <h2>Last 10 Uploads</h2>
        <h3>Recently Submitted Permits</h3>
        {recentRecords.length > 0 ? (
          <StyledTable>
            <thead>
              <tr>
                <th>Permit No.</th>
                <th>Deceased Name</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentRecords.map(record => (
                <tr key={record._id}>
                  <td style={{ fontWeight: 600 }}>{record.permitNumber}</td>
                  <td>{record.fullName}</td>
                  <td>{formatDate(record.dateOfDeath)}</td>
                  <td>
                    <StatusBadge $status={record.status}>
                      {record.status}
                    </StatusBadge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <ActionButton title="View Details" onClick={() => handleView(record._id)}>
                        👁
                      </ActionButton>
                      <ActionButton title="Edit Record" onClick={() => handleEdit(record._id)}>
                        <MdEdit size={18} />
                      </ActionButton>
                      <ActionButton title="Download" onClick={() => handleDownload(record)}>
                        <MdDownload size={18} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </StyledTable>
        ) : (
          <div style={{
            padding: '40px',
            textAlign: 'center',
            color: isDarkMode ? '#a0a0a0' : theme.colors.gray500,
            backgroundColor: isDarkMode ? '#1f1f1f' : theme.colors.gray50,
            borderRadius: '8px'
          }}>
            <div style={{ marginBottom: '16px' }}><MdDescription size={48} color="#9ca3af" /></div>
            <div style={{ fontSize: '16px', fontWeight: 500 }}>No recent uploads</div>
          </div>
        )}
      </RecentUploadsSection>

      <div style={{ textAlign: 'center', padding: '24px', color: isDarkMode ? '#6d6d6d' : theme.colors.gray500, fontSize: '12px' }}>
        © 2025 Burial Permit Manager. All rights reserved.
      </div>
    </DashboardContainer>
  );
}

export default Dashboard;
