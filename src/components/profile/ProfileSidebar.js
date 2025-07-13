"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getProfileByUserId } from "@/services/profileService";
import api from "@/services/api";

export default function ProfileSidebar() {
  const router = useRouter();
  const { user, logout, refreshUserRoles, isSuperAdmin } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasRefreshedRoles, setHasRefreshedRoles] = useState(false);

  // Debug logging
  console.log('ProfileSidebar - Current user:', user);
  console.log('ProfileSidebar - User roles:', user?.roles);
  console.log('ProfileSidebar - Is superAdmin:', isSuperAdmin());

  useEffect(() => {
    if (user?.id && !hasRefreshedRoles) {
      fetchUserAndProfile();
    }
  }, [user, hasRefreshedRoles]);

  const fetchUserAndProfile = async () => {
    try {
      setLoading(true);
      
      // First, refresh user roles from backend (only once)
      if (!hasRefreshedRoles) {
        await refreshUserRoles();
        setHasRefreshedRoles(true);
      }
      
      // Then, get the user info from backend to get the database user ID
      try {
        const userResponse = await api.get('/users/me');
        const userInfo = userResponse.data;
        
        if (userInfo?.id) {
          // Then fetch the profile using the database user ID
          const profileData = await getProfileByUserId(userInfo.id);
          setProfile(profileData);
        }
      } catch (error) {
        if (error.response?.status === 404) {
          console.log('User not found in database yet, this is normal during first login');
        } else {
          console.error('Failed to fetch user info:', error);
        }
      }
    } catch (error) {
      console.error('Failed to fetch user or profile:', error);
      // Don't keep retrying on error to prevent infinite loops
      setHasRefreshedRoles(true);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProfile = () => {
    router.push("/me");
  };

  const handleSignOut = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error('Logout failed:', error);
      router.push("/");
    }
  };

  if (loading) {
    return (
      <div className="bg-[#009ddb] rounded-2xl shadow p-6 flex flex-col items-center border border-[#009ddb]/10 animate-pulse">
        <div className="w-20 h-20 rounded-full bg-white mb-3" />
        <div className="h-5 w-32 bg-gray-200 rounded mb-2" />
        <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
        <div className="flex gap-6 text-center mb-4">
          <div>
            <div className="h-4 w-8 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-12 bg-gray-200 rounded" />
          </div>
          <div>
            <div className="h-4 w-8 bg-gray-200 rounded mb-1" />
            <div className="h-3 w-12 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <div className="h-10 w-1/2 bg-gray-200 rounded-full" />
          <div className="h-10 w-1/2 bg-gray-200 rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#009ddb] rounded-2xl shadow p-6 flex flex-col items-center border border-[#009ddb]/10">
      {/* Avatar */}
      {profile?.avatar ? (
        <img
          src={profile.avatar}
          alt="Profile avatar"
          className="w-20 h-20 rounded-full object-cover mb-3 bg-white"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-white mb-3 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#009ddb]">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
          </span>
        </div>
      )}
      <h2 className="text-lg font-bold text-white">{profile?.name || `${user?.firstName} ${user?.lastName}` || "Unknown User"}</h2>
      <p className="text-sm text-gray-200 mb-4">{profile?.bio || "No bio provided."}</p>
      
      {/* Role indicator for debugging */}
      <div className="text-xs text-yellow-300 mb-4">
        Role: {user?.roles?.includes('superAdmin') ? '👑 SuperAdmin' : '👤 User'}
      </div>

      <div className="flex gap-6 text-center mb-4">
        <div>
          <div className="text-[#fb5c1d] font-bold">34</div>
          <div className="text-xs text-gray-200">Following</div>
        </div>
        <div>
          <div className="text-[#fb5c1d] font-bold">155</div>
          <div className="text-xs text-gray-200">Followers</div>
        </div>
      </div>

      <aside className="flex gap-4">
        <button 
          onClick={handleViewProfile}
          className="bg-[#fb5c1d] hover:bg-[#fde848] text-white font-bold py-2 px-6 rounded-full transition-colors"
        >
          View Profile
        </button> 
        <button 
        onClick={handleSignOut}
        className="bg-[#000000] hover:bg-[#434343] text-white font-bold py-2 px-6 rounded-full transition-colors">
          Sign Out
        </button>
      </aside>
    </div>
  );
}
