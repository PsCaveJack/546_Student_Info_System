import { dataFetcher } from "@/fetchers/classFetchers";
import { Course } from "@/types/classTypes";
import { Section, Schedule, allDays } from "@/types/sectionTypes";
import { Autocomplete, Box, Button, Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, TextField, Typography } from "@mui/material";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import useSWR from "swr";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

interface SectionFormParams {
  section?: Section
  handleClose: () => void
}

interface CourseForm {
  courseCode: string;
  section: string;
  semester: string;
  instructor: string;
  schedule: Schedule;
  location?: string;
  capacity?: number;
  enrolledStudents?: string[];
  enrollmentStartDate?: Date;
  enrollmentEndDate?: Date;
  dropDeadline?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const SectionForm = (({section, handleClose}: SectionFormParams) => {

  const courses = useSWR(`${API_BASE}/courses`, dataFetcher);
  const professors = useSWR(`${API_BASE}/professor`, dataFetcher);

  const { register, handleSubmit, watch, formState: { errors }, control } = useForm<CourseForm>({
    defaultValues: {
      courseCode: section?.courseCode ?? "",
      section: section?.section ?? "",
      semester: section?.semester ?? "",
      instructor: section?.instructor ?? "",
      schedule: section?.schedule ?? {
        days: [],
        time: ""
      },
      location: section?.location ?? "",
      capacity: section?.capacity ?? 0,
      enrolledStudents: section?.enrolledStudents ?? [],
      enrollmentStartDate: section?.enrollmentStartDate,
      enrollmentEndDate: section?.enrollmentEndDate,
      dropDeadline: section?.dropDeadline,
      createdAt: section?.createdAt,
      updatedAt: section?.updatedAt,
    },
  });

  const courseCodes: string[] = courses.data?.map((course: Course) => (course.courseCode)) || [];

  const professorUsernames: string[] = professors.data?.map((professor: any) => (professor.username)) || [];

  const [submitDisabled, setDisabled] = useState(false);

  const onSubmit = handleSubmit(async (formData) => {
    setDisabled(true);
    if(section){
      try {
        await axios.put(`${API_BASE}/sections/${section._id}`, formData)
      }
      catch (e) {
        console.log("Edit section error", e)
      }
    }
    else {
      try {
        await axios.post(`${API_BASE}/sections`, formData)
      }
      catch (e) {
        console.log("Add section error", e)

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
        {(section) ? "Edit Section" : "Add Section"}
      </Typography>

      <Autocomplete
        disablePortal
        options={courseCodes}
        renderInput={(params) => 
          <TextField 
            {...params} 
            fullWidth
            label="Course Code"
            required
            {...register('courseCode')}
          />}
      />

      <TextField
        fullWidth
        label="Section"
        required
        type="number"
        {...register('section')}
      />

      <TextField
        fullWidth
        label="Semester"
        required
        {...register('semester')}
      />

      <Autocomplete
        disablePortal
        options={professorUsernames}
        renderInput={(params) => 
          <TextField 
            {...params} 
            fullWidth
            label="Instructor"
            required
            {...register('instructor')}
          />}
      />

      <TextField
        fullWidth
        label="Location"
        {...register('location')}
      />

      <TextField
        fullWidth
        label="Capacity"
        type="number"
        {...register('capacity', { valueAsNumber: true })}
      />

      {/* Schedule - Days (Multi-select) */}
      <FormControl fullWidth>
        <InputLabel id="days-label">Days</InputLabel>
        <Controller
          name="schedule.days"
          control={control}
          render={({ field }) => (
            <Select
              labelId="days-label"
              multiple
              value={field.value}
              onChange={field.onChange}
              input={<OutlinedInput label="Days" />}
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              {allDays.map((day) => (
                <MenuItem key={day} value={day}>
                  <Checkbox checked={field.value.includes(day)} />
                  <ListItemText primary={day} />
                </MenuItem>
              ))}
            </Select>
          )}
        />
      </FormControl>

      {/* Schedule - Time */}
      <TextField
        fullWidth
        label="Time"
        placeholder="e.g., 10:00 AM - 11:30 AM"
        {...register('schedule.time')}
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
});

export default SectionForm;