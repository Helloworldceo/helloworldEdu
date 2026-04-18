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

  const { courseId, title, content } = await req.json();

  if (!courseId || !title?.trim() || !content?.trim()) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const post = await prisma.forumPost.create({
    data: { courseId, authorId: userId, title: title.trim(), content: content.trim() },
  });

  return NextResponse.json(post, { status: 201 });
}
