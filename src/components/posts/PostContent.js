"use client";

import PropTypes from "prop-types";
import { useState } from "react";

export default function PostContent({ 
  post,
  isEditing, 
  onEditCancel, 
  onEditSave 
}) {
  const [editContent, setEditContent] = useState(post.content);

  function handleSave() {
    onEditSave(editContent);
  }

  if (isEditing) {
    return (
      <div className="mb-3">
        <textarea 
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009ddb]"
          rows={3}
        />
        <div className="flex justify-end gap-2 mt-2">
          <button 
            onClick={onEditCancel}
            className="px-3 py-1 text-sm rounded bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-3 py-1 text-sm rounded bg-[#009ddb] hover:bg-[#0089c3] text-white"
            disabled={!editContent.trim()}
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <p className="mb-3 text-gray-700 whitespace-pre-line">{post.content}</p>
  );
}

PostContent.propTypes = {
  post: PropTypes.object.isRequired,
  isEditing: PropTypes.bool.isRequired,
  onEditSave: PropTypes.func.isRequired,
  onEditCancel: PropTypes.func.isRequired,
}; 