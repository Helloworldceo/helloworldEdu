import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import PublishToggle from "./PublishToggle";
import AddLessonForm from "./AddLessonForm";
import AddQuizForm from "./AddQuizForm";

export const dynamic = "force-dynamic";

export default async function ManageCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string };

  if (!user?.id || user.role !== "INSTRUCTOR") redirect("/");

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: { orderBy: { order: "asc" } },
      quizzes: {
        include: { questions: { select: { id: true } } },
      },
      enrollments: {
        include: { user: { select: { name: true, email: true } } },
      },
    },
  });

  if (!course || course.instructorId !== user.id) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <Link
        href="/instructor"
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6"
      >
        <HiChevronLeft /> Back to Dashboard
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          <p className="text-gray-500 text-sm mt-1">{course.category} · {course.level}</p>
        </div>
        <PublishToggle courseId={course.id} published={course.published} />
      </div>

      {/* Lessons */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Lessons ({course.lessons.length})
        </h2>
        {course.lessons.length > 0 && (
          <div className="space-y-2 mb-4">
            {course.lessons.map((lesson, i) => (
              <div
                key={lesson.id}
                className="bg-white rounded-lg border p-4 flex items-center gap-3"
              >
                <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-sm font-semibold">
                  {i + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm">{lesson.title}</p>
                  {lesson.videoUrl && (
                    <p className="text-xs text-gray-400 truncate">{lesson.videoUrl}</p>
                  )}
                </div>
                {lesson.duration && (
                  <span className="text-xs text-gray-400">{lesson.duration} min</span>
                )}
              </div>
            ))}
          </div>
        )}
        <AddLessonForm courseId={course.id} nextOrder={course.lessons.length + 1} />
      </section>

      {/* Quizzes */}
      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Quizzes ({course.quizzes.length})
        </h2>
        {course.quizzes.length > 0 && (
          <div className="space-y-2 mb-4">
            {course.quizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white rounded-lg border p-4 flex items-center justify-between"
              >
                <p className="font-medium text-gray-800 text-sm">{quiz.title}</p>
                <span className="text-xs text-gray-400">
                  {quiz.questions.length} questions
                </span>
              </div>
            ))}
          </div>
        )}
        <AddQuizForm courseId={course.id} />
      </section>

      {/* Enrolled Students */}
      <section>
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Enrolled Students ({course.enrollments.length})
        </h2>
        {course.enrollments.length === 0 ? (
          <p className="text-gray-400 text-sm">No students enrolled yet.</p>
        ) : (
          <div className="bg-white rounded-xl border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-medium text-gray-500">Name</th>
                  <th className="text-left p-3 font-medium text-gray-500">Email</th>
                </tr>
              </thead>
              <tbody>
                {course.enrollments.map((e) => (
                  <tr key={e.id} className="border-t">
                    <td className="p-3 text-gray-800">{e.user.name}</td>
                    <td className="p-3 text-gray-500">{e.user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
