"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PostCard from "./PostCard";
import CommentsModal from "./comments/CommentsModal";
import { 
  getUserPosts, 
  editPost, 
  deletePost, 
  addReaction, 
  addComment 
} from "@/utils/localDataService";

const currentUserId = 1; // Simulated logged-in user

export default function UserPostsList() {
  const [userPosts, setUserPosts] = useState([]);
  const [commentsPostId, setCommentsPostId] = useState(null);
  const [pickerPostId, setPickerPostId] = useState(null);

  useEffect(() => {
    // Get posts from local storage
    const posts = getUserPosts();
    setUserPosts(posts);
  }, []);

  function handleCommentsClick(postId) {
    setCommentsPostId(postId);
  }

  function handleCloseComments() {
    setCommentsPostId(null);
  }

  function handleLongPress(postId) {
    setPickerPostId(postId);
  }
  
  function handleClosePicker() {
    setPickerPostId(null);
  }

  function handlePickReaction(postId, emoji) {
    // Update local storage
    addReaction(postId, emoji);
    
    // Update UI
    setUserPosts((prevPosts) =>
      prevPosts.map((post) => {
        if (post.id !== postId) return post;
        if (emoji === "👍") {
          return { ...post, likes: post.likes + 1 };
        } else if (emoji === "👎") {
          return { ...post, dislikes: post.dislikes + 1 };
        }
        return post;
      })
    );
    setPickerPostId(null);
  }

  function handleEditPost(postId, newContent) {
    // Update local storage
    editPost(postId, newContent);
    
    // Update UI
    setUserPosts(userPosts.map(post => 
      post.id === postId 
        ? { ...post, content: newContent }
        : post
    ));
  }

  function handleDeletePost(postId) {
    // Update local storage
    deletePost(postId);
    
    // Update UI
    setUserPosts(userPosts.filter(post => post.id !== postId));
  }

  function handleAddComment(postId) {
    // Update local storage is handled in CommentsModal
    
    // Update UI
    setUserPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, commentCount: (post.commentCount || 0) + 1 } : post
      )
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
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Comments Drawer */}
      <CommentsModal
        open={commentsPostId !== null}
        onClose={handleCloseComments}
        post={userPosts.find((p) => p.id === commentsPostId)}
        onAddComment={() => handleAddComment(commentsPostId)}
      />
    </div>
  );
} 