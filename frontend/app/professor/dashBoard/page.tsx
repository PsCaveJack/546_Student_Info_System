"use client";

import Container  from "@mui/material/Container";
import Box        from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import MenuBookIcon from "@mui/icons-material/MenuBook";
import EditIcon     from "@mui/icons-material/Edit";
import GroupIcon    from "@mui/icons-material/Group";

import { DashboardCard } from "../../components/DashboardCard";

export default function ProfessorDashboard() {
  const cards = [
    {
      title: "View Courses",
      href:  "/professor/coursesview",
      icon:  <MenuBookIcon sx={{ fontSize: 50 }} />
    },
    {
      title: "Course Management",
      href:  "/professor/course",
      icon:  <EditIcon sx={{ fontSize: 50 }} />
    },
    {
      title: "Student View",
      href:  "/professor/studentview",
      icon:  <GroupIcon sx={{ fontSize: 50 }} />
    },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome Professor
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
