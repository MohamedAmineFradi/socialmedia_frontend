"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getProfileByUserId } from "@/services/profileService";
import api from "@/services/api";

export default function ProfileHeader() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserAndProfile();
    }
  }, [user]);

  const fetchUserAndProfile = async () => {
    try {
      // First, get the user info from backend to get the database user ID
      const userResponse = await api.get('/users/me');
      const userInfo = userResponse.data;
      
      if (userInfo?.id) {
        // Then fetch the profile using the database user ID
        const profileData = await getProfileByUserId(userInfo.id);
        setProfile(profileData);
      }
    } catch (error) {
      console.error('Failed to fetch user or profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
        <div className="text-center py-8">
          <p className="text-gray-600">No profile information available.</p>
          <button 
            onClick={() => window.location.href = "/settings"}
            className="mt-4 bg-[#009ddb] hover:bg-[#007bb5] text-white font-bold py-2 px-6 rounded-full transition-colors">
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
      <div className="flex items-start gap-4">
        {/* Profile picture */}
        <div className="w-24 h-24 rounded-full bg-[#009ddb] flex-shrink-0 overflow-hidden">
          <img src={profile.avatar} alt="avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-[#009ddb]">{profile.name}</h2>
              <p className="text-sm text-gray-500">{profile.username}</p>
            </div>
            <button 
              onClick={() => window.location.href = "/settings"}
              className="bg-[#fb5c1d] hover:bg-[#fde848] text-white font-bold py-2 px-6 rounded-full transition-colors">
              Edit Profile
            </button>
          </div>
          <p className="mt-3 text-gray-700">{profile.bio}</p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            {profile.location && (
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>{profile.location}</span>
              </div>
            )}
            {profile.website && (
              <div className="flex items-center gap-1">
                <span>🔗</span>
                <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-[#009ddb] hover:underline">
                  {profile.website}
                </a>
              </div>
            )}
            {profile.birthday && (
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>Birthday {profile.birthday}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 