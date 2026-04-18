import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string })?.id;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { quizId, answers } = await req.json();

  if (!quizId || !Array.isArray(answers)) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: { questions: { orderBy: { id: "asc" } } },
  });

  if (!quiz) {
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  // Grade
  const correct = quiz.questions.map((q, i) => q.correctAnswer === answers[i]);
  const score = correct.filter(Boolean).length;

  await prisma.quizAttempt.create({
    data: {
      quizId,
      userId,
      score,
      total: quiz.questions.length,
      answers: JSON.stringify(answers),
    },
  });

  return NextResponse.json({ score, total: quiz.questions.length, correct });
}
