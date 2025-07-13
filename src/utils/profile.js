// Utility to enrich comments with user profile info
import { getProfileByUserId } from "@/services/profileService";

export async function enrichCommentsWithProfiles(comments) {
  return Promise.all(
    comments.map(async (comment) => {
      if (comment.user && comment.user.profile) {
        return comment;
      }
      if (comment.userId) {
        try {
          const profile = await getProfileByUserId(comment.userId);
          return {
            ...comment,
            user: {
              ...comment.user,
              profile,
            },
          };
        } catch {
          return comment;
        }
      }
      return comment;
    })
  );
}

// Calculate minutes ago from timestamp
function calculateMinutesAgo(timestamp) {
  if (!timestamp) return 0;
  const now = new Date();
  const commentTime = new Date(timestamp);
  const diffInMs = now.getTime() - commentTime.getTime();
  return Math.floor(diffInMs / (1000 * 60));
}

// Consistent mapping from backend comment response to UI shape
export function mapCommentResponseToUI(comment) {
  return {
    ...comment,
    text: comment.content,
    author: comment.authorName || comment.user?.profile?.name || comment.user?.email || "User",
    authorId: comment.userId,
    username: comment.authorUsername || comment.user?.profile?.username,
    avatar: comment.user?.profile?.avatar,
    minutesAgo: calculateMinutesAgo(comment.createdAt),
  };
} 