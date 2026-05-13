import { Outlet, Link, useLocation } from "react-router";
import {
  LayoutDashboard,
  FileText,
  History,
  BarChart3,
  Package,
  Moon,
  Sun,
  Activity,
  ChevronRight,
} from "lucide-react";
import { useTheme } from "@/app/components/ThemeProvider";

export function Layout() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { path: "/", icon: LayoutDashboard, label: "Dashboard", color: "blue" },
    {
      path: "/permintaan",
      icon: FileText,
      label: "Form Permintaan",
      color: "blue",
    },
    {
      path: "/riwayat",
      icon: History,
      label: "Riwayat Permintaan",
      color: "blue",
    },
    {
      path: "/laporan",
      icon: BarChart3,
      label: "Laporan Keluar Masuk",
      color: "blue",
    },
    { path: "/inventory", icon: Package, label: "Inventori", color: "blue" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const getColorClasses = (color: string, active: boolean) => {
    if (active) {
      const activeColors: { [key: string]: string } = {
        blue: "bg-blue-500 text-white shadow-lg shadow-blue-500/50",
      };
      return activeColors[color] || activeColors.blue;
    }
    return "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700";
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col shadow-xl transition-colors">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl shadow-lg">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                MEDIVA
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Manajemen dan Kelola Vaksinasi, Obat, dan Alat Kesehatan
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 ${getColorClasses(
                  item.color,
                  active
                )}`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${
                      active ? "scale-110" : "group-hover:scale-110"
                    }`}
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </div>
                {active && (
                  <ChevronRight className="w-4 h-4 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle & Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 group"
          >
            <div className="flex items-center gap-3">
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:rotate-12 transition-transform duration-200" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:rotate-45 transition-transform duration-200" />
              )}
              <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
                {theme === "light" ? "Mode Gelap" : "Mode Terang"}
              </span>
            </div>
            <div
              className={`w-11 h-6 rounded-full relative transition-colors duration-200 ${
                theme === "dark" ? "bg-blue-500" : "bg-gray-300"
              }`}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-200 ${
                  theme === "dark" ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
          </button>

          {/* User Info */}
          <div className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Logged in as
            </p>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              Admin User
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900 transition-colors">
        <Outlet />
      </main>
    </div>
  );
}
