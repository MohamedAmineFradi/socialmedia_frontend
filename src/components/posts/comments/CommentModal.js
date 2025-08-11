"use client";

import { useEffect } from "react";
import CommentForm from "./CommentForm";

export default function CommentModal({ open, onClose, onSubmit, initialValue }) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#009ddb] text-white rounded-2xl shadow-lg w-full max-w-md mx-4 animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0089c3]">
          <h3 className="text-lg font-bold">Edit Comment</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-[#fde848] text-2xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="px-6 py-4">
          <CommentForm
            onSubmit={(text) => {
              onSubmit(text);
              onClose();
            }}
            initialValue={initialValue}
          />
        </div>
        <div className="flex justify-end gap-2 px-6 py-3 border-t border-[#0089c3]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 text-white font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
} 