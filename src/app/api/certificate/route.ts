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

  const { courseId } = await req.json();

  if (!courseId) {
    return NextResponse.json({ error: "Missing courseId" }, { status: 400 });
  }

  // Check enrollment and course completion
  const enrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
    include: {
      completions: true,
      course: {
        include: {
          lessons: { select: { id: true } },
        },
      },
    },
  });

  if (!enrollment) {
    return NextResponse.json({ error: "Not enrolled" }, { status: 403 });
  }

  const totalLessons = enrollment.course.lessons.length;
  const completedLessons = enrollment.completions.length;

  if (completedLessons < totalLessons) {
    return NextResponse.json(
      { error: `Complete all lessons first (${completedLessons}/${totalLessons})` },
      { status: 400 }
    );
  }

  // Check existing certificate
  const existing = await prisma.certificate.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });

  if (existing) {
    return NextResponse.json(existing);
  }

  const certificate = await prisma.certificate.create({
    data: { userId, courseId },
  });

  return NextResponse.json(certificate, { status: 201 });
}
