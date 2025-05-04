import { Section } from "@/types/sectionTypes";
import { Box, Button } from "@mui/material";

interface ClassInfoParams {
  section?: Section
  userId: string
  handleClose: () => void
}

const ClassEnrollInfo = (({section, userId, handleClose}: ClassInfoParams) => {
  const enroll = () => {
    
    
    handleClose();
  }
  
  return (
    <Box
      sx={{
        backgroundColor: "white",
        height: "100%",
        flexDirection: "column",
        padding:"2rem",
        width:"500px",
        gap:"1rem",
        display:"flex"
      }}
    >
      <Button
        onClick={enroll}
        sx= {{
          backgroundColor: "green",
          color: "white",
          padding:"10px",
          marginLeft:"auto",
        }}
      >
        Enroll
      </Button>
    </Box>
  )
})

export default ClassEnrollInfo;