"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getProfileByUserId, updateProfile } from "@/services/profileService";

export default function SettingsPage() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    bio: "",
    location: "",
    website: "",
    birthday: "",
    avatar: "",
    info: ""
  });
  const [profileId, setProfileId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    getProfileByUserId(1).then((data) => {
      setProfile({
        name: data.name || "",
        username: data.username || "",
        bio: data.bio || "",
        location: data.location || "",
        website: data.website || "",
        birthday: data.birthday || "",
        avatar: data.avatar || "",
        info: data.info || ""
      });
      setProfileId(data.id);
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(profileId, profile);
      setSaveMessage("Profile updated successfully!");
      setTimeout(() => {
        setSaveMessage("");
        router.push("/me");
      }, 2000);
    } catch (error) {
      setSaveMessage("Error updating profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-10">
      <h1 className="text-2xl font-bold text-[#009ddb]">Edit Profile</h1>
      <div className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input type="text" id="name" name="name" value={profile.name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#009ddb]" required />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input type="text" id="username" name="username" value={profile.username} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#009ddb]" required />
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea id="bio" name="bio" value={profile.bio} onChange={handleChange} rows={3} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#009ddb]" />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input type="text" id="location" name="location" value={profile.location} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#009ddb]" />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input type="text" id="website" name="website" value={profile.website} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#009ddb]" placeholder="github.com/yourusername" />
          </div>
          <div>
            <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-1">Birthday</label>
            <input type="text" id="birthday" name="birthday" value={profile.birthday} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#009ddb]" placeholder="Month Day, Year" />
          </div>
          <div>
            <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
            <input type="text" id="avatar" name="avatar" value={profile.avatar} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#009ddb]" placeholder="https://..." />
          </div>
          <div className="flex justify-between pt-4">
            <button type="button" onClick={() => router.push("/me")}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-800 font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving}
              className="px-6 py-2 bg-[#fb5c1d] hover:bg-[#fa5c1a] rounded-full text-white font-medium transition-colors disabled:opacity-50">
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
          {saveMessage && (
            <div className={`mt-4 p-3 rounded-lg text-center ${saveMessage.includes("Error") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
              {saveMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
} 