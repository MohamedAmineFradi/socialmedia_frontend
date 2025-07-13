"use client";

import { useState, useEffect } from "react";
import Feed from "../../components/posts/Feed";
import { getPosts } from "@/services/postService";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPosts().then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading posts...</div>;
  }

  return (
    <ProtectedRoute>
      <Feed initialPosts={posts} />
    </ProtectedRoute>
  );
} 