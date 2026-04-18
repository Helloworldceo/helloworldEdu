import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import LessonPlayer from "./LessonPlayer";

export const dynamic = "force-dynamic";

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) redirect("/login");

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      lessons: { orderBy: { order: "asc" } },
      enrollments: {
        where: { userId },
        include: { completions: true },
      },
    },
  });

  if (!course) notFound();

  const enrollment = course.enrollments[0];
  if (!enrollment) redirect(`/courses/${slug}`);

  const completedIds = enrollment.completions.map((c) => c.lessonId);

  return (
    <LessonPlayer
      course={{
        id: course.id,
        title: course.title,
        slug: course.slug,
        lessons: course.lessons,
      }}
      enrollmentId={enrollment.id}
      completedLessonIds={completedIds}
    />
  );
}
