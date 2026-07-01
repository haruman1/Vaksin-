'use client';

import * as React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Avatar,
  CircularProgress,
} from '@mui/material';
import {
  Users,
  Syringe,
  TrendingUp,
  Activity,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import { apiGet } from './lib/api';
import { useRouter } from 'next/navigation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend,
);

interface DashboardStats {
  totalMedicines: number;
  totalBmhp: number;
  totalRegistrations: number;
}

export default function Dashboard() {
  const [statsData, setStatsData] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [user, setUser] = React.useState<any>(null);
  const [pendingRequests, setPendingRequests] = React.useState<any[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const checkAuth = async () => {
      const { getUserFromToken } = await import('@/app/lib/auth');
      const currentUser = getUserFromToken();
      if (!currentUser) {
        router.push('/login');
        return;
      }
      setUser(currentUser);

      try {
        const data = await apiGet<DashboardStats>('/dashboard');
        setStatsData(data);

        // Fetch requests for admin
        if (currentUser.role === 'admin') {
          const requestsData = await apiGet<any[]>('/requests');
          const pending = requestsData.filter((r: any) => r.status === 'pending');
          setPendingRequests(pending);
        }
      } catch (err) {
        console.error('Gagal memuat statistics', err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  if (!user) {
    return (
      <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  const stats = [
    {
      title: 'Total Obat',
      value: loading ? (
        <CircularProgress size={16} />
      ) : (
        (statsData?.totalMedicines ?? 0)
      ),
      change: 'Master stok obat',
      icon: Users,
      color: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    },
    {
      title: 'Total BMHP',
      value: loading ? (
        <CircularProgress size={16} />
      ) : (
        (statsData?.totalBmhp ?? 0)
      ),
      change: 'Master stok BMHP',
      icon: Syringe,
      color: 'linear-gradient(135deg, #10b981 0%, #047857 100%)',
    },

    {
      title: 'Sinkronisasi Stok',
      value: '100%',
      change: 'Obat dan BMHP',
      icon: Activity,
      color: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
    },
  ];

  // ChartJS Data Configurations
  const trendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'],
    datasets: [
      {
        label: 'Jumlah Vaksinasi',
        data: [120, 180, 150, 220, 280, 250],
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const distributionData = {
    labels: ['COVID-19', 'Influenza', 'Hepatitis B', 'MMR'],
    datasets: [
      {
        data: [450, 280, 180, 150],
        backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
        borderWidth: 0,
      },
    ],
  };

  const recentAppointments = [
    {
      id: 1,
      name: 'Ahmad Fauzi',
      vaccine: 'COVID-19',
      time: '09:00',
      status: 'completed',
    },
    {
      id: 2,
      name: 'Siti Nurhaliza',
      vaccine: 'Influenza',
      time: '10:30',
      status: 'completed',
    },
    {
      id: 3,
      name: 'Budi Santoso',
      vaccine: 'Hepatitis B',
      time: '11:00',
      status: 'scheduled',
    },
    {
      id: 4,
      name: 'Dewi Lestari',
      vaccine: 'COVID-19',
      time: '13:30',
      status: 'scheduled',
    },
  ];

  return (
    <Box sx={{ p: 4, flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, color: 'text.primary' }}
        >
          Dashboard Mediva
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Selamat datang di Sistem Manajemen Vaksinasi MEDIVA
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: '100%',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: 'text.secondary', fontWeight: 600 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800, my: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'success.main', fontWeight: 500 }}
                    >
                      {stat.change}
                    </Typography>
                  </Box>
                  <Avatar
                    sx={{
                      background: stat.color,
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                    }}
                  >
                    <Icon size={22} color="#ffffff" />
                  </Avatar>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Charts section - only for admin */}
      {user.role === 'admin' && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card sx={{ p: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Tren Aktivitas Dashboard
                </Typography>
                <Box sx={{ height: 300, position: 'relative' }}>
                  <Line
                    data={trendData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                      },
                      scales: {
                        y: { grid: { color: 'rgba(0,0,0,0.05)' } },
                        x: { grid: { display: false } },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <Card sx={{ p: 2, height: '100%' }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Distribusi Kategori Data
                </Typography>
                <Box
                  sx={{
                    height: 260,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Pie
                    data={distributionData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom' },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Admin Warning: Low Stock / Pending Requests */}
      {user.role === 'admin' && pendingRequests.length > 0 && (
        <Card sx={{ mb: 4, border: '1px solid', borderColor: 'warning.main' }}>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'rgba(245, 158, 11, 0.05)' }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: 'warning.dark', display: 'flex', alignItems: 'center', gap: 1 }}>
              <AlertCircle size={20} />
              Peringatan: Ada Permintaan Stok Menunggu Approval
            </Typography>
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Unit / Pengguna</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Tanggal Permintaan</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Pemohon</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pendingRequests.map((req) => (
                  <TableRow
                    key={req.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{req.unit}</TableCell>
                    <TableCell>{req.requestDate || req.createdAt}</TableCell>
                    <TableCell>{req.staffName}</TableCell>
                    <TableCell>
                      <Chip
                        icon={<AlertCircle size={14} color="#b45309" />}
                        label="Menunggu Approval"
                        size="small"
                        color="warning"
                        sx={{
                          bgcolor: 'rgba(245, 158, 11, 0.12)',
                          color: 'warning.dark',
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Recent Appointments table - only for admin */}
      {user.role === 'admin' && (
        <Card>
          <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Ringkasan Data Terkini
            </Typography>
          </Box>
          <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600 }}>Nama Pasien</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Jenis Vaksin</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Waktu</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentAppointments.map((row) => (
                  <TableRow
                    key={row.id}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                    <TableCell>{row.vaccine}</TableCell>
                    <TableCell>{row.time}</TableCell>
                    <TableCell>
                      {row.status === 'completed' ? (
                        <Chip
                          icon={<CheckCircle2 size={14} color="#15803d" />}
                          label="Selesai"
                          size="small"
                          color="success"
                          sx={{
                            bgcolor: 'rgba(16, 185, 129, 0.12)',
                            color: 'success.dark',
                            fontWeight: 600,
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<AlertCircle size={14} color="#b45309" />}
                          label="Terjadwal"
                          size="small"
                          color="warning"
                          sx={{
                            bgcolor: 'rgba(245, 158, 11, 0.12)',
                            color: 'warning.dark',
                            fontWeight: 600,
                          }}
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  );
}
