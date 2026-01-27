import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { quizConfig } from "@/config/quizConfig";

export default function QuestionModal({ question, onSave, onClose }) {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    question: "",
    category: "",
    subcategory: "",
    difficulty: "medium",
    options: { a: "", b: "", c: "", d: "" },
    correctAnswer: "",
  });

  useEffect(() => {
    if (question) {
      setFormData({
        ...question,
        options: question.options || { a: "", b: "", c: "", d: "" },
        correctAnswer: question.correctAnswer || "",
      });
    } else {
      setFormData({
        id: crypto.randomUUID(),
        question: "",
        category: "",
        subcategory: "",
        difficulty: "medium",
        options: { a: "", b: "", c: "", d: "" },
        correctAnswer: "",
      });
    }
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (["a", "b", "c", "d"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        options: { ...prev.options, [name]: value },
      }));
    } else if (name === "correctAnswer") {
      setFormData((prev) => ({ ...prev, correctAnswer: value }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...(name === "category" ? { subcategory: "" } : {}),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.correctAnswer) {
      alert("Please select the correct answer before saving.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        createdAt: question ? question.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/questions", {
        method: question ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save question");
      }

      const savedQuestion = await response.json();

      // Return saved data to parent
      onSave(savedQuestion);

      onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving the question.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory = quizConfig.categories.find(
    (cat) => cat.name === formData.category
  );

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-background p-6 rounded-lg shadow-lg w-full max-w-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4 text-text">
          {question ? "Edit Question" : "Add Question"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question
            </label>
            <input
              type="text"
              name="question"
              value={formData.question}
              onChange={handleChange}
              placeholder="Enter question"
              required
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Choose Category</option>
              {quizConfig.categories.map(({ name }, index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {formData.category && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategory
              </label>
              <select
                name="subcategory"
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="">Choose Subcategory</option>
                {selectedCategory?.subcategories.map((name, index) => (
                  <option key={index} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent"
            >
              <option value="">Choose Difficulty</option>
              {quizConfig.levels.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options (Select the correct one)
            </label>
            <div className="space-y-2">
              {["a", "b", "c", "d"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 rounded">
                  <input
                    type="radio"
                    name="correctAnswer"
                    value={opt}
                    checked={formData.correctAnswer === opt}
                    onChange={handleChange}
                    className="accent"
                  />
                  <span className="font-semibold">{opt.toUpperCase()}.</span>
                  <input
                    type="text"
                    name={opt}
                    value={formData.options[opt]}
                    onChange={handleChange}
                    placeholder={`Option ${opt.toUpperCase()}`}
                    className="flex-1 px-3 py-2 border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border rounded hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-dashboard-primary text-white rounded hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : question ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
