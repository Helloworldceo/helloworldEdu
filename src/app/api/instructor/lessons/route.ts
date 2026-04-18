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

  const { courseId, title, content, videoUrl, duration, order } = await req.json();

  if (!courseId || !title?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify course ownership
  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.instructorId !== user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const lesson = await prisma.lesson.create({
    data: {
      courseId,
      title: title.trim(),
      content: content || "",
      videoUrl: videoUrl || null,
      duration: duration || null,
      order: order || 1,
    },
  });

  return NextResponse.json(lesson, { status: 201 });
}
