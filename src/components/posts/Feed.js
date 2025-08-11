"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import PostCard from "./PostCard";
import CommentsModal from "./comments/CommentsModal";
import PostForm from "./PostForm";
import InlineComments from "./comments/InlineComments";
import usePosts from "@/hooks/usePosts";
import useUserDbId from "@/hooks/useUserDbId";
import { useAuth } from "@/components/auth/AuthProvider";
import api from "@/services/api";

export default function Feed() {
  const { userDbId, loadingUserId } = useUserDbId();
  const { isSuperAdmin } = useAuth();
  const [hasFetchedUserInfo, setHasFetchedUserInfo] = useState(false);

  const [pickerPostId, setPickerPostId] = useState(null);
  const [openComments, setOpenComments] = useState({});
  const [commentsRefresh, setCommentsRefresh] = useState({});

  const { posts, loading, handlePublish, handleEditPost, handleDeletePost } = usePosts(null);

  useEffect(() => {
    function handleToggleComments(e) {
      const { postId } = e.detail;
      setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    }
    function handleCommentsUpdated(e) {
      const { postId } = e.detail;
      setCommentsRefresh(prev => ({ ...prev, [postId]: (prev[postId] || 0) + 1 }));
    }
    window.addEventListener('toggleComments', handleToggleComments);
    window.addEventListener('commentsUpdated', handleCommentsUpdated);
    return () => {
      window.removeEventListener('toggleComments', handleToggleComments);
      window.removeEventListener('commentsUpdated', handleCommentsUpdated);
    };
  }, []);


  useEffect(() => {
    import('long-press-event');
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

  if (loadingUserId || loading || !userDbId) {
    return <div className="p-6 text-center">Loading posts...</div>;
  }

  return (
      <div className="relative z-10 flex flex-col gap-6">
        {/* Publish Post */}
      <PostForm onSubmit={handlePublish} userId={userDbId} />

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
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
                currentUserId={userDbId}
                isSuperAdmin={isSuperAdmin()}
              />
              {openComments[post.id] && (
                <InlineComments
                  post={post}
                  currentUserId={userDbId}
                  isSuperAdmin={isSuperAdmin()}
                  refreshKey={commentsRefresh[post.id] || 0}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
    </div>
  );
}
