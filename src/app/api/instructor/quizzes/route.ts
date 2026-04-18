import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string };

  if (!user?.id || user.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { courseId, title, questions } = await req.json();

  if (!courseId || !title?.trim() || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify course ownership
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.instructorId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const quiz = await prisma.quiz.create({
    data: {
      courseId,
      title: title.trim(),
      questions: {
        create: questions.map(
          (q: { question: string; options: string[]; correctAnswer: number }, i: number) => ({
            question: q.question,
            options: JSON.stringify(q.options),
            order: i,
            correctAnswer: q.correctAnswer,
          })
        ),
      },
    },
  });

  return NextResponse.json(quiz, { status: 201 });
}
