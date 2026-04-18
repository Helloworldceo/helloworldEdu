import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import QuizForm from "./QuizForm";

export const dynamic = "force-dynamic";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ slug: string; quizId: string }>;
}) {
  const { slug, quizId } = await params;
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) redirect("/login");

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      questions: { orderBy: { id: "asc" } },
      course: { select: { slug: true, title: true } },
    },
  });

  if (!quiz || quiz.course.slug !== slug) notFound();

  // Check for existing attempt
  const lastAttempt = await prisma.quizAttempt.findFirst({
    where: { quizId, userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <QuizForm
        quiz={{
          id: quiz.id,
          title: quiz.title,
          courseSlug: slug,
          courseTitle: quiz.course.title,
          questions: quiz.questions.map((q) => ({
            id: q.id,
            question: q.question,
            options: JSON.parse(q.options) as string[],
          })),
        }}
        lastAttempt={
          lastAttempt
            ? {
                score: lastAttempt.score,
                total: lastAttempt.total,
                answers: JSON.parse(lastAttempt.answers) as number[],
              }
            : null
        }
      />
    </div>
  );
}
