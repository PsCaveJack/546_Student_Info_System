"use client";

import Container  from "@mui/material/Container";
import Box        from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import ListAltIcon from "@mui/icons-material/ListAlt";
import SearchIcon  from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";

import { DashboardCard } from "../../components/DashboardCard";

export default function StudentDashboard() {
  const cards = [
    {
      title: "My Classes",
      href:  "/student/class-control",
      icon:  <ListAltIcon sx={{ fontSize: 50 }} />
    },
    {
      title: "Search Classes",
      href:  "/student/class-search",
      icon:  <SearchIcon sx={{ fontSize: 50 }} />
    },
    {
      title: "Course History",
      href:  "/student/course-history",
      icon:  <HistoryIcon sx={{ fontSize: 50 }} />
    },
  ];

  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <Typography variant="h3" align="center" gutterBottom>
        Welcome Student
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
