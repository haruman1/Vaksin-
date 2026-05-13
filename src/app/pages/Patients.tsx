import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  Plus,
  Trash2,
  User,
  Package,
  Syringe,
  Stethoscope,
  Save,
} from "lucide-react";

import { apiFetch } from "../lib/api";

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

export function Patients() {
  const navigate = useNavigate();

  /*
  =====================================
  MASTER DATA FROM DATABASE
  =====================================
  */

  const [medicines, setMedicines] = useState<
    InventoryItem[]
  >([]);

  const [bmhpItems, setBmhpItems] = useState<
    InventoryItem[]
  >([]);

  const [medicalEquipments, setMedicalEquipments] =
    useState<InventoryItem[]>([]);

  /*
  =====================================
  FORM STATE
  =====================================
  */

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    requestDate: new Date().toISOString().split("T")[0],
    unit: "",
    staffName: "",
    position: "",
  });

  const [medicineRequests, setMedicineRequests] =
    useState<ItemRequest[]>([]);

  const [bmhpRequests, setBmhpRequests] =
    useState<ItemRequest[]>([]);

  const [equipmentRequests, setEquipmentRequests] =
    useState<ItemRequest[]>([]);

  /*
  =====================================
  LOAD INVENTORY
  =====================================
  */

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      const [
        medicinesData,
        bmhpData,
        equipmentData,
      ] = await Promise.all([
        apiFetch<InventoryItem[]>("/medicines"),

        apiFetch<InventoryItem[]>(
          "/bmhp-items"
        ),

        apiFetch<InventoryItem[]>(
          "/medical-equipment"
        ),
      ]);

      setMedicines(medicinesData);

      setBmhpItems(bmhpData);

      setMedicalEquipments(equipmentData);
    } catch (error) {
      console.error(
        "Gagal memuat inventory:",
        error
      );
    }
  };

  /*
  =====================================
  MASTER OPTION
  =====================================
  */

  const units = [
    "IGD (Instalasi Gawat Darurat)",
    "Terminal 1 A Bandara Soekarno-Hatta",
    "Terminal 2 D Bandara Soekarno-Hatta",
    "Terminal 3 Internasional Bandara Soekarno-Hatta",
    "Poliklinik Vaksinasi Internasional",
  ];

  const positions = [
    "Dokter",
    "Perawat",
    "Apoteker",
    "Asisten Apoteker",
  ];

  /*
  =====================================
  CREATE EMPTY ITEM
  =====================================
  */

  const createEmptyItem = (): ItemRequest => ({
    id: crypto.randomUUID(),
    name: "",
    stockRemaining: 0,
    requestDate: new Date().toISOString().split("T")[0],
    requestQuantity: 0,
  });

  /*
  =====================================
  ADD ROW
  =====================================
  */

  const addMedicineRow = () => {
    setMedicineRequests((prev) => [
      ...prev,
      createEmptyItem(),
    ]);
  };

  const addBMHPRow = () => {
    setBmhpRequests((prev) => [
      ...prev,
      createEmptyItem(),
    ]);
  };

  const addEquipmentRow = () => {
    setEquipmentRequests((prev) => [
      ...prev,
      createEmptyItem(),
    ]);
  };

  /*
  =====================================
  REMOVE ROW
  =====================================
  */

  const removeRow = (
    id: string,
    setter: React.Dispatch<
      React.SetStateAction<ItemRequest[]>
    >
  ) => {
    setter((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  /*
  =====================================
  UPDATE ITEM
  =====================================
  */

  const updateItem = (
    id: string,
    field: keyof ItemRequest,
    value: any,
    inventory: InventoryItem[],
    setter: React.Dispatch<
      React.SetStateAction<ItemRequest[]>
    >
  ) => {
    setter((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        if (field === "name") {
          const selected = inventory.find(
            (inv) => inv.name === value
          );

          return {
            ...item,
            name: value,
            stockRemaining:
              selected?.stock || 0,
          };
        }

        return {
          ...item,
          [field]: value,
        };
      })
    );
  };

  /*
  =====================================
  RESET FORM
  =====================================
  */

  const resetForm = () => {
    setFormData({
      requestDate: new Date()
        .toISOString()
        .split("T")[0],

      unit: "",
      staffName: "",
      position: "",
    });

    setMedicineRequests([]);

    setBmhpRequests([]);

    setEquipmentRequests([]);
  };

  /*
  =====================================
  SUBMIT
  =====================================
  */

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        requestDate: formData.requestDate,
        unit: formData.unit,
        staffName: formData.staffName,
        position: formData.position,

        medicines: medicineRequests.map(
          (item) => ({
            medicine: item.name,
            quantity:
              item.requestQuantity,
            requestDate:
              item.requestDate,
          })
        ),

        bmhp: bmhpRequests.map((item) => ({
          item: item.name,
          quantity:
            item.requestQuantity,
          requestDate: item.requestDate,
        })),

        medicalEquipment:
          equipmentRequests.map(
            (item) => ({
              equipment: item.name,
              quantity:
                item.requestQuantity,
              requestDate:
                item.requestDate,
            })
          ),
      };

      await apiFetch("/requests", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      alert(
        "Permintaan berhasil disimpan"
      );

      resetForm();

      navigate("/riwayat-permintaan");
    } catch (error) {
      console.error(error);

      alert(
        "Gagal menyimpan permintaan"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =====================================
  RENDER SECTION
  =====================================
  */

  const renderSection = (
    title: string,
    icon: React.ReactNode,
    items: ItemRequest[],
    inventory: InventoryItem[],
    addAction: () => void,
    setter: React.Dispatch<
      React.SetStateAction<ItemRequest[]>
    >
  ) => (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          {icon}

          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
        </div>

        <button
          type="button"
          onClick={addAction}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
        >
          <Plus className="w-4 h-4" />
          Tambah Item
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="grid grid-cols-12 gap-3 bg-gray-50 p-4 rounded-lg"
          >
            <div className="col-span-12 md:col-span-4">
              <label className="text-sm font-medium text-gray-700">
                Pilih Item
              </label>

              <select
                required
                value={item.name}
                onChange={(e) =>
                  updateItem(
                    item.id,
                    "name",
                    e.target.value,
                    inventory,
                    setter
                  )
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">
                  Pilih Item
                </option>

                {inventory.map((inv) => (
                  <option
                    key={inv.id}
                    value={inv.name}
                  >
                    {inv.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-6 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Stok
              </label>

              <input
                type="number"
                readOnly
                value={
                  item.stockRemaining
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div className="col-span-6 md:col-span-3">
              <label className="text-sm font-medium text-gray-700">
                Tanggal
              </label>

              <input
                type="date"
                required
                value={item.requestDate}
                onChange={(e) =>
                  updateItem(
                    item.id,
                    "requestDate",
                    e.target.value,
                    inventory,
                    setter
                  )
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="col-span-10 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">
                Jumlah
              </label>

              <input
                type="number"
                required
                min="1"
                value={
                  item.requestQuantity ||
                  ""
                }
                onChange={(e) =>
                  updateItem(
                    item.id,
                    "requestQuantity",
                    Number(
                      e.target.value
                    ),
                    inventory,
                    setter
                  )
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="col-span-2 md:col-span-1 flex items-end">
              <button
                type="button"
                onClick={() =>
                  removeRow(
                    item.id,
                    setter
                  )
                }
                className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <div className="text-center py-6 text-gray-500 text-sm">
            Belum ada item.
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Form Permintaan Barang
        </h1>

        <p className="text-gray-600 mt-2">
          Permintaan obat, BMHP,
          dan alat kesehatan
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        {/* DATA PEMOHON */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="w-5 h-5 text-blue-600" />

            <h3 className="text-lg font-semibold">
              Data Pemohon
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              required
              value={formData.requestDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  requestDate:
                    e.target.value,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />

            <select
              required
              value={formData.unit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  unit: e.target.value,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">
                Pilih Unit
              </option>

              {units.map((unit) => (
                <option
                  key={unit}
                  value={unit}
                >
                  {unit}
                </option>
              ))}
            </select>

            <input
              type="text"
              required
              placeholder="Nama Petugas"
              value={formData.staffName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  staffName:
                    e.target.value,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />

            <select
              required
              value={formData.position}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  position:
                    e.target.value,
                })
              }
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">
                Pilih Jabatan
              </option>

              {positions.map(
                (position) => (
                  <option
                    key={position}
                    value={position}
                  >
                    {position}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* MEDICINES */}
        {renderSection(
          "Permintaan Obat",
          <Syringe className="w-5 h-5 text-green-600" />,
          medicineRequests,
          medicines,
          addMedicineRow,
          setMedicineRequests
        )}

        {/* BMHP */}
        {renderSection(
          "Permintaan BMHP",
          <Package className="w-5 h-5 text-purple-600" />,
          bmhpRequests,
          bmhpItems,
          addBMHPRow,
          setBmhpRequests
        )}

        {/* EQUIPMENT */}
        {renderSection(
          "Permintaan Alat Kesehatan",
          <Stethoscope className="w-5 h-5 text-orange-600" />,
          equipmentRequests,
          medicalEquipments,
          addEquipmentRow,
          setEquipmentRequests
        )}

        {/* SUBMIT */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-5 h-5" />

              {loading
                ? "Menyimpan..."
                : "Simpan Permintaan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}