import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function UserForm({ onClose, formTitle, onSave, user }) {
  const [formData, setFormData] = useState({
    id: "",
    username: "",
    name: "",
    email: "",
    status: "Active",
    type: "Regular",
  });

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  const uid = crypto.randomUUID();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);

    setFormData({
      id: "",
      name: "",
      email: "",
      status: "Active",
      type: "Regular",
    });
  };

  const fields = [
    { name: "name", type: "text", placeholder: "Full Name" },
    { name: "username", type: "text", placeholder: "Username" },
    { name: "email", type: "email", placeholder: "Email Address" },
  ];

  const inputClass =
    "w-full px-3 py-2 border border-border rounded focus:outline-none focus:ring-2 focus:ring-accent";

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-lg shadow-md bg-background text-[var(--text-color)] font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text capitalize">
          {formTitle ? formTitle : "Add / Edit User"}
        </h2>
        <X onClick={onClose} className="cursor-pointer" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {fields.map(({ name, type, placeholder }) => (
          <div className="space-y-1" key={name}>
            <label htmlFor={name}>{placeholder}</label>
            <input
              type={type}
              name={name}
              placeholder={placeholder}
              value={formData[name]}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>
        ))}
        <select
          name="status"
          id="status"
          value={formData.status}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="Active">Active</option>
          <option value="Blocked">Blocked</option>
        </select>
        <select
          name="type"
          id="type"
          value={formData.type}
          onChange={handleChange}
          className={inputClass}
        >
          <option value="Regular">Regular</option>
          <option value="Admin">Admin</option>
          <option value="Premium">Premium</option>
        </select>
        <button
          type="submit"
          className={"bg-dashboard-primary text-white px-4 py-2 rounded w-full"}
        >
          Save User
        </button>
      </form>
    </div>
  );
}
