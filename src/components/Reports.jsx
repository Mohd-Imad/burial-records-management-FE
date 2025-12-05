import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, Button, PageHeader, FormGroup, Alert } from '../styles/CommonStyles';
import { theme } from '../styles/theme';
import ModernDatePicker from './ModernDatePicker';
import { MdVisibility, MdDownload, MdPictureAsPdf, MdTableChart } from 'react-icons/md';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { useToast } from '../contexts/ToastContext';
import { useSettings } from '../contexts/SettingsContext';
import Spinner from './Spinner';
import EmptyState from './EmptyState';
import { MdBarChart } from 'react-icons/md';

const ReportsContainer = styled.div`
  font-family: ${theme.fonts.body};

  @media print {
    background: white;
    
    /* Hide page header, controls, and footer */
    & > div:first-child,  /* PageHeader */
    & > div:nth-child(2), /* Alert */
    & > div:nth-child(3), /* ControlsCard */
    & > div:last-child {  /* Footer */
      display: none !important;
    }
  }
`;

const ControlsCard = styled(Card)`
  margin-bottom: ${theme.spacing.xl};
  h2 { 
    font-size: 18px; 
    font-weight: 700; 
    margin: 0 0 4px 0;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
  p { 
    font-size: 13px; 
    color: ${theme.colors.gray500}; 
    margin: 0 0 ${theme.spacing.lg} 0;

    body.dark-theme & {
      color: #a0a0a0;
    }
  }

  @media print {
    display: none !important;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr) repeat(2, 1fr);
  gap: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.lg};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing.sm};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: ${theme.spacing.lg};
  margin-bottom: ${theme.spacing.xl};

  @media print {
    page-break-after: avoid;
    margin-bottom: 20px;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: ${theme.spacing.lg};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.gray200};
  box-shadow: ${theme.shadows.sm};
  position: relative;

  body.dark-theme & {
    background: #2d2d2d;
    border-color: #3d3d3d;
  }

  .stat-icon {
    position: absolute;
    top: 16px;
    right: 16px;
    font-size: 20px;
    opacity: 0.3;
  }
  .stat-label { 
    font-size: 13px; 
    color: ${theme.colors.gray600}; 
    margin-bottom: 8px;
    font-weight: 500;

    body.dark-theme & {
      color: #b0b0b0;
    }
  }
  .stat-value { 
    font-size: 36px; 
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

  @media print {
    box-shadow: none;
    border: 1px solid #ddd;
    page-break-inside: avoid;
    
    .stat-icon {
      display: none;
    }
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing.xl};
  margin-bottom: ${theme.spacing.xl};

  @media print {
    page-break-inside: avoid;
    margin-bottom: 20px;
    gap: 16px;
  }
`;

const ChartCard = styled(Card)`
  h3 { 
    font-size: 16px; 
    font-weight: 700; 
    margin: 0 0 4px 0;

    body.dark-theme & {
      color: #e5e5e5;
    }
  }
  p { 
    font-size: 13px; 
    color: ${theme.colors.gray500}; 
    margin: 0 0 ${theme.spacing.lg} 0;

    body.dark-theme & {
      color: #a0a0a0;
    }
  }

  @media print {
    box-shadow: none;
    border: 1px solid #ddd;
    page-break-inside: avoid;
  }
`;

const MapPlaceholder = styled.div`
  background: ${theme.colors.gray50};
  border: 2px dashed ${theme.colors.gray300};
  border-radius: ${theme.borderRadius.lg};
  padding: 60px;
  text-align: center;
  color: ${theme.colors.gray500};
  .icon { font-size: 48px; margin-bottom: 16px; }
  h4 { font-size: 15px; font-weight: 600; margin: 0 0 4px 0; }
  p { font-size: 13px; margin: 0; }
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

  @media print {
    font-size: 11px;
    
    th {
      background: #f5f5f5 !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      padding: 8px 12px;
      font-size: 10px;
    }
    
    td {
      padding: 8px 12px;
    }
    
    tbody tr:hover {
      background: transparent;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  background: ${props => props.$status === 'Verified' ? '#7C3AED' : props.$status === 'Pending' ? '#F59E0B' : '#10B981'};
  color: white;
`;

