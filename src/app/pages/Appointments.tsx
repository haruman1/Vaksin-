<<<<<<< HEAD
import { useState, useEffect } from "react";
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
  notes: string;
}

export function Appointments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<AppointmentForm>({
=======
import { useEffect, useState } from "react";
import api from "../services/api";

export default function Appointments() {
  const [appointments, setAppointments] =
    useState<any[]>([]);

  const [formData, setFormData] = useState({
>>>>>>> 334e0553976a6426ab56c748959a9b4bdde8f660
    patientName: "",
    patientNIK: "",
    vaccineType: "",
    date: "",
    time: "",
<<<<<<< HEAD
=======
    status: "scheduled",
>>>>>>> 334e0553976a6426ab56c748959a9b4bdde8f660
    notes: "",
  });

  useEffect(() => {
    fetchAppointments();
<<<<<<< HEAD
  }, [searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const data = await apiFetch<Appointment[]>(
        `/appointments?${params.toString()}`
      );

      setAppointments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (
    id: number,
    status: Appointment["status"]
  ) => {
    try {
      const appointment = appointments.find((a) => a.id === id);

      if (!appointment) return;

      await apiFetch(`/appointments/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...appointment,
          status,
        }),
      });

      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Gagal update status");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus jadwal ini?"
    );

    if (!confirmDelete) return;

    try {
      await apiFetch(`/appointments/${id}`, {
        method: "DELETE",
      });

      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus jadwal");
    }
  };

  const handleAddAppointment = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      await apiFetch("/appointments", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          status: "scheduled",
        }),
      });

      setShowAddModal(false);

      setFormData({
        patientName: "",
        patientNIK: "",
        vaccineType: "",
        date: "",
        time: "",
        notes: "",
      });

      fetchAppointments();
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan jadwal");
    }
  };

  const getStatusBadge = (status: Appointment["status"]) => {
    switch (status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle2 className="w-3 h-3" />
            Selesai
          </span>
        );

      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="w-3 h-3" />
            Dibatalkan
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertCircle className="w-3 h-3" />
            Terjadwal
          </span>
        );
    }
  };

  const groupAppointmentsByDate = () => {
    const grouped: Record<string, Appointment[]> = {};

    appointments.forEach((appointment) => {
      if (!grouped[appointment.date]) {
        grouped[appointment.date] = [];
      }

      grouped[appointment.date].push(appointment);
    });

    return grouped;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const groupedAppointments = groupAppointmentsByDate();

  const sortedDates = Object.keys(groupedAppointments).sort();
=======
  }, []);

  const fetchAppointments = async () => {
    const res = await api.get("/appointments");

    setAppointments(res.data);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    await api.post("/appointments", formData);

    fetchAppointments();

    setFormData({
      patientName: "",
      patientNIK: "",
      vaccineType: "",
      date: "",
      time: "",
      status: "scheduled",
      notes: "",
    });
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/appointments/${id}`);

    fetchAppointments();
  };
>>>>>>> 334e0553976a6426ab56c748959a9b4bdde8f660

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-8">
<<<<<<< HEAD
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Jadwal Vaksinasi
        </h1>

        <p className="text-gray-600 mt-1">
          Kelola jadwal dan janji temu vaksinasi
        </p>
      </div>

      {loading && (
        <div className="mb-4 text-blue-600 font-medium">
          Loading...
        </div>
      )}

      {error && (
        <div className="mb-4 text-red-600 font-medium">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-sm text-gray-600">
            Terjadwal Hari Ini
          </p>

          <p className="text-2xl font-bold mt-1">
            {
              appointments.filter(
                (a) =>
                  a.date === today &&
                  a.status === "scheduled"
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-sm text-gray-600">
            Selesai Hari Ini
          </p>

          <p className="text-2xl font-bold mt-1">
            {
              appointments.filter(
                (a) =>
                  a.date === today &&
                  a.status === "completed"
              ).length
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
          <p className="text-sm text-gray-600">
            Total Jadwal
          </p>

          <p className="text-2xl font-bold mt-1">
            {appointments.length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

          <input
            type="text"
            placeholder="Cari nama, NIK, vaksin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="pl-10 pr-8 py-2 border rounded-lg"
            >
              <option value="all">Semua Status</option>
              <option value="scheduled">Terjadwal</option>
              <option value="completed">Selesai</option>
              <option value="cancelled">Dibatalkan</option>
            </select>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            <Plus className="w-5 h-5" />
            Jadwal Baru
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {sortedDates.map((date) => (
          <div
            key={date}
            className="bg-white rounded-lg shadow border"
          >
            <div className="px-6 py-4 bg-gray-50 border-b">
              <h3 className="font-semibold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                {formatDate(date)}
              </h3>
            </div>

            <div className="divide-y">
              {groupedAppointments[date].map(
                (appointment) => (
                  <div
                    key={appointment.id}
                    className="p-6"
                  >
                    <div className="flex justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">
                            {appointment.patientName}
                          </h4>

                          {getStatusBadge(
                            appointment.status
                          )}
                        </div>

                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {appointment.time}
                          </div>

                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            {appointment.patientNIK}
                          </div>

                          <div className="flex items-center gap-2">
                            <Syringe className="w-4 h-4" />
                            {appointment.vaccineType}
                          </div>
                        </div>

                        {appointment.notes && (
                          <p className="text-sm text-gray-500">
                            Catatan: {appointment.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {appointment.status ===
                          "scheduled" && (
                          <>
                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  appointment.id,
                                  "completed"
                                )
                              }
                              className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg"
                            >
                              Selesai
                            </button>

                            <button
                              onClick={() =>
                                handleUpdateStatus(
                                  appointment.id,
                                  "cancelled"
                                )
                              }
                              className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg"
                            >
                              Batalkan
                            </button>
                          </>
                        )}

                        <button
                          onClick={() =>
                            handleDelete(
                              appointment.id
                            )
                          }
                          className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
=======
      <h1 className="text-2xl font-bold mb-6">
        Appointments
      </h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 mb-8"
      >
        <input
          type="text"
          placeholder="Patient Name"
          value={formData.patientName}
          onChange={(e) =>
            setFormData({
              ...formData,
              patientName: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <input
          type="text"
          placeholder="NIK"
          value={formData.patientNIK}
          onChange={(e) =>
            setFormData({
              ...formData,
              patientNIK: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <input
          type="text"
          placeholder="Vaccine Type"
          value={formData.vaccineType}
          onChange={(e) =>
            setFormData({
              ...formData,
              vaccineType: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <input
          type="date"
          value={formData.date}
          onChange={(e) =>
            setFormData({
              ...formData,
              date: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <input
          type="time"
          value={formData.time}
          onChange={(e) =>
            setFormData({
              ...formData,
              time: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <textarea
          placeholder="Notes"
          value={formData.notes}
          onChange={(e) =>
            setFormData({
              ...formData,
              notes: e.target.value,
            })
          }
          className="border p-2 w-full"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Vaccine</th>
            <th>Date</th>
            <th>Time</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((item) => (
            <tr key={item.id}>
              <td>{item.patient_name}</td>
              <td>{item.vaccine_type}</td>
              <td>{item.date}</td>
              <td>{item.time}</td>

              <td>
                <button
                  onClick={() =>
                    handleDelete(item.id)
                  }
                  className="bg-red-600 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
>>>>>>> 334e0553976a6426ab56c748959a9b4bdde8f660
    </div>
  );
}