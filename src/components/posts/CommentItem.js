"use client";

import PropTypes from "prop-types";
import { useState } from "react";

export default function CommentItem({ 
  comment, 
  isPostOwner, 
  currentUserId, 
  onEdit, 
  onDelete 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.text);

  function handleEditStart() {
    setIsEditing(true);
    setEditContent(comment.text);
  }

  function handleEditCancel() {
    setIsEditing(false);
  }

  function handleEditSave() {
    onEdit(comment.id, editContent);
    setIsEditing(false);
  }

  function handleDelete() {
    onDelete(comment.id);
  }

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-[#009ddb]" />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <p className="text-sm">
            <span className="font-semibold text-[#009ddb]">
              {comment.author}
            </span>{" "}
            <span className="text-gray-400 text-xs">
              {comment.minutesAgo} min ago
            </span>
          </p>
          
          {(comment.authorId === currentUserId || isPostOwner) && !isEditing && (
            <div className="flex gap-2">
              {comment.authorId === currentUserId && (
                <button 
                  onClick={handleEditStart} 
                  className="text-sm px-1.5 py-0.5 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" 
                  title="Edit"
                >
                  ✒️
                </button>
              )}
              <button 
                onClick={handleDelete} 
                className="text-sm px-1.5 py-0.5 rounded bg-red-100 hover:bg-red-200 text-red-700" 
                title="Delete"
              >
                ❌
              </button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div className="mt-1">
            <textarea 
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ddb] text-sm"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-1">
              <button 
                onClick={handleEditCancel}
                className="px-2 py-0.5 text-xs rounded bg-gray-100 hover:bg-gray-200"
              >
                Cancel
              </button>
              <button 
                onClick={handleEditSave}
                className="px-2 py-0.5 text-xs rounded bg-[#009ddb] hover:bg-[#0089c3] text-white"
                disabled={!editContent.trim()}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 text-sm whitespace-pre-line">
            {comment.text}
          </p>
        )}
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    author: PropTypes.string.isRequired,
    authorId: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    minutesAgo: PropTypes.number.isRequired,
  }).isRequired,
  isPostOwner: PropTypes.bool.isRequired,
  currentUserId: PropTypes.number.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}; 