const ActionLink = styled.button`
  background: ${theme.colors.gray100};
  border: none;
  color: ${theme.colors.gray700};
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;

  body.dark-theme & {
    background: #3d3d3d;
    color: #b0b0b0;
  }
  
  &:hover {
    background: ${theme.colors.primarySolid};
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

    body.dark-theme & {
      background: #7c3aed;
    }
  }

  @media print {
    display: none !important;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid ${theme.colors.gray200};
  button { 
    padding: 6px 12px; 
    background: white; 
    border: 1px solid ${theme.colors.gray300}; 
    border-radius: 6px; 
    color: ${theme.colors.gray700}; 
    font-size: 13px; 
    cursor: pointer; 
    font-weight: 500;
    min-width: 36px;
  }
  button:hover:not(:disabled) { 
    background: ${theme.colors.gray50}; 
    border-color: ${theme.colors.primarySolid}; 
  }
  button.active { 
    background: ${theme.colors.primarySolid}; 
    color: white; 
    border-color: ${theme.colors.primarySolid}; 
  }
  button:disabled { 
    opacity: 0.5; 
    cursor: not-allowed; 
  }

  @media print {
    display: none !important;
  }
`;

const COLORS = ['#6366f1', '#F59E0B', '#10B981'];

function Reports() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { formatDate } = useSettings();
  // Detect dark mode
  const isDarkMode = document.body.classList.contains('dark-theme');
  const [stats, setStats] = useState(null);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [allRecords, setAllRecords] = useState([]);
  const [filters, setFilters] = useState({
    reportType: 'Summary',
    dateRange: 'all',
    ageGroup: '',
    gender: '',
    burialLocation: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [monthlyData, setMonthlyData] = useState([]);
  const [genderData, setGenderData] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchFilteredRecords();
  }, []);

  useEffect(() => {
    fetchFilteredRecords();
  }, [currentPage, filters]);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('/api/reports/overview', { headers: { 'x-auth-token': token } });
      setStats(res.data);

      const genderStats = res.data.genderStats || [];
      setGenderData([
        { name: 'Male', value: genderStats.find(g => g._id === 'Male')?.count || 0 },
        { name: 'Female', value: genderStats.find(g => g._id === 'Female')?.count || 0 },
        { name: 'Unknown', value: genderStats.find(g => g._id === 'Unknown' || g._id === 'Other')?.count || 0 }
      ]);

      const monthlyTrend = res.data.monthlyTrend || [];
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      setMonthlyData(monthlyTrend.map(item => ({
        month: monthNames[item._id.month - 1],
        Records: item.count
      })));
    } catch (err) {
      console.error('Error fetching stats:', err);
      showToast(err.response?.data?.message || 'Failed to load statistics', 'error');
      setStats(null);
    }
  };

  const getDateRange = () => {
    const now = new Date();
    let startDate = null;
    let endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    switch (filters.dateRange) {
      case 'all':
        // No date filtering - return null for both to get all records
        startDate = null;
        endDate = null;
        break;
      case 'last7days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'last30days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'last90days':
        startDate = new Date(now.setDate(now.getDate() - 90));
        break;
      case 'thisyear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = null;
        endDate = null;
    }

    return { startDate, endDate };
  };

  const fetchFilteredRecords = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const { startDate, endDate } = getDateRange();
      const params = {
        page: currentPage,
        limit: 10,
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.burialLocation && { burialLocation: filters.burialLocation }),
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() })
      };

      const res = await axios.get('/api/permits', {
        headers: { 'x-auth-token': token },
        params
      });

      setFilteredRecords(res.data.permits || []);
      setTotalPages(res.data.totalPages || 1);
      setMessage({ type: 'success', text: `Found ${res.data.total} records` });

      // Fetch all records for export (without pagination)
      const allParams = {
        limit: 10000,
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.burialLocation && { burialLocation: filters.burialLocation }),
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() })
      };
      const allRes = await axios.get('/api/permits', {
        headers: { 'x-auth-token': token },
        params: allParams
      });
      setAllRecords(allRes.data.permits || []);
    } catch (err) {
      console.error('Error fetching filtered records:', err);
      const errorMsg = err.response?.data?.msg || err.response?.data?.message || 'Failed to load records';
      setMessage({ type: 'error', text: errorMsg });
      showToast(errorMsg, 'error');
      setFilteredRecords([]);
      setAllRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      if (allRecords.length === 0) {
        showToast('No records to export. Please wait for data to load.', 'warning');
        return;
      }

      showToast('Generating PDF... Please wait', 'info');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 10;

      // Add title
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Burial Permit Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 8;

      // Add date
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${formatDate(new Date())}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 10;

      // Capture Stats Grid
      const statsGrid = document.getElementById('stats-grid-pdf');
      if (statsGrid) {
        const canvas = await html2canvas(statsGrid, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yPosition + imgHeight > pageHeight - 10) {
          pdf.addPage();
          yPosition = 10;
        }

        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }

      // Capture Charts Grid
      const chartsGrid = document.getElementById('charts-grid-pdf');
      if (chartsGrid) {
        if (yPosition + 80 > pageHeight - 10) {
          pdf.addPage();
          yPosition = 10;
        }

        const canvas = await html2canvas(chartsGrid, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yPosition + imgHeight > pageHeight - 10) {
          pdf.addPage();
          yPosition = 10;
        }

        pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }

      // Add Records Table
      pdf.addPage();
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Filtered Records', 10, 15);

      const tableData = allRecords.map(record => [
        record.permitNumber || '',
        `${record.firstName || ''} ${record.middleName || ''} ${record.lastName || ''}`.replace(/\s+/g, ' ').trim(),
        record.dateOfDeath ? formatDate(record.dateOfDeath) : '',
        record.burialLocation || '',
        record.gender || '',
        record.status || ''
      ]);

      autoTable(pdf, {
        startY: 20,
        head: [['Permit No.', 'Name', 'Date of Death', 'Burial Location', 'Gender', 'Status']],
        body: tableData,
        styles: {
          fontSize: 8,
          cellPadding: 2
        },
        headStyles: {
          fillColor: [124, 58, 237],
          fontStyle: 'bold',
          halign: 'left'
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245]
        },
        margin: { left: 10, right: 10 }
      });

      pdf.save(`burial-permit-report-${new Date().toISOString().split('T')[0]}.pdf`);
      showToast(`PDF exported successfully with ${allRecords.length} records`, 'success');
    } catch (err) {
      console.error('PDF export error:', err);
      showToast(`Error exporting PDF: ${err.message}`, 'error');
    }
  };

  const handleExportExcel = () => {
    try {
      if (allRecords.length === 0) {
        showToast('No records to export. Please wait for data to load.', 'warning');
        return;
      }

      // Create workbook
      const wb = XLSX.utils.book_new();

      // Stats sheet
      const statsData = [
        ['Burial Permit Report'],
        ['Generated:', formatDate(new Date())],
        [],
        ['Summary Statistics'],
        ['Total Records', stats.totalRecords || 0],
        ['Males', stats.genderStats?.find(g => g._id === 'Male')?.count || 0],
        ['Females', stats.genderStats?.find(g => g._id === 'Female')?.count || 0],
        ['Verified Records', stats.verifiedRecords || 0],
        [],
        ['Records exported:', allRecords.length]
      ];
      const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(wb, statsSheet, 'Summary');

      // Records sheet - using array of arrays for better control
      const recordsHeaders = ['Permit Number', 'Full Name', 'Date of Death', 'Burial Location', 'Gender', 'Age', 'Status'];
      const recordsRows = allRecords.map(record => [
        record.permitNumber || '',
        `${record.firstName || ''} ${record.middleName || ''} ${record.lastName || ''}`.replace(/\s+/g, ' ').trim(),
        record.dateOfDeath ? formatDate(record.dateOfDeath) : '',
        record.burialLocation || '',
        record.gender || '',
        record.age || '',
        record.status || '',
        record.issuanceDate ? formatDate(record.issuanceDate) : ''
      ]);

      const recordsData = [recordsHeaders, ...recordsRows];
      const recordsSheet = XLSX.utils.aoa_to_sheet(recordsData);

      // Set column widths
      recordsSheet['!cols'] = [
        { wch: 15 }, // Permit Number
        { wch: 25 }, // Full Name
        { wch: 15 }, // Date of Death
        { wch: 20 }, // Burial Location
        { wch: 10 }, // Gender
        { wch: 8 },  // Age
        { wch: 12 }, // Status
        { wch: 15 }  // Issuance Date
      ];

      XLSX.utils.book_append_sheet(wb, recordsSheet, 'All Records');

      // Filtered Records sheet (currently visible records)
      if (filteredRecords.length > 0) {
        const filteredHeaders = ['Permit No.', 'Name', 'Date of Death', 'Burial Location', 'Gender', 'Status'];
        const filteredRows = filteredRecords.map(record => [
          record.permitNumber || '',
          `${record.firstName || ''} ${record.middleName || ''} ${record.lastName || ''}`.replace(/\s+/g, ' ').trim(),
          record.dateOfDeath ? formatDate(record.dateOfDeath) : '',
          record.burialLocation || '',
          record.gender || '',
          record.status || ''
        ]);

        const filteredData = [
          ['Filtered Records'],
          ['Current Page:', currentPage],
          ['Filters Applied:'],
          ['Date Range:', filters.dateRange],
          ['Gender:', filters.gender || 'All'],
          ['Burial Location:', filters.burialLocation || 'All'],
          [],
          filteredHeaders,
          ...filteredRows
        ];

        const filteredSheet = XLSX.utils.aoa_to_sheet(filteredData);

        // Set column widths for filtered sheet
        filteredSheet['!cols'] = [
          { wch: 15 }, // Permit No.
          { wch: 25 }, // Name
          { wch: 15 }, // Date of Death
          { wch: 20 }, // Burial Location
          { wch: 10 }, // Gender
          { wch: 12 }  // Status
        ];

        XLSX.utils.book_append_sheet(wb, filteredSheet, 'Filtered View');
      }

      // Save file
      XLSX.writeFile(wb, `burial-permit-report-${new Date().toISOString().split('T')[0]}.xlsx`);
      showToast(`Excel file exported with ${allRecords.length} total records`, 'success');
    } catch (err) {
      console.error('Excel export error:', err);
      showToast('Error exporting Excel file', 'error');
    }
  };

  const handleExportCSV = () => {
    try {
      // Create CSV content
      const headers = ['Permit Number', 'Full Name', 'Date of Death', 'Burial Location', 'Gender', 'Age', 'Status'];
      const rows = allRecords.map(record => [
        record.permitNumber,
        `${record.firstName || ''} ${record.middleName || ''} ${record.lastName || ''}`.replace(/\s+/g, ' ').trim(),
        formatDate(record.dateOfDeath),
        record.burialLocation,
        record.gender,
        record.age,
        record.status,
        formatDate(record.issuanceDate)
      ]);

      let csvContent = headers.join(',') + '\n';
      rows.forEach(row => {
        csvContent += row.map(cell => `"${cell}"`).join(',') + '\n';
      });

      // Download CSV
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `burial-permit-report-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);

      showToast('CSV file exported successfully', 'success');
    } catch (err) {
      console.error('CSV export error:', err);
      showToast('Error exporting CSV file', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleViewDetails = (id) => {
    navigate(`/document/${id}`);
  };

  const handleDownloadPermit = (record) => {
    const fullName = `${record.firstName || ''} ${record.middleName || ''} ${record.lastName || ''}`.replace(/\s+/g, ' ').trim();
    const permitData = `
Burial Permit: ${record.permitNumber}
Name: ${fullName}
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

  if (!stats) {
    return (
      <Spinner minHeight="400px" text="Loading reports..." />
    );
  }

  if (stats.totalPermits === 0) {
    return (
      <EmptyState
        icon={<MdBarChart size={48} />}
        title="No Report Data Available"
        description="There are no burial permits in the system yet. Create your first permit to start generating reports."
        action={() => navigate('/data-capture')}
        actionText="Create First Permit"
      />
    );
  }

  return (
    <ReportsContainer>
      <PageHeader>
        <h1>Reports & Analytics</h1>
        <p>Generate and view various reports and analytical insights from the burial permit data.</p>
      </PageHeader>

      {message.text && <Alert $type={message.type}>{message.text}</Alert>}

      <ControlsCard>
        <h2>Report Controls</h2>
        <p>Filter data for detailed analysis</p>
        <FiltersGrid>
          <FormGroup>
            <label>Report Type</label>
            <select value={filters.reportType} onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}>
              <option value="Summary">Summary</option>
              <option value="Detailed">Detailed</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Date Range</label>
            <select value={filters.dateRange} onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}>
              <option value="all">All Time</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="last90days">Last 90 Days</option>
              <option value="thisyear">This Year</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Age Group</label>
            <select value={filters.ageGroup} onChange={(e) => setFilters({ ...filters, ageGroup: e.target.value })}>
              <option value="">All</option>
              <option value="0-18">0-18</option>
              <option value="19-35">19-35</option>
              <option value="36-60">36-60</option>
              <option value="60+">60+</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Gender</label>
            <select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
              <option value="">All</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </FormGroup>
          <FormGroup>
            <label>Burial Location</label>
            <select value={filters.burialLocation} onChange={(e) => setFilters({ ...filters, burialLocation: e.target.value })}>
              <option value="">All</option>
              <option value="Block A">Block A</option>
              <option value="Main">Main</option>
              <option value="Block B">Block B</option>
              <option value="Lan'gata">Lan'gata</option>
            </select>
          </FormGroup>
        </FiltersGrid>
        <ActionButtons>
          <Button $variant="primary" onClick={handleExportPDF} disabled={loading}>
            <MdPictureAsPdf size={18} /> Export PDF
          </Button>
          <Button $variant="secondary" onClick={handleExportExcel}>
            <MdTableChart size={18} /> Export Excel
          </Button>
          <Button $variant="secondary" onClick={handleExportCSV}>
            <MdTableChart size={18} /> Export CSV
          </Button>
          <Button $variant="secondary" onClick={handlePrint}>
            <MdDownload size={18} /> Print
          </Button>
        </ActionButtons>
      </ControlsCard>

      <StatsGrid id="stats-grid-pdf">
        <StatCard>
          <div className="stat-icon"><MdBarChart size={32} /></div>
          <div className="stat-label">Total Records</div>
          <div className="stat-value">{stats.totalRecords || 0}</div>
          <div className="stat-trend">
            {stats.growth?.total !== undefined ? (
              stats.growth.total > 0 ? `+${stats.growth.total}% from last month` :
                stats.growth.total < 0 ? `${stats.growth.total}% from last month` :
                  'No change from last month'
            ) : 'No data'}
          </div>
        </StatCard>
        <StatCard>
          <div className="stat-icon">👨</div>
          <div className="stat-label">Males</div>
          <div className="stat-value">{stats.genderStats?.find(g => g._id === 'Male')?.count || 0}</div>
          <div className="stat-trend">
            {stats.growth?.male !== undefined ? (
              stats.growth.male > 0 ? `+${stats.growth.male}% from last month` :
                stats.growth.male < 0 ? `${stats.growth.male}% from last month` :
                  'No change from last month'
            ) : 'No data'}
          </div>
        </StatCard>
        <StatCard>
          <div className="stat-icon">👩</div>
          <div className="stat-label">Females</div>
          <div className="stat-value">{stats.genderStats?.find(g => g._id === 'Female')?.count || 0}</div>
          <div className="stat-trend">
            {stats.growth?.female !== undefined ? (
              stats.growth.female > 0 ? `+${stats.growth.female}% from last month` :
                stats.growth.female < 0 ? `${stats.growth.female}% from last month` :
                  'No change from last month'
            ) : 'No data'}
          </div>
        </StatCard>
        <StatCard>
          <div className="stat-icon">✅</div>
          <div className="stat-label">Verified Records</div>
          <div className="stat-value">{stats.verifiedRecords || 0}</div>
          <div className="stat-trend">
            {stats.growth?.verified !== undefined ? (
              stats.growth.verified > 0 ? `+${stats.growth.verified}% from last month` :
                stats.growth.verified < 0 ? `${stats.growth.verified}% from last month` :
                  'No change from last month'
            ) : `${stats.totalRecords > 0 ? Math.round((stats.verifiedRecords / stats.totalRecords) * 100) : 0}% of total`}
          </div>
        </StatCard>
      </StatsGrid>

      <ChartsGrid id="charts-grid-pdf">
        <ChartCard>
          <h3>Records by Month</h3>
          <p>Number of burial permits issued per month</p>
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#3d3d3d' : '#E5E7EB'} />
                <XAxis
                  dataKey="month"
                  stroke={isDarkMode ? '#6d6d6d' : '#6B7280'}
                  style={{ fontSize: '12px' }}
                  tick={{ fill: isDarkMode ? '#b0b0b0' : '#6B7280' }}
                />
                <YAxis
                  stroke={isDarkMode ? '#6d6d6d' : '#6B7280'}
                  style={{ fontSize: '12px' }}
                  tick={{ fill: isDarkMode ? '#b0b0b0' : '#6B7280' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#2d2d2d' : 'white',
                    border: `1px solid ${isDarkMode ? '#3d3d3d' : '#E5E7EB'}`,
                    borderRadius: '8px',
                    color: isDarkMode ? '#e5e5e5' : '#1F2937'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: isDarkMode ? '#e5e5e5' : '#1F2937'
                  }}
                />
                <Bar dataKey="Records" fill="#EF4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDarkMode ? '#a0a0a0' : '#6B7280' }}>No data</div>}
        </ChartCard>

        <ChartCard>
          <h3>Gender Distribution</h3>
          <p>Breakdown of permits by gender of the deceased</p>
          {genderData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart style={{ outline: 'none' }}>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="value"
                  activeShape={null}
                  activeIndex={undefined}
                  style={{ outline: 'none' }}
                >
                  {genderData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      style={{ outline: 'none', cursor: 'default' }}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#1f1f1f' : 'white',
                    border: `2px solid ${isDarkMode ? '#7c3aed' : '#6366f1'}`,
                    borderRadius: '10px',
                    padding: '14px 16px',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: isDarkMode ? '#f5f5f5' : '#1F2937',
                    boxShadow: isDarkMode ? '0 8px 24px rgba(0, 0, 0, 0.6)' : '0 4px 12px rgba(0, 0, 0, 0.15)'
                  }}
                  labelStyle={{
                    color: isDarkMode ? '#f5f5f5' : '#1F2937',
                    fontWeight: '600',
                    marginBottom: '8px'
                  }}
                  itemStyle={{
                    color: isDarkMode ? '#e5e5e5' : '#374151',
                    padding: '4px 0'
                  }}
                />
                <Legend
                  wrapperStyle={{
                    color: isDarkMode ? '#e5e5e5' : '#1F2937'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDarkMode ? '#a0a0a0' : '#6B7280' }}>No data</div>}
        </ChartCard>
      </ChartsGrid>

      <Card>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px 0', color: isDarkMode ? '#e5e5e5' : theme.colors.gray900 }}>Filtered Records</h3>
        <p style={{ fontSize: '13px', color: isDarkMode ? '#a0a0a0' : theme.colors.gray500, margin: '0 0 20px 0' }}>Overview of burial permits matching current report filters</p>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: isDarkMode ? '#a0a0a0' : theme.colors.gray500 }}>
            Loading records...
          </div>
        ) : (
          <>
            <StyledTable>
              <thead>
                <tr>
                  <th>Permit No.</th>
                  <th>Name</th>
                  <th>Date of Death</th>
                  <th>Burial Location</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                  <tr key={record._id}>
                    <td style={{ fontWeight: 600 }}>{record.permitNumber}</td>
                    <td>{`${record.firstName || ''} ${record.middleName || ''} ${record.lastName || ''}`.replace(/\s+/g, ' ').trim()}</td>
                    <td>{formatDate(record.dateOfDeath)}</td>
                    <td>{record.burialLocation}</td>
                    <td>{record.gender}</td>
                    <td><StatusBadge $status={record.status}>{record.status}</StatusBadge></td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <ActionLink title="View Details" onClick={() => handleViewDetails(record._id)}>
                          <MdVisibility size={18} />
                        </ActionLink>
                        <ActionLink title="Download Permit" onClick={() => handleDownloadPermit(record)}>
                          <MdDownload size={18} />
                        </ActionLink>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: isDarkMode ? '#a0a0a0' : theme.colors.gray500 }}>
                      No records found matching the current filters
                    </td>
                  </tr>
                )}
              </tbody>
            </StyledTable>
            {filteredRecords.length > 0 && totalPages > 1 && (
              <Pagination>
                <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                  « Previous
                </button>
                {[...Array(Math.min(totalPages, 3))].map((_, i) => {
                  const pageNum = currentPage <= 2 ? i + 1 : currentPage + i - 1;
                  if (pageNum > totalPages) return null;
                  return (
                    <button
                      key={pageNum}
                      className={currentPage === pageNum ? 'active' : ''}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next »
                </button>
              </Pagination>
            )}
          </>
        )}
      </Card>

      <div style={{ textAlign: 'center', padding: '24px', color: isDarkMode ? '#6d6d6d' : theme.colors.gray500, fontSize: '12px' }}>
        © 2025 Burial Permit Manager. All rights reserved.
      </div>
    </ReportsContainer>
  );
}

export default Reports;
