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
  Button,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
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
  Menu,
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
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

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

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Close drawer on path change (for mobile)
  React.useEffect(() => {
    if (!isDesktop) {
      setMobileOpen(false);
    }
  }, [pathname, isDesktop]);

  const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/permintaan', label: 'Form Permintaan', icon: FileText },
    { path: '/riwayat', label: 'Riwayat Permintaan', icon: History },
    { path: '/laporan', label: 'Laporan Keluar Masuk', icon: BarChart3 },
    { path: '/inventory', label: 'Inventori', icon: Package },
  ].filter(item => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (user.role === 'pengguna') {
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

  if (pathname === '/login') {
    return <>{children}</>;
  }

  const drawerContent = (
    <>
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

      <Divider sx={{ mx: 2, opacity: 0.5 }} />

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
                  mb: 0.5,
                  bgcolor: active ? (mode === 'dark' ? 'rgba(37, 99, 235, 0.2)' : '#eff6ff') : 'transparent',
                  color: active ? '#2563eb' : 'text.primary',
                  position: 'relative',
                  overflow: 'hidden',
                  '&:hover': {
                    bgcolor: active 
                      ? (mode === 'dark' ? 'rgba(37, 99, 235, 0.3)' : '#dbeafe') 
                      : (mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'),
                  },
                  transition: 'all 0.2s ease-in-out',
                }}
              >
                {active && (
                  <Box
                    sx={{
                      position: 'absolute',
                      left: 0,
                      top: '15%',
                      bottom: '15%',
                      width: '4px',
                      borderRadius: '0 4px 4px 0',
                      bgcolor: '#2563eb',
                    }}
                  />
                )}
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: active ? '#2563eb' : 'text.secondary',
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

      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
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
            bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8fafc',
            border: '1px solid',
            borderColor: mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : '#e2e8f0',
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: mode === 'dark' ? 'rgba(255, 255, 255, 0.08)' : '#f1f5f9',
            },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, color: 'text.primary' }}>
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

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: '16px',
            background: mode === 'dark' 
              ? 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(13, 148, 136, 0.15) 100%)'
              : 'linear-gradient(135deg, rgba(79, 70, 229, 0.05) 0%, rgba(13, 148, 136, 0.05) 100%)',
            border: '1px solid',
            borderColor: mode === 'dark' ? 'rgba(79, 70, 229, 0.2)' : 'rgba(79, 70, 229, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5
          }}
        >
          <Box>
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
              Masuk sebagai {user?.role === 'admin' ? 'Admin' : 'Pengguna'}
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {user?.name || 'Loading...'}
            </Typography>
            {user?.wilayah && (
              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                📍 {user.wilayah}
              </Typography>
            )}
          </Box>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleLogout}
            sx={{ 
              mt: 0.5, 
              textTransform: 'none', 
              borderRadius: '8px',
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': {
                boxShadow: 'none',
              }
            }}
          >
            Keluar
          </Button>
        </Paper>
      </Box>
    </>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Mobile AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: 'none' },
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider',
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, color: 'text.primary' }}
          >
            <Menu />
          </IconButton>
          <Box
            sx={{
              background: 'linear-gradient(135deg, #0f766e 0%, #2563eb 100%)',
              p: 0.75,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 1.5,
            }}
          >
            <Activity size={18} color="#ffffff" />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              fontWeight: 800,
              fontSize: '1.1rem',
              background: 'linear-gradient(90deg, #0f766e 0%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            MEDIVA
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
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
        open
      >
        {drawerContent}
      </Drawer>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            bgcolor: 'background.paper',
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Page Content Wrapper */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: '64px', md: 0 }, // Add padding top for mobile app bar
        }}
      >
        {children}
      </Box>
    </Box>
  );
}
