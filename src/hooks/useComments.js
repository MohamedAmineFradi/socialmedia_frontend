import { useState, useCallback } from "react";
import {
  addComment as addCommentApi,
  editComment as editCommentApi,
  deleteComment as deleteCommentApi,
} from "@/services/commentService";

export default function useComments(postId, initialComments = [], currentUserId) {
  const [comments, setComments] = useState(initialComments);

  const handleAddComment = useCallback(async (commentText) => {
    const newComment = await addCommentApi(postId, currentUserId, { content: commentText });
    setComments((prev) => [...prev, newComment]);
    return newComment;
  }, [postId, currentUserId]);

  const handleEditComment = useCallback(async (commentId, newText) => {
    await editCommentApi(commentId, currentUserId, { content: newText });
    // Optionally, refetch or update local state
    setComments((prev) => prev.map(c => c.id === commentId ? { ...c, content: newText } : c));
  }, [currentUserId]);

  const handleDeleteComment = useCallback(async (commentId) => {
    await deleteCommentApi(commentId, currentUserId);
    setComments((prev) => prev.filter(c => c.id !== commentId));
  }, [currentUserId]);

  return {
    comments,
    setComments,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
  };
} 