'use client'

import useSWR from 'swr'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://your-api.com'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export default function CourseHistoryPage() {
  const { data: courses, error, isLoading } = useSWR(`${API_BASE}/students/me/course-history`, fetcher)

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 p-6">Failed to load course history.</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Course History</h1>
      <div className="space-y-4">
        {courses?.length === 0 && <p>No courses found.</p>}
        {courses?.map((course: any) => (
          <Card key={course.id}>
            <CardContent className="p-4">
              <div className="text-lg font-semibold">{course.name} ({course.code})</div>
              <div className="text-sm text-gray-600">Term: {course.term}</div>
              <div className="text-sm text-gray-600">Grade: {course.grade || 'In Progress'}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

