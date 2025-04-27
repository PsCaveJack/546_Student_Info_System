"use client";

import { ReactNode, useState } from 'react';
import { Drawer, AppBar, Toolbar, List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {

  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/admin/account-control':
        return 'Account Control';
      case '/admin/course-control':
        return 'Course Control';
      case '/admin/majors-control':
        return 'Majors Control';
      case '/admin/section-control':
        return 'Section Control';
      default:
        return 'Admin Dashboard';
    }
  };

  return (
    <Box >
      {/* AppBar (top bar) */}
      <AppBar position="sticky"
        sx={{
          backgroundColor:"#00244E"
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">{getPageTitle()}</Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Drawer
        sx={{
          width: 240,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 240,
            boxSizing: 'border-box',
            backgroundColor: '#f4f4f4',
          },
        }}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerToggle}
      >
        <Box sx={{ width: 240 }}>
          <List>
            <ListItem component="button">
              <Link href="/admin/account-control" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary="Accounts" />
              </Link>
            </ListItem>
            <ListItem component="button">
              <Link href="/admin/course-control" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary="Courses" />
              </Link>
            </ListItem>
            <ListItem component="button">
              <Link href="/admin/majors-control" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary="Majors" />
              </Link>
            </ListItem>
            <ListItem component="button">
              <Link href="/admin/section-control" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary="Sections" />
              </Link>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Main content */}
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {children}
      </main>
    </Box>
  );
};

export default AdminLayout;
