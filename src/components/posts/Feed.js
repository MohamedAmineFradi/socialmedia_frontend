"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import PostCard from "./PostCard";
import CommentsModal from "./comments/CommentsModal";
import PostForm from "./PostForm";
import { getPosts, addPost as addPostApi, editPost as editPostApi, deletePost as deletePostApi, addReaction as addReactionApi, deleteReaction as deleteReactionApi } from "@/services/postService";
import { getComments, addComment as addCommentApi, editComment as editCommentApi, deleteComment as deleteCommentApi } from "@/services/commentService";
import InlineComments from "./comments/InlineComments";
import usePosts from "@/hooks/usePosts";
// import 'long-press-event';

const currentUserId = 1; // Simulated logged-in user

export default function Feed({ initialPosts = [] }) {
  useEffect(() => {
    import('long-press-event');
  }, []);

  const [pickerPostId, setPickerPostId] = useState(null);
  const [commentsPostId, setCommentsPostId] = useState(null);
  const [openComments, setOpenComments] = useState({});

  const {
    posts,
    pendingReaction,
    handlePublish,
    handleEditPost,
    handleDeletePost,
    handlePickReaction,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
  } = usePosts(currentUserId, initialPosts);

  function handleLongPress(postId) {
    setPickerPostId(postId);
  }

  function handleClosePicker() {
    setPickerPostId(null);
  }

  function handleCommentsClick(postId) {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  function handleCloseComments() {
    setCommentsPostId(null);
  }

  return (
    <div className="relative flex flex-col gap-6 min-h-[600px] scrollbar-hide">
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
                userReaction={post.userReaction}
                pendingReaction={pendingReaction[post.id]}
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
    </div>
  );
}
