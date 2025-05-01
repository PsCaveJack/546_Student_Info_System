import { Section } from "@/types/classTypes";

interface SectionFormParams {
  section?: Section
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

const SectionForm = (({section, handleClose}: SectionFormParams) => {
  return (
    <>
    </>
  )
});

export default SectionForm;