"use client";

import { useState } from "react";
import { X, Upload } from "lucide-react";

export default function CreateQuizModal({ onClose }) {
  const [quizTitle, setQuizTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const quizData = {
      quizTitle,
      question,
      options,
      correctAnswer,
    };

    console.log("Quiz Created:", quizData);
    // TODO: send to API or database
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Create New Quiz</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quiz Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Quiz Title</label>
            <input
              type="text"
              value={quizTitle}
              onChange={(e) => setQuizTitle(e.target.value)}
              placeholder="Enter quiz title..."
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Question */}
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter question..."
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Multiple Choice Options */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Multiple Choice Options
            </label>
            {options.map((opt, index) => (
              <div key={index} className="flex items-center gap-3 mb-2">
                <input
                  type="radio"
                  name="correctAnswer"
                  checked={correctAnswer === index}
                  onChange={() => setCorrectAnswer(index)}
                  className="w-5 h-5"
                />
                <input
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}...`}
                  className="flex-1 rounded-md border border-gray-200 bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}
            <p className="text-xs text-gray-500 mt-1">
              Select the radio button to the correct answer
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end items-center gap-3 pt-4">
            <button
              type="button"
              className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              <Upload className="w-4 h-4" /> Bulk Import
            </button>
            <button
              type="submit"
              className="rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Generate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
