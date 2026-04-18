import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { enrollmentId, lessonId } = await req.json();

  if (!enrollmentId || !lessonId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const existing = await prisma.lessonCompletion.findUnique({
    where: { enrollmentId_lessonId: { enrollmentId, lessonId } },
  });

  if (existing) {
    return NextResponse.json({ message: "Already completed" });
  }

  const completion = await prisma.lessonCompletion.create({
    data: { enrollmentId, lessonId },
  });

  return NextResponse.json(completion, { status: 201 });
}
