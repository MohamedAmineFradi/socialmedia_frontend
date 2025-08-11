import { useSelector, useDispatch } from 'react-redux';
import { fetchGlobalPosts, fetchUserPosts, addPost, editPost, deletePost } from '@/store/postsSlice';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';

export default function usePosts(rawUserId = null) {
  const userId = rawUserId === null || rawUserId === undefined ? null : String(rawUserId);
  const dispatch = useDispatch();

  const { isAuthenticated } = useAuth();

  const EMPTY_ARRAY = [];
  const posts = useSelector(state =>
    userId ? state.posts.byUserId[userId] || EMPTY_ARRAY : state.posts.global
  );
  const loading = useSelector(state =>
    userId ? state.posts.loadingByUserId[userId] || false : state.posts.loadingGlobal
  );

  const loadedGlobal = useSelector(state => state.posts.loadedGlobal);
  const loadedByUser = useSelector(state => state.posts.loadedByUserId[userId]);

  const prevUserId = useRef();

  useEffect(() => {
    if (userId === null) {
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