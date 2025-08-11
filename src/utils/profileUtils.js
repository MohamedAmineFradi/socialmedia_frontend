// Utility functions for profile data mapping and enrichment

export function mapProfileResponseToUI(profile) {
  return {
    id: profile.id,
    userId: profile.userId,
    name: profile.name,
    avatar: profile.avatar,
    bio: profile.bio,
    username: profile.username,
  };
} 