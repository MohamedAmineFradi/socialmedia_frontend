"use client";

import PropTypes from "prop-types";

export default function PostFooter({
  post,
  onLike,
  onDislike,
  onEdit,
  onDelete,
  pendingReaction,
  showPicker,
  onLongPress,
  onClosePicker,
  currentUserId,
  onCommentsClick, // new prop
}) {
  return (
    <div className="flex items-center justify-between mt-4">
      <div className="flex items-center gap-4">
        <button
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${post.userReaction?.type === "LIKE" ? "bg-[#009ddb]/20 text-[#009ddb]" : "bg-gray-100 text-gray-600"}`}
          onClick={onLike}
          disabled={pendingReaction}
        >
          👍 {post.likes || 0}
          {pendingReaction && <span className="ml-1 animate-spin">⏳</span>}
        </button>
        <button
          className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${post.userReaction?.type === "DISLIKE" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-600"}`}
          onClick={onDislike}
          disabled={pendingReaction}
        >
          👎 {post.dislikes || 0}
          {pendingReaction && <span className="ml-1 animate-spin">⏳</span>}
        </button>
        <button
          className="text-gray-400 text-sm hover:underline focus:outline-none"
          onClick={onCommentsClick}
          aria-label="Show comments"
        >
          💬 {post.commentCount || 0}
        </button>
      </div>
      <div className="flex items-center gap-2">
        {onEdit && (
          <button
            className="text-blue-500 hover:underline text-sm"
            onClick={onEdit}
          >
            Edit
          </button>
        )}
        {onDelete && (
          <button
            className="text-red-500 hover:underline text-sm"
            onClick={onDelete}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

PostFooter.propTypes = {
  post: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onDislike: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  pendingReaction: PropTypes.bool,
  showPicker: PropTypes.bool,
  onLongPress: PropTypes.func,
  onClosePicker: PropTypes.func,
  currentUserId: PropTypes.any,
  onCommentsClick: PropTypes.func, // new prop
}; 