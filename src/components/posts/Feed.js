"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import PostCard from "./PostCard";
import CommentsDrawer from "./CommentsDrawer";
import PostForm from "./PostForm";
import { addPost, editPost, deletePost, addReaction, addComment } from "@/utils/localDataService";
// import 'long-press-event';

const currentUserId = 1; // Simulated logged-in user

export default function Feed({ initialPosts = [] }) {
  useEffect(() => {
    import('long-press-event');
  }, []);
  
  const [posts, setPosts] = useState(initialPosts);
  const [pickerPostId, setPickerPostId] = useState(null);
  const [commentsPostId, setCommentsPostId] = useState(null);

  function handlePublish(content) {
    // Add post to local storage (handled in PostForm)
    // Just update UI here
    const newPost = addPost(content);
    setPosts([newPost, ...posts]);
  }

  function handleLongPress(postId) {
    setPickerPostId(postId);
  }
  
  function handleClosePicker() {
    setPickerPostId(null);
  }

  function handleCommentsClick(postId) {
    setCommentsPostId(postId);
  }

  function handleCloseComments() {
    setCommentsPostId(null);
  }

  function handlePickReaction(postId, emoji) {
    // Update in local storage
    addReaction(postId, emoji);
    
    // Update UI
    setPosts((prevPosts) =>
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

  // Post CRUD
  function handleEditPost(postId, newContent) {
    // Update in local storage
    editPost(postId, newContent);
    
    // Update UI
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, content: newContent }
        : post
    ));
  }

  function handleDeletePost(postId) {
    // Update in local storage
    deletePost(postId);
    
    // Update UI
    setPosts(posts.filter(post => post.id !== postId));
  }

  // Comment CRUD
  function handleAddComment(postId) {
    // Update UI
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, commentCount: (post.commentCount || 0) + 1 } : post
      )
    );
  }

  return (
    <div className="relative flex flex-col gap-6 min-h-[600px]">
      {/* Background Logo */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0">
        <Image
          src="/logo_with_transperent_bg.png"
          alt=""
          width={500}
          height={500}
          className="opacity-10"
          aria-hidden="true"
          loading="lazy"
          priority={false}
        />
      </div>

      {/* Feed Content */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Publish Post */}
        <PostForm onSubmit={handlePublish} />

        {/* Posts */}
        <AnimatePresence>
          {posts.map((post) => (
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
      </div>
      {/* Comments Drawer */}
      <CommentsDrawer
        open={commentsPostId !== null}
        onClose={handleCloseComments}
        post={posts.find((p) => p.id === commentsPostId)}
        onAddComment={() => handleAddComment(commentsPostId)}
      />
    </div>
  );
}
