"use client";

import { useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";
import { getUser } from "@/services/userService";
// TODO: Replace with real backend stats API when available

export default function UserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    posts: 0,
    comments: 0,
    likes: 0, // Not available in backend, keep as 0 or fetch if available
    followers: 0, // Not available in backend, keep as 0 or fetch if available
    following: 0 // Not available in backend, keep as 0 or fetch if available
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (user?.id) {
        try {
          const userData = await getUser(user.id);
          setStats({
            posts: userData.postCount || 0,
            comments: userData.commentCount || 0,
            likes: userData.reactionCount || 0,
            followers: 0, // TODO: brancher si dispo
            following: 0  // TODO: brancher si dispo
          });
        } catch (error) {
          setStats({ posts: 0, comments: 0, likes: 0, followers: 0, following: 0 });
        }
      }
    };
    fetchStats();
  }, [user?.id]);

  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
      <h3 className="text-lg font-bold text-[#009ddb] mb-4">Your Activity</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-2xl font-bold text-[#fb5c1d]">{stats.posts}</span>
          <span className="text-xs text-gray-500">Posts</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-2xl font-bold text-[#fb5c1d]">{stats.comments}</span>
          <span className="text-xs text-gray-500">Comments</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-2xl font-bold text-[#fb5c1d]">{stats.likes}</span>
          <span className="text-xs text-gray-500">Likes</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-2xl font-bold text-[#fb5c1d]">{stats.followers}</span>
          <span className="text-xs text-gray-500">Followers</span>
        </div>
        
        <div className="flex flex-col items-center p-3 bg-gray-50 rounded-lg">
          <span className="text-2xl font-bold text-[#fb5c1d]">{stats.following}</span>
          <span className="text-xs text-gray-500">Following</span>
        </div>
      </div>
    </div>
  );
} 