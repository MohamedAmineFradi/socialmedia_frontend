"use client";

import PropTypes from "prop-types";
import { useState } from "react";
import { addPost } from "@/utils/localDataService";

export default function PostForm({ onSubmit }) {
  const [draft, setDraft] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!draft.trim()) return;
    
    // Add post to local storage
    const newPost = addPost(draft);
    
    // Call parent component's onSubmit
    if (onSubmit) {
      onSubmit(draft);
    }
    
    setDraft("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#009ddb] rounded-2xl shadow p-6 border border-[#009ddb]/10 mb-4 flex flex-col sm:flex-row items-center gap-4"
    >
      <input
        type="text"
        placeholder="What's on your mind?"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        className="flex-1 rounded-full px-4 py-2 text-gray-800 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009ddb]"
        aria-label="Post content"
      />
      <button
        type="submit"
        className="bg-[#fb5c1d] hover:bg-[#fa5c1a] text-white font-bold py-2 px-6 rounded-full transition-colors disabled:opacity-50"
        disabled={!draft.trim()}
      >
        Publish
      </button>
    </form>
  );
}

PostForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
}; 