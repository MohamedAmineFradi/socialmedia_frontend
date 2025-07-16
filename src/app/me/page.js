"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserPostsList from "@/components/posts/UserPostsList";
import ProfileHeader from "@/components/profile/ProfileHeader";

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileHeader />
      <UserPostsList />
    </ProtectedRoute>
  );
} 