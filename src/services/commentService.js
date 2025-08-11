import api from './api';

export const getComments = async (postId) => {
  const { data } = await api.get(`/comments/post/${postId}`);
  return data;
};

export const addComment = async (postId, commentData) => {
  const { data } = await api.post(`/comments?postId=${postId}`, commentData);
  return data;
};

export const editComment = async (commentId, userId, commentData) => {
  const { data } = await api.put(
    `/comments/${commentId}/user/${userId}`,
    commentData,
    { headers: { 'Content-Type': 'application/json' } }
  );
  return data;
};

export const deleteComment = async (commentId, userId) => {
  await api.delete(`/comments/${commentId}/user/${userId}`);
}; 