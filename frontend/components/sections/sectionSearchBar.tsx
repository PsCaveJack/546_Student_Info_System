import { Seasons } from "@/types/sectionTypes";
import { Autocomplete, Box, MenuItem, Select, TextField } from "@mui/material";
import { SetStateAction } from "react";

interface SearchBarParams {
  searchTerm: string;
  setSearchTerm: (value: SetStateAction<string>) => void;
  season: string;
  setSeason: (value: SetStateAction<string>) => void;
  year: string;
  setYear: (value: SetStateAction<string>) => void;
}

const SectionSearchBar = (({searchTerm, setSearchTerm, season, setSeason, year, setYear}: SearchBarParams) => {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flexDirection: "row",
        gap: 2,
        maxWidth: "100%",
        margin: "0 auto", // Center the entire content horizontally
      }}
    >
      <Select
        value={season}
        onChange={(e) => {setSeason(e.target.value)}}
        sx={{
          width:"200px",
          lineHeight:"inherit",
        }}
        label="Season"
      >
        {
          Seasons.map((season) => (
            <MenuItem value={season}>
              {season}
            </MenuItem>
          ))
        }
        
      </Select>
      <TextField
        label="Year"
        variant="outlined"
        size="small"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        type="number"
        sx={{
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
      <TextField
        label="Search by ID"
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{
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
    </Box>
  )
});

export default SectionSearchBar;