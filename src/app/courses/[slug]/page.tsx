import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import EnrollButton from "./EnrollButton";
import Link from "next/link";
import { HiBookOpen, HiPlay, HiClock, HiChat } from "react-icons/hi";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      instructor: { select: { name: true } },
      lessons: { orderBy: { order: "asc" } },
      enrollments: { select: { id: true, userId: true } },
      quizzes: { select: { id: true, title: true } },
    },
  });

  if (!course || !course.published) notFound();

  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;
  const isEnrolled = userId
    ? course.enrollments.some((e) => e.userId === userId)
    : false;

  const totalDuration = course.lessons.reduce((sum, l) => sum + (l.duration || 0), 0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20">
            {course.category}
          </span>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20">
            {course.level}
          </span>
        </div>
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="opacity-90 mb-4">{course.description}</p>
        <div className="flex flex-wrap items-center gap-6 text-sm opacity-80">
          <span className="flex items-center gap-1">
            <HiBookOpen /> {course.lessons.length} lessons
          </span>
          <span className="flex items-center gap-1">
            <HiClock /> {totalDuration} min
          </span>
          <span>by {course.instructor.name}</span>
          <span>{course.enrollments.length} students</span>
        </div>
        <div className="mt-6">
          {isEnrolled ? (
            <Link
              href={`/courses/${slug}/learn`}
              className="inline-block bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-50 transition"
            >
              Continue Learning →
            </Link>
          ) : (
            <EnrollButton courseId={course.id} />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Course Content</h2>
          <div className="space-y-2">
            {course.lessons.map((lesson, i) => (
              <div
                key={lesson.id}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border hover:border-indigo-200 transition"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-sm font-semibold text-indigo-600">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{lesson.title}</p>
                  {lesson.duration && (
                    <p className="text-xs text-gray-400">{lesson.duration} min</p>
                  )}
                </div>
                {lesson.videoUrl && <HiPlay className="text-gray-300" />}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {course.quizzes.length > 0 && (
            <div className="bg-white rounded-xl border p-5">
              <h3 className="font-semibold text-gray-900 mb-3">Quizzes</h3>
              {course.quizzes.map((quiz) => (
                <Link
                  key={quiz.id}
                  href={isEnrolled ? `/courses/${slug}/quiz/${quiz.id}` : "#"}
                  className="block p-3 rounded-lg hover:bg-gray-50 text-sm text-gray-700"
                >
                  📝 {quiz.title}
                </Link>
              ))}
            </div>
          )}

          <Link
            href={`/courses/${slug}/forum`}
            className="flex items-center gap-3 bg-white rounded-xl border p-5 hover:border-indigo-200 transition"
          >
            <HiChat className="text-2xl text-indigo-500" />
            <div>
              <p className="font-semibold text-gray-900">Discussion Forum</p>
              <p className="text-xs text-gray-400">Ask questions & discuss</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
