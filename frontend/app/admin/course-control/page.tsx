"use client";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

import CourseForm from "@/components/courses/courseForm";
import { dataFetcher } from "@/fetchers/classFetchers";
import { fetchCourses } from "@/handlers/classHandlers";
import { Course } from "@/types/classTypes";
import { Box, Button, Drawer } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { Edit, Delete } from "@mui/icons-material";

export default function CourseControlPage() {
  
  const courses = useSWR(`${API_BASE}/courses`, dataFetcher);

  const [drawer, setDrawer] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | undefined>(undefined);

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
        alignContent:"center",
        alignItems:"center",
        width:"700px"
      }}
    >
      {
        courses.data && (
          <>
            <DataGrid 
              getRowId={getRowId}
              rows={courses.data} 
              columns={columns} 
              sx={{
                width: "auto",
                backgroundColor:"white",
              }}
            />
            <Button
              sx = {{
                backgroundColor:"white",
                color: "black",

              }}
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