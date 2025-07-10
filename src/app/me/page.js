"use client";

import { Suspense } from "react";
import ProfileHeader from "@/components/profile/ProfileHeader";
import UserStats from "@/components/profile/UserStats";
import UserPostsList from "@/components/posts/UserPostsList";
import CommentsModal from "@/components/posts/comments/CommentsModal";

export default function ProfilePage() {
  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl font-bold text-[#009ddb]">Your Profile</h1>
      
      <ProfileHeader />
      
      <UserStats />
      
      <div className="mt-8">
        <h2 className="text-xl font-bold text-[#009ddb] mb-4">Your Posts</h2>
        <Suspense fallback={<div className="p-6 text-center">Loading your posts...</div>}>
          <UserPostsList />
        </Suspense>
      </div>
    </div>
  );
} 