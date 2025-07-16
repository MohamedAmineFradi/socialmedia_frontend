import { useSelector, useDispatch } from 'react-redux';
import { fetchComments, addComment, editComment, deleteComment } from '@/store/commentsSlice';
import { useEffect, useRef, useMemo } from 'react';

export default function useComments(postId, currentUserId, refreshKey) {
  const dispatch = useDispatch();
  // Memoize the empty array and fallback object
  const EMPTY_ARRAY = useMemo(() => [], []);
  const EMPTY_STATE = useMemo(() => ({ items: EMPTY_ARRAY, loading: false, error: null }), [EMPTY_ARRAY]);
  const commentsState = useSelector(state => state.comments.byPost[postId] || EMPTY_STATE);
  const { items: comments, loading, error } = commentsState;

  const prevPostId = useRef();

  useEffect(() => {
    const postChanged = prevPostId.current !== postId;
    prevPostId.current = postId;

    // Ne fetch que si le post change OU si aucun commentaire en cache
    const cached = comments?.length > 0;
    if (postId && (postChanged || !cached || refreshKey !== undefined)) {
      dispatch(fetchComments(postId));
    }
  }, [postId, comments.length, dispatch, refreshKey]);

  const handleAddComment = (commentText) => dispatch(addComment({ postId, content: commentText }));
  const handleEditComment = (commentId, newText) => dispatch(editComment({ commentId, userId: currentUserId, commentData: { content: newText }, postId }));
  const handleDeleteComment = (commentId, postId) => dispatch(deleteComment({ commentId, postId, userId: currentUserId }));

  return {
    comments,
    loading,
    error,
    handleAddComment,
    handleEditComment,
    handleDeleteComment,
  };
} 