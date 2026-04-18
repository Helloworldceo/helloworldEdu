import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { HiBookOpen, HiAcademicCap } from "react-icons/hi";
import CertificateButton from "@/components/CertificateButton";

export const dynamic = "force-dynamic";

export default async function MyLearningPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) redirect("/login");

  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          lessons: { select: { id: true } },
          instructor: { select: { name: true } },
        },
      },
      completions: { select: { lessonId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    select: { courseId: true },
  });

  const certCourseIds = new Set(certificates.map((c) => c.courseId));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h1>
      <p className="text-gray-500 mb-8">Track your progress across all enrolled courses</p>

      {enrollments.length === 0 ? (
        <div className="text-center py-20">
          <HiBookOpen className="mx-auto text-5xl text-gray-300" />
          <p className="text-gray-400 mt-4 text-lg">You haven&apos;t enrolled in any courses yet.</p>
          <Link
            href="/courses"
            className="inline-block mt-4 text-indigo-600 font-medium hover:underline"
          >
            Browse courses →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {enrollments.map((enrollment) => {
            const totalLessons = enrollment.course.lessons.length;
            const completedCount = enrollment.completions.length;
            const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            const allCompleted = totalLessons > 0 && completedCount >= totalLessons;

            return (
              <div
                key={enrollment.id}
                className="bg-white rounded-xl border p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/courses/${enrollment.course.slug}`}
                        className="font-semibold text-gray-900 hover:text-indigo-600 transition"
                      >
                        {enrollment.course.title}
                      </Link>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                        {enrollment.course.level}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      by {enrollment.course.instructor.name} · {totalLessons} lessons
                    </p>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1 max-w-xs bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600">{progress}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/courses/${enrollment.course.slug}/learn`}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
                    >
                      {progress === 0 ? "Start" : "Continue"}
                    </Link>
                    {allCompleted && (
                      <CertificateButton
                        courseId={enrollment.course.id}
                        courseSlug={enrollment.course.slug}
                        allCompleted={allCompleted}
                        hasCertificate={certCourseIds.has(enrollment.course.id)}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
