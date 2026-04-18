"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CertificateButton({
  courseId,
  courseSlug,
  allCompleted,
  hasCertificate,
}: {
  courseId: string;
  courseSlug: string;
  allCompleted: boolean;
  hasCertificate: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  if (hasCertificate) {
    return (
      <a
        href={`/certificate/${courseSlug}`}
        className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-700 transition inline-block"
      >
        🎓 View Certificate
      </a>
    );
  }

  if (!allCompleted) {
    return (
      <button
        disabled
        className="bg-gray-200 text-gray-500 px-5 py-2.5 rounded-lg font-medium cursor-not-allowed"
      >
        Complete all lessons to earn certificate
      </button>
    );
  }

  const handleClaim = async () => {
    setLoading(true);
    const res = await fetch("/api/certificate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    if (res.ok) {
      router.push(`/certificate/${courseSlug}`);
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleClaim}
      disabled={loading}
      className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
    >
      {loading ? "Generating..." : "🎓 Claim Certificate"}
    </button>
  );
}
