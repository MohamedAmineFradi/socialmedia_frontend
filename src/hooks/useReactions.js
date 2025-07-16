"use client";
import { useSelector, useDispatch } from 'react-redux';
import { addReaction, deleteReaction, clearReactions } from '@/store/reactionsSlice';
import { useEffect, useRef } from 'react';

export default function useReactions(postId) {
  const dispatch = useDispatch();
  const pending = useSelector(state => state.reactions.pending[postId] || false);

  const prevPostId = useRef();

  useEffect(() => {
    if (prevPostId.current && prevPostId.current !== postId) {
      dispatch(clearReactions());
    }
    prevPostId.current = postId;
  }, [postId, dispatch]);

  const handleAddReaction = (userId, reactionType) => {
    dispatch(addReaction({ postId, userId, reactionType }));
  };

  const handleDeleteReaction = (reactionId, userId) => {
    dispatch(deleteReaction({ reactionId, userId, postId }));
  };

  return {
    pending,
    handleAddReaction,
    handleDeleteReaction,
  };
} 