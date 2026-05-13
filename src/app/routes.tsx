import { createBrowserRouter, redirect } from "react-router";
import { Dashboard } from "@/app/pages/Dashboard";
import { Patients } from "@/app/pages/Patients";
import { RiwayatPermintaan } from "@/app/pages/RiwayatPermintaan";
import { LaporanKeluarMasuk } from "@/app/pages/LaporanKeluarMasuk";
import { Inventory } from "@/app/pages/Inventory";
import { Layout } from "@/app/components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "permintaan", Component: Patients },
      { path: "riwayat", Component: RiwayatPermintaan },
      { path: "laporan", Component: LaporanKeluarMasuk },
      { path: "inventory", Component: Inventory },
      // Redirects for old routes
      { 
        path: "patients", 
        loader: () => redirect("/permintaan")
      },
      { 
        path: "appointments", 
        loader: () => redirect("/laporan")
      },
      // Catch all - redirect to dashboard
      { 
        path: "*", 
        loader: () => redirect("/")
      },
    ],
  },
]);