"use client";

import PropTypes from "prop-types";
import { useState } from "react";
import PostHeader from "./PostHeader";
import PostContent from "./PostContent";
import PostFooter from "./PostFooter";
import SocialShareModal from "@/components/ui/SocialShareModal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import useProfile from "@/hooks/useProfile";
import useReactions from "@/hooks/useReactions";
import { useAuth } from "@/components/auth/AuthProvider";

export default function PostCard({
  post,
  onLongPress,
  showPicker,
  onClosePicker,
  onEdit,
  onDelete,
  currentUserId,
  isSuperAdmin,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const isOwn = post.authorId === currentUserId;
  const canEdit = isOwn || isSuperAdmin;

  const { profile: authorProfile, loading: loadingProfile } = useProfile(post.authorId);
  const { user } = useAuth();
  const { pending, handleAddReaction, handleDeleteReaction } = useReactions(post.id);

  function handleEditStart() {
    setIsEditing(true);
  }

  function handleEditCancel() {
    setIsEditing(false);
  }

  function handleEditSave(newContent) {
    if (onEdit) {
      onEdit(post.id, newContent)
        .then(() => {
          setIsEditing(false);
          // Optimistically update UI: Redux state is updated by the fulfilled reducer
          // console.log('Post edited successfully, UI updated via Redux');
        })
        .catch((err) => {
          console.error('Failed to edit post, consider refetching...', err);
        });
    }
  }

  function handleDelete() {
    setShowDeleteModal(true);
  }

  function confirmDelete() {
    if (onDelete) {
      onDelete(post.id, currentUserId);
    }
    setShowDeleteModal(false);
  }

  function cancelDelete() {
    setShowDeleteModal(false);
  }

  function handleLike() {
    if (!currentUserId) return; // Defensive: don't call if no user ID
    if (post.userReaction && post.userReaction.type === "LIKE") {
      // Supprimer la réaction
      handleDeleteReaction(post.userReaction.id, currentUserId);
    } else {
      handleAddReaction(currentUserId, "LIKE");
    }
  }

  function handleDislike() {
    if (!currentUserId) return; // Defensive: don't call if no user ID
    if (post.userReaction && post.userReaction.type === "DISLIKE") {
      // Supprimer la réaction
      handleDeleteReaction(post.userReaction.id, currentUserId);
    } else {
      handleAddReaction(currentUserId, "DISLIKE");
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10 mb-4">
      <PostHeader
        post={post}
        authorProfile={authorProfile}
        loadingProfile={loadingProfile}
        isOwn={isOwn}
        canEdit={canEdit}
        onEditStart={handleEditStart}
        onDelete={handleDelete}
      />
      <PostContent post={post} isEditing={isEditing} onEditSave={handleEditSave} onEditCancel={handleEditCancel} />
      <PostFooter
        post={post}
        onLike={handleLike}
        onDislike={handleDislike}
        pendingReaction={pending}
        showPicker={showPicker}
        onLongPress={onLongPress}
        onClosePicker={onClosePicker}
        currentUserId={currentUserId}
        onCommentsClick={() => {
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('toggleComments', { detail: { postId: post.id } }));
          }
        }}
      />
      <ConfirmModal
        open={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Supprimer le post ?"
        description="Cette action est irréversible."
      />
    </div>
  );
}

PostCard.propTypes = {
  post: PropTypes.object.isRequired,
  onLongPress: PropTypes.func.isRequired,
  showPicker: PropTypes.bool,
  onClosePicker: PropTypes.func.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  currentUserId: PropTypes.string.isRequired,
  isSuperAdmin: PropTypes.bool,
}; 