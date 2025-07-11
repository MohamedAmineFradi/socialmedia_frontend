"use client";

import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const ANIMATION_DURATION = 500; // 500ms

export default function PostFooter({
  likes,
  dislikes,
  commentCount,
  onLike,
  onDislike,
  onCommentsClick,
  isCommentsOpen,
  userReaction,
  pendingReaction,
}) {
  const [likeActive, setLikeActive] = useState(false);
  const [dislikeActive, setDislikeActive] = useState(false);

  useEffect(() => {
    if (likeActive) {
      const timeout = setTimeout(() => setLikeActive(false), ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
    if (dislikeActive) {
      const timeout = setTimeout(() => setDislikeActive(false), ANIMATION_DURATION);
      return () => clearTimeout(timeout);
    }
  }, [likeActive, dislikeActive]);

  function handleLike() {
    setLikeActive(true);
    onLike();
  }

  function handleDislike() {
    setDislikeActive(true);
    onDislike();
  }

  return (
    <footer className="flex items-center justify-between mt-4">
      <div className="flex gap-4">
        <button
          onClick={handleLike}
          disabled={pendingReaction}
          className={`text-[#009ddb] font-bold transition-transform duration-[${ANIMATION_DURATION}] px-2 py-1 rounded-full
            ${likeActive ? 'scale-110 bg-[#fde848]' : ''}
            ${userReaction === 'LIKE' ? 'bg-[#fde848] text-[#009ddb]' : 'bg-gray-100'}
            ${pendingReaction ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          👍 {typeof likes === 'number' ? likes : 0}
        </button>
        <button
          onClick={handleDislike}
          disabled={pendingReaction}
          className={`text-[#009ddb] font-bold transition-transform duration-[${ANIMATION_DURATION}] px-2 py-1 rounded-full
            ${dislikeActive ? 'scale-110 bg-[#fde848]' : ''}
            ${userReaction === 'DISLIKE' ? 'bg-[#fde848] text-[#009ddb]' : 'bg-gray-100'}
            ${pendingReaction ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          👎 {typeof dislikes === 'number' ? dislikes : 0}
        </button>
        <button
          onClick={onCommentsClick}
          className={`font-bold flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${isCommentsOpen ? 'bg-[#fde848] text-[#009ddb]' : 'bg-gray-100 text-[#009ddb] hover:bg-[#009ddb] hover:text-white'}`}
        >
          💬 {typeof commentCount === 'number' ? commentCount : 0}
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
  userReaction: PropTypes.string,
  pendingReaction: PropTypes.bool,
}; 