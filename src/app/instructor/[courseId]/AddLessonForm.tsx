"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddLessonForm({
  courseId,
  nextOrder,
}: {
  courseId: string;
  nextOrder: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const res = await fetch("/api/instructor/lessons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        title,
        content,
        videoUrl: videoUrl || null,
        duration: duration ? parseInt(duration) : null,
        order: nextOrder,
      }),
    });

    if (res.ok) {
      setTitle("");
      setContent("");
      setVideoUrl("");
      setDuration("");
      setOpen(false);
      router.refresh();
    }
    setLoading(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-indigo-600 text-sm font-medium hover:underline"
      >
        + Add Lesson
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-5 space-y-4">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Lesson title"
        required
        className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Lesson content / notes..."
        rows={4}
        className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="Video URL (YouTube, Vimeo...)"
          className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="Duration (minutes)"
          className="px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Lesson"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-5 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
