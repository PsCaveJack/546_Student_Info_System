"use client";

import Link from "next/link";
import { Card, CardActionArea, CardContent, Typography, Box } from "@mui/material";

interface DashboardCardProps {
  title: string;
  href: string;
  icon: React.ReactNode;
}

export function DashboardCard({ title, href, icon }: DashboardCardProps) {
  return (
    <Card
      sx={{
        height: "100%",
        textAlign: "center",
        borderRadius: 2,
        boxShadow: 3,
        transition: "box-shadow 0.2s",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardActionArea
        component={Link}
        href={href}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 3,
          height: "100%",
        }}
      >
        <Box sx={{ mb: 1 }}>{icon}</Box>
        <CardContent>
          <Typography variant="h6">{title}</Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
