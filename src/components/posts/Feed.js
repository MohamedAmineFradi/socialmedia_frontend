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
import { useAuth } from "@/components/auth/AuthProvider";
import api from "@/services/api";
// import 'long-press-event';

export default function Feed({ initialPosts = [] }) {
  useEffect(() => {
    import('long-press-event');
  }, []);

  const { user } = useAuth();
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [hasFetchedUserInfo, setHasFetchedUserInfo] = useState(false);

  const [pickerPostId, setPickerPostId] = useState(null);
  const [commentsPostId, setCommentsPostId] = useState(null);
  const [openComments, setOpenComments] = useState({});

  // Get the database user ID from backend
  useEffect(() => {
    if (user?.id && !hasFetchedUserInfo) {
      fetchUserInfo();
    }
  }, [user, hasFetchedUserInfo]);

  const fetchUserInfo = async () => {
    try {
      if (user?.id) {
        console.log('=== Feed Component - Fetching User Info ===');
        console.log('Keycloak user:', user);
        console.log('Keycloak user ID:', user.id);
        console.log('Keycloak user roles:', user.roles);
        
        try {
          const response = await api.get('/users/me');
          console.log('Backend response:', response.data);
          
          setCurrentUserId(response.data?.id);
          // Check if user is superAdmin
          const isAdmin = response.data?.roles?.includes('superAdmin') || false;
          setIsSuperAdmin(isAdmin);
          console.log('User roles from backend:', response.data?.roles, 'Is superAdmin:', isAdmin);
        } catch (error) {
          if (error.response?.status === 404) {
            console.log('User not found in database yet, using Keycloak user info');
            // Use Keycloak user info as fallback
            setCurrentUserId(1); // Fallback user ID
            const isAdmin = user.roles?.includes('superAdmin') || false;
            setIsSuperAdmin(isAdmin);
          } else {
            console.error('Failed to fetch user info:', error);
            // Fallback to first user in dev mode
            setCurrentUserId(1);
            setIsSuperAdmin(false);
          }
        }
        setHasFetchedUserInfo(true);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      // Fallback to first user in dev mode
      setCurrentUserId(1);
      // In dev mode, only set as admin if the user is actually admin
      // Don't automatically set everyone as superAdmin
      setIsSuperAdmin(false);
      setHasFetchedUserInfo(true);
    } finally {
      setLoading(false);
    }
  };

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

  if (loading) {
    return (
      <div className="relative flex flex-col gap-6 min-h-[600px] scrollbar-hide">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
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
        <PostForm onSubmit={handlePublish} userId={currentUserId} />

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
                currentUserId={currentUserId}
                isSuperAdmin={isSuperAdmin}
              />
              {openComments[post.id] && (
                <InlineComments
                  post={post}
                  onAddComment={handleAddComment}
                  onEditComment={handleEditComment}
                  onDeleteComment={handleDeleteComment}
                  currentUserId={currentUserId}
                  isSuperAdmin={isSuperAdmin}
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
