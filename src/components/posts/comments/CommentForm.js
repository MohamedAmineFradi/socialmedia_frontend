"use client";

import PropTypes from "prop-types";
import { useState } from "react";

export default function CommentForm({ onSubmit }) {
  const [draft, setDraft] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    
    onSubmit(draft);
    setDraft("");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Add a comment"
        className="flex-1 rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#009ddb]"
      />
      <button
        type="submit"
        className="bg-[#fb5c1d] hover:bg-[#fa5c1a] text-white font-bold px-4 py-2 rounded-full disabled:opacity-50"
        disabled={!draft.trim()}
      >
        Send
      </button>
    </form>
  );
}

CommentForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}; 