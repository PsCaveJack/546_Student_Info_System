"use client";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

import CourseForm from "@/components/courses/courseForm";
import { dataFetcher } from "@/fetchers/classFetchers";
import { fetchCourses } from "@/handlers/classHandlers";
import { Course } from "@/types/classTypes";
import { Box, Button, Drawer, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Edit, Delete } from "@mui/icons-material";

export default function CourseControlPage() {
  
  const courses = useSWR(`${API_BASE}/courses`, dataFetcher);

  const [drawer, setDrawer] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCourses = courses.data?.filter((course: Course) => {
    const query = searchTerm.toLowerCase();
    return (
      course.courseCode.toString().includes(query) || course.courseName.toLowerCase().includes(query)
    );
  });

  const handleFormClose = () => {
    setDrawer(false);
    setCourseToEdit(undefined);
    courses.mutate();
  }

  const editCourse = (course: Course) => {
    if (course) {
      setCourseToEdit(course);
      setDrawer(true);
    }
  }

  const deleteCourse = async (courseCode: string) => {
    if (courseCode) {
      await axios.delete(`${API_BASE}/courses/${courseCode}`);
      courses.mutate();
    }
  }

  const columns: GridColDef[] = [
    { field: 'courseCode', headerName: 'ID', width: 150, sortable: false },
    { field: 'courseName', headerName: 'Name', width: 300, sortable: false },
    { field: 'units', headerName: 'Units', width: 100, sortable: false },
    { field: 'department', headerName: 'Department', width: 150, sortable: false },
    {
      field: 'edit', 
      headerName: 'Edit',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      renderCell: (params) => {
        const {id} = params;
        return (
          <Box
            sx = {{
              display: "flex",
              justifyContent: "center",
              alignItems:"center",
              width:"100%",
              height:"100%",
            }}
          >
            <Button
              onClick={() => editCourse(params.row)}
            >
              <Edit/>
            </Button>
          </Box>
        );
      }
    },
    {
      field: 'delete', 
      headerName: 'Delete',
      width: 100,
      sortable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      renderCell: (params) => {
        const {id} = params;
        return (
          <Box
            sx = {{
              display: "flex",
              justifyContent: "center",
              alignItems:"center",
              width:"100%",
              height:"100%",
            }}
          >
            <Button
              onClick={() => deleteCourse(params.row.courseCode)}
            >
              <Delete/>
            </Button>
          </Box>
        );
        
      }
    }
  ];

  function getRowId(row: any) {
    return row._id;
  }
  
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        gap: 3, // Adjusted gap for proper vertical spacing
        padding: "20px", // Added padding for proper spacing inside the Box
        maxWidth: "100%",
        margin: "0 auto", // Center the entire content horizontally
      }}
    >
      {
        courses.data && (
          <>
            <TextField
              label="Search by ID or Name"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                marginBottom: 2,
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "white",
                borderRadius: "12px",
                boxShadow: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  "& fieldset": {
                    borderColor: "#ccc",
                  },
                  "&:hover fieldset": {
                    borderColor: "#1e90ff",
                  },
                },
              }}
            />

            <div style={{ width: "fit-content", maxWidth: "100%" }}>
              <DataGrid 
                getRowId={getRowId}
                rows={filteredCourses || courses.data} 
                columns={columns} 
                sx={{
                  backgroundColor:"white",
                }}
              />
            </div>
            
            <Button
              className="fancy-button"
              onClick={() =>setDrawer(true)}
            >
              Add Courses
            </Button>
            <Drawer
              anchor="right"
              open={drawer}
              onClose={() => handleFormClose()}
            >
              <CourseForm course={courseToEdit} currentCourses={courses.data} handleClose={handleFormClose}/>
            </Drawer>
          </>
        )
      }
      
      
    </Box>
  )
  
}