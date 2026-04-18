"use client";

import { HiAcademicCap, HiDownload } from "react-icons/hi";
import { format } from "date-fns";

interface Props {
  studentName: string;
  courseTitle: string;
  issuedAt: string;
  certificateId: string;
}

export default function CertificateView({
  studentName,
  courseTitle,
  issuedAt,
  certificateId,
}: Props) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-10">
      <button
        onClick={handlePrint}
        className="mb-6 flex items-center gap-2 text-indigo-600 font-medium hover:underline print:hidden"
      >
        <HiDownload /> Print / Save as PDF
      </button>

      <div className="w-full max-w-2xl bg-white border-4 border-indigo-600 rounded-2xl p-12 text-center print:border-2 print:shadow-none">
        <HiAcademicCap className="mx-auto text-6xl text-indigo-600 mb-4" />

        <p className="text-sm text-indigo-600 font-semibold tracking-widest uppercase mb-2">
          Certificate of Completion
        </p>

        <h1 className="text-3xl font-bold text-gray-900 mb-1">Helloworldceo</h1>

        <div className="w-16 h-0.5 bg-indigo-600 mx-auto my-6" />

        <p className="text-gray-500 mb-2">This certifies that</p>
        <p className="text-2xl font-bold text-gray-900 mb-2">{studentName}</p>
        <p className="text-gray-500 mb-2">has successfully completed the course</p>
        <p className="text-xl font-semibold text-indigo-600 mb-6">{courseTitle}</p>

        <div className="w-16 h-0.5 bg-gray-200 mx-auto my-6" />

        <p className="text-sm text-gray-400">
          Issued on {format(new Date(issuedAt), "MMMM d, yyyy")}
        </p>
        <p className="text-xs text-gray-300 mt-1">ID: {certificateId}</p>
      </div>
    </div>
  );
}
