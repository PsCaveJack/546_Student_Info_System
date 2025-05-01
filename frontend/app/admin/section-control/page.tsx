import { dataFetcher } from "@/fetchers/classFetchers";
import { Section } from "@/types/classTypes";
import { useState } from "react";
import useSWR from "swr";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export default function SectionControlPage() {

  const sections = useSWR(`${API_BASE}/section`, dataFetcher);

  const [drawer, setDrawer] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Section | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredCourses = sections.data?.filter((section: Section) => {
    const query = searchTerm.toLowerCase();
    return (
      section.courseCode.toString().includes(query)
    );
  });

  return (
    <>
    </>
  )
}