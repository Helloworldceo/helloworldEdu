"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { HiCheck, HiPlay, HiChevronLeft } from "react-icons/hi";
import Link from "next/link";

const DynamicReactPlayer: any = dynamic(() => import("react-player").then((mod) => mod.default), { ssr: false });

interface Lesson {
  id: string;
  title: string;
  content: string;
  videoUrl: string | null;
  order: number;
  duration: number | null;
}

interface Props {
  course: {
    id: string;
    title: string;
    slug: string;
    lessons: Lesson[];
  };
  enrollmentId: string;
  completedLessonIds: string[];
}

export default function LessonPlayer({ course, enrollmentId, completedLessonIds }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set(completedLessonIds));
  const lesson = course.lessons[activeIndex];

  const markComplete = async (lessonId: string) => {
    if (completed.has(lessonId)) return;

    const res = await fetch("/api/lessons/complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId, lessonId }),
    });

    if (res.ok) {
      setCompleted((prev) => new Set([...prev, lessonId]));
    }
  };

  const progress = Math.round((completed.size / course.lessons.length) * 100);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-full lg:w-80 bg-white border-r overflow-y-auto">
        <div className="p-4 border-b">
          <Link
            href={`/courses/${course.slug}`}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-2"
          >
            <HiChevronLeft /> Back to course
          </Link>
          <h2 className="font-bold text-gray-900">{course.title}</h2>
          <div className="mt-2">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
        <div className="p-2">
          {course.lessons.map((l, i) => (
            <button
              key={l.id}
              onClick={() => setActiveIndex(i)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left text-sm transition ${
                i === activeIndex
                  ? "bg-indigo-50 text-indigo-700"
                  : "hover:bg-gray-50 text-gray-700"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0 ${
                  completed.has(l.id)
                    ? "bg-green-100 text-green-600"
                    : i === activeIndex
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {completed.has(l.id) ? <HiCheck /> : i + 1}
              </div>
              <span className="truncate">{l.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {lesson.videoUrl && (
          <div className="aspect-video bg-black">
            <DynamicReactPlayer
              url={lesson.videoUrl}
              width="100%"
              height="100%"
              controls
              playing
            />
          </div>
        )}
        <div className="max-w-3xl mx-auto p-6 lg:p-10">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
            {lesson.duration && (
              <span className="text-sm text-gray-400">{lesson.duration} min</span>
            )}
          </div>
          <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">
            {lesson.content}
          </div>
          <div className="mt-8 flex items-center gap-4">
            {!completed.has(lesson.id) ? (
              <button
                onClick={() => markComplete(lesson.id)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition flex items-center gap-2"
              >
                <HiCheck /> Mark as Complete
              </button>
            ) : (
              <span className="text-green-600 font-medium flex items-center gap-1">
                <HiCheck /> Completed
              </span>
            )}
            {activeIndex < course.lessons.length - 1 && (
              <button
                onClick={() => setActiveIndex(activeIndex + 1)}
                className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium hover:bg-gray-200 transition flex items-center gap-2"
              >
                Next Lesson <HiPlay />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
