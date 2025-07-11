"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PostCard from "./PostCard";
import InlineComments from "./comments/InlineComments";
import { getUserPosts, editPost as editPostApi, deletePost as deletePostApi, addReaction as addReactionApi } from "@/services/postService";
import { addComment as addCommentApi, editComment as editCommentApi, deleteComment as deleteCommentApi } from "@/services/commentService";

const currentUserId = 1; // Simulated logged-in user

export default function UserPostsList() {
  const [userPosts, setUserPosts] = useState([]);
  const [pickerPostId, setPickerPostId] = useState(null);
  const [openComments, setOpenComments] = useState({});

  useEffect(() => {
    getUserPosts(currentUserId).then(setUserPosts);
  }, []);

  function handleCommentsClick(postId) {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  function handleLongPress(postId) {
    setPickerPostId(postId);
  }
  
  function handleClosePicker() {
    setPickerPostId(null);
  }

  async function handlePickReaction(postId, emoji) {
    const reactionType = emoji === "👍" ? "LIKE" : emoji === "👎" ? "DISLIKE" : null;
    if (!reactionType) return;
    // Optimistically update UI
    setUserPosts((prevPosts) => prevPosts.map(post => {
      if (post.id !== postId) return post;
      let likes = post.likes || 0;
      let dislikes = post.dislikes || 0;
      let userReaction = reactionType;
      if (reactionType === "LIKE") likes++;
      if (reactionType === "DISLIKE") dislikes++;
      return { ...post, likes, dislikes, userReaction };
    }));
    await addReactionApi(postId, currentUserId, reactionType);
    getUserPosts(currentUserId).then(setUserPosts);
    setPickerPostId(null);
  }

  async function handleEditPost(postId, newContent) {
    await editPostApi(postId, currentUserId, { content: newContent });
    getUserPosts(currentUserId).then(setUserPosts);
  }

  async function handleDeletePost(postId) {
    await deletePostApi(postId, currentUserId);
    setUserPosts(userPosts.filter(post => post.id !== postId));
  }

  async function handleAddComment(postId, text) {
    await addCommentApi(postId, currentUserId, { content: text });
    getUserPosts(currentUserId).then(setUserPosts);
  }

  async function handleEditComment(postId, commentId, newText) {
    await editCommentApi(commentId, currentUserId, { content: newText });
    getUserPosts(currentUserId).then(setUserPosts);
  }

  async function handleDeleteComment(postId, commentId) {
    await deleteCommentApi(commentId, currentUserId);
    getUserPosts(currentUserId).then(setUserPosts);
  }

  if (userPosts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-center">
        <p className="text-gray-500">You haven&apos;t created any posts yet.</p>
        <button 
          onClick={() => window.location.href = '/posts'}
          className="mt-4 bg-[#fb5c1d] hover:bg-[#fa5c1a] text-white font-bold py-2 px-6 rounded-full transition-colors"
        >
          Create Your First Post
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence>
        {userPosts.map((post) => (
          <motion.div
            key={post.id}
            layout
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <PostCard
              post={post}
              onLongPress={() => handleLongPress(post.id)}
              showPicker={pickerPostId === post.id}
              onClosePicker={handleClosePicker}
              onPickReaction={(emoji) => handlePickReaction(post.id, emoji)}
              onCommentsClick={() => handleCommentsClick(post.id)}
              isCommentsOpen={!!openComments[post.id]}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              userReaction={post.userReaction}
            />
            {openComments[post.id] && (
              <InlineComments
                post={post}
                onAddComment={handleAddComment}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 