"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PostCard from "./PostCard";
import InlineComments from "./comments/InlineComments";
import usePosts from "@/hooks/usePosts";
import useUserDbId from "@/hooks/useUserDbId";
import { useAuth } from "@/components/auth/AuthProvider";
import api from "@/services/api";

export default function UserPostsList() {
  const { user, isSuperAdmin } = useAuth();
  const { userDbId, loadingUserId } = useUserDbId();
  const [pickerPostId, setPickerPostId] = useState(null);
  const [openComments, setOpenComments] = useState({});

  useEffect(() => {
    function handleToggleComments(e) {
      const { postId } = e.detail;
      setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    }
    window.addEventListener('toggleComments', handleToggleComments);
    return () => {
      window.removeEventListener('toggleComments', handleToggleComments);
    };
  }, []);

  // Utilise le hook Redux pour les posts
  const { posts, loading, handlePublish, handleEditPost, handleDeletePost } = usePosts(userDbId && !loadingUserId ? userDbId : null);

  useEffect(() => {
    if (user?.id && !userDbId) {
      // This case should ideally not happen if useUserDbId is always called
      // but as a fallback, we can set a default or throw an error.
      // For now, we'll just ensure userDbId is set if user is available.
      // If user is available but userDbId is not, it means useUserDbId failed to fetch.
      // We can add a check here to set a default if needed.
    }
  }, [user, userDbId]);

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
              />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 