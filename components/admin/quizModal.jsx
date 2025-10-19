import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { quizConfig } from "@/config/quizConfig";

export default function QuestionModal({ question, onSave, onClose }) {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    category: "",
    difficulty: "medium",
  });

  useEffect(() => {
    if (question) {
      setFormData(question);
    } else {
      setFormData({
        id: crypto.randomUUID(),
        title: "",
        description: "",
        category: "",
        difficulty: "medium",
        subcategory: "",
        category: "",
      });
    }
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}), // reset subcategory if category changes
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // 🔹 Define field configs
  const fields = [
    {
      label: "Question",
      name: "question",
      type: "text",
      placeholder: "Enter question",
      required: true,
    },
    {
      label: "Description",
      name: "description",
      type: "textarea",
      placeholder: "Enter question description",
    },
  ];

  const selectFields = [
    {
      name: "category",
      label: "Category",
      options: quizConfig.categories,
    },
    {
      name: "levels",
      label: "Difficulty",
      options: quizConfig.levels,
    },
  ];

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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  rows={4}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                />
              ) : (
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
                />
              )}
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            >
              <option value="Default" defaultChecked>
                Choose Category
              </option>
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
                name={"subcategory"}
                value={formData.subcategory}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
              >
                <option value="Default" defaultChecked>
                  Choose Subcategory
                </option>
                {selectedCategory?.subcategories.map(
                  (name , index) => (
                    <option key={index} value={name}>
                      {name}
                    </option>
                  )
                )}
              </select>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
            <select
              name="difficulty"
              value={formData["difficulty"]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)]"
            >
              <option value="Default" defaultChecked>
                Choose Difficulty
              </option>
              {quizConfig.levels.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          {/* Buttons */}
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
              className="px-4 py-2 bg-dashboard-primary text-white rounded hover:opacity-90 transition"
            >
              {question ? "Update" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
