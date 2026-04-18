"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PublishToggle({
  courseId,
  published,
}: {
  courseId: string;
  published: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const toggle = async () => {
    setLoading(true);
    await fetch(`/api/instructor/courses/${courseId}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    router.refresh();
    setLoading(false);
  };

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
        published
          ? "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
          : "bg-green-50 text-green-700 hover:bg-green-100"
      } disabled:opacity-50`}
    >
      {published ? "Unpublish" : "Publish"}
    </button>
  );
}
