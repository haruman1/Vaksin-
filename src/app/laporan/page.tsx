'use client';

import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton
} from "@mui/material";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  X,
  FileText
} from "lucide-react";
import * as XLSX from "xlsx";
import { apiFetch } from "../lib/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

interface Transaction {
  id: number;
  date: string;
  type: "masuk" | "keluar";
  item: string;
  category: "obat" | "bmhp" | "alat";
  quantity: number;
  unit: string;
  source?: string;
  destination?: string;
  notes?: string;
}

const mockTransactions: Transaction[] = [
  { id: 1, date: "2024-02-03", type: "keluar", item: "Paracetamol 500mg", category: "obat", quantity: 100, unit: "tablet", destination: "IGD (Instalasi Gawat Darurat)", notes: "Permintaan rutin" },
  { id: 2, date: "2024-02-03", type: "keluar", item: "Sarung Tangan Latex (Box)", category: "bmhp", quantity: 10, unit: "box", destination: "IGD (Instalasi Gawat Darurat)" },
  { id: 3, date: "2024-02-02", type: "masuk", item: "Amoxicillin 500mg", category: "obat", quantity: 500, unit: "kapsul", source: "PT. Kimia Farma" },
  { id: 9, date: "2024-01-30", type: "masuk", item: "Metformin 500mg", category: "obat", quantity: 300, unit: "tablet", source: "PT. Kalbe Farma" },
  { id: 10, date: "2024-01-29", type: "keluar", item: "Alkohol 70% (Liter)", category: "bmhp", quantity: 15, unit: "liter", destination: "Laboratorium" },
];

