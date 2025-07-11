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

// Consistent mapping from backend comment response to UI shape
export function mapCommentResponseToUI(comment) {
  return {
    ...comment,
    text: comment.content,
    author: comment.user?.profile?.name || comment.user?.email || "User",
    authorId: comment.userId,
    avatar: comment.user?.profile?.avatar,
    minutesAgo: 0, // TODO: calculate from createdAt
  };
} 