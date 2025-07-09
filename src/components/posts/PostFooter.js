"use client";

import PropTypes from "prop-types";
import { useState } from "react";

export default function PostFooter({ 
  likes, 
  dislikes, 
  commentCount, 
  onLike, 
  onDislike, 
  onCommentsClick 
}) {
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);

  function handleLike() {
    setLikeActive(true);
    onLike();
    setTimeout(() => setLikeActive(false), 150);
  }

  function handleDislike() {
    setDislikeActive(true);
    onDislike();
    setTimeout(() => setDislikeActive(false), 150);
  }

  return (
    <footer className="mt-2 text-sm text-gray-500">
      <div className="flex gap-6">
        <span
          onClick={handleLike}
          className={`cursor-pointer select-none transition-transform duration-150 ${likeActive ? "scale-150" : "hover:scale-125"}`}
          role="button"
          tabIndex={0}
          aria-label="Like"
        >
          👍 {likes}
        </span>
        <span
          onClick={handleDislike}
          className={`cursor-pointer select-none transition-transform duration-150 ${dislikeActive ? "scale-150" : "hover:scale-125"}`}
          role="button"
          tabIndex={0}
          aria-label="Dislike"
        >
          👎 {dislikes}
        </span>
        <button 
          type="button" 
          className="cursor-pointer" 
          onClick={onCommentsClick}
        >
          💬 {commentCount || 0}
        </button>
      </div>
    </footer>
  );
}

PostFooter.propTypes = {
  likes: PropTypes.number.isRequired,
  dislikes: PropTypes.number.isRequired,
  commentCount: PropTypes.number.isRequired,
  onLike: PropTypes.func.isRequired,
  onDislike: PropTypes.func.isRequired,
  onCommentsClick: PropTypes.func.isRequired,
}; 