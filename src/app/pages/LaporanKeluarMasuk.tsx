import { useEffect, useMemo, useState } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import * as XLSX from "xlsx";

import { apiFetch } from "../lib/api";

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
  {
    id: 1,
    date: "2024-02-03",
    type: "keluar",
    item: "Paracetamol 500mg",
    category: "obat",
    quantity: 100,
    unit: "tablet",
    destination: "IGD (Instalasi Gawat Darurat)",
    notes: "Permintaan rutin",
  },
  {
    id: 2,
    date: "2024-02-03",
    type: "keluar",
    item: "Sarung Tangan Latex (Box)",
    category: "bmhp",
    quantity: 10,
    unit: "box",
    destination: "IGD (Instalasi Gawat Darurat)",
  },
  {
    id: 3,
    date: "2024-02-02",
    type: "masuk",
    item: "Amoxicillin 500mg",
    category: "obat",
    quantity: 500,
    unit: "kapsul",
    source: "PT. Kimia Farma",
  },
  {
    id: 9,
    date: "2024-01-30",
    type: "masuk",
    item: "Metformin 500mg",
    category: "obat",
    quantity: 300,
    unit: "tablet",
    source: "PT. Kalbe Farma",
  },
  {
    id: 10,
    date: "2024-01-29",
    type: "keluar",
    item: "Alkohol 70% (Liter)",
    category: "bmhp",
    quantity: 15,
    unit: "liter",
    destination: "Laboratorium",
  },
];

export function LaporanKeluarMasuk() {
  const [filterPeriod, setFilterPeriod] = useState<
    "3days" | "7days" | "30days" | "custom"
  >("7days");

  const [customStartDate, setCustomStartDate] =
    useState("");

  const [customEndDate, setCustomEndDate] =
    useState("");

  const [transactions, setTransactions] =
    useState<Transaction[]>(mockTransactions);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);

      const response = await apiFetch<
        { data: Transaction[] } | Transaction[]
      >("/reports/inventory-movement");

      const data = Array.isArray(response)
        ? response
        : response.data;

      if (data?.length) {
        setTransactions(data);
      }
    } catch (error) {
      console.error(
        "Gagal memuat transaksi dari API, menggunakan mock data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const getDateRange = () => {
    const today = new Date();

    const startDate = new Date(today);

    if (filterPeriod === "custom") {
      return {
        start: customStartDate
          ? new Date(customStartDate)
          : new Date(0),

        end: customEndDate
          ? new Date(customEndDate)
          : today,
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

    return {
      start: startDate,
      end: today,
    };
  };

  const filteredTransactions = useMemo(() => {
    const { start, end } = getDateRange();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);

      return (
        transactionDate >= start &&
        transactionDate <= end
      );
    });
  }, [
    transactions,
    filterPeriod,
    customStartDate,
    customEndDate,
  ]);

  const totalMasuk = filteredTransactions
    .filter((t) => t.type === "masuk")
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const totalKeluar = filteredTransactions
    .filter((t) => t.type === "keluar")
    .reduce((acc, curr) => acc + curr.quantity, 0);

  const exportToExcel = () => {
    const exportData = filteredTransactions.map(
      (transaction) => ({
        Tanggal: transaction.date,
        Jenis:
          transaction.type === "masuk"
            ? "Barang Masuk"
            : "Barang Keluar",
        Barang: transaction.item,
        Kategori: transaction.category.toUpperCase(),
        Jumlah: transaction.quantity,
        Satuan: transaction.unit,
        Asal: transaction.source || "-",
        Tujuan: transaction.destination || "-",
        Catatan: transaction.notes || "-",
      })
    );

    const worksheet = XLSX.utils.json_to_sheet(
      exportData
    );

    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Laporan Keluar Masuk"
    );

    XLSX.writeFile(
      workbook,
      `laporan-keluar-masuk-${Date.now()}.xlsx`
    );
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Laporan Keluar Masuk
          </h1>

          <p className="text-gray-600">
            Monitoring transaksi barang masuk dan keluar
          </p>
        </div>

        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          <Download className="w-4 h-4" />
          Export Excel
        </button>
      </div>

      {/* FILTER */}
      <div className="bg-white rounded-xl border p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />

            <select
              value={filterPeriod}
              onChange={(e) =>
                setFilterPeriod(
                  e.target.value as
                    | "3days"
                    | "7days"
                    | "30days"
                    | "custom"
                )
              }
              className="border rounded-lg px-3 py-2"
            >
              <option value="3days">
                3 Hari Terakhir
              </option>

              <option value="7days">
                7 Hari Terakhir
              </option>

              <option value="30days">
                30 Hari Terakhir
              </option>

              <option value="custom">
                Custom Tanggal
              </option>
            </select>
          </div>

          {filterPeriod === "custom" && (
            <div className="flex gap-4">
              <input
                type="date"
                value={customStartDate}
                onChange={(e) =>
                  setCustomStartDate(e.target.value)
                }
                className="border rounded-lg px-3 py-2"
              />

              <input
                type="date"
                value={customEndDate}
                onChange={(e) =>
                  setCustomEndDate(e.target.value)
                }
                className="border rounded-lg px-3 py-2"
              />
            </div>
          )}
        </div>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Barang Masuk
              </p>

              <h2 className="text-2xl font-bold text-green-600">
                {totalMasuk}
              </h2>
            </div>

            <TrendingUp className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Total Barang Keluar
              </p>

              <h2 className="text-2xl font-bold text-red-600">
                {totalKeluar}
              </h2>
            </div>

            <TrendingDown className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3">
                  Tanggal
                </th>

                <th className="text-left px-4 py-3">
                  Jenis
                </th>

                <th className="text-left px-4 py-3">
                  Barang
                </th>

                <th className="text-left px-4 py-3">
                  Jumlah
                </th>

                <th className="text-left px-4 py-3">
                  Asal / Tujuan
                </th>

                <th className="text-left px-4 py-3">
                  Catatan
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6"
                  >
                    Loading...
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    Tidak ada data transaksi
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-t"
                  >
                    <td className="px-4 py-3">
                      {transaction.date}
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          transaction.type === "masuk"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.type === "masuk"
                          ? "Masuk"
                          : "Keluar"}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium">
                          {transaction.item}
                        </p>

                        <p className="text-xs text-gray-500 uppercase">
                          {transaction.category}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {transaction.quantity}{" "}
                      {transaction.unit}
                    </td>

                    <td className="px-4 py-3">
                      {transaction.source ||
                        transaction.destination ||
                        "-"}
                    </td>

                    <td className="px-4 py-3">
                      {transaction.notes || "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}