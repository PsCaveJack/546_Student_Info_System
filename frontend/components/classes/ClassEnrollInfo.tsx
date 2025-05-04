import { dataFetcher } from "@/fetchers/classFetchers";
import { Course } from "@/types/classTypes";
import { Section } from "@/types/sectionTypes";
import { Box, Button, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import useSWR from "swr";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

interface ClassInfoParams {
  section?: Section
  userId: string
  handleClose: () => void
}

const ClassEnrollInfo = (({section, userId, handleClose}: ClassInfoParams) => {
  const course = (section) ? useSWR(`${API_BASE}/courses/${section?.courseCode}`, dataFetcher) : null;
  
  const courseData: Course = course?.data;
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
      {/* When the details of a class has registered course information, display info on this page */}
      {courseData &&
        <>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {courseData.courseName} ({courseData.courseCode})
              </Typography>

              <Typography variant="body1" paragraph>
                {courseData.description}
              </Typography>

              <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", mb: 2 }}>
                <Box>
                  <Typography variant="subtitle1">
                    <strong>Units:</strong> {courseData.units}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle1">
                    <strong>Department:</strong> {courseData.department}
                  </Typography>
                </Box>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  <strong>Prerequisites:</strong>
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {courseData.prerequisites.map((prereq, index) => (
                    <Chip key={index} label={prereq} color="primary" />
                  ))}
                </Box>
              </Box>
            </CardContent>
          </Card>

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
        </>
      }
      
    </Box>
  )
})

export default ClassEnrollInfo;