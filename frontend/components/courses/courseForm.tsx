import { Course } from "@/types/classTypes";
import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

interface CourseFormParams {
  course?: Course
  currentCourses: Course[]
  handleClose: () => void
}

interface CourseForm {
  courseCode: string;
  courseName: string;
  description?: string;
  prerequisites: string[];
  units: number;
  department: string;
}

const CourseForm = (({course, currentCourses, handleClose}: CourseFormParams) => {

  //  <Jack Rogers> 4-16-2025
  //    If a course is included, this form is for editing
  //    If not, it's for adding a new course

  const { register, handleSubmit, watch, formState: { errors }, control } = useForm<CourseForm>({
    defaultValues: {
      courseCode: course?.courseCode ?? "",
      courseName: course?.courseName ?? "",
      description: course?.description ?? "",
      prerequisites: course?.prerequisites ?? [],
      units: course?.units ?? 0,
      department: course?.department ?? "",
    }
  });

  const [submitDisabled, setDisabled] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    setDisabled(true);
    if(course){
      try {
        axios.put(`${API_BASE}/courses`, formData)
      }
      catch (e) {
        console.log("Edit course error", e)

      }
    }
    else {
      try {
        axios.post(`${API_BASE}/courses`, formData)
      }
      catch (e) {
        console.log("Add course error", e)

      }
    }
    handleClose();
  })

  return (
    <Box component="form"
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
      <Typography variant="h6">
        {(course) ? "Edit Course" : "Add Course"}
      </Typography>
      <TextField
        fullWidth
        label="Course Number"
        helperText="Must be unique"
        required
        {...register("courseCode")}
      />
      <TextField
        fullWidth
        label="Course Name"
        required
        {...register("courseName")}
      />
      <TextField
        fullWidth
        label="Description"
        required
        multiline
        rows={4}
        {...register("description")}
      />

      <Controller
        name="prerequisites"
        control={control}
        render={({field}) => 
          <Autocomplete
            multiple
            options={currentCourses.map((course: Course) => course.courseCode)}
            value={field.value}
            onChange={(event, newValue) => field.onChange(newValue)}
            renderInput={(params) => (
              <TextField 
                {...params}
                fullWidth
                label="Prerequisites"
              />
            )}
          />
        }
      />
      <TextField
        fullWidth
        label="Units"
        required
        type="number"
        {...register("units")}
      />

      <TextField
        fullWidth
        label="Department"
        required
        {...register("department")}
      />

      <Button
        fullWidth
        variant="contained"
        type="submit"
        onClick={onSubmit}
        disabled={submitDisabled}
      >
        Submit
      </Button>
    </Box>
  )
})

export default CourseForm;