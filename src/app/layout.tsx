import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import ThemeRegistry from '@/components/ThemeRegistry';
import MainLayout from '@/components/MainLayout';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MEDIVA - Manajemen Vaksinasi & Alkes',
  description:
    'Sistem Manajemen dan Kelola Vaksinasi, Obat, dan Alat Kesehatan',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
        <AppRouterCacheProvider>
          <ThemeRegistry fontClassName={plusJakartaSans.style.fontFamily}>
            <MainLayout>{children}</MainLayout>
          </ThemeRegistry>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
