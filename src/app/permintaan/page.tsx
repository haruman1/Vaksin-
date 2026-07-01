'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
  Divider,
  Paper,
} from '@mui/material';
import {
  Plus,
  Trash2,
  User,
  Package,
  Syringe,
  Stethoscope,
  Save,
  RotateCcw,
} from 'lucide-react';
import { apiFetch } from '../lib/api';
import { getUserFromToken, DecodedToken } from '../lib/auth';

interface InventoryItem {
  id: number;
  name: string;
  stock: number;
}

interface ItemRequest {
  id: string;
  name: string;
  stockRemaining: number;
  requestDate: string;
  requestQuantity: number;
}

export default function PermintaanPage() {
  const router = useRouter();

  const [medicines, setMedicines] = React.useState<InventoryItem[]>([]);
  const [bmhpItems, setBmhpItems] = React.useState<InventoryItem[]>([]);
  const [medicalEquipments, setMedicalEquipments] = React.useState<
    InventoryItem[]
  >([]);

  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    requestDate: new Date().toISOString().split('T')[0],
    unit: '',
    staffName: '',
    position: '',
  });

  const [medicineRequests, setMedicineRequests] = React.useState<ItemRequest[]>(
    [],
  );
  const [bmhpRequests, setBmhpRequests] = React.useState<ItemRequest[]>([]);
  const [equipmentRequests, setEquipmentRequests] = React.useState<
    ItemRequest[]
  >([]);

  const [user, setUser] = React.useState<DecodedToken | null>(null);

  React.useEffect(() => {
    setUser(getUserFromToken());
    async function loadInventory() {
      try {
        const [medicinesData, bmhpData, equipmentData] = await Promise.all([
          apiFetch<InventoryItem[]>('/medicines'),
          apiFetch<InventoryItem[]>('/bmhp-items'),
          apiFetch<InventoryItem[]>('/medical-equipment'),
        ]);
        setMedicines(medicinesData || []);
        setBmhpItems(bmhpData || []);
        setMedicalEquipments(equipmentData || []);
      } catch (error) {
        console.error('Gagal memuat inventory:', error);
      }
    }
    loadInventory();
  }, []);

  const allUnits = [
    'IGD (Instalasi Gawat Darurat)',
    'Terminal 1 A Bandara Soekarno-Hatta',
    'Terminal 1 B Bandara Soekarno-Hatta',
    'Terminal 1 C Bandara Soekarno-Hatta',
    'Terminal 2 D Bandara Soekarno-Hatta',
    'Terminal 2 E Bandara Soekarno-Hatta',
    'Terminal 2 F Bandara Soekarno-Hatta',
    'Terminal 3 Internasional Bandara Soekarno-Hatta',
    'Terminal 3 Domestik Bandara Soekarno-Hatta',
    'Poliklinik Vaksinasi Internasional',
  ];

  const units = React.useMemo(() => {
    if (!user) return [];
    const w = user.wilayah?.toLowerCase() || '';
    if (w === 'pusat') return []; // Pusat does not request
    if (w.includes('terminal1')) return allUnits.filter(u => u.includes('Terminal 1'));
    if (w.includes('terminal2')) return allUnits.filter(u => u.includes('Terminal 2'));
    if (w.includes('terminal3')) return allUnits.filter(u => u.includes('Terminal 3'));
    if (w.includes('igd')) return allUnits.filter(u => u.includes('IGD'));
    return allUnits;
  }, [user]);

  const positions = ['Dokter', 'Perawat', 'Apoteker', 'Asisten Apoteker'];

  const createEmptyItem = (): ItemRequest => ({
    id: crypto.randomUUID(),
    name: '',
    stockRemaining: 0,
    requestDate: new Date().toISOString().split('T')[0],
    requestQuantity: 0,
  });

  const addMedicineRow = () => {
    setMedicineRequests((prev) => [...prev, createEmptyItem()]);
  };

  const addBMHPRow = () => {
    setBmhpRequests((prev) => [...prev, createEmptyItem()]);
  };

  const addEquipmentRow = () => {
    setEquipmentRequests((prev) => [...prev, createEmptyItem()]);
  };

  const removeRow = (
    id: string,
    setter: React.Dispatch<React.SetStateAction<ItemRequest[]>>,
  ) => {
    setter((prev) => prev.filter((item) => item.id !== id));
  };

  const updateItem = (
    id: string,
    field: keyof ItemRequest,
    value: any,
    inventory: InventoryItem[],
    setter: React.Dispatch<React.SetStateAction<ItemRequest[]>>,
  ) => {
    setter((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === 'name') {
          const selected = inventory.find((inv) => inv.name === value);
          return {
            ...item,
            name: value,
            stockRemaining: selected?.stock || 0,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      }),
    );
  };

  const resetForm = () => {
    setFormData({
      requestDate: new Date().toISOString().split('T')[0],
      unit: '',
      staffName: '',
      position: '',
    });
    setMedicineRequests([]);
    setBmhpRequests([]);
    setEquipmentRequests([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi stok
    const hasExceedingStock = [...medicineRequests, ...bmhpRequests, ...equipmentRequests].some(
      (item) => item.requestQuantity > item.stockRemaining
    );

    if (hasExceedingStock) {
      alert('Terdapat permintaan yang melebihi stok pusat. Silakan periksa kembali jumlah permintaan Anda.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        requestDate: formData.requestDate,
        unit: formData.unit,
        staffName: formData.staffName,
        position: formData.position,
        medicines: medicineRequests.map((item) => ({
          medicine: item.name,
          quantity: item.requestQuantity,
          requestDate: item.requestDate,
        })),
        bmhp: bmhpRequests.map((item) => ({
          item: item.name,
          quantity: item.requestQuantity,
          requestDate: item.requestDate,
        })),
        medicalEquipment: equipmentRequests.map((item) => ({
          equipment: item.name,
          quantity: item.requestQuantity,
          requestDate: item.requestDate,
        })),
      };

      await apiFetch('/requests', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      alert('Permintaan berhasil disimpan');
      resetForm();
      router.push('/riwayat');
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan permintaan');
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    items: ItemRequest[],
    inventory: InventoryItem[],
    addAction: () => void,
    setter: React.Dispatch<React.SetStateAction<ItemRequest[]>>,
  ) => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {icon}
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Plus size={16} />}
            onClick={addAction}
          >
            Tambah Item
          </Button>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {items.map((item) => (
            <Paper
              key={item.id}
              variant="outlined"
              sx={{ p: 2, bgcolor: 'action.hover' }}
            >
              <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel>Pilih Item</InputLabel>
                    <Select
                      value={item.name}
                      label="Pilih Item"
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          'name',
                          e.target.value,
                          inventory,
                          setter,
                        )
                      }
                    >
                      {inventory.map((inv) => (
                        <MenuItem key={inv.id} value={inv.name}>
                          {inv.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Stok"
                    type="number"
                    size="small"
                    value={item.stockRemaining}
                    slotProps={{
                      input: { readOnly: true },
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    label="Tanggal"
                    type="date"
                    size="small"
                    required
                    value={item.requestDate}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        'requestDate',
                        e.target.value,
                        inventory,
                        setter,
                      )
                    }
                    slotProps={{
                      inputLabel: { shrink: true },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 10, md: 2 }}>
                  <TextField
                    fullWidth
                    label="Jumlah"
                    type="number"
                    size="small"
                    required
                    slotProps={{
                      htmlInput: { min: 1, max: item.stockRemaining },
                    }}
                    error={item.requestQuantity > item.stockRemaining}
                    helperText={item.requestQuantity > item.stockRemaining ? "Melebihi stok pusat" : ""}
                    value={item.requestQuantity || ''}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        'requestQuantity',
                        Number(e.target.value),
                        inventory,
                        setter,
                      )
                    }
                  />
                </Grid>
                <Grid
                  size={{ xs: 2, md: 1 }}
                  sx={{ display: 'flex', justifyContent: 'center' }}
                >
                  <IconButton
                    color="error"
                    onClick={() => removeRow(item.id, setter)}
                    sx={{
                      bgcolor: 'error.lighter',
                      '&:hover': { bgcolor: 'error.light' },
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                </Grid>
              </Grid>
            </Paper>
          ))}

          {items.length === 0 && (
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}
            >
              Belum ada item yang ditambahkan.
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 4, flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Form Permintaan Barang
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Buat permintaan obat dan BMHP untuk unit kerja Anda
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        {/* Data Pemohon */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box
              sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}
            >
              <User size={20} color="#4f46e5" />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Data Pemohon
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {user?.wilayah === 'pusat' && (
                <Grid size={{ xs: 12 }}>
                  <Typography color="error" variant="body2">
                    Akun Pusat tidak dapat membuat permintaan ke pusat.
                  </Typography>
                </Grid>
              )}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Tanggal Permintaan"
                  type="date"
                  required
                  value={formData.requestDate}
                  onChange={(e) =>
                    setFormData({ ...formData, requestDate: e.target.value })
                  }
                  slotProps={{
                    inputLabel: { shrink: true },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Pilih Unit</InputLabel>
                  <Select
                    value={formData.unit}
                    label="Pilih Unit"
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                  >
                    {units.map((unit) => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Nama Petugas"
                  required
                  placeholder="Masukkan nama lengkap"
                  value={formData.staffName}
                  onChange={(e) =>
                    setFormData({ ...formData, staffName: e.target.value })
                  }
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required>
                  <InputLabel>Pilih Jabatan</InputLabel>
                  <Select
                    value={formData.position}
                    label="Pilih Jabatan"
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
                  >
                    {positions.map((pos) => (
                      <MenuItem key={pos} value={pos}>
                        {pos}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Medicines Section */}
        {renderSection(
          'Permintaan Obat',
          <Syringe size={20} color="#10b981" />,
          medicineRequests,
          medicines,
          addMedicineRow,
          setMedicineRequests,
        )}

        {/* BMHP Section */}
        {renderSection(
          'Permintaan BMHP',
          <Package size={20} color="#8b5cf6" />,
          bmhpRequests,
          bmhpItems,
          addBMHPRow,
          setBmhpRequests,
        )}

        {/* Medical Equipment Section */}
        {medicalEquipments.length > 0 &&
          renderSection(
            'Permintaan Alat Kesehatan',
            <Stethoscope size={20} color="#f59e0b" />,
            equipmentRequests,
            medicalEquipments,
            addEquipmentRow,
            setEquipmentRequests,
          )}

        {/* Form Actions */}
        <Card sx={{ p: 1 }}>
          <CardContent sx={{ display: 'flex', gap: 3 }}>
            <Button
              variant="outlined"
              color="inherit"
              fullWidth
              startIcon={<RotateCcw size={18} />}
              onClick={resetForm}
              sx={{ py: 1.5 }}
            >
              Reset Form
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading || user?.wilayah === 'pusat'}
              startIcon={<Save size={18} />}
              sx={{ py: 1.5 }}
            >
              {loading ? 'Menyimpan...' : 'Simpan Permintaan'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </Box>
  );
}
