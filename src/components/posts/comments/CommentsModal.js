"use client";

import { useState } from "react";
import PropTypes from "prop-types";
import CommentItem from "./CommentItem";
import CommentModal from "./CommentModal";
import CommentForm from "./CommentForm";
import ConfirmModal from "@/components/ui/ConfirmModal";
import useComments from "@/hooks/useComments";

export default function CommentsModal({ open, onClose, post, currentUserId }) {
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const { comments, loading, handleAddComment, handleEditComment, handleDeleteComment } = useComments(post?.id, currentUserId);

  if (!open) return null;

  async function handleAdd(text) {
    await handleAddComment(text);
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
    await handleEditComment(commentId, newText);
    setEditingId(null);
    setEditingValue("");
  }

  function handleDelete(commentId) {
    setDeleteId(commentId);
  }

  async function confirmDelete() {
    if (deleteId) {
      await handleDeleteComment(deleteId, post.id);
      setDeleteId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={onClose}>&times;</button>
        <h2 className="text-xl font-bold mb-4">Commentaires</h2>
        {loading ? (
          <div className="text-center text-gray-500">Chargement des commentaires...</div>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onEdit={() => handleEditStart(comment)}
              onDelete={() => handleDelete(comment.id)}
              isEditing={editingId === comment.id}
              editingValue={editingValue}
              onEditCancel={handleEditCancel}
              onEditSave={handleEditSave}
              currentUserId={currentUserId}
            />
          ))
        )}
        <CommentForm onSubmit={handleAdd} />
        <ConfirmModal
          open={!!deleteId}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Supprimer le commentaire ?"
          description="Cette action est irréversible."
        />
      </div>
    </div>
  );
}

CommentsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  post: PropTypes.object,
  currentUserId: PropTypes.number.isRequired,
}; 