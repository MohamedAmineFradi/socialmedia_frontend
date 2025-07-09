"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserProfile } from "@/utils/localDataService";

export default function ProfileHeader() {
  const router = useRouter();
  const [user, setUser] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    Birthday: ""
  });

  useEffect(() => {
    // Get profile from local storage
    const profile = getUserProfile();
    setUser({
      name: profile.name,
      username: profile.username,
      bio: profile.bio,
      location: profile.location,
      website: profile.website,
      Birthday: profile.birthday
    });
  }, []);

  const handleEditProfile = () => {
    router.push("/settings");
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
      <div className="flex items-start gap-4">
        {/* Profile picture */}
        <div className="w-24 h-24 rounded-full bg-[#009ddb] flex-shrink-0" />
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-[#009ddb]">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.username}</p>
            </div>
            
            <button 
              onClick={handleEditProfile}
              className="bg-[#fb5c1d] hover:bg-[#fde848] text-white font-bold py-2 px-6 rounded-full transition-colors">
              Edit Profile
            </button>
          </div>
          
          <p className="mt-3 text-gray-700">{user.bio}</p>
          
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
            {user.location && (
              <div className="flex items-center gap-1">
                <span>📍</span>
                <span>{user.location}</span>
              </div>
            )}
            
            {user.website && (
              <div className="flex items-center gap-1">
                <span>🔗</span>
                <a href={`https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-[#009ddb] hover:underline">
                  {user.website}
                </a>
              </div>
            )}
            
            {user.Birthday && (
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>Birthday {user.Birthday}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 