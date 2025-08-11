// Utility functions for comment data mapping and enrichment

export function mapCommentResponseToUI(comment) {
  return {
    id: comment.id,
    postId: comment.postId,
    userId: comment.userId,
    content: comment.content,
    createdAt: comment.createdAt,
  };
} 