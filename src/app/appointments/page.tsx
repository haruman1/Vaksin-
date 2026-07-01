'use client';

import * as React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from "@mui/material";
import {
  Calendar as CalendarIcon,
  Plus,
  Search,
  Filter,
  Clock,
  User,
  Syringe,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Edit,
  Trash2
} from "lucide-react";
import { apiFetch } from "../lib/api";

interface Appointment {
  id: number;
  patientName: string;
  patientNIK: string;
  vaccineType: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes?: string;
}

interface AppointmentForm {
  patientName: string;
  patientNIK: string;
  vaccineType: string;
  date: string;
  time: string;
  status: "scheduled" | "completed" | "cancelled";
  notes: string;
}

const initialForm: AppointmentForm = {
  patientName: "",
  patientNIK: "",
  vaccineType: "",
  date: new Date().toISOString().split("T")[0],
  time: "09:00",
  status: "scheduled",
  notes: "",
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = React.useState<Appointment[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [formData, setFormData] = React.useState<AppointmentForm>(initialForm);

  React.useEffect(() => {
    fetchAppointments();
  }, [searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append("search", searchTerm);
      }
      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }
      const data = await apiFetch<Appointment[]>(`/appointments?${params.toString()}`);
      setAppointments(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name as string]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiFetch("/appointments", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      await fetchAppointments();
      setShowAddModal(false);
      setFormData(initialForm);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patientName: appointment.patientName,
      patientNIK: appointment.patientNIK,
      vaccineType: appointment.vaccineType,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      notes: appointment.notes || "",
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    try {
      await apiFetch(`/appointments/${selectedAppointment.id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
      });
      await fetchAppointments();
      setSelectedAppointment(null);
      setFormData(initialForm);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Apakah Anda yakin ingin menghapus jadwal ini?");
    if (!confirmDelete) return;
    try {
      await apiFetch(`/appointments/${id}`, { method: "DELETE" });
      await fetchAppointments();
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusChip = (status: Appointment["status"]) => {
    const configs = {
      completed: { label: "Selesai", color: "success" as const, icon: CheckCircle2 },
      cancelled: { label: "Batal", color: "error" as const, icon: XCircle },
      scheduled: { label: "Terjadwal", color: "warning" as const, icon: AlertCircle },
    };
    const config = configs[status] || configs.scheduled;
    const StatusIcon = config.icon;
    return (
      <Chip
        icon={<StatusIcon size={14} />}
        label={config.label}
        color={config.color}
        size="small"
        sx={{ fontWeight: 600 }}
      />
    );
  };

  return (
    <Box sx={{ p: 4, flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 4, display: "flex", justifyContext: "space-between", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Jadwal Vaksinasi Pasien
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
            Registrasi dan monitoring antrean jadwal vaksinasi masyarakat
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={18} />}
          onClick={() => {
            setFormData(initialForm);
            setShowAddModal(true);
          }}
        >
          Daftar Jadwal
        </Button>
      </Box>

      {/* Filter and search bar */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 8, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Cari nama pasien, NIK, atau jenis vaksin..."
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
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <MenuItem value="all">Semua Status</MenuItem>
              <MenuItem value="scheduled">Terjadwal</MenuItem>
              <MenuItem value="completed">Selesai</MenuItem>
              <MenuItem value="cancelled">Batal</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      {/* Appointments Table */}
      <Card>
        <TableContainer component={Paper} elevation={0} sx={{ border: "none" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead sx={{ bgcolor: "action.hover" }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>Tanggal & Waktu</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nama Pasien / NIK</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Jenis Vaksin</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Catatan</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                    Tidak ada jadwal vaksinasi ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CalendarIcon size={16} color="#64748b" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.date}
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                        <Clock size={14} color="#94a3b8" />
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          Pukul {row.time} WIB
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.patientName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        NIK: {row.patientNIK}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <Syringe size={14} color="#4f46e5" />
                        <Typography variant="body2">{row.vaccineType}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary", maxWidth: 200 }}>
                      {row.notes || "-"}
                    </TableCell>
                    <TableCell>{getStatusChip(row.status)}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                        <IconButton
                          color="primary"
                          size="small"
                          onClick={() => handleEdit(row)}
                          sx={{ bgcolor: "primary.lighter", "&:hover": { bgcolor: "primary.light" } }}
                        >
                          <Edit size={16} />
                        </IconButton>
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => handleDelete(row.id)}
                          sx={{ bgcolor: "error.lighter", "&:hover": { bgcolor: "error.light" } }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add / Edit Dialog Form */}
      <Dialog
        open={showAddModal || !!selectedAppointment}
        onClose={() => {
          setShowAddModal(false);
          setSelectedAppointment(null);
        }}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: "16px" } } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {selectedAppointment ? "Edit Jadwal Vaksinasi" : "Daftar Jadwal Vaksinasi"}
          </Typography>
          <IconButton
            onClick={() => {
              setShowAddModal(false);
              setSelectedAppointment(null);
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <form onSubmit={selectedAppointment ? handleUpdate : handleSubmit}>
          <DialogContent sx={{ p: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Nama Lengkap Pasien"
                  name="patientName"
                  required
                  value={formData.patientName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="NIK Pasien (16 digit)"
                  name="patientNIK"
                  required
                  slotProps={{
                    htmlInput: { maxLength: 16 },
                  }}
                  value={formData.patientNIK}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Jenis Vaksin"
                  name="vaccineType"
                  required
                  placeholder="Contoh: COVID-19, Influenza"
                  value={formData.vaccineType}
                  onChange={handleChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Tanggal"
                  name="date"
                  type="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Waktu"
                  name="time"
                  placeholder="Contoh: 09:00, 10:30"
                  required
                  value={formData.time}
                  onChange={handleChange}
                />
              </Grid>
              {selectedAppointment && (
                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status Jadwal</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      label="Status Jadwal"
                      onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value as any }))}
                    >
                      <MenuItem value="scheduled">Terjadwal</MenuItem>
                      <MenuItem value="completed">Selesai</MenuItem>
                      <MenuItem value="cancelled">Batal</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Catatan Tambahan"
                  name="notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setShowAddModal(false);
                setSelectedAppointment(null);
              }}
            >
              Batal
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedAppointment ? "Update Jadwal" : "Daftar Jadwal"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
