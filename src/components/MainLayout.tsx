'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
  Paper,
  Switch,
  Button
} from '@mui/material';
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
} from 'lucide-react';
import { useThemeContext } from './ThemeRegistry';

const drawerWidth = 280;

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { mode, toggleMode } = useThemeContext();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    // Only run on client
    const checkAuth = async () => {
      const { getUserFromToken } = await import('@/app/lib/auth');
      const currentUser = getUserFromToken();
      if (currentUser) {
        setUser(currentUser);
      }
    };
    checkAuth();
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/permintaan', label: 'Form Permintaan', icon: FileText },
    { path: '/riwayat', label: 'Riwayat Permintaan', icon: History },
    { path: '/laporan', label: 'Laporan Keluar Masuk', icon: BarChart3 },
    { path: '/inventory', label: 'Inventori', icon: Package },
  ].filter(item => {
    if (!user) return false; // Default safe 
    if (user.role === 'admin') return true;
    if (user.role === 'pengguna') {
      // Pengguna only sees Dashboard, Form Permintaan, and Inventory (stock view)
      return ['/', '/permintaan', '/inventory', '/laporan', '/riwayat'].includes(item.path);
    }
    return true;
  });

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  // Don't render sidebar if it's the login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        {/* Logo Header */}
        <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0f766e 0%, #2563eb 100%)',
              p: 1.25,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
            }}
          >
            <Activity size={24} color="#ffffff" />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                fontSize: '1.25rem',
                letterSpacing: '0.5px',
                background: 'linear-gradient(90deg, #0f766e 0%, #2563eb 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              MEDIVA
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'text.secondary',
                display: 'block',
                fontSize: '0.7rem',
                lineHeight: 1.2,
              }}
            >
              Manajemen Vaksinasi & Alkes
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Navigation List */}
        <List
          sx={{
            flexGrow: 1,
            px: 2,
            py: 3,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  sx={{
                    borderRadius: '12px',
                    py: 1.5,
                    px: 2,
                    bgcolor: active ? 'primary.main' : 'transparent',
                    color: active ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      bgcolor: active ? 'primary.main' : 'action.hover',
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 40,
                      color: active ? 'primary.contrastText' : 'text.secondary',
                    }}
                  >
                    <Icon size={20} />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        sx: {
                          fontWeight: active ? 600 : 500,
                          fontSize: '0.9rem',
                        },
                      },
                    }}
                  />
                  {active && <ChevronRight size={16} />}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider />

        {/* Dark Mode Toggle & Footer */}
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {/* Theme Switcher Button */}
          <Paper
            elevation={0}
            onClick={toggleMode}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1.5,
              borderRadius: '12px',
              cursor: 'pointer',
              bgcolor: mode === 'dark' ? 'slate.800' : 'action.hover',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              {mode === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {mode === 'dark' ? 'Mode Gelap' : 'Mode Terang'}
              </Typography>
            </Box>
            <Switch
              size="small"
              checked={mode === 'dark'}
              onChange={toggleMode}
              onClick={(e) => e.stopPropagation()}
            />
          </Paper>

          {/* User Profile Badge */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: '12px',
              background:
                'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(13, 148, 136, 0.05) 100%)',
              border: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
              gap: 1
            }}
          >
            <Box>
              <Typography
                variant="caption"
                sx={{ color: 'text.secondary', display: 'block' }}
              >
                Masuk sebagai {user?.role === 'admin' ? 'Admin' : 'Pengguna'}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                {user?.name || 'Loading...'}
              </Typography>
              {user?.wilayah && (
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                  Wilayah: {user.wilayah}
                </Typography>
              )}
            </Box>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={handleLogout}
              sx={{ mt: 1, textTransform: 'none', borderRadius: '8px' }}
            >
              Keluar
            </Button>
          </Paper>
        </Box>
      </Drawer>

      {/* Main Page Content Wrapper */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
