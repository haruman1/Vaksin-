import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Eye,
  X,
  Plus,
  FileText,
} from "lucide-react";

import { apiFetch } from "../lib/api";

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

export function RiwayatPermintaan() {
  const navigate = useNavigate();

  const [requests, setRequests] = useState<RequestForm[]>(
    []
  );

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedRequest, setSelectedRequest] =
    useState<RequestForm | null>(null);

  const [showDetailModal, setShowDetailModal] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setIsLoading(true);

      const response = await apiFetch<
        { data: RequestForm[] } | RequestForm[]
      >("/requests");

      const data = Array.isArray(response)
        ? response
        : response.data;

      setRequests(data || []);
    } catch (error) {
      console.error(
        "Gagal memuat data dari API, menggunakan localStorage:",
        error
      );

      const savedRequests = JSON.parse(
        localStorage.getItem("requests") || "[]"
      );

      setRequests(savedRequests);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const keyword = searchTerm.toLowerCase();

      return (
        request.staffName
          .toLowerCase()
          .includes(keyword) ||
        request.unit.toLowerCase().includes(keyword) ||
        request.position
          .toLowerCase()
          .includes(keyword)
      );
    });
  }, [requests, searchTerm]);

  const getStatusBadge = (
    status: RequestForm["status"]
  ) => {
    const styles = {
      approved:
        "bg-green-100 text-green-800",
      rejected:
        "bg-red-100 text-red-800",
      pending:
        "bg-yellow-100 text-yellow-800",
    };

    const labels = {
      approved: "Disetujui",
      rejected: "Ditolak",
      pending: "Menunggu",
    };

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
      >
        {labels[status]}
      </span>
    );
  };

  const handleViewDetail = (
    request: RequestForm
  ) => {
    setSelectedRequest(request);
    setShowDetailModal(true);
  };

  const handleUpdateStatus = async (
    id: number,
    newStatus: "approved" | "rejected"
  ) => {
    try {
      const endpoint =
        newStatus === "approved"
          ? `/requests/${id}/approve`
          : `/requests/${id}/reject`;

      await apiFetch(endpoint, {
        method: "PATCH",
      });
    } catch (error) {
      console.error(
        "Gagal update status via API, lanjut update lokal:",
        error
      );
    }

    const updatedRequests = requests.map((request) =>
      request.id === id
        ? {
            ...request,
            status: newStatus,
          }
        : request
    );

    setRequests(updatedRequests);

    localStorage.setItem(
      "requests",
      JSON.stringify(updatedRequests)
    );
  };

  return (
    <div className="p-8">
<<<<<<< HEAD
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Riwayat Permintaan
          </h1>

          <p className="text-gray-600 mt-1">
            Lihat dan kelola semua permintaan
            barang
          </p>
=======
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Riwayat Permintaan
            </h1>
            <p className="text-gray-600 mt-1">
              Lihat dan kelola semua permintaan barang
            </p>
          </div>
>>>>>>> 334e0553976a6426ab56c748959a9b4bdde8f660
        </div>

        <button
          onClick={() =>
            navigate("/permintaan/create")
          }
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Permintaan Baru
        </button>
      </div>

      {/* SEARCH */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Cari nama petugas, unit, jabatan..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Tanggal",
                  "Unit",
                  "Nama Petugas",
                  "Jabatan",
                  "Item",
                  "Status",
                  "Aksi",
                ].map((header) => (
                  <th
                    key={header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Memuat data...
                  </td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    Tidak ada data permintaan
                  </td>
                </tr>
              ) : (
                filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {request.requestDate}
                      </div>

                      <div className="text-xs text-gray-500">
                        {request.createdAt}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {request.unit}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {request.staffName}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900">
                      {request.position}
                    </td>

                    <td className="px-6 py-4">
                      <div className="space-y-1 text-sm">
                        {request.medicines.length >
                          0 && (
                          <div>
                            💊{" "}
                            {
                              request.medicines
                                .length
                            }{" "}
                            Obat
                          </div>
                        )}

                        {request.bmhp.length > 0 && (
                          <div>
                            📦 {request.bmhp.length}{" "}
                            BMHP
                          </div>
                        )}

                        {request
                          .medicalEquipment
                          .length > 0 && (
                          <div>
                            🏥{" "}
                            {
                              request
                                .medicalEquipment
                                .length
                            }{" "}
                            Alat Medis
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {getStatusBadge(
                        request.status
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleViewDetail(
                              request
                            )
                          }
                          className="p-2 rounded-lg bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {request.status ===
                          "pending" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  request.id,
                                  "approved"
                                )
                              }
                              className="px-3 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200 text-sm"
                            >
                              Setujui
                            </button>

                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  request.id,
                                  "rejected"
                                )
                              }
                              className="px-3 py-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 text-sm"
                            >
                              Tolak
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

<<<<<<< HEAD
      {/* DETAIL MODAL */}
      {showDetailModal &&
        selectedRequest && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-xl font-semibold">
                    Detail Permintaan
                  </h2>
=======
      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-4xl w-full my-8">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-900">
                Detail Permintaan
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
    
>>>>>>> 334e0553976a6426ab56c748959a9b4bdde8f660

                  <p className="text-sm text-gray-500">
                    #{selectedRequest.id}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setShowDetailModal(false)
                  }
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InfoItem
                    label="Unit"
                    value={selectedRequest.unit}
                  />

                  <InfoItem
                    label="Petugas"
                    value={
                      selectedRequest.staffName
                    }
                  />

                  <InfoItem
                    label="Jabatan"
                    value={
                      selectedRequest.position
                    }
                  />

                  <InfoItem
                    label="Tanggal"
                    value={
                      selectedRequest.requestDate
                    }
                  />
                </div>

                <div>
                  <h3 className="font-semibold mb-3">
                    Daftar Permintaan
                  </h3>

                  <div className="space-y-3">
                    {selectedRequest.medicines.map(
                      (item) => (
                        <RequestItem
                          key={item.id}
                          title={item.medicine}
                          qty={`${item.requestQuantity} item`}
                        />
                      )
                    )}

                    {selectedRequest.bmhp.map(
                      (item) => (
                        <RequestItem
                          key={item.id}
                          title={item.item}
                          qty={`${item.requestQuantity} item`}
                        />
                      )
                    )}

                    {selectedRequest.medicalEquipment.map(
                      (item) => (
                        <RequestItem
                          key={item.id}
                          title={item.equipment}
                          qty={`${item.requestQuantity} item`}
                        />
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-gray-500">
        {label}
      </p>

      <p className="font-medium text-gray-900">
        {value}
      </p>
    </div>
  );
}

function RequestItem({
  title,
  qty,
}: {
  title: string;
  qty: string;
}) {
  return (
    <div className="flex items-center justify-between border rounded-lg p-3">
      <div className="flex items-center gap-3">
        <FileText className="w-4 h-4 text-blue-600" />

        <span>{title}</span>
      </div>

      <span className="text-sm text-gray-500">
        {qty}
      </span>
    </div>
  );
}