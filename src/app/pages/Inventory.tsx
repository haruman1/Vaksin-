import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  X,
  TrendingDown,
  TrendingUp,
  Calendar,
  Loader2,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { apiFetch } from "../lib/api";

interface VaccineInventory {
  id: number;
  name: string;
  manufacturer: string;
  batchNumber: string;
  quantity: number;
  minStock: number;
  expiryDate: string;
  storageTemp: string;
  usedThisMonth: number;
}

interface VaccineForm {
  name: string;
  manufacturer: string;
  batchNumber: string;
  quantity: number;
  minStock: number;
  expiryDate: string;
  storageTemp: string;
  usedThisMonth: number;
}

const initialForm: VaccineForm = {
  name: "",
  manufacturer: "",
  batchNumber: "",
  quantity: 0,
  minStock: 0,
  expiryDate: "",
  storageTemp: "",
  usedThisMonth: 0,
};

export function Inventory() {
  const [inventory, setInventory] = useState<VaccineInventory[]>([]);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedVaccine, setSelectedVaccine] =
    useState<VaccineInventory | null>(null);

  const [formData, setFormData] =
    useState<VaccineForm>(initialForm);

  /*
   FETCH DATA
  */
  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);

      const data = await apiFetch<VaccineInventory[]>(
        "/inventory"
      );

      setInventory(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  /*
   FILTER
  */
  const filteredInventory = useMemo(() => {
    return inventory.filter(
      (item) =>
        item.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.manufacturer
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.batchNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  /*
   HANDLE INPUT
  */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity" ||
        name === "minStock" ||
        name === "usedThisMonth"
          ? Number(value)
          : value,
    }));
  };

  /*
   CREATE
  */
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await apiFetch("/inventory", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      await fetchInventory();

      setShowAddModal(false);

      setFormData(initialForm);
    } catch (error) {
      console.error(error);
    }
  };

  /*
   EDIT
  */
  const handleEdit = (
    vaccine: VaccineInventory
  ) => {
    setSelectedVaccine(vaccine);

    setFormData({
      name: vaccine.name,
      manufacturer: vaccine.manufacturer,
      batchNumber: vaccine.batchNumber,
      quantity: vaccine.quantity,
      minStock: vaccine.minStock,
      expiryDate: vaccine.expiryDate,
      storageTemp: vaccine.storageTemp,
      usedThisMonth: vaccine.usedThisMonth,
    });
  };

  /*
   UPDATE
  */
  const handleUpdate = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!selectedVaccine) return;

    try {
      await apiFetch(
        `/inventory/${selectedVaccine.id}`,
        {
          method: "PUT",
          body: JSON.stringify(formData),
        }
      );

      await fetchInventory();

      setSelectedVaccine(null);

      setFormData(initialForm);
    } catch (error) {
      console.error(error);
    }
  };

  /*
   DELETE
  */
  const handleDelete = async (
    id: number
  ) => {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus vaksin ini?"
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`/inventory/${id}`, {
        method: "DELETE",
      });

      await fetchInventory();
    } catch (error) {
      console.error(error);
    }
  };

  /*
   STATUS
  */
  const getStockStatus = (
    quantity: number,
    minStock: number
  ) => {
    if (quantity < minStock) {
      return {
        label: "Stok Rendah",
        color:
          "bg-red-100 text-red-700",
        icon: AlertTriangle,
      };
    }

    return {
      label: "Stok Baik",
      color:
        "bg-green-100 text-green-700",
      icon: CheckCircle,
    };
  };

  /*
   EXPIRY
  */
  const isExpiringSoon = (
    expiryDate: string
  ) => {
    const today = new Date();

    const expiry =
      new Date(expiryDate);

    const diffTime =
      expiry.getTime() -
      today.getTime();

    const diffDays = Math.ceil(
      diffTime /
        (1000 * 60 * 60 * 24)
    );

    return diffDays < 90;
  };

  /*
   STATS
  */
  const totalStock = inventory.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  const lowStockCount =
    inventory.filter(
      (item) =>
        item.quantity <
        item.minStock
    ).length;

  const expiringSoonCount =
    inventory.filter((item) =>
      isExpiringSoon(
        item.expiryDate
      )
    ).length;

  /*
   CHART
  */
  const usageData = inventory.map(
    (item) => ({
      name: item.name.split(" ")[0],
      digunakan:
        item.usedThisMonth,
      tersisa: item.quantity,
    })
  );

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Inventori Vaksin
        </h1>

        <p className="text-gray-600 mt-1">
          Kelola stok dan
          ketersediaan vaksin
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Total Stok
              </p>

              <p className="text-2xl font-bold mt-1">
                {totalStock}
              </p>
            </div>

            <div className="bg-blue-100 p-3 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Stok Rendah
              </p>

              <p className="text-2xl font-bold mt-1">
                {lowStockCount}
              </p>
            </div>

            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Kadaluarsa
              </p>

              <p className="text-2xl font-bold mt-1">
                {
                  expiringSoonCount
                }
              </p>
            </div>

            <div className="bg-yellow-100 p-3 rounded-lg">
              <Calendar className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white rounded-lg shadow border p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">
          Penggunaan Vaksin
        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <BarChart
            data={usageData}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="digunakan"
              fill="#3b82f6"
            />

            <Bar
              dataKey="tersisa"
              fill="#10b981"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SEARCH */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

          <input
            type="text"
            placeholder="Cari vaksin..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <button
          onClick={() =>
            setShowAddModal(true)
          }
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-5 h-5" />
          Tambah Vaksin
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Vaksin
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Batch
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stok
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Kadaluarsa
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Suhu
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Digunakan
                  </th>

                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {filteredInventory.map(
                  (item) => {
                    const stockStatus =
                      getStockStatus(
                        item.quantity,
                        item.minStock
                      );

                    const StatusIcon =
                      stockStatus.icon;

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {item.name}
                          </div>

                          <div className="text-sm text-gray-500">
                            {
                              item.manufacturer
                            }
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {
                            item.batchNumber
                          }
                        </td>

                        <td className="px-6 py-4">
                          <div className="font-medium">
                            {
                              item.quantity
                            }{" "}
                            dosis
                          </div>

                          <div className="text-xs text-gray-500">
                            Min:{" "}
                            {
                              item.minStock
                            }
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${stockStatus.color}`}
                          >
                            <StatusIcon className="w-3 h-3" />

                            {
                              stockStatus.label
                            }
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <div
                            className={`text-sm ${
                              isExpiringSoon(
                                item.expiryDate
                              )
                                ? "text-yellow-600 font-medium"
                                : ""
                            }`}
                          >
                            {
                              item.expiryDate
                            }
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          {
                            item.storageTemp
                          }
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1">
                            {item.usedThisMonth >
                            50 ? (
                              <TrendingUp className="w-4 h-4 text-green-600" />
                            ) : (
                              <TrendingDown className="w-4 h-4 text-gray-400" />
                            )}

                            {
                              item.usedThisMonth
                            }
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleEdit(
                                  item
                                )
                              }
                              className="text-blue-600"
                            >
                              <Edit className="w-5 h-5" />
                            </button>

                            <button
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
                              className="text-red-600"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ADD MODAL */}
      {showAddModal && (
        <Modal
          title="Tambah Vaksin"
          onClose={() =>
            setShowAddModal(false)
          }
        >
          <InventoryForm
            formData={formData}
            handleChange={
              handleChange
            }
            onSubmit={
              handleSubmit
            }
            submitLabel="Simpan"
          />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {selectedVaccine && (
        <Modal
          title="Edit Vaksin"
          onClose={() =>
            setSelectedVaccine(
              null
            )
          }
        >
          <InventoryForm
            formData={formData}
            handleChange={
              handleChange
            }
            onSubmit={
              handleUpdate
            }
            submitLabel="Update"
          />
        </Modal>
      )}
    </div>
  );
}

/*
 MODAL
*/
function Modal({
  children,
  title,
  onClose,
}: {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold">
            {title}
          </h2>

          <button
            onClick={onClose}
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

/*
 FORM
*/
function InventoryForm({
  formData,
  handleChange,
  onSubmit,
  submitLabel,
}: {
  formData: VaccineForm;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  onSubmit: (
    e: React.FormEvent
  ) => void;
  submitLabel: string;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-6 space-y-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nama Vaksin"
          name="name"
          value={formData.name}
          onChange={
            handleChange
          }
        />

        <Input
          label="Produsen"
          name="manufacturer"
          value={
            formData.manufacturer
          }
          onChange={
            handleChange
          }
        />

        <Input
          label="Batch Number"
          name="batchNumber"
          value={
            formData.batchNumber
          }
          onChange={
            handleChange
          }
        />

        <Input
          label="Jumlah Stok"
          name="quantity"
          type="number"
          value={
            formData.quantity
          }
          onChange={
            handleChange
          }
        />

        <Input
          label="Minimum Stok"
          name="minStock"
          type="number"
          value={
            formData.minStock
          }
          onChange={
            handleChange
          }
        />

        <Input
          label="Tanggal Kadaluarsa"
          name="expiryDate"
          type="date"
          value={
            formData.expiryDate
          }
          onChange={
            handleChange
          }
        />

        <Input
          label="Suhu Penyimpanan"
          name="storageTemp"
          value={
            formData.storageTemp
          }
          onChange={
            handleChange
          }
        />

        <Input
          label="Digunakan/Bulan"
          name="usedThisMonth"
          type="number"
          value={
            formData.usedThisMonth
          }
          onChange={
            handleChange
          }
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
      >
        {submitLabel}
      </button>
    </form>
  );
}

/*
 INPUT
*/
function Input({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {label}
      </label>

      <input
        {...props}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}