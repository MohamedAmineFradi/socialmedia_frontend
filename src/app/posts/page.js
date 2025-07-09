"use client";

import { useState, useEffect } from "react";
import Feed from "../../components/posts/Feed";
import { getUserPosts } from "@/utils/localDataService";

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get posts from local storage
    const userPosts = getUserPosts();
    setPosts(userPosts);
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Loading posts...</div>;
  }

  return <Feed initialPosts={posts} />;
} 