"use client";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

import CourseForm from "@/components/courses/courseForm";
import { dataFetcher } from "@/fetchers/classFetchers";
import { fetchCourses } from "@/handlers/classHandlers";
import { Course } from "@/types/classTypes";
import { Box, Button, Drawer } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function CourseControlPage() {
  
  const courses = useSWR(`${API_BASE}/courses`, dataFetcher);

  const [drawer, setDrawer] = useState(false);

  const addCourse = () => {
    
    courses.mutate();
  }

  const columns: GridColDef[] = [
    { field: 'courseCode', headerName: 'ID', width: 150, sortable: false },
    { field: 'courseName', headerName: 'Name', width: 150, sortable: false },
    { field: 'units', headerName: 'Units', width: 150, sortable: false },
    { field: 'department', headerName: 'Department', width: 150, sortable: false },
  ];

  function getRowId(row: any) {
    return row._id;
  }
  
  return (
    <Box
      sx={{
        alignContent:"center",
        alignItems:"center",
        width:"600px"
      }}
    >
      {
        courses.data && 
        <DataGrid 
          getRowId={getRowId}
          rows={courses.data} 
          columns={columns} 
          sx={{
            width: "auto",
            backgroundColor:"white",
          }}
        />
      }
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
        onClose={() => setDrawer(false)}
      >
        <CourseForm currentCourses={courses.data}/>
      </Drawer>
    </Box>
  )
  
}