"use client";

import { ReactNode, useEffect, useState } from 'react';
import { Drawer, AppBar, Toolbar, List, ListItem, ListItemText, IconButton, Typography, Box } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { userAtom } from '@/storage/user';
import { useAtom } from 'jotai';


interface ProfessorLayoutProps {
  children: ReactNode;
}

const ProfessorLayout = ({ children }: ProfessorLayoutProps) => {

  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const getPageTitle = () => {
    switch (pathname) {
      case '/professor/coursesview':
        return 'Courses';
      case '/professor/studentview':
        return 'Students';
      default:
        return 'Professor Dashboard';
    }
  };

  const [user] = useAtom(userAtom);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace('/');
    }
    else if(user.role !== 'professor') {
      router.replace('/loading');
    }
  }, [user]);

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
              <Link href="/professor/coursesview" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary="Courses" />
              </Link>
            </ListItem>
            <ListItem component="button">
              <Link href="/professor/studentview" style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemText primary="Students" />
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

export default ProfessorLayout;
