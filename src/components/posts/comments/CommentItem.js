"use client";

import PropTypes from "prop-types";
import { useState } from "react";
import useProfile from "@/hooks/useProfile";

export default function CommentItem({ 
  comment, 
  isPostOwner, 
  currentUserId, 
  isSuperAdmin,
  isEditing,
  editValue,
  onEditStart,
  onEditCancel,
  onEditSave,
  onEditChange,
  onDelete 
}) {
  const [avatarError, setAvatarError] = useState(false);

  const { profile: authorProfile, loading: profileLoading } = useProfile(comment.userId);

  function handleEditSave() {
    onEditSave(comment.id, editValue);
  }

  function handleDelete() {
    onDelete(comment.id);
  }

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(authorProfile?.name || comment.author || "User")}&background=009ddb&color=fff&size=32`;
  const avatarUrl = (authorProfile?.avatar && !avatarError)
    ? authorProfile.avatar
    : (comment.avatar && !avatarError)
      ? comment.avatar
      : fallbackAvatar;

  let displayName;
  if (profileLoading) {
    displayName = 'Loading...';
  } else {
    displayName = authorProfile?.name || comment.author || 'Unknown User';
  }
  let displayUsername;
  if (profileLoading) {
    displayUsername = '';
  } else {
    displayUsername = authorProfile?.username || comment.username || '';
  }

  const isOwnComment = comment.userId === currentUserId;
  const canEditComment = isOwnComment || isSuperAdmin;

  return (
    <div className="flex items-start gap-3">
      <img
        src={avatarUrl}
        alt={displayName}
        className="w-8 h-8 rounded-full object-cover bg-white/20 border border-white/30"
        loading="lazy"
        onError={handleAvatarError}
      />
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-semibold text-black">
              {displayName}
            </span>
            {displayUsername && (
              <span className="ml-2 text-xs text-black/70">@{displayUsername}</span>
            )}
            <span className="ml-2 text-black/50 text-xs">
              {typeof comment.minutesAgo === 'number' ? `${comment.minutesAgo} min ago` : ''}
            </span>
          </div>
          {(comment.userId === currentUserId || isPostOwner || isSuperAdmin) && !isEditing && (
            <div className="flex gap-2">
              {canEditComment && (
                <button 
                  onClick={onEditStart} 
                  className="text-sm px-1.5 py-0.5 rounded bg-white/20 hover:bg-white/30 text-white" 
                  title={isOwnComment ? "Edit" : "Edit (Admin)"}
                >
                  ✒️
                </button>
              )}
              <button 
                onClick={handleDelete} 
                className="text-sm px-1.5 py-0.5 rounded bg-red-400/20 hover:bg-red-400/40 text-white" 
                title={isOwnComment || isPostOwner ? "Delete" : "Delete (Admin)"}
              >
                ❌
              </button>
            </div>
          )}
        </div>
        {isEditing ? (
          <div className="mt-1">
            <textarea 
              value={editValue}
              onChange={(e) => onEditChange(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#fde848] text-sm bg-white text-[#009ddb]"
              rows={2}
            />
            <div className="flex justify-end gap-2 mt-1">
              <button 
                type="button"
                onClick={onEditCancel}
                className="px-2 py-0.5 text-xs rounded bg-white/20 hover:bg-white/30 text-black border border-gray-300"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={handleEditSave}
                className="px-2 py-0.5 text-xs rounded bg-[#fde848] hover:bg-[#fb5c1d] text-[#009ddb] border border-gray-300"
                disabled={!editValue.trim()}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <p className="text-black text-sm whitespace-pre-line">
            {comment.text || comment.content}
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
    userId: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    minutesAgo: PropTypes.number.isRequired,
    username: PropTypes.string,
  }).isRequired,
  isPostOwner: PropTypes.bool.isRequired,
  currentUserId: PropTypes.number.isRequired,
  isSuperAdmin: PropTypes.bool,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}; 