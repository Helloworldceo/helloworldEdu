"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiX } from "react-icons/hi";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function AddQuizForm({ courseId }: { courseId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { question: "", options: ["", "", "", ""], correctAnswer: 0 },
  ]);
  const [loading, setLoading] = useState(false);

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
  };

  const removeQuestion = (i: number) => {
    if (questions.length <= 1) return;
    setQuestions(questions.filter((_, idx) => idx !== i));
  };

  const updateQuestion = (i: number, field: string, value: string | number) => {
    const updated = [...questions];
    if (field === "question") updated[i].question = value as string;
    else if (field === "correctAnswer") updated[i].correctAnswer = value as number;
    setQuestions(updated);
  };

  const updateOption = (qi: number, oi: number, value: string) => {
    const updated = [...questions];
    updated[qi].options[oi] = value;
    setQuestions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);

    const res = await fetch("/api/instructor/quizzes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, title, questions }),
    });

    if (res.ok) {
      setTitle("");
      setQuestions([{ question: "", options: ["", "", "", ""], correctAnswer: 0 }]);
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
        + Add Quiz
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-5 space-y-6">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Quiz title"
        required
        className="w-full px-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
      />

      {questions.map((q, qi) => (
        <div key={qi} className="bg-white rounded-lg border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-600">Question {qi + 1}</span>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => removeQuestion(qi)}
                className="text-red-400 hover:text-red-600"
              >
                <HiX />
              </button>
            )}
          </div>
          <input
            type="text"
            value={q.question}
            onChange={(e) => updateQuestion(qi, "question", e.target.value)}
            placeholder="Enter question..."
            required
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
          {q.options.map((opt, oi) => (
            <div key={oi} className="flex items-center gap-2">
              <input
                type="radio"
                name={`correct-${qi}`}
                checked={q.correctAnswer === oi}
                onChange={() => updateQuestion(qi, "correctAnswer", oi)}
                className="text-indigo-600"
              />
              <input
                type="text"
                value={opt}
                onChange={(e) => updateOption(qi, oi, e.target.value)}
                placeholder={`Option ${oi + 1}`}
                required
                className="flex-1 px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          ))}
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="text-indigo-600 text-sm font-medium hover:underline"
      >
        + Add Question
      </button>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Quiz"}
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
