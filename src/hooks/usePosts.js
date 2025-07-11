import { useState, useEffect, useCallback } from "react";
import {
  getPosts,
  addPost as addPostApi,
  editPost as editPostApi,
  deletePost as deletePostApi,
  addReaction as addReactionApi,
  deleteReaction as deleteReactionApi,
} from "@/services/postService";
import {
  addComment as addCommentApi,
  editComment as editCommentApi,
  deleteComment as deleteCommentApi,
} from "@/services/commentService";

export default function usePosts(currentUserId, initialPosts = []) {
  const [posts, setPosts] = useState(initialPosts);
  const [pendingReaction, setPendingReaction] = useState({}); // { [postId]: boolean }

  // Fetch posts on mount
  useEffect(() => {
    getPosts(currentUserId).then(setPosts);
  }, [currentUserId]);

  // Post CRUD
  const handlePublish = useCallback(async (content) => {
    const newPost = await addPostApi(currentUserId, { content });
    setPosts((prev) => [newPost, ...prev]);
  }, [currentUserId]);

  const handleEditPost = useCallback(async (postId, newContent) => {
    await editPostApi(postId, currentUserId, { content: newContent });
    getPosts(currentUserId).then(setPosts);
  }, [currentUserId]);

  const handleDeletePost = useCallback(async (postId) => {
    await deletePostApi(postId, currentUserId);
    setPosts((prev) => prev.filter(post => post.id !== postId));
  }, [currentUserId]);

  // Reaction logic
  const handlePickReaction = useCallback(async (postId, emoji) => {
    if (pendingReaction[postId]) return;
    setPendingReaction((prev) => ({ ...prev, [postId]: true }));
    const reactionType = emoji === "👍" ? "LIKE" : emoji === "👎" ? "DISLIKE" : null;
    if (!reactionType) {
      setPendingReaction((prev) => ({ ...prev, [postId]: false }));
      return;
    }
    const post = posts.find(p => p.id === postId);
    const userReaction = post.userReaction;
    if (userReaction && userReaction.type === reactionType) {
      // Defensive check and logging
      if (!userReaction.id) {
        console.error("userReaction.id is missing!", userReaction);
        setPendingReaction((prev) => ({ ...prev, [postId]: false }));
        // Optionally refetch posts for accuracy
        getPosts(currentUserId).then(setPosts);
        return;
      }
      // Optimistically update UI
      setPosts((prevPosts) => prevPosts.map(post =>
        post.id === postId ? { ...post, userReaction: null } : post
      ));
      await deleteReactionApi(userReaction.id, currentUserId);
    } else {
      setPosts((prevPosts) => prevPosts.map(post => {
        if (post.id !== postId) return post;
        let likes = post.likes || 0;
        let dislikes = post.dislikes || 0;
        if (reactionType === "LIKE") likes++;
        if (reactionType === "DISLIKE") dislikes++;
        return { ...post, likes, dislikes, userReaction: { type: reactionType } };
      }));
      await addReactionApi(postId, currentUserId, reactionType);
    }
    getPosts(currentUserId).then(setPosts);
    setPendingReaction((prev) => ({ ...prev, [postId]: false }));
  }, [currentUserId, pendingReaction, posts]);

  // Comment CRUD
  const handleAddComment = useCallback(async (postId, commentText) => {
    const newComment = await addCommentApi(postId, currentUserId, { content: commentText });
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, comments: [...(post.comments || []), newComment], commentCount: (post.commentCount || 0) + 1 }
          : post
      )
    );
  }, [currentUserId]);

  const handleEditComment = useCallback(async (postId, commentId, newText) => {
    await editCommentApi(commentId, currentUserId, { content: newText });
    getPosts(currentUserId).then(setPosts);
  }, [currentUserId]);

  const handleDeleteComment = useCallback(async (postId, commentId) => {
    await deleteCommentApi(commentId, currentUserId);
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? {
              ...post,
              comments: (post.comments || []).filter((c) => c.id !== commentId),
              commentCount: Math.max(0, (post.commentCount || 1) - 1),
            }
          : post
      )
    );
  }, [currentUserId]);

  return {
    posts,
    setPosts,
    pendingReaction,
    handlePublish,
    handleEditPost,
    handleDeletePost,
    handlePickReaction,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
  };
} 