"use client";

import PropTypes from "prop-types";
import { useState } from "react";

export default function PostHeader({ 
  post,
  authorProfile,
  loadingProfile,
  isOwn, 
  canEdit,
  onEditStart, 
  onDelete 
}) {
  const [avatarError, setAvatarError] = useState(false);
  
  // Extract data from post and authorProfile
  const author = authorProfile?.displayName || post.authorName || post.authorUsername || "Unknown User";
  const avatar = authorProfile?.avatar;
  const username = authorProfile?.username || post.authorUsername;
  
  // Calculate minutes ago from post creation date
  const minutesAgo = post.createdAt 
    ? Math.floor((Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60))
    : 0;

  // Fallback avatar URL using UI Avatars service
  const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=009ddb&color=fff&size=40`;

  const handleAvatarError = () => {
    setAvatarError(true);
  };

  return (
    <header className="flex items-center gap-3 mb-2">
      {avatar && !avatarError ? (
        <img
          src={avatar}
          alt={author}
          className="w-10 h-10 rounded-full object-cover bg-white"
          onError={handleAvatarError}
        />
      ) : (
        <img
          src={fallbackAvatar}
          alt={author}
          className="w-10 h-10 rounded-full object-cover bg-white"
        />
      )}
      <div>
        <h4 className="font-bold text-[#009ddb]">{author}</h4>
        {username && (
          <span className="ml-2 text-xs text-gray-400">@{username}</span>
        )}
        <time className="block text-xs text-gray-400">{minutesAgo} min ago</time>
      </div>
      
      {/* Edit/Delete buttons */}
      {canEdit && (
        <div className="ml-auto flex gap-2">
          <button 
            onClick={onEditStart} 
            className="text-xl px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700" 
            title={isOwn ? "Edit" : "Edit (Admin)"}
          >
            ✒️
          </button>
          <button 
            onClick={onDelete} 
            className="text-xl px-2 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700" 
            title={isOwn ? "Delete" : "Delete (Admin)"}
          >
            ❌
          </button>
        </div>
      )}
    </header>
  );
}

PostHeader.propTypes = {
  post: PropTypes.object.isRequired,
  authorProfile: PropTypes.object,
  loadingProfile: PropTypes.bool,
  isOwn: PropTypes.bool.isRequired,
  canEdit: PropTypes.bool.isRequired,
  onEditStart: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}; 