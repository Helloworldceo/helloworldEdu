"use client";

import { useState } from "react";
import Link from "next/link";
import { HiChevronLeft, HiCheck, HiX } from "react-icons/hi";

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface Props {
  quiz: {
    id: string;
    title: string;
    courseSlug: string;
    courseTitle: string;
    questions: Question[];
  };
  lastAttempt: {
    score: number;
    total: number;
    answers: number[];
  } | null;
}

export default function QuizForm({ quiz, lastAttempt }: Props) {
  const [answers, setAnswers] = useState<number[]>(
    lastAttempt?.answers || new Array(quiz.questions.length).fill(-1)
  );
  const [result, setResult] = useState<{ score: number; total: number; correct: boolean[] } | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (answers.includes(-1)) return;
    setLoading(true);

    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: quiz.id, answers }),
    });

    if (res.ok) {
      const data = await res.json();
      setResult(data);
    }
    setLoading(false);
  };

  return (
    <div>
      <Link
        href={`/courses/${quiz.courseSlug}`}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-600 mb-6"
      >
        <HiChevronLeft /> Back to {quiz.courseTitle}
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">{quiz.title}</h1>

      {result && (
        <div
          className={`mb-8 p-5 rounded-xl ${
            result.score >= result.total * 0.7
              ? "bg-green-50 border border-green-200"
              : "bg-red-50 border border-red-200"
          }`}
        >
          <p className="font-semibold text-lg">
            Score: {result.score}/{result.total} (
            {Math.round((result.score / result.total) * 100)}%)
          </p>
          <p className="text-sm mt-1 text-gray-600">
            {result.score >= result.total * 0.7
              ? "Great job! You passed! 🎉"
              : "Keep studying and try again!"}
          </p>
        </div>
      )}

      <div className="space-y-8">
        {quiz.questions.map((q, qi) => (
          <div key={q.id} className="bg-white rounded-xl border p-6">
            <p className="font-medium text-gray-900 mb-4">
              {qi + 1}. {q.question}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <button
                  key={oi}
                  onClick={() => {
                    if (result) return;
                    const newAnswers = [...answers];
                    newAnswers[qi] = oi;
                    setAnswers(newAnswers);
                  }}
                  className={`w-full text-left p-3 rounded-lg border text-sm transition flex items-center gap-3 ${
                    result
                      ? result.correct[qi] && answers[qi] === oi
                        ? "bg-green-50 border-green-300 text-green-700"
                        : !result.correct[qi] && answers[qi] === oi
                        ? "bg-red-50 border-red-300 text-red-700"
                        : "border-gray-200 text-gray-600"
                      : answers[qi] === oi
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      answers[qi] === oi
                        ? result
                          ? result.correct[qi]
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-red-500 bg-red-500 text-white"
                          : "border-indigo-500 bg-indigo-500 text-white"
                        : "border-gray-300"
                    }`}
                  >
                    {answers[qi] === oi &&
                      (result ? (
                        result.correct[qi] ? (
                          <HiCheck className="text-xs" />
                        ) : (
                          <HiX className="text-xs" />
                        )
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full" />
                      ))}
                  </div>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!result && (
        <button
          onClick={handleSubmit}
          disabled={loading || answers.includes(-1)}
          className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Quiz"}
        </button>
      )}
    </div>
  );
}
