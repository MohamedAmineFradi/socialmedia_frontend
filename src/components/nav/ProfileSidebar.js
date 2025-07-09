export default function ProfileSidebar() {
  return (
    <div className="bg-white rounded-2xl shadow p-6 flex flex-col items-center border border-[#009ddb]/10">
      <div className="w-20 h-20 rounded-full bg-[#009ddb] mb-3" />
      <h2 className="text-lg font-bold text-[#009ddb]">Amin fradi</h2>
      <p className="text-sm text-gray-500 mb-4">Software Engineer</p>
      <div className="flex gap-6 text-center mb-4">
        <div>
          <div className="text-[#fb5c1d] font-bold">34</div>
          <div className="text-xs text-gray-400">Following</div>
        </div>
        <div>
          <div className="text-[#fb5c1d] font-bold">155</div>
          <div className="text-xs text-gray-400">Followers</div>
        </div>
      </div>
      <button className="bg-[#fb5c1d] hover:bg-[#fde848] text-white font-bold py-2 px-6 rounded-full transition-colors">View Profile</button>
    </div>
  );
} 