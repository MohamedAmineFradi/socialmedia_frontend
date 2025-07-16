"use client";

import Feed from "../../components/posts/Feed";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function PostsPage() {
  return (
    <ProtectedRoute>
      <Feed />
    </ProtectedRoute>
  );
} 