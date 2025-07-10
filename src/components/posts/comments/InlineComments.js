"use client";
import { useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import ConfirmModal from "@/components/ui/ConfirmModal";

const currentUserId = 1; // Simulated logged-in user

export default function InlineComments({ post, onAddComment, onEditComment, onDeleteComment }) {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  function handleAddComment(text) {
    if (!post) return;
    const user = { ...post, ...post.profile };
    const tempId = `temp_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const commentObj = {
      id: tempId,
      author: user.author || user.name,
      authorId: user.authorId || user.id,
      avatar: user.avatar,
      content: text,
      minutesAgo: 0,
    };
    onAddComment(post.id, commentObj);
  }

  function handleEditStart(comment) {
    setEditingId(comment.id);
    setEditingValue(comment.content);
  }

  function handleEditCancel() {
    setEditingId(null);
    setEditingValue("");
  }

  function handleEditSave(commentId, newText) {
    if (!post) return;
    onEditComment(post.id, commentId, newText);
    setEditingId(null);
    setEditingValue("");
  }

  function handleDeleteComment(commentId) {
    setDeleteId(commentId);
  }

  function confirmDeleteComment() {
    if (!post || !deleteId) return;
    onDeleteComment(post.id, deleteId);
    setDeleteId(null);
  }

  function cancelDeleteComment() {
    setDeleteId(null);
  }

  return (
    <div className="bg-[#009ddb] text-white rounded-2xl shadow-lg w-full mt-4 p-4">
      <div className="flex flex-col gap-4 max-h-[40vh] overflow-y-auto scrollbar-hide">
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