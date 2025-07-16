import { useSelector, useDispatch } from 'react-redux';
import { fetchGlobalPosts, fetchUserPosts, addPost, editPost, deletePost } from '@/store/postsSlice';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function usePosts(rawUserId = null) {
  // Normalize key: use string for dictionary keys to avoid 1 vs "1" issues
  const userId = rawUserId === null || rawUserId === undefined ? null : String(rawUserId);
  const dispatch = useDispatch();

  // Need auth state to ensure we have JWT before hitting protected /posts endpoint
  const { isAuthenticated } = useAuth();

  const EMPTY_ARRAY = [];
  const posts = useSelector(state =>
    userId ? state.posts.byUserId[userId] || EMPTY_ARRAY : state.posts.global
  );
  const loading = useSelector(state =>
    userId ? state.posts.loadingByUserId[userId] || false : state.posts.loadingGlobal
  );

  // Flags whether we already loaded once
  const loadedGlobal = useSelector(state => state.posts.loadedGlobal);
  const loadedByUser = useSelector(state => state.posts.loadedByUserId[userId]);

  const prevUserId = useRef(); // kept for possible future but no clearing

  useEffect(() => {
    // No automatic cache clearing here – rely on resetPosts on logout

    // Fetch posts only if we don't have them yet and not already loading
    if (userId === null) {
      // Only fetch global feed after we are authenticated (token present)
      if (isAuthenticated && !loading && !loadedGlobal) {
        dispatch(fetchGlobalPosts());
      }
    } else if (userId) {
      if (isAuthenticated && !loading && !loadedByUser) {
        dispatch(fetchUserPosts(userId));
      }
    }

    prevUserId.current = userId;
  }, [userId, dispatch, loading, isAuthenticated, loadedGlobal, loadedByUser]);

  const handlePublish = (content) => dispatch(addPost({ userId, content }));
  const handleEditPost = (postId, content) => dispatch(editPost({ postId, userId, content }));
  const handleDeletePost = (postId, deleteUserId = userId) => dispatch(deletePost({ postId, userId: deleteUserId }));

  return {
    posts,
    loading,
    handlePublish,
    handleEditPost,
    handleDeletePost,
  };
} 