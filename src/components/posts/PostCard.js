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
  currentUserId,
  isSuperAdmin,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isOwn = post.authorId === currentUserId;
  const canEdit = isOwn || isSuperAdmin;

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
    <>
      <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
        <PostHeader
          post={post}
          authorProfile={authorProfile}
          loadingProfile={loadingProfile}
          isOwn={isOwn}
          canEdit={canEdit}
          onEditStart={handleEditStart}
          onDelete={handleDelete}
        />
        <PostContent
          post={post}
          isEditing={isEditing}
          onEditCancel={handleEditCancel}
          onEditSave={handleEditSave}
        />
        <PostFooter
          likes={post.likes || 0}
          dislikes={post.dislikes || 0}
          commentCount={post.commentCount || 0}
          onLike={handleLike}
          onDislike={handleDislike}
          onCommentsClick={onCommentsClick}
          isCommentsOpen={isCommentsOpen}
          userReaction={userReaction}
          pendingReaction={pendingReaction}
        />
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
    </>
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
  currentUserId: PropTypes.string.isRequired,
  isSuperAdmin: PropTypes.bool,
}; 