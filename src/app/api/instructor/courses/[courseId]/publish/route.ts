import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  const session = await getServerSession(authOptions);
  const user = session?.user as { id?: string; role?: string };

  if (!user?.id || user.role !== "INSTRUCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const course = await prisma.course.findUnique({ where: { id: courseId } });
  if (!course || course.instructorId !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { published } = await req.json();

  const updated = await prisma.course.update({
    where: { id: courseId },
    data: { published },
  });

  return NextResponse.json(updated);
}
