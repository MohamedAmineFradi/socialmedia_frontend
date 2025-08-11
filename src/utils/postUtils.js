// Utility functions for post data mapping and enrichment
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
  };
} 