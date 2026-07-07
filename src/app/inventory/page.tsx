'use client';

import * as React from 'react';
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
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TablePagination,
  Autocomplete,
} from '@mui/material';
import {
  AlertTriangle,
  Edit,
  Layers3,
  Package,
  Plus,
  Search,
  Trash2,
  X,
  Download,
} from 'lucide-react';
import { apiFetch } from '../lib/api';

type InventoryCategory = 'obat' | 'bmhp';

interface TimkerStockItem {
  id: number;
  noUrut: number;
  name: string;
  unit: string;
  stock: number | null;
  category: InventoryCategory;
  wilayah?: string;
}

interface StockForm {
  category: InventoryCategory;
  noUrut: number;
  name: string;
  unit: string;
  stock: number;
  wilayah?: string;
  notes?: string;
}

const initialForm: StockForm = {
  category: 'obat',
  noUrut: 0,
  name: '',
  unit: '',
  stock: 0,
  wilayah: 'pusat',
  notes: '',
};

const categoryLabel: Record<InventoryCategory, string> = {
  obat: 'Obat',
  bmhp: 'BMHP',
};

import { getUserFromToken, DecodedToken } from '../lib/auth';

export default function InventoriPage() {
  const [inventory, setInventory] = React.useState<TimkerStockItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [selectedItem, setSelectedItem] =
    React.useState<TimkerStockItem | null>(null);
  const [formData, setFormData] = React.useState<StockForm>(initialForm);
  const [user, setUser] = React.useState<DecodedToken | null>(null);
  const [wilayahFilter, setWilayahFilter] = React.useState('semua');
  const [categoryFilter, setCategoryFilter] = React.useState('semua');

  React.useEffect(() => {
    setUser(getUserFromToken());
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const data = await apiFetch<TimkerStockItem[]>('/inventory');
      setInventory(data || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = React.useMemo(() => {
    const keyword = searchTerm.toLowerCase();
    return inventory.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(keyword) ||
        item.unit.toLowerCase().includes(keyword) ||
        categoryLabel[item.category].toLowerCase().includes(keyword);
      const matchWilayah =
        wilayahFilter === 'semua' ||
        (item.wilayah || 'pusat') === wilayahFilter;
      const matchCategory =
        categoryFilter === 'semua' || item.category === categoryFilter;
      return matchSearch && matchWilayah && matchCategory;
    });
  }, [inventory, searchTerm, wilayahFilter, categoryFilter]);

  React.useEffect(() => {
    setPage(0);
  }, [searchTerm, wilayahFilter, categoryFilter]);

  React.useEffect(() => {
    const maxPage = Math.max(
      0,
      Math.ceil(filteredInventory.length / rowsPerPage) - 1,
    );

    if (page > maxPage) {
      setPage(maxPage);
    }
  }, [filteredInventory.length, page, rowsPerPage]);

  const paginatedInventory = React.useMemo(() => {
    const startIndex = page * rowsPerPage;
    return filteredInventory.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredInventory, page, rowsPerPage]);

  const totalStock = React.useMemo(
    () => inventory.reduce((sum, item) => sum + Number(item.stock || 0), 0),
    [inventory],
  );

  const lowStockCount = React.useMemo(
    () => inventory.filter((item) => Number(item.stock || 0) <= 10).length,
    [inventory],
  );

  const medicineCount = React.useMemo(
    () => inventory.filter((item) => item.category === 'obat').length,
    [inventory],
  );

  const bmhpCount = React.useMemo(
    () => inventory.filter((item) => item.category === 'bmhp').length,
    [inventory],
  );

  const handleChange = (field: keyof StockForm, value: string | number) => {
    setFormData(
      (prev) =>
        ({
          ...prev,
          [field]:
            field === 'name' ||
            field === 'unit' ||
            field === 'category' ||
            field === 'wilayah' ||
            field === 'notes'
              ? value
              : Number(value),
        }) as StockForm,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = {
        category: formData.category,
        noUrut: formData.noUrut,
        name: formData.name,
        unit: formData.unit,
        wilayah: formData.wilayah,
        notes: formData.notes,
      };

      if (user?.role !== 'admin' && selectedItem) {
        payload.quantityUsed = formData.stock;
      } else {
        payload.stock = formData.stock;
      }

      if (selectedItem) {
        await apiFetch(`/inventory/${selectedItem.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
      } else {
        await apiFetch('/inventory', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
      }

      await fetchInventory();
      setSelectedItem(null);
      setShowAddModal(false);
      setFormData(initialForm);
      setPage(0);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (item: TimkerStockItem) => {
    setSelectedItem(item);
    setFormData({
      category: item.category,
      noUrut: item.noUrut,
      name: item.name,
      unit: item.unit,
      stock: user?.role === 'admin' ? Number(item.stock || 0) : 0,
      wilayah: item.wilayah || 'pusat',
    });
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      'Apakah Anda yakin ingin menghapus item ini?',
    );
    if (!confirmDelete) return;
    try {
      await apiFetch(`/inventory/${id}`, { method: 'DELETE' });
      await fetchInventory();
      setPage(0);
    } catch (error) {
      console.error(error);
    }
  };

  const getStockStatus = (stock: number | null) => {
    if (Number(stock || 0) <= 10) {
      return { label: 'Stok Rendah', color: 'error' as const };
    }
    return { label: 'Stok Aman', color: 'success' as const };
  };

  const handleExportEmptyStock = () => {
    const emptyItems = inventory.filter((item) => Number(item.stock || 0) <= 0);
    if (emptyItems.length === 0) {
      alert('Tidak ada item dengan stok kosong.');
      return;
    }
    const header = 'Kategori,No Urut,Nama Item,Satuan,Stok,Wilayah\n';
    const csvContent = emptyItems
      .map(
        (item) =>
          `${categoryLabel[item.category]},${item.noUrut},"${item.name}",${item.unit},${item.stock},${item.wilayah || 'pusat'}`,
      )
      .join('\n');
    const blob = new Blob([header + csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Stok_Kosong_${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ p: 4, flexGrow: 1 }}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Inventori Obat dan BMHP
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            Sinkron dengan master stok obat dan BMHP dari database timker4
          </Typography>
        </Box>
        {user?.role === 'admin' && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              color="success"
              startIcon={<Download size={18} />}
              onClick={handleExportEmptyStock}
            >
              Export Stok Kosong (Excel)
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Plus size={18} />}
              onClick={() => {
                setSelectedItem(null);
                setFormData(initialForm);
                setShowAddModal(true);
              }}
            >
              Tambah Item
            </Button>
          </Box>
        )}
        {user?.role === 'pengguna' && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Plus size={18} />}
            onClick={() => {
              setSelectedItem(null);
              setFormData(initialForm);
              setShowAddModal(true);
            }}
          >
            Pengeluaran Obat/Alkes
          </Button>
        )}
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                  Total Item
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
                  {inventory.length}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'primary.lighter',
                  borderRadius: '10px',
                  color: 'primary.main',
                }}
              >
                <Package size={28} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                  Total Stok
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, mt: 1 }}>
                  {totalStock}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'info.lighter',
                  borderRadius: '10px',
                  color: 'info.main',
                }}
              >
                <Layers3 size={28} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                  Item Stok Rendah
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: 800, mt: 1, color: 'error.main' }}
                >
                  {lowStockCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'error.lighter',
                  borderRadius: '10px',
                  color: 'error.main',
                }}
              >
                <AlertTriangle size={28} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card>
            <CardContent
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontWeight: 600 }}
                >
                  Obat / BMHP
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, mt: 1 }}>
                  {medicineCount} / {bmhpCount}
                </Typography>
              </Box>
              <Box
                sx={{
                  p: 1.5,
                  bgcolor: 'success.lighter',
                  borderRadius: '10px',
                  color: 'success.main',
                }}
              >
                <Package size={28} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          mb: 4,
          display: 'flex',
          gap: 2,
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <TextField
          sx={{ minWidth: 300, flexGrow: 1, maxWidth: 420 }}
          size="small"
          placeholder="Cari item, satuan, atau kategori..."
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
        <TextField
          select
          size="small"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="semua">Semua Kategori</MenuItem>
          <MenuItem value="obat">Obat</MenuItem>
          <MenuItem value="bmhp">BMHP</MenuItem>
        </TextField>
        {user?.wilayah === 'pusat' && (
          <TextField
            select
            size="small"
            value={wilayahFilter}
            onChange={(e) => setWilayahFilter(e.target.value)}
            sx={{ minWidth: 200 }}
          >
            <MenuItem value="semua">Semua Wilayah</MenuItem>
            <MenuItem value="pusat">Pusat</MenuItem>
            <MenuItem value="terminal1a">Terminal 1A</MenuItem>
            <MenuItem value="terminal1b">Terminal 1B</MenuItem>
            <MenuItem value="terminal1c">Terminal 1C</MenuItem>
            <MenuItem value="terminal2d">Terminal 2D</MenuItem>
            <MenuItem value="terminal2e">Terminal 2E</MenuItem>
            <MenuItem value="terminal2f">Terminal 2F</MenuItem>
            <MenuItem value="terminal3inter">Terminal 3 Internasional</MenuItem>
            <MenuItem value="terminal3dom">Terminal 3 Domestik</MenuItem>
            <MenuItem value="igd">IGD</MenuItem>
          </TextField>
        )}
      </Box>

      <Card>
        <TableContainer component={Paper} elevation={0} sx={{ border: 'none' }}>
          <Table sx={{ minWidth: 700 }}>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>No Urut</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Nama Item</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Kategori</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Satuan</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Stok</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Wilayah</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">
                  Aksi
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <CircularProgress size={24} />
                  </TableCell>
                </TableRow>
              ) : filteredInventory.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    Tidak ada data inventori.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedInventory.map((row) => {
                  const stockStatus = getStockStatus(row.stock);

                  return (
                    <TableRow key={`${row.category}-${row.id}`} hover>
                      <TableCell>{row.noUrut || '-'}</TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {row.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={categoryLabel[row.category]}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{row.unit || '-'}</TableCell>
                      <TableCell>{Number(row.stock || 0)}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.wilayah || 'pusat'}
                          size="small"
                          color="default"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={stockStatus.label}
                          color={stockStatus.color}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 1,
                          }}
                        >
                          <IconButton
                            color="primary"
                            size="small"
                            onClick={() => handleEdit(row)}
                            sx={{
                              bgcolor: 'primary.lighter',
                              '&:hover': { bgcolor: 'primary.light' },
                            }}
                          >
                            <Edit size={16} />
                          </IconButton>
                          {user?.role === 'admin' && (
                            <IconButton
                              color="error"
                              size="small"
                              onClick={() => handleDelete(row.id)}
                              sx={{
                                bgcolor: 'error.lighter',
                                '&:hover': { bgcolor: 'error.light' },
                              }}
                            >
                              <Trash2 size={16} />
                            </IconButton>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={filteredInventory.length}
            page={page}
            onPageChange={(_, nextPage) => setPage(nextPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Baris per halaman"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} dari ${count !== -1 ? count : `lebih dari ${to}`}`
            }
          />
        </TableContainer>
      </Card>

      <Dialog
        open={showAddModal || !!selectedItem}
        onClose={() => {
          setShowAddModal(false);
          setSelectedItem(null);
        }}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: '16px' } } }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 3,
          }}
        >
          <Typography component="div" variant="h6" sx={{ fontWeight: 700 }}>
            {selectedItem
              ? user?.role === 'admin'
                ? 'Edit Item Inventori'
                : 'Laporkan Penggunaan'
              : 'Tambah Item Inventori'}
          </Typography>
          <IconButton
            onClick={() => {
              setShowAddModal(false);
              setSelectedItem(null);
            }}
          >
            <X size={20} />
          </IconButton>
        </DialogTitle>
        <Divider />
        <form onSubmit={handleSubmit}>
          <DialogContent
            sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 3 }}
          >
            <FormControl fullWidth required>
              <InputLabel>Kategori</InputLabel>
              <Select
                value={formData.category}
                label="Kategori"
                onChange={(e) => handleChange('category', e.target.value)}
                disabled={user?.role !== 'admin' && !!selectedItem}
              >
                <MenuItem value="obat">Obat</MenuItem>
                <MenuItem value="bmhp">BMHP</MenuItem>
              </Select>
            </FormControl>

            <Grid container spacing={2}>
              {user?.role !== 'admin' && !selectedItem ? (
                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    options={inventory.filter(
                      (i) => i.category === formData.category,
                    )}
                    getOptionLabel={(option) =>
                      `${option.name} - ${option.wilayah || 'pusat'} (Sisa Stok: ${option.stock})`
                    }
                    onChange={(event, newValue) => {
                      if (newValue) {
                        handleEdit(newValue);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cari Item dari Inventori Anda"
                        required
                      />
                    )}
                  />
                </Grid>
              ) : (
                <>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <TextField
                      fullWidth
                      label="No Urut"
                      type="number"
                      required
                      value={formData.noUrut}
                      onChange={(e) => handleChange('noUrut', e.target.value)}
                      disabled={user?.role !== 'admin' && !!selectedItem}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 8 }}>
                    <TextField
                      fullWidth
                      label="Nama Item"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      disabled={user?.role !== 'admin' && !!selectedItem}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                      fullWidth
                      label="Satuan"
                      required
                      value={formData.unit}
                      onChange={(e) => handleChange('unit', e.target.value)}
                      disabled={user?.role !== 'admin' && !!selectedItem}
                    />
                  </Grid>
                </>
              )}
              {(!user || user?.role === 'admin' || selectedItem) && (
                <Grid
                  size={{
                    xs: 12,
                    sm: user?.role !== 'admin' && selectedItem ? 12 : 6,
                  }}
                >
                  <TextField
                    fullWidth
                    label={
                      user?.role !== 'admin' && selectedItem
                        ? 'Jumlah Pengeluaran'
                        : 'Stok'
                    }
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                    slotProps={{
                      htmlInput: {
                        max:
                          user?.role !== 'admin'
                            ? selectedItem?.stock
                            : undefined,
                        min: 0,
                      },
                    }}
                  />
                </Grid>
              )}
              {user?.role === 'admin' && (
                <Grid size={{ xs: 12, sm: 12 }}>
                  <FormControl fullWidth required>
                    <InputLabel>Wilayah</InputLabel>
                    <Select
                      value={formData.wilayah || 'pusat'}
                      label="Wilayah"
                      onChange={(e) => handleChange('wilayah', e.target.value)}
                    >
                      <MenuItem value="pusat">Pusat</MenuItem>
                      <MenuItem value="terminal1a">Terminal 1A</MenuItem>
                      <MenuItem value="terminal1b">Terminal 1B</MenuItem>
                      <MenuItem value="terminal1c">Terminal 1C</MenuItem>
                      <MenuItem value="terminal2d">Terminal 2D</MenuItem>
                      <MenuItem value="terminal2e">Terminal 2E</MenuItem>
                      <MenuItem value="terminal2f">Terminal 2F</MenuItem>
                      <MenuItem value="terminal2c">Terminal 2C</MenuItem>
                      <MenuItem value="terminal2b">Terminal 2B</MenuItem>
                      <MenuItem value="terminal3inter">
                        Terminal 3 Internasional
                      </MenuItem>
                      <MenuItem value="terminal3dom">
                        Terminal 3 Domestik
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              )}
              {user?.role !== 'admin' && selectedItem && (
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Catatan Kegiatan (Digunakan untuk apa?)"
                    required
                    multiline
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                  />
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 3 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setShowAddModal(false);
                setSelectedItem(null);
              }}
            >
              Batal
            </Button>
            <Button type="submit" variant="contained" color="primary">
              {selectedItem
                ? user?.role === 'admin'
                  ? 'Update Item'
                  : 'Simpan'
                : 'Simpan Item'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
