"use client";

import PropTypes from "prop-types";
import { useState } from "react";

export default function PostFooter({
  likes,
  dislikes,
  commentCount,
  onLike,
  onDislike,
  onCommentsClick,
  isCommentsOpen,
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
    <footer className="flex items-center justify-between mt-4">
      <div className="flex gap-4">
        <button onClick={onLike} className="text-[#009ddb] hover:text-[#fb5c1d] font-bold">
          👍 {likes}
        </button>
        <button onClick={onDislike} className="text-[#009ddb] hover:text-[#fb5c1d] font-bold">
          👎 {dislikes}
        </button>
        <button
          onClick={onCommentsClick}
          className={`font-bold flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${isCommentsOpen ? 'bg-[#fde848] text-[#009ddb]' : 'bg-gray-100 text-[#009ddb] hover:bg-[#009ddb] hover:text-white'}`}
        >
          💬 {commentCount}
          <span className="ml-1">{isCommentsOpen ? 'Hide' : 'Comments'}</span>
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
  isCommentsOpen: PropTypes.bool.isRequired,
}; 