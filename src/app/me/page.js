"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import UserPostsList from "@/components/posts/UserPostsList";
import api from "@/services/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserInfo();
    }
  }, [user]);

  const fetchUserInfo = async () => {
    try {
      // First, get the user info from backend to get the database user ID
      const response = await api.get('/users/me');
      setUserInfo(response.data);
      
      // Then fetch the profile using the database user ID
      if (response.data?.id) {
        await fetchProfile(response.data.id);
      }
    } catch (error) {
      console.error('Failed to fetch user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (userId) => {
    try {
      const response = await api.get(`/profiles/user/${userId}`);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      // Profile might not exist yet, which is okay
    }
  };

  const ProfileContent = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-[#009ddb] to-[#007bb5] rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.firstName} {user?.lastName}
            </h1>
            <p className="text-gray-600">@{user?.username}</p>
            <p className="text-gray-500">{user?.email}</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        ) : profile ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Posts</h3>
              <p className="text-2xl font-bold text-blue-600">{profile.postCount || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Comments</h3>
              <p className="text-2xl font-bold text-green-600">{profile.commentCount || 0}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Reactions</h3>
              <p className="text-2xl font-bold text-purple-600">{profile.reactionCount || 0}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-600">No profile information available.</p>
            <button 
              onClick={() => window.location.href = "/settings"}
              className="mt-4 bg-[#009ddb] hover:bg-[#007bb5] text-white font-bold py-2 px-6 rounded-full transition-colors">
              Create Profile
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Your Posts</h2>
        <UserPostsList userId={userInfo?.id} />
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
} 