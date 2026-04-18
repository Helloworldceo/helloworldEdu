import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { HiPlus, HiBookOpen, HiUsers, HiAcademicCap } from "react-icons/hi";

export const dynamic = "force-dynamic";

export default async function InstructorDashboard() {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string };

  if (!user?.id || user.role !== "INSTRUCTOR") redirect("/");

  const courses = await prisma.course.findMany({
    where: { instructorId: user.id },
    include: {
      lessons: { select: { id: true } },
      enrollments: { select: { id: true } },
      quizzes: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalStudents = courses.reduce((sum, c) => sum + c.enrollments.length, 0);
  const totalLessons = courses.reduce((sum, c) => sum + c.lessons.length, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your courses and students</p>
        </div>
        <Link
          href="/instructor/new"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
        >
          <HiPlus /> New Course
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
              <HiBookOpen className="text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              <p className="text-xs text-gray-500">Courses</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <HiUsers className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              <p className="text-xs text-gray-500">Students</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
              <HiAcademicCap className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalLessons}</p>
              <p className="text-xs text-gray-500">Lessons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses */}
      {courses.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border">
          <HiBookOpen className="mx-auto text-5xl text-gray-300" />
          <p className="text-gray-400 mt-4 text-lg">No courses yet</p>
          <Link
            href="/instructor/new"
            className="inline-block mt-4 text-indigo-600 font-medium hover:underline"
          >
            Create your first course →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border p-5 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{course.title}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      course.published
                        ? "bg-green-50 text-green-600"
                        : "bg-yellow-50 text-yellow-600"
                    }`}
                  >
                    {course.published ? "Published" : "Draft"}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>{course.lessons.length} lessons</span>
                  <span>{course.enrollments.length} students</span>
                  <span>{course.quizzes.length} quizzes</span>
                </div>
              </div>
              <Link
                href={`/instructor/${course.id}`}
                className="text-indigo-600 font-medium text-sm hover:underline"
              >
                Manage →
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
