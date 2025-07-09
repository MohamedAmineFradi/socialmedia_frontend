"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { addComment, editComment, deleteComment } from "@/utils/localDataService";

const currentUserId = 1; // Simulated logged-in user

export default function CommentsDrawer({ open, onClose, post, onAddComment }) {
  const [comments, setComments] = useState([]);

  // Load comments when post changes
  useEffect(() => {
    if (post && post.comments) {
      setComments(post.comments);
    }
  }, [post]);

  // Check if current user is the post owner
  const isPostOwner = post?.authorId === currentUserId;

  function handleAddComment(text) {
    if (!post) return;
    
    // Update in local storage
    const newComment = addComment(post.id, text);
    
    // Update UI
    setComments([
      ...comments,
      { 
        id: newComment.id, 
        author: newComment.author, 
        authorId: newComment.authorId, 
        text: newComment.content, 
        minutesAgo: 0 
      },
    ]);
    
    if (onAddComment) onAddComment();
  }

  function handleEditComment(commentId, newText) {
    if (!post) return;
    
    // Update in local storage
    editComment(post.id, commentId, newText);
    
    // Update UI
    setComments(
      comments.map(c => 
        c.id === commentId 
          ? { ...c, text: newText } 
          : c
      )
    );
  }

  function handleDeleteComment(commentId) {
    if (!post) return;
    
    // Update in local storage
    deleteComment(post.id, commentId);
    
    // Update UI
    setComments(comments.filter(c => c.id !== commentId));
  }

  const variants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
    exit: { y: "100%" },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 z-50 h-[70vh] flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
          >
            <header className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#009ddb]">Comments</h3>
              <button
                type="button"
                onClick={onClose}
                className="text-xl text-gray-400 hover:text-[#fb5c1d]"
              >
                ✕
              </button>
            </header>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  isPostOwner={isPostOwner}
                  currentUserId={currentUserId}
                  onEdit={handleEditComment}
                  onDelete={handleDeleteComment}
                />
              ))}
            </div>

            {/* Add comment */}
            <CommentForm onSubmit={handleAddComment} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

CommentsDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  post: PropTypes.object,
  onAddComment: PropTypes.func,
}; 