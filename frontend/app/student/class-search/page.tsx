"use client";
import SectionSearchBar from "@/components/sections/sectionSearchBar";
import { dataFetcher } from "@/fetchers/classFetchers";
import { Section } from "@/types/sectionTypes";
import { Box, Button, Drawer } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import useSWR from "swr";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ClassEnrollInfo from "@/components/classes/ClassEnrollInfo";
import { useAtom } from "jotai";
import { userAtom } from "@/storage/user";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";


export default function ClassSearchPage() {
  const sections = useSWR(`${API_BASE}/sections`, dataFetcher);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [sectionToEdit, setSectionToEdit] = useState<Section | undefined>(undefined);

  const [searchTerm, setSearchTerm] = useState<string>("");

  const [season, setSeason] = useState<string>("");
  const [year, setYear] = useState<string>("2025");

  const [error, setError] = useState<string | null>(null);

  const [user, setUser] = useAtom(userAtom);
  const studentId = (user) ? user!._id : "";

  const filteredSections = sections.data?.filter((section: Section) => {
    const query = searchTerm.toLowerCase();

    const matchingSeason = (season !== "") ? section.semester.includes(season) : true;
    const matchingYear = (year !== "") ? section.semester.includes(year) : true;

    return (
      section.courseCode.toString().includes(query) && matchingSeason && matchingYear
    );
  });

  const handleDetailsClose = () => {
    setError(null);
    setDetailsOpen(false);
    setSectionToEdit(undefined);
    sections.mutate();
  }

  function getRowId(row: any) {
    return row._id;
  }

  function viewDetails(row: any) {
    if (row != undefined) {
      setSectionToEdit(row);
      setDetailsOpen(true);
    }
      
  }

  const columns: GridColDef[] = [
    { field: 'courseCode', headerName: 'Course', width: 150, sortable: false },
    { field: 'section', headerName: 'Section', width: 100, sortable: false },
    { field: 'semester', headerName: 'Semester', width: 150, sortable: false },
    {
      field: 'details', 
      headerName: 'Details',
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
              onClick={() => viewDetails(params.row)}
            >
              <ArrowForwardIcon/>
            </Button>
          </Box>
        );
      }
    },
  ];

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
            <SectionSearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} 
              season={season} setSeason={setSeason} year={year} setYear={setYear} />

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
              open={detailsOpen}
              onClose={() => handleDetailsClose()}
            >

              {user && 
                <ClassEnrollInfo section={sectionToEdit} user={user} handleClose={handleDetailsClose} 
                  error={error} setError={setError}/>
              }
            </Drawer>
          </>
        )
      }
    </Box>
  );
}