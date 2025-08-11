import api from './api';

export const getUserReactionForPost = async (postId, userId) => {
  if (!userId) {
    return null;
  }
  try {
    const { data } = await api.get(`/reactions/post/${postId}/user/${userId}`);
    return data;
  } catch (err) {
    return null;
  }
};

const EMPTY_ARRAY = [];

export const getPosts = async (currentUserId) => {
  const { data: posts } = await api.get('/posts');
  if (!currentUserId) {
    return posts.map(post => ({ ...post, userReaction: null }));
  }
  const postsWithUserReaction = await Promise.all(
    posts.map(async (post) => {
      const userReaction = await getUserReactionForPost(post.id, currentUserId);
      return {
        ...post,
        userReaction: userReaction ? { type: userReaction.type, id: userReaction.id } : null,
      };
    })
  );
  return postsWithUserReaction;
};

export const getUserPosts = async (userId) => {
  const { data } = await api.get(`/posts/user/${userId}`);
  return data;
};

export const addPost = async (userId, postData) => {
  const { data } = await api.post('/posts', postData);
  return data;
};

export const editPost = async (postId, userId, postData) => {
  const { data } = await api.put(`/posts/${postId}`, postData);
  return data;
};

export const deletePost = async (postId, userId) => {
  const { data } = await api.delete(`/posts/${postId}`);
  return data;
};

export const addReaction = async (postId, userId, reactionType) => {
  const { data } = await api.post(`/reactions/post/${postId}/user/${userId}`, { type: reactionType });
  return data;
};

export const deleteReaction = async (reactionId, userId) => {
  await api.delete(`/reactions/${reactionId}/user/${userId}`);
};