"use client";

import { ReactNode, useState } from 'react';
import { Drawer, AppBar, Toolbar, List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';


interface StudentLayoutProps {
  children: ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {

  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/student/class-control':
        return 'Active Classes';
      case '/student/class-search':
        return 'Search and Enroll Classes';
      default:
        return 'Student Dashboard';
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
              <Link href="/student/class-control" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary="Active Classes" />
              </Link>
            </ListItem>
            <ListItem component="button">
              <Link href="/student/class-search" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary="Search and Enroll" />
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

export default StudentLayout;
