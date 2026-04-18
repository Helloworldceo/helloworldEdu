import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { HiChevronLeft } from "react-icons/hi";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import CommentForm from "./CommentForm";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string; postId: string }>;
}) {
  const { slug, postId } = await params;

  const post = await prisma.forumPost.findUnique({
    where: { id: postId },
    include: {
      author: { select: { name: true } },
      comments: {
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!post) notFound();

  const session = await getServerSession(authOptions);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link
        href={`/courses/${slug}/forum`}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6"
      >
        <HiChevronLeft /> Back to forum
      </Link>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h1 className="text-xl font-bold text-gray-900">{post.title}</h1>
        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
          <span className="font-medium text-gray-600">{post.author.name}</span>
          <span>{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span>
        </div>
        <p className="mt-4 text-gray-700 whitespace-pre-wrap">{post.content}</p>
      </div>

      <h2 className="font-semibold text-gray-900 mb-4">
        {post.comments.length} {post.comments.length === 1 ? "Reply" : "Replies"}
      </h2>

      <div className="space-y-3 mb-8">
        {post.comments.map((comment) => (
          <div key={comment.id} className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
              <span className="font-medium text-gray-600">{comment.author.name}</span>
              <span>{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
            </div>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
      </div>

      {session && <CommentForm postId={postId} />}
    </div>
  );
}
