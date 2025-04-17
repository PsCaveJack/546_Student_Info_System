import { Course } from "@/types/classTypes";
import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

interface CourseFormParams {
  course?: Course
  currentCourses: Course[]
}

interface CourseForm {
  courseCode: string;
  courseName: string;
  description?: string;
  prerequisites: string[];
  units: number;
  department: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const CourseForm = (({course, currentCourses}: CourseFormParams) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<CourseForm>({
    // resolver?
    defaultValues: {
      courseCode: course?.courseCode ?? "",
      courseName: course?.courseName ?? "",
      description: course?.description ?? "",
      prerequisites: course?.prerequisites ?? [],
      units: course?.units ?? 0,

    }
  });

  const onSubmit = handleSubmit(async (formData) => {


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
      <Typography variant="h6"
        sx={{
          
        }}
      >
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

      <Autocomplete
        multiple
        options={currentCourses.map((course: Course) => course.courseCode)}
        renderInput={(params) => (
          <TextField 
            {...params}
            fullWidth
            label="Prerequisites"
            {...register("prerequisites")}
          />
        )}
      />
      <TextField
        fullWidth
        label="Units"
        required
        type="number"
        {...register("units")}
      />

      <Button
        fullWidth
        variant="contained"
        type="submit"
        onClick={onSubmit}
      >
        Submit
      </Button>
    </Box>
  )
})

export default CourseForm;