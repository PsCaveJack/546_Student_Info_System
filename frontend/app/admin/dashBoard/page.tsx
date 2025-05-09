// frontend/app/admin/dashboard/page.tsx
"use client";

import Container  from "@mui/material/Container";
import Box        from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ClassIcon         from "@mui/icons-material/Class";
import SchoolIcon        from "@mui/icons-material/School";
import TuneIcon          from "@mui/icons-material/Tune";
import HowToRegIcon      from "@mui/icons-material/HowToReg";

import { DashboardCard } from "../../components/DashboardCard";

export default function AdminDashboard() {
  const cards = [
    {
      title: "Account Control",
      href:  "/admin/account-control",
      icon:  <AccountCircleIcon sx={{ fontSize: 50 }} />
    },
    {
      title: "Course Control",
      href:  "/admin/course-control",
      icon:  <ClassIcon sx={{ fontSize: 50 }} />
    },
    {
      title: "Majors Control",
      href:  "/admin/majors-control",
      icon:  <SchoolIcon sx={{ fontSize: 50 }} />
    },
    {
      title: "Section Control",
      href:  "/admin/section-control",
      icon:  <TuneIcon sx={{ fontSize: 50 }} />
    },
    {
      title: "Graduation Check",
      href:  "/admin/graduation-check",
      icon:  <HowToRegIcon sx={{ fontSize: 50 }} />
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome Admin
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 4,
        }}
      >
        {cards.map((c) => (
          <Box key={c.title} sx={{ flex: "1 1 280px", maxWidth: "280px" }}>
            <DashboardCard {...c} />
          </Box>
        ))}
      </Box>
    </Container>
  );
}
