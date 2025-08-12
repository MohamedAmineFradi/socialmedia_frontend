"use client";

import Image from 'next/image';
import useUserDbId from "@/hooks/useUserDbId";
import useProfile from "@/hooks/useProfile";
import { useEffect } from "react";

export default function ProfileHeader() {
  const { userDbId, loadingUserId } = useUserDbId();
  const { profile, loading, error } = useProfile(userDbId && !loadingUserId ? userDbId : null);

  useEffect(() => {
    if (profile) {
      console.log("ProfileHeader: profile updated", profile);
    }
  }, [profile]);

  if (loadingUserId || !userDbId || loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
        <div className="text-center py-8">
          <p className="text-red-600">Erreur lors du chargement du profil.</p>
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

  // Affichage du profil utilisateur
  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10 w-full">
      {/* Avatar + Nom */}
      <div className="flex items-center gap-4 mb-4">
        {profile.avatar ? (
          <div className="w-20 h-20 rounded-full overflow-hidden">
            <Image src={profile.avatar} alt="avatar" width={80} height={80} className="w-20 h-20 object-cover" unoptimized />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-2xl font-bold text-[#009ddb]">
            {profile.name?.charAt(0) || "?"}
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold text-[#009ddb]">{profile.name}</h2>
          {profile.username && <p className="text-gray-600">@{profile.username}</p>}
          {profile.bio && <p className="mt-2 text-sm text-gray-700 max-w-md">{profile.bio}</p>}
        </div>
      </div>

      {/* Infos supplémentaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
        {profile.location && <div><span className="font-semibold">📍 Location:&nbsp;</span>{profile.location}</div>}
        {profile.website && <div><span className="font-semibold">🔗 Website:&nbsp;</span><a href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-[#009ddb] hover:underline">{profile.website}</a></div>}
        {profile.birthday && <div><span className="font-semibold">🎂 Birthday:&nbsp;</span>{profile.birthday}</div>}
      </div>

      {/* Statistiques */}
      <div className="flex gap-8 text-center">
        <div>
          <div className="text-lg font-bold text-[#fb5c1d]">{profile.postCount ?? 0}</div>
          <div className="text-xs text-gray-500">Posts</div>
        </div>
        <div>
          <div className="text-lg font-bold text-[#fb5c1d]">{profile.commentCount ?? 0}</div>
          <div className="text-xs text-gray-500">Comments</div>
        </div>
        <div>
          <div className="text-lg font-bold text-[#fb5c1d]">{profile.reactionCount ?? 0}</div>
          <div className="text-xs text-gray-500">Reactions</div>
        </div>
      </div>
    </div>
  );
} 