"use client";

import SectionForm from "@/components/sections/sectionForm"
import { dataFetcher } from "@/fetchers/classFetchers";
import { Section } from "@/types/classTypes";
import { Edit, Delete } from "@mui/icons-material";
import { Box, Button, Drawer, TextField } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import axios from "axios";
import { useState } from "react";
import useSWR from "swr";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function SectionControlPage() {

  const sections = useSWR(`${API_BASE}/sections`, dataFetcher);

  const [drawer, setDrawer] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<Section | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredSections = sections.data?.filter((section: Section) => {
    const query = searchTerm.toLowerCase();
    return (
      section.courseCode.toString().includes(query)
    );
  });

  const handleFormClose = () => {
    setDrawer(false);
    setSectionToEdit(undefined);
    sections.mutate();
  }

  const editSection = (section: Section) => {
    if (section) {
      setSectionToEdit(section);
      setDrawer(true);
    }
  }

  const deleteSection = async (courseCode: string) => {
    if (courseCode) {
      await axios.delete(`${API_BASE}/sections/${courseCode}`);
      sections.mutate();
    }
  }

  const columns: GridColDef[] = [
    { field: 'courseCode', headerName: 'Course', width: 150, sortable: false },
    { field: 'section', headerName: 'Section', width: 100, sortable: false },
    { field: 'semester', headerName: 'Semester', width: 150, sortable: false },
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
              onClick={() => editSection(params.row)}
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
              onClick={() => deleteSection(params.row.courseCode)}
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
        sections.data && (
          <>
            
            <TextField
              label="Search by ID"
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
                rows={filteredSections || sections.data} 
                columns={columns} 
                sx={{
                  backgroundColor:"white",
                }}
              />
            </div>
            
            
            <Drawer
              anchor="right"
              open={drawer}
              onClose={() => handleFormClose()}
            >
              <SectionForm section={sectionToEdit} handleClose={handleFormClose}/>
            </Drawer>
            <Button
              className="fancy-button"
              onClick={() =>setDrawer(true)}
            >
              Add Sections
            </Button>
          </>
        )
      }
      
      
    </Box>
  )
}