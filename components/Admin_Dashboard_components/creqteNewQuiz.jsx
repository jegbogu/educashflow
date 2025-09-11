"use client";

import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { quizConfig } from "../../config/quizConfig "; // adjust path if needed

export default function CreateQuizModal({ onClose }) {
  const questionRef = useRef();

  // State
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
const [uploading, setUploading] = useState(false);
const [uploadMsg, setUploadMsg] = useState("");


  // Handlers
  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  
const handleFileChange = (e) => {
  const f = e.target.files?.[0] || null;
  setUploadMsg("");
  if (!f) {
    setFile(null);
    return;
  }

  // basic CSV guard (browsers can label CSV oddly, so check name too)
  const looksCsv =
    f.type === "text/csv" ||
    f.type === "application/vnd.ms-excel" ||
    f.name.toLowerCase().endsWith(".csv");

  if (!looksCsv) {
    setUploadMsg("Selected file is not a CSV.");
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    return;
  }

  setFile(f);
};

const handleUpload = async () => {
  try {
    setUploadMsg("");
    if (!file) {
      setUploadMsg("Please choose a CSV file first.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
  

    const res = await fetch("http://localhost:3000/api/upload-csv", {
      method: "POST",
      body: formData,
    });

    let data = {};
    try {
      data = await res.json();
    } catch (_) {}

    if (!res.ok) {
      setUploadMsg(data?.message || "CSV upload failed.");
      return;
    }

    // Success message (supports your backend’s response shape)
    const inserted = data?.rows_inserted ?? "";
    const failed = data?.rows_failed ?? "";
    setUploadMsg(
      data?.message ||
        `Upload complete.${inserted !== "" ? ` Inserted: ${inserted}.` : ""}${
          failed !== "" ? ` Failed: ${failed}.` : ""
        }`
    );

    // Reset file and input
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  } catch (err) {
    setUploadMsg(err?.message || "Upload error.");
  } finally {
    setUploading(false);
  }
};

   

  const handleSubmit = async (e) => {
    e.preventDefault();

    const enteredQuestion = questionRef.current.value;

    const quizData = {
      question: enteredQuestion,
      category,
      level,
      options,
      correctAnswer,
    };

     

    const response = await fetch("/api/quizCreation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizData),
    });

    const newPostData = await response.json();

    if (newPostData.success === true) {
      alert(newPostData.message);

      // ✅ Reset controlled fields
      setCategory("");
      setLevel("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(null);

      // ✅ Reset uncontrolled field
      if (questionRef.current) questionRef.current.value = "";
    } else {
      alert(newPostData.message || "Something went wrong");
    }
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
          {/* Question */}
          <div>
            <label className="block text-sm font-medium mb-1">Question</label>
            <input
              type="text"
              name="question"
              ref={questionRef}
              placeholder="Enter question..."
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Category</option>
              {quizConfig.categories.map((cat, idx) => (
                <option key={idx} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Level Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Select Level</option>
              {quizConfig.levels.map((lvl, idx) => (
                <option key={idx} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
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
              Select the radio button for the correct answer
            </p>
          </div>

           {/* Bulk Import & Submit */}
<input
  type="file"
  accept=".csv"
  onChange={handleFileChange}
  ref={fileInputRef}
  className="mt-2 rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 px-5 py-2 text-sm font-medium text-white hover:opacity-90"
  
/>

{uploadMsg ? (
  <div className="mt-2 text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
    {uploadMsg}
  </div>
) : null}

<div className="flex justify-end items-center gap-3 pt-4">
  <button
    type="button"
    onClick={handleUpload}
    disabled={!file || uploading}
    className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-60"
  >
    <Upload className="w-4 h-4" />
    {uploading ? "Uploading..." : "Bulk Import"}
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
