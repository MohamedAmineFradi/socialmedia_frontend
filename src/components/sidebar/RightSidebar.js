export default function RightSidebar() {
  // Fake data for illustration.
  const trending = ["#AIArt", "#Euro2025", "#ClimateTech", "#IndieHackers"];


  return (
    <aside className="flex flex-col gap-6">
      {/* Trending Topics */}
      <section className="bg-white rounded-2xl shadow p-6 border border-[#009ddb]/10">
        <h3 className="text-md font-bold text-[#fb5c1d] mb-4">Trending</h3>
        <ul className="space-y-3">
          {trending.map((tag) => (
            <li key={tag} className="flex items-center justify-between text-sm">
              <span className="text-gray-700">{tag}</span>
              <button className="text-[#009ddb] hover:text-[#fb5c1d] transition-colors">
                See posts
              </button>
            </li>
          ))}
        </ul>
      </section>


    </aside>
  );
}
