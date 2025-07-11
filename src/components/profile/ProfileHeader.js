"use client";

import { useEffect, useState } from "react";
import { getProfileByUserId } from "@/services/profileService";

export default function ProfileHeader() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    getProfileByUserId(1).then(setProfile);
  }, []);

  if (!profile) return <div>Loading...</div>;

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