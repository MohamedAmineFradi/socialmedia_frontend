import api from './api';

// Fetch the current user's reaction for a post
export const getUserReactionForPost = async (postId, userId) => {
  if (!userId) {
    console.warn("getUserReactionForPost called with undefined userId", { postId, userId });
    return null;
  }
  try {
    const { data } = await api.get(`/reactions/post/${postId}/user/${userId}`);
    return data; // { id, type, ... }
  } catch (err) {
    // 404 means no reaction
    return null;
  }
};

export const getPosts = async (currentUserId) => {
  const { data: posts } = await api.get('/posts');
  // Attach userReaction (type + id) to each post
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
  const { data } = await api.post(`/posts/user/${userId}`, postData);
  return data;
};

export const editPost = async (postId, userId, postData) => {
  const { data } = await api.put(`/posts/${postId}/user/${userId}`, postData);
  return data;
};

export const deletePost = async (postId, userId) => {
  const { data } = await api.delete(`/posts/${postId}/user/${userId}`);
  return data;
};

// Reaction endpoint requires userId
export const addReaction = async (postId, userId, reactionType) => {
  const { data } = await api.post(`/reactions/post/${postId}/user/${userId}`, { type: reactionType });
  return data;
};

// Delete a reaction by reactionId and userId
export const deleteReaction = async (reactionId, userId) => {
  await api.delete(`/reactions/${reactionId}/user/${userId}`);
}; 