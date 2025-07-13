"use client";

import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import CommentItem from "./CommentItem";
import CommentModal from "./CommentModal";
import { addComment, editComment, deleteComment } from "@/services/commentService";
import { getProfileByUserId } from "@/services/profileService";
import CommentForm from "./CommentForm";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function CommentsModal({ open, onClose, post, onAddComment, onEditComment, onDeleteComment, currentUserId }) {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  async function handleAddComment(text) {
    if (!post || !currentUserId) return;
    await addComment(post.id, currentUserId, { content: text });
    if (onAddComment) onAddComment(post.id, text);
  }

  function handleEditStart(comment) {
    setEditingId(comment.id);
    setEditingValue(comment.content);
  }

  function handleEditCancel() {
    setEditingId(null);
    setEditingValue("");
  }

  async function handleEditSave(commentId, newText) {
    if (!post || !currentUserId) return;
    await editComment(commentId, currentUserId, { content: newText });
    if (onEditComment) onEditComment(post.id, commentId, newText);
    setEditingId(null);
    setEditingValue("");
  }

  function handleDeleteComment(commentId) {
    setDeleteId(commentId);
  }

  async function confirmDeleteComment() {
    if (!post || !deleteId || !currentUserId) return;
    await deleteComment(deleteId, currentUserId);
    if (onDeleteComment) onDeleteComment(post.id, deleteId);
    setDeleteId(null);
  }

  function cancelDeleteComment() {
    setDeleteId(null);
  }

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
        <div className="bg-[#009ddb] text-white rounded-2xl shadow-lg w-full max-w-2xl mx-4 animate-fadeIn">
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#0089c3]">
            <span className="font-bold text-lg">Comments</span>
            <button
              onClick={onClose}
              className="text-white hover:text-[#fde848] text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className="px-6 py-4 max-h-[60vh] overflow-y-auto flex flex-col gap-4 scrollbar-hide">
            {(post.comments || []).map((comment) => (
              <CommentItem
                key={comment.id}
                comment={{ ...comment, text: comment.content }}
                isPostOwner={post?.authorId === currentUserId}
                currentUserId={currentUserId}
                isEditing={editingId === comment.id}
                editValue={editingValue}
                onEditStart={() => handleEditStart(comment)}
                onEditCancel={handleEditCancel}
                onEditSave={handleEditSave}
                onEditChange={setEditingValue}
                onDelete={handleDeleteComment}
              />
            ))}
            {/* Add Comment Form below comments */}
            <div className="mt-4">
              <CommentForm onSubmit={handleAddComment} />
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmModal
        open={!!deleteId}
        onClose={cancelDeleteComment}
        onConfirm={confirmDeleteComment}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </>
  );
}

CommentsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  post: PropTypes.object,
  onAddComment: PropTypes.func,
  currentUserId: PropTypes.number.isRequired,
}; 