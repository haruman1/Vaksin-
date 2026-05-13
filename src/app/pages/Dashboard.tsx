import {
  Activity,
  Users,
  Syringe,
  TrendingUp,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export function Dashboard() {
  const stats = [
    {
      title: "Total Vaksin",
      value: "2,345",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Obat",
      value: "48",
      change: "+5%",
      icon: Syringe,
      color: "bg-green-500",
    },
    {
      title: "Total Alat Kesehatan",
      value: "23",
      change: "-8%",
      icon: TrendingUp,
      color: "bg-yellow-500",
    },
    {
      title: "Total BMHP",
      value: "98.5%",
      change: "+2%",
      icon: TrendingUp,
      color: "bg-purple-500",
    },
  ];

  const vaccinationTrend = [
    { month: "Jan", vaksinasi: 120 },
    { month: "Feb", vaksinasi: 180 },
    { month: "Mar", vaksinasi: 150 },
    { month: "Apr", vaksinasi: 220 },
    { month: "Mei", vaksinasi: 280 },
    { month: "Jun", vaksinasi: 250 },
  ];

  const vaccineTypes = [
    { name: "COVID-19", value: 450, color: "#3b82f6" },
    { name: "Influenza", value: 280, color: "#10b981" },
    { name: "Hepatitis B", value: 180, color: "#f59e0b" },
    { name: "MMR", value: 150, color: "#8b5cf6" },
  ];

  const recentAppointments = [
    {
      id: 1,
      name: "Ahmad Fauzi",
      vaccine: "COVID-19",
      time: "09:00",
      status: "completed",
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      vaccine: "Influenza",
      time: "10:30",
      status: "completed",
    },
    {
      id: 3,
      name: "Budi Santoso",
      vaccine: "Hepatitis B",
      time: "11:00",
      status: "scheduled",
    },
    {
      id: 4,
      name: "Dewi Lestari",
      vaccine: "COVID-19",
      time: "13:30",
      status: "scheduled",
    },
  ];

  return (
    <div className="p-8 dark:bg-gray-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Selamat datang di Sistem Manajemen Vaksinasi
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-2">{stat.change}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Vaccination Trend */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Tren Vaksinasi (6 Bulan Terakhir)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vaccinationTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="vaksinasi"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Jumlah Vaksinasi"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Vaccine Types Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Distribusi Jenis Vaksin
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vaccineTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {vaccineTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Jadwal Vaksinasi Hari Ini
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nama Pasien
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Jenis Vaksin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {recentAppointments.map((appointment) => (
                <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {appointment.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {appointment.vaccine}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-300">
                      {appointment.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {appointment.status === "completed" ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle2 className="w-3 h-3" />
                        Selesai
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <AlertCircle className="w-3 h-3" />
                        Terjadwal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}