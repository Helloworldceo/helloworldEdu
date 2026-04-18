import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import { HiChevronLeft, HiChat } from "react-icons/hi";
import NewPostForm from "./NewPostForm";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ForumPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      forumPosts: {
        include: {
          author: { select: { name: true } },
          comments: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!course) notFound();

  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href={`/courses/${slug}`}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6"
      >
        <HiChevronLeft /> Back to {course.title}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">Discussion Forum</h1>
      <p className="text-gray-500 mb-8">
        Ask questions, share insights, and help each other learn.
      </p>

      {session && <NewPostForm courseId={course.id} />}

      {course.forumPosts.length === 0 ? (
        <div className="text-center py-16">
          <HiChat className="mx-auto text-5xl text-gray-300" />
          <p className="text-gray-400 mt-4">No discussions yet. Be the first to post!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {course.forumPosts.map((post) => (
            <Link
              key={post.id}
              href={`/courses/${slug}/forum/${post.id}`}
              className="block bg-white rounded-xl border p-5 hover:border-indigo-200 transition"
            >
              <h3 className="font-semibold text-gray-900">{post.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.content}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                <span>{post.author.name}</span>
                <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
                <span className="flex items-center gap-1">
                  <HiChat /> {post.comments.length} replies
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
