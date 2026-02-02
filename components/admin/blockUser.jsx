import React from "react";
import { X } from "lucide-react";

export default function BlockUserModal({ user, onClose, onConfirm }) {
  if (!user) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-background p-6 rounded-lg shadow-lg w-96 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <X />
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold mb-4 text-text">
          {user.role.includes("blocked") ? "Unblock User" : "Block User"}
        </h2>

        {/* Message */}
        <p className="text-gray-700 mb-4">
          Are you sure you want to{" "}
          <strong>{user.role.includes("blocked") ? "Unblock" : "Block"}</strong>{" "}
          <strong>{user.name}</strong> ({user.username})?
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(user)}
            className={`px-4 py-2 text-white rounded transition ${
             user.role.includes("blocked")
                ? "bg-green-600 hover:bg-green-700"
                : "bg-yellow-500 hover:bg-yellow-600"
            }`}
          >
            {user.role.includes("blocked") ? "Unblock" : "Block"}
          </button>
        </div>
      </div>
    </div>
  );
}
