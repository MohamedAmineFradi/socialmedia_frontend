"use client";

import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import useUserDbId from "@/hooks/useUserDbId";
import useProfile from "@/hooks/useProfile";
import api from "@/services/api";

export default function ProfileSidebar() {
  const router = useRouter();
  const { user, logout, refreshUserRoles, isSuperAdmin } = useAuth();
  const [hasRefreshedRoles, setHasRefreshedRoles] = useState(false);

  const { userDbId, loadingUserId } = useUserDbId();
  const { profile, loading } = useProfile(userDbId && !loadingUserId ? userDbId : null);

  useEffect(() => {
    if (profile) {
      console.log("ProfileSidebar: profile updated", profile);
    }
  }, [profile]);

  // Debug logging
  console.log('ProfileSidebar - Current user:', user);
  console.log('ProfileSidebar - User roles:', user?.roles);
  console.log('ProfileSidebar - Is superAdmin:', isSuperAdmin());
  console.log('ProfileSidebar - userDbId utilisé:', userDbId);

  if (loadingUserId || !userDbId) {
    return <div>Chargement du profil utilisateur...</div>;
  }

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
        <div className="w-20 h-20 rounded-full overflow-hidden mb-3 bg-white">
          <Image
            src={profile.avatar}
            alt="Profile avatar"
            width={80}
            height={80}
            className="w-20 h-20 object-cover"
          />
        </div>
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
