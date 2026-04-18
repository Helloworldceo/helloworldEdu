import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { HiBookOpen, HiClock, HiAcademicCap } from "react-icons/hi";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: {
      instructor: { select: { name: true } },
      lessons: { select: { id: true } },
      enrollments: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Browse Courses</h1>
        <p className="text-gray-500 mt-2">Explore our catalog and start learning today</p>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-20">
          <HiBookOpen className="mx-auto text-5xl text-gray-300" />
          <p className="text-gray-400 mt-4 text-lg">No courses available yet.</p>
          <p className="text-gray-400 text-sm">Check back soon or become an instructor!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition group"
            >
              <div className="h-40 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <HiAcademicCap className="text-5xl text-white/70 group-hover:scale-110 transition" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600">
                    {course.category}
                  </span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                    {course.level}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 text-lg group-hover:text-indigo-600 transition">
                  {course.title}
                </h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <HiBookOpen /> {course.lessons.length} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <HiClock /> {course.enrollments.length} enrolled
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  by {course.instructor.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