export default function LaporanPage() {
  const [filterPeriod, setFilterPeriod] = React.useState<"3days" | "7days" | "30days" | "custom">("7days");
  const [customStartDate, setCustomStartDate] = React.useState("");
  const [customEndDate, setCustomEndDate] = React.useState("");
  const [transactions, setTransactions] = React.useState<Transaction[]>(mockTransactions);
  const [loading, setLoading] = React.useState(false);
  const [selectedTransaction, setSelectedTransaction] = React.useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);

  React.useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await apiFetch<{ data: Transaction[] } | Transaction[]>("/reports/inventory-movement");
      const data = Array.isArray(response) ? response : response.data;
      if (data && data.length > 0) {
        setTransactions(data);
      }
    } catch (error) {
      console.error("Gagal memuat transaksi dari API, menggunakan mock data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = React.useCallback(() => {
    const today = new Date();
    const startDate = new Date(today);

    if (filterPeriod === "custom") {
      return {
        start: customStartDate ? new Date(customStartDate) : new Date(0),
        end: customEndDate ? new Date(customEndDate) : today,
      };
    }

    switch (filterPeriod) {
      case "3days":
        startDate.setDate(today.getDate() - 3);
        break;
      case "7days":
        startDate.setDate(today.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(today.getDate() - 30);
        break;
    }

    return { start: startDate, end: today };
  }, [filterPeriod, customStartDate, customEndDate]);

  const filteredTransactions = React.useMemo(() => {
    const { start, end } = getDateRange();
    // Normalize date thresholds to midnight
    const startMs = new Date(start.getFullYear(), start.getMonth(), start.getDate()).getTime();
    const endMs = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999).getTime();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date).getTime();
      return transactionDate >= startMs && transactionDate <= endMs;
    });
  }, [transactions, getDateRange]);

  const totalMasuk = React.useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "masuk")
      .reduce((acc, curr) => acc + curr.quantity, 0);
  }, [filteredTransactions]);

  const totalKeluar = React.useMemo(() => {
    return filteredTransactions
      .filter((t) => t.type === "keluar")
      .reduce((acc, curr) => acc + curr.quantity, 0);
  }, [filteredTransactions]);

  const distributionData = React.useMemo(() => {
    const distributed = filteredTransactions.filter((t) => t.type === "keluar");
    const map = new Map<string, number>();
    distributed.forEach(t => {
      const dest = t.destination || "Lainnya";
      map.set(dest, (map.get(dest) || 0) + t.quantity);
    });

    const labels = Array.from(map.keys());
    const data = Array.from(map.values());

    return {
      labels,
      datasets: [
        {
          label: 'Jumlah Distribusi',
          data,
          backgroundColor: '#3b82f6',
          borderRadius: 4,
        },
      ],
    };
  }, [filteredTransactions]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
  };

  const exportToExcel = () => {
    const exportData = filteredTransactions.map((transaction) => ({
      Tanggal: transaction.date,
      Jenis: transaction.type === "masuk" ? "Barang Masuk" : "Barang Keluar",
      Barang: transaction.item,
      Kategori: transaction.category.toUpperCase(),
      Jumlah: transaction.quantity,
      Satuan: transaction.unit,
      Asal: transaction.source || "-",
      Tujuan: transaction.destination || "-",
      Catatan: transaction.notes || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan Keluar Masuk");
    XLSX.writeFile(workbook, `laporan-keluar-masuk-${Date.now()}.xlsx`);
  };

  return (
    <Box sx={{ p: 4, flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexDirection: { xs: "column", sm: "row" }, gap: 2 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Laporan Keluar Masuk
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Monitoring dan ekspor data transaksi keluar masuk inventori logistik medis
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="success"
          startIcon={<Download size={18} />}
          onClick={exportToExcel}
        >
          Export Excel
        </Button>
      </Box>

      {/* Filter Card */}
      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 3, py: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Calendar size={18} color="#64748b" />
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <InputLabel>Periode</InputLabel>
              <Select
                value={filterPeriod}
                label="Periode"
                onChange={(e) => setFilterPeriod(e.target.value as any)}
              >
                <option value="3days" style={{ padding: "8px" }}>3 Hari Terakhir</option>
                <option value="7days" style={{ padding: "8px" }}>7 Hari Terakhir</option>
                <option value="30days" style={{ padding: "8px" }}>30 Hari Terakhir</option>
                <option value="custom" style={{ padding: "8px" }}>Custom Tanggal</option>
              </Select>
            </FormControl>
          </Box>

          {filterPeriod === "custom" && (
            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Tanggal Mulai"
                type="date"
                size="small"
                value={customStartDate}
                onChange={(e) => setCustomStartDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                label="Tanggal Selesai"
                type="date"
                size="small"
                value={customEndDate}
                onChange={(e) => setCustomEndDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{ borderLeft: "6px solid #10b981" }}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  Total Barang Masuk
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: "success.main" }}>
                  {totalMasuk}
                </Typography>
              </Box>
              <TrendingUp size={40} color="#10b981" />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card sx={{ borderLeft: "6px solid #ef4444" }}>
            <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600 }}>
                  Total Barang Keluar
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, color: "error.main" }}>
                  {totalKeluar}
                </Typography>
              </Box>
              <TrendingDown size={40} color="#ef4444" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Distribution Chart */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Grafik Distribusi per Wilayah / Tujuan
          </Typography>
          <Box sx={{ height: 300, width: '100%' }}>
            <Bar data={distributionData} options={chartOptions} />
          </Box>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <TableContainer component={Paper} elevation={0} sx={{ border: "none" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Tanggal</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Jenis</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Barang</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Jumlah</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Asal / Tujuan</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Catatan</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    Memuat data transaksi...
                  </TableCell>
                </TableRow>
              ) : filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    Tidak ada data transaksi.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((row) => (
                  <TableRow 
                    key={row.id} 
                    hover
                    onClick={() => {
                      setSelectedTransaction(row);
                      setShowDetailModal(true);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell sx={{ fontWeight: 500 }}>{row.date}</TableCell>
                    <TableCell>
                      <Chip
                        label={row.type === "masuk" ? "Masuk" : "Keluar"}
                        color={row.type === "masuk" ? "success" : "error"}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.item}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase" }}>
                        {row.category}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {row.quantity} {row.unit}
                    </TableCell>
                    <TableCell>{row.source || row.destination || "-"}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{row.notes || "-"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Transaction Detail Dialog */}
      <Dialog
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "16px" } } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Detail Transaksi
          </Typography>
          <IconButton onClick={() => setShowDetailModal(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4 }}>
          {selectedTransaction && (
            <Grid container spacing={3}>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Tanggal</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedTransaction.date}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Jenis Transaksi</Typography>
                <Chip
                  label={selectedTransaction.type === "masuk" ? "Masuk" : "Keluar"}
                  color={selectedTransaction.type === "masuk" ? "success" : "error"}
                  size="small"
                  sx={{ fontWeight: 600, mt: 0.5 }}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Barang</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                  <FileText size={18} color="#64748b" />
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedTransaction.item}</Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "text.secondary", textTransform: "uppercase" }}>{selectedTransaction.category}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Jumlah</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedTransaction.quantity} {selectedTransaction.unit}</Typography>
              </Grid>
              <Grid size={{ xs: 6 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>{selectedTransaction.type === "masuk" ? "Asal" : "Tujuan"}</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedTransaction.source || selectedTransaction.destination || "-"}</Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>Catatan</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>{selectedTransaction.notes || "-"}</Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3 }}>
          <Button variant="outlined" onClick={() => setShowDetailModal(false)}>Tutup</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
