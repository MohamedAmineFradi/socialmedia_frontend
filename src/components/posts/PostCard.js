"use client";

import PropTypes from "prop-types";
import { useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";

const currentUserId = 1; // Simulated logged-in user

export default function PostCard({
  post,
  onLongPress,
  showPicker,
  onClosePicker,
  onPickReaction,
  onCommentsClick,
  onEdit,
  onDelete,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const isOwn = post.authorId === currentUserId;

  function handleEditStart() {
    setIsEditing(true);
  }

  function handleEditCancel() {
    setIsEditing(false);
  }

  function handleEditSave(newContent) {
    if (onEdit) {
      onEdit(post.id, newContent);
      setIsEditing(false);
    }
  }

  function handleDelete() {
    if (onDelete) {
      onDelete(post.id);
    }
  }

  function handleLike() {
    onPickReaction("👍");
  }

  function handleDislike() {
    onPickReaction("👎");
  }

  return (
    <article className="bg-white hover:bg-white transition-all duration-200 rounded-2xl shadow p-6 border border-[#009ddb]/10 backdrop-blur-sm cursor-pointer relative">
      <PostHeader 
        author={post.author}
        minutesAgo={post.minutesAgo}
        isOwn={isOwn}
        isEditing={isEditing}
        onEditStart={handleEditStart}
        onDelete={handleDelete}
      />
      
      <PostContent 
        content={post.content}
        isEditing={isEditing}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
      />

      {/* Tags */}
      {post.tags?.length > 0 && (
        <ul className="flex gap-2 mb-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="bg-[#fde848] text-[#fb5c1d] text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}

      <PostFooter 
        likes={post.likes}
        dislikes={post.dislikes}
        commentCount={post.commentCount || 0}
        onLike={handleLike}
        onDislike={handleDislike}
        onCommentsClick={() => onCommentsClick(post.id)}
      />
    </article>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onLongPress: PropTypes.func.isRequired,
  showPicker: PropTypes.bool,
  onClosePicker: PropTypes.func.isRequired,
  onPickReaction: PropTypes.func.isRequired,
  onCommentsClick: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
}; 