// src/components/WhoToFollow.js
import { useState, useMemo } from "react";

/* ---------- reusable hook ---------- */
function useSearch(data, keys = ["name", "username"]) {
  const [query, setQuery] = useState("");

  // Memo-compute results whenever data or query changes
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter((item) =>
        keys.some((k) => item[k].toLowerCase().includes(q))
    );
  }, [query, data, keys]);

  return { query, setQuery, filtered };
}

/* ---------- main component ---------- */
export default function WhoToFollow() {
  // Mock suggestions (swap with your API data)
  const [suggested, setSuggested] = useState([
    {
      id: 1,
      name: "Jennifer anniston",
      username: "Jen_anniston",
      avatar: "https://i.pravatar.cc/80?img=47",
      followed: false,
    },
    {
      id: 2,
      name: "Lisa kuredov",
      username: "i_dont_have_a_pla",
      avatar: "https://i.pravatar.cc/80?img=32",
      followed: false,
    },
    {
      id: 3,
      name: "Matt le blanc",
      username: "Mat_le_blanc",
      avatar: "https://i.pravatar.cc/80?img=53",
      followed: false,
    },
  ]);

  // Hook: live-filtered list + search state
  const { query, setQuery, filtered } = useSearch(suggested);

  // Toggle follow (demo only)
  const handleFollow = (id) =>
      setSuggested((prev) =>
          prev.map((u) =>
              u.id === id ? { ...u, followed: !u.followed } : u
          )
      );

  return (
      <section className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-900 shadow p-4">
        {/* Heading */}
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-gray-100">
          Who to follow
        </h2>

        {/* Search box */}
        <div className="relative mb-4">
          <input
              type="text"
              placeholder="Search people"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-transparent py-2 pl-4 pr-3 text-sm focus:border-blue-500 focus:ring-0 dark:text-gray-100"
          />
        </div>

        {/* Suggestions */}
        {filtered.length ? (
            <ul className="space-y-3">
              {filtered.map(({ id, name, username, avatar, followed }) => (
                  <li key={id} className="flex items-center justify-between">
                    {/* User info */}
                    <div className="flex items-center">
                      <img
                          src={avatar}
                          alt={name}
                          className="h-10 w-10 rounded-full object-cover"
                      />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {name}
                        </p>
                        <p className="text-xs text-gray-500">@{username}</p>
                      </div>
                    </div>

                    {/* Follow / Following button */}
                    <button
                        onClick={() => handleFollow(id)}
                        className={`px-4 py-1 text-sm font-medium rounded-full transition
                  ${
                            followed
                                ? "border border-gray-300 text-gray-700 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                                : "bg-blue-500 text-white hover:bg-blue-600"
                        }`}
                    >
                      {followed ? "Following" : "Follow"}
                    </button>
                  </li>
              ))}
            </ul>
        ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No matches found.
            </p>
        )}
      </section>
  );
}
