"use client";

import PropTypes from "prop-types";

export default function PostHeader({ 
  author, 
  minutesAgo, 
  isOwn, 
  isEditing,
  onEditStart, 
  onDelete 
}) {
  return (
    <header className="flex items-center gap-3 mb-2">
      <div className="w-10 h-10 rounded-full bg-[#009ddb]" />
      <div>
        <h4 className="font-bold text-[#009ddb]">{author}</h4>
        <time className="text-xs text-gray-400">{minutesAgo} min ago</time>
      </div>
      
      {/* Edit/Delete buttons */}
      {isOwn && !isEditing && (
        <div className="ml-auto flex gap-2">
          <button 
            onClick={onEditStart} 
            className="text-xl px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" 
            title="Edit"
          >
            ✒️
          </button>
          <button 
            onClick={onDelete} 
            className="text-xl px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700" 
            title="Delete"
          >
            ❌
          </button>
        </div>
      )}
    </header>
  );
}

PostHeader.propTypes = {
  author: PropTypes.string.isRequired,
  minutesAgo: PropTypes.number.isRequired,
  isOwn: PropTypes.bool.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEditStart: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}; 