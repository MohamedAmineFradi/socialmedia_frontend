"use client";

import { useRouter } from "next/navigation";

export default function ProfileSidebar() {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push("/me");
  };
  const handleSignOut = () => {
    router.push("/");
  };

  return (
    <div className="bg-[#009ddb] rounded-2xl shadow p-6 flex flex-col items-center border border-[#009ddb]/10">
      {/* Change the background of the photo placeholder to white */}
      <div className="w-20 h-20 rounded-full bg-white mb-3" />
      <h2 className="text-lg font-bold text-white">Amin fradi</h2>
      <p className="text-sm text-gray-200 mb-4">Software Engineer</p>

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
