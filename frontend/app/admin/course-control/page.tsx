"use client";
import { useEffect, useState } from "react";
import useSWR from "swr";
import axios from "axios";
import { Box, Button, Drawer, CircularProgress, Typography } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Edit, Delete } from "@mui/icons-material";

import CourseForm from "@/components/courses/courseForm";
import { dataFetcher } from "@/fetchers/classFetchers";
import { Course } from "@/types/classTypes";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5050/api";

export default function CourseControlPage() {
  
  const { data, error, mutate } = useSWR(`${API_BASE}/courses`, dataFetcher);
 
  const [drawer, setDrawer] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // to prevent SSR mismatch
  }, []);

  const handleFormClose = () => {
    setDrawer(false);
    setCourseToEdit(undefined);
    mutate();
  };

  const editCourse = (course: Course) => {
    setCourseToEdit(course);
    setDrawer(true);
  };

  const deleteCourse = async (courseCode: string) => {
    if (courseCode) {
      try {
        await axios.delete(`${API_BASE}/courses/${courseCode}`);
        mutate();
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const columns: GridColDef[] = [
    { field: 'courseCode', headerName: 'ID', width: 150, sortable: false },
    { field: 'courseName', headerName: 'Name', width: 150, sortable: false },
    { field: 'units', headerName: 'Units', width: 150, sortable: false },
    { field: 'department', headerName: 'Department', width: 150, sortable: false },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Button onClick={() => editCourse(params.row)}>
            <Edit />
          </Button>
        </Box>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100%", height: "100%" }}>
          <Button onClick={() => deleteCourse(params.row.courseCode)}>
            <Delete />
          </Button>
        </Box>
      ),
    },
  ];

  const getRowId = (row: any) => row._id;

  if (!isClient) return null; // avoid hydration error

  if (error) {
    return <Typography color="error">Failed to load courses.</Typography>;
  }

  if (!data) {
    return <CircularProgress />;
  }

  return (
    <Box sx={{ alignContent: "center", alignItems: "center", width: "700px" }}>
      <DataGrid
        getRowId={getRowId}
        rows={data}
        columns={columns}
        sx={{ width: "auto", backgroundColor: "white" }}
      />
      <Button
        sx={{ backgroundColor: "white", color: "black", mt: 2 }}
        onClick={() => setDrawer(true)}
      >
        Add Courses
      </Button>
      <Drawer
        anchor="right"
        open={drawer}
        onClose={handleFormClose}
      >
        <CourseForm course={courseToEdit} currentCourses={data} handleClose={handleFormClose} />
      </Drawer>
    </Box>
  );
}
