"use client";
import { useState, useEffect } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { getComments } from "@/services/commentService";
import { getProfileByUserId } from "@/services/profileService";
import { enrichCommentsWithProfiles, mapCommentResponseToUI } from "@/utils/profile";

export default function InlineComments({ post, onAddComment, onEditComment, onDeleteComment, currentUserId, isSuperAdmin }) {
  const [comments, setComments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (post?.id) {
      getComments(post.id).then(async (comments) => {
        const commentsWithProfiles = await enrichCommentsWithProfiles(comments);
        setComments(commentsWithProfiles);
      });
    }
  }, [post?.id]);

  async function handleAddComment(text) {
    if (!post) return;
    await onAddComment(post.id, text);
    getComments(post.id).then(async (comments) => {
      const commentsWithProfiles = await enrichCommentsWithProfiles(comments);
      setComments(commentsWithProfiles);
    });
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
    if (!post) return;
    await onEditComment(post.id, commentId, newText);
    setEditingId(null);
    setEditingValue("");
    getComments(post.id).then(async (comments) => {
      const commentsWithProfiles = await enrichCommentsWithProfiles(comments);
      setComments(commentsWithProfiles);
    });
  }

  function handleDeleteComment(commentId) {
    setDeleteId(commentId);
  }

  async function confirmDeleteComment() {
    if (!post || !deleteId) return;
    await onDeleteComment(post.id, deleteId);
    setDeleteId(null);
    getComments(post.id).then(async (comments) => {
      const commentsWithProfiles = await enrichCommentsWithProfiles(comments);
      setComments(commentsWithProfiles);
    });
  }

  function cancelDeleteComment() {
    setDeleteId(null);
  }

  return (
    <div className="bg-[#009ddb] text-white rounded-2xl shadow-lg w-full mt-4 p-4">
      <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto scrollbar-hide">
        {(comments || []).map((comment) => (
          <CommentItem
            key={comment.id}
            comment={mapCommentResponseToUI(comment)}
            isPostOwner={post?.authorId === currentUserId}
            currentUserId={currentUserId}
            isSuperAdmin={isSuperAdmin}
            isEditing={editingId === comment.id}
            editValue={editingValue}
            onEditStart={() => handleEditStart(comment)}
            onEditCancel={handleEditCancel}
            onEditSave={handleEditSave}
            onEditChange={setEditingValue}
            onDelete={handleDeleteComment}
          />
        ))}
        <div className="mt-2">
          <CommentForm onSubmit={handleAddComment} />
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
    </div>
  );
} 