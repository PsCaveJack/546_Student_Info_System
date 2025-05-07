import { dataFetcher } from "@/fetchers/classFetchers";
import { checkPrerequisites } from "@/handlers/prerequisiteHandler";
import { userAtom } from "@/storage/user";
import { Course } from "@/types/classTypes";
import { Section } from "@/types/sectionTypes";
import { User } from "@/types/userTypes";
import { Alert, Box, Button, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import axios from "axios";
import { useAtom } from "jotai";
import { Dispatch, SetStateAction, useState } from "react";
import useSWR from "swr";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

interface ClassInfoParams {
  section?: Section
  user: User
  handleClose: () => void
  error: string | null
  setError: Dispatch<SetStateAction<string | null>>
}

const ClassEnrollInfo = (({section, user, handleClose, error, setError}: ClassInfoParams) => {
  const course = (section) ? useSWR(`${API_BASE}/courses/${section?.courseCode}`, dataFetcher) : null;

  const courseData: Course = course?.data;

  const enroll = async () => {
    
    //  TO-DO: get completed courses from user info
    const completedPrerequisites = user.history?.map(entry => entry.courseCode) || [];
    const hasPrerequisites = await checkPrerequisites(courseData.courseCode, completedPrerequisites);


    console.log("completed prereq", completedPrerequisites);
    console.log("user info", user);
    if (hasPrerequisites && section && user._id){
      // make request to add section
      setError(null);
      const objectToPost = {
        studentId: user._id,
        sectionId: section._id,
        status: "enrolled",
      }
      await axios.post(`${API_BASE}/registrations`, objectToPost)
      handleClose();
    }
    else {
      setError("You do not meet the prerequisites for this course.");
    }
    
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
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
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