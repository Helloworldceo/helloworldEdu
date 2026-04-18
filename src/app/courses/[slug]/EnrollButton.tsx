"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleEnroll = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/enroll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    if (res.ok) {
      router.refresh();
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="bg-white text-indigo-600 px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-50 transition disabled:opacity-50"
    >
      {loading ? "Enrolling..." : "Enroll Now — Free"}
    </button>
  );
}
