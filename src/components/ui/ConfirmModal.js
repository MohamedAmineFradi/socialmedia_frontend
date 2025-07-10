"use client";

export default function ConfirmModal({ open, onClose, onConfirm, title, description, confirmText = "Delete", cancelText = "Cancel" }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-[#009ddb] text-white rounded-2xl shadow-lg w-full max-w-md mx-4 animate-fadeIn">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#0089c3]">
          <h3 className="text-lg font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="text-white hover:text-[#fde848] text-2xl font-bold focus:outline-none"
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="px-6 py-6">
          <p className="mb-4 text-white/90">{description}</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded bg-white/20 hover:bg-white/30 text-white font-semibold"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded bg-[#fde848] hover:bg-[#fb5c1d] text-[#009ddb] font-semibold"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 