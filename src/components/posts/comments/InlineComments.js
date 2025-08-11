"use client";
import { useState } from "react";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import ConfirmModal from "@/components/ui/ConfirmModal";
import useComments from "@/hooks/useComments";

export default function InlineComments({ post, currentUserId, isSuperAdmin, refreshKey }) {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const { comments, loading, handleAddComment, handleEditComment, handleDeleteComment } = useComments(post?.id, currentUserId, refreshKey);

  async function handleAdd(text) {
    await handleAddComment(text);
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('commentsUpdated', { detail: { postId: post.id } }));
    }
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
    try {
      await handleEditComment(commentId, newText);
      setEditingId(null);
      setEditingValue("");
    } catch (err) {
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('commentsUpdated', { detail: { postId: post.id } }));
      }
    }
  }

  function handleDelete(commentId) {
    setDeleteId(commentId);
  }

  async function confirmDelete() {
    if (deleteId) {
      await handleDeleteComment(deleteId, post.id);
      setDeleteId(null);
      if (typeof window !== 'undefined' && window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('commentsUpdated', { detail: { postId: post.id } }));
      }
    }
  }

  if (loading) {
    return <div className="p-4 text-center text-gray-500">Chargement des commentaires...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow p-4 mt-2">
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          isPostOwner={post.userId === currentUserId}
          currentUserId={currentUserId}
          isSuperAdmin={typeof isSuperAdmin === 'function' ? isSuperAdmin() : !!isSuperAdmin}
          isEditing={editingId === comment.id}
          editValue={editingValue}
          onEditStart={() => handleEditStart(comment)}
          onEditCancel={handleEditCancel}
          onEditSave={handleEditSave}
          onEditChange={setEditingValue}
          onDelete={() => handleDelete(comment.id)}
        />
      ))}
      <CommentForm onSubmit={handleAdd} />
      <ConfirmModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={confirmDelete}
        title="Supprimer le commentaire ?"
        description="Cette action est irréversible."
      />
    </div>
  );
} 