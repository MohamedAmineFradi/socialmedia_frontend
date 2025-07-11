// Utility functions for post data mapping and enrichment

/**
 * Maps a backend post response to the UI shape expected by components.
 * @param {Object} post - The post object from the backend
 * @returns {Object} - The mapped/enriched post object
 */
export function mapPostResponseToUI(post) {
  return {
    id: post.id,
    content: post.content,
    authorId: post.authorId,
    likes: post.likes || 0,
    dislikes: post.dislikes || 0,
    commentCount: post.commentCount || 0,
    userReaction: post.userReaction || null,
    comments: post.comments || [],
    createdAt: post.createdAt,
    // Add more fields as needed
  };
} 