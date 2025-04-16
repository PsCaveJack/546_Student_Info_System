import { Course } from "@/types/classTypes";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

export const fetchCourses = async (
  setCourses: React.Dispatch<React.SetStateAction<Course[]>>
) => {
  try {
    // ${API_BASE} was http://localhost:5000/api, changed to this because of the fallback design
    const res = await fetch(`${API_BASE}/courses`);
    if (!res.ok) throw new Error("Failed to fetch users");

    const data = await res.json();
    setCourses(data);
  } catch (err) {
    console.error("❌ fetchCourses error:", err);
  }
};