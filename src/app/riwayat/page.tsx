'use client';

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import {
  Search,
  Eye,
  X,
  Plus,
  FileText,
  Check,
  Ban
} from "lucide-react";
import { apiFetch } from "../lib/api";
import { getUserFromToken, DecodedToken } from "../lib/auth";

interface MedicineRequest {
  id: string;
  medicine: string;
  stockRemaining: number;
  requestDate: string;
  requestQuantity: number;
}

interface BMHPRequest {
  id: string;
  item: string;
  stockRemaining: number;
  requestDate: string;
  requestQuantity: number;
}

interface MedicalEquipmentRequest {
  id: string;
  equipment: string;
  stockRemaining: number;
  requestDate: string;
  requestQuantity: number;
}

interface RequestForm {
  id: number;
  requestDate: string;
  unit: string;
  staffName: string;
  position: string;
  medicines: MedicineRequest[];
  bmhp: BMHPRequest[];
  medicalEquipment: MedicalEquipmentRequest[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export default function RiwayatPermintaanPage() {
  const router = useRouter();

  const [requests, setRequests] = React.useState<RequestForm[]>([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedRequest, setSelectedRequest] = React.useState<RequestForm | null>(null);
  const [showDetailModal, setShowDetailModal] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [user, setUser] = React.useState<DecodedToken | null>(null);

  React.useEffect(() => {
    setUser(getUserFromToken());
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoading(true);
      const response = await apiFetch<{ data: RequestForm[] } | RequestForm[]>("/requests");
      const data = Array.isArray(response) ? response : response.data;
      setRequests(data || []);
    } catch (error) {
      console.error("Gagal memuat data dari API", error);
      // fallback to localStorage
      const savedRequests = JSON.parse(localStorage.getItem("requests") || "[]");
      setRequests(savedRequests);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = React.useMemo(() => {
    return requests.filter((request) => {
      const keyword = searchTerm.toLowerCase();
      return (
        request.staffName.toLowerCase().includes(keyword) ||
        request.unit.toLowerCase().includes(keyword) ||
        request.position.toLowerCase().includes(keyword)
      );
    });
  }, [requests, searchTerm]);

  const handleUpdateStatus = async (id: number, newStatus: "approved" | "rejected") => {
    try {
      const endpoint = newStatus === "approved" ? `/requests/${id}/approve` : `/requests/${id}/reject`;
      await apiFetch(endpoint, { method: "PATCH" });
      alert(newStatus === "approved" ? "Permintaan berhasil disetujui" : "Permintaan berhasil ditolak");
    } catch (error) {
      console.error("Gagal update status via API, lanjut update lokal:", error);
      alert("Gagal memperbarui status permintaan");
    }

    const updatedRequests = requests.map((request) =>
      request.id === id ? { ...request, status: newStatus } : request
    );
    setRequests(updatedRequests);
    localStorage.setItem("requests", JSON.stringify(updatedRequests));

    if (selectedRequest && selectedRequest.id === id) {
      setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  };

  const handleViewDetail = (request: RequestForm) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const getStatusChip = (status: RequestForm["status"]) => {
    const configs = {
      approved: { label: "Disetujui", color: "success" as const },
      rejected: { label: "Ditolak", color: "error" as const },
      pending: { label: "Menunggu", color: "warning" as const },
    };
    const config = configs[status] || configs.pending;
    return <Chip label={config.label} color={config.color} size="small" sx={{ fontWeight: 600 }} />;
  };

  return (
    <Box sx={{ p: 4, flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Riwayat Permintaan
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Lihat, verifikasi, dan kelola semua log permintaan barang petugas
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={18} />}
          onClick={() => router.push("/permintaan")}
        >
          Permintaan Baru
        </Button>
      </Box>

      {/* Search Input */}
      <Box sx={{ mb: 4, maxWidth: 400 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Cari petugas, unit, jabatan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={18} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Requests table */}
      <Card>
        <TableContainer component={Paper} elevation={0} sx={{ border: "none" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Tanggal / Dibuat</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Unit</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nama Petugas</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Jabatan</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Item</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    Memuat data permintaan...
                  </TableCell>
                </TableRow>
              ) : filteredRequests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    Tidak ada data permintaan ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRequests.map((row) => (
                  <TableRow 
                    key={row.id} 
                    hover 
                    onClick={() => handleViewDetail(row)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.requestDate}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {row.createdAt}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell sx={{ fontWeight: 500 }}>{row.staffName}</TableCell>
                    <TableCell>{row.position}</TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {row.medicines.length > 0 && (
                          <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            💊 {row.medicines.length} Obat
                          </Typography>
                        )}
                        {row.bmhp.length > 0 && (
                          <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            📦 {row.bmhp.length} BMHP
                          </Typography>
                        )}
                        {row.medicalEquipment.length > 0 && (
                          <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            🏥 {row.medicalEquipment.length} Alat Medis
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{getStatusChip(row.status)}</TableCell>
                    <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleViewDetail(row)}
                          sx={{ bgcolor: "primary.lighter", "&:hover": { bgcolor: "primary.light" } }}
                        >
                          <Eye size={16} />
                        </IconButton>
                        {row.status === "pending" && user?.role === 'admin' && (
                          <>
                            <Button
                              variant="outlined"
                              color="success"
                              size="small"
                              startIcon={<Check size={14} />}
                              onClick={() => handleUpdateStatus(row.id, "approved")}
                            >
                              Setuju
                            </Button>
                            <Button
                              variant="outlined"
                              color="error"
                              size="small"
                              startIcon={<Ban size={14} />}
                              onClick={() => handleUpdateStatus(row.id, "rejected")}
                            >
                              Tolak
                            </Button>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Details Dialog Modal */}
      <Dialog
        open={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "16px" } } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Detail Permintaan
            </Typography>
            {selectedRequest && (
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                ID Permintaan: #{selectedRequest.id}
              </Typography>
            )}
          </Box>
          <IconButton onClick={() => setShowDetailModal(false)}>
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 4 }}>
          {selectedRequest && (
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  Unit Kerja
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedRequest.unit}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  Petugas
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedRequest.staffName}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  Jabatan
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedRequest.position}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, md: 3 }}>
                <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
                  Tanggal Permintaan
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {selectedRequest.requestDate}
                </Typography>
              </Grid>
            </Grid>
          )}

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Daftar Barang Diminta
          </Typography>

          <List sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {selectedRequest?.medicines.map((item) => (
              <ListItem key={item.id} variant="outlined" component={Paper} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
                <ListItemIcon sx={{ color: "success.main" }}>
                  <FileText size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.medicine}
                  secondary={`Jenis: Obat`}
                  slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {item.requestQuantity} item
                </Typography>
              </ListItem>
            ))}

            {selectedRequest?.bmhp.map((item) => (
              <ListItem key={item.id} variant="outlined" component={Paper} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
                <ListItemIcon sx={{ color: "primary.main" }}>
                  <FileText size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.item}
                  secondary={`Jenis: BMHP`}
                  slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {item.requestQuantity} item
                </Typography>
              </ListItem>
            ))}

            {selectedRequest?.medicalEquipment.map((item) => (
              <ListItem key={item.id} variant="outlined" component={Paper} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
                <ListItemIcon sx={{ color: "warning.main" }}>
                  <FileText size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.equipment}
                  secondary={`Jenis: Alat Medis`}
                  slotProps={{ primary: { sx: { fontWeight: 600 } } }}
                />
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {item.requestQuantity} item
                </Typography>
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <Divider />
        <DialogActions sx={{ p: 3, justifyContent: "space-between" }}>
          <Box>
            {selectedRequest?.status === "pending" && user?.role === 'admin' && (
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Check size={16} />}
                  onClick={() => handleUpdateStatus(selectedRequest.id, "approved")}
                >
                  Setujui Permintaan
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<Ban size={16} />}
                  onClick={() => handleUpdateStatus(selectedRequest.id, "rejected")}
                >
                  Tolak Permintaan
                </Button>
              </Box>
            )}
          </Box>
          <Button variant="outlined" onClick={() => setShowDetailModal(false)}>
            Tutup
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
