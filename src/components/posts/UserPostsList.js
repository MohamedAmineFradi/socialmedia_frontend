"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PostCard from "./PostCard";
import InlineComments from "./comments/InlineComments";
import { getUserPosts, editPost as editPostApi, deletePost as deletePostApi, addReaction as addReactionApi } from "@/services/postService";
import { addComment as addCommentApi, editComment as editCommentApi, deleteComment as deleteCommentApi } from "@/services/commentService";
import { useAuth } from "@/components/auth/AuthProvider";
import api from "@/services/api";

export default function UserPostsList() {
  const { user } = useAuth();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [pickerPostId, setPickerPostId] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [loading, setLoading] = useState(true);
  const [hasFetchedUserInfo, setHasFetchedUserInfo] = useState(false);

  // Get the database user ID from backend
  useEffect(() => {
    if (user?.id && !hasFetchedUserInfo) {
      fetchUserInfo();
    }
  }, [user, hasFetchedUserInfo]);

  const fetchUserInfo = async () => {
    try {
      if (user?.id) {
        const response = await api.get('/users/me');
        setCurrentUserId(response.data?.id);
        setHasFetchedUserInfo(true);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Fallback to first user in dev mode
      setCurrentUserId(1);
      setHasFetchedUserInfo(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      getUserPosts(currentUserId).then(setUserPosts);
    }
  }, [currentUserId]);

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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your posts...</p>
      </div>
    );
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
              currentUserId={currentUserId}
            />
            {openComments[post.id] && (
              <InlineComments
                post={post}
                onAddComment={handleAddComment}
                onEditComment={handleEditComment}
                onDeleteComment={handleDeleteComment}
                currentUserId={currentUserId}
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 