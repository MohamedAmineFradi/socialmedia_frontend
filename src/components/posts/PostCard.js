"use client";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";
import SocialShareModal from "@/components/ui/SocialShareModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { getProfileByUserId } from "@/services/profileService";
import useProfile from "@/hooks/useProfile";
import { currentUserId } from "@/mocks/currentUser";

export default function PostCard({
  post,
  onLongPress,
  showPicker,
  onClosePicker,
  onPickReaction,
  onCommentsClick,
  isCommentsOpen,
  onEdit,
  onDelete,
  userReaction,
  pendingReaction,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isOwn = post.authorId === currentUserId;

  const { profile: authorProfile, loading: loadingProfile } = useProfile(post.authorId);

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
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    if (onDelete) {
      onDelete(post.id);
    }
    setShowDeleteModal(false);
  }

  function cancelDelete() {
    setShowDeleteModal(false);
  }

  function handleLike() {
    onPickReaction("👍");
  }

  function handleDislike() {
    onPickReaction("👎");
  }

  return (
    <article className="bg-white hover:bg-white transition-all duration-200 rounded-2xl shadow p-6 border border-[#009ddb]/10 backdrop-blur-sm cursor-pointer relative">
      {loadingProfile ? (
        <div className="flex items-center gap-3 mb-2 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-gray-200" />
          <div className="h-4 w-24 bg-gray-200 rounded" />
        </div>
      ) : (
        <PostHeader 
          author={authorProfile?.name || "Unknown User"}
          avatar={authorProfile?.avatar}
          username={authorProfile?.username}
          minutesAgo={post.minutesAgo}
          isOwn={isOwn}
          isEditing={isEditing}
          onEditStart={handleEditStart}
          onDelete={handleDelete}
        />
      )}
      
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
        onCommentsClick={onCommentsClick}
        isCommentsOpen={isCommentsOpen}
        userReaction={userReaction}
        pendingReaction={pendingReaction}
      />
      <div className="flex justify-end mt-2">
        <SocialShareModal url={post.url} title={post.title || post.author} description={post.content} />
      </div>
      <ConfirmModal
        open={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
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
  userReaction: PropTypes.string,
}; 