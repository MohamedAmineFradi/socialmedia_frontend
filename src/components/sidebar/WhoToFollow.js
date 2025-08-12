"use client";

import Image from 'next/image';
import { useState, useMemo } from "react";

function useSearch(data, keys = ["name", "username"]) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return data;

    return data.filter((item) =>
        keys.some((k) => item[k].toLowerCase().includes(q))
    );
  }, [query, data, keys]);

  return { query, setQuery, filtered };
}

export default function WhoToFollow() {
  const [suggested, setSuggested] = useState([
    {
      id: 1,
      name: "Jennifer Aniston",
      username: "jen_aniston",
      avatar: "/avatars/jennifer.jpg", // Put images in public/avatars/
      followed: false,
    },
    {
      id: 2,
      name: "Courteney Cox",
      username: "courteneycoxofficial",
      avatar: "/avatars/courteney.jpg",
      followed: false,
    },
    {
      id: 3,
      name: "Lisa Kudrow",
      username: "lisa.kudrow",
      avatar: "/avatars/lisa.jpg",
      followed: false,
    },
    {
      id: 4,
      name: "Matt LeBlanc",
      username: "mattleblanc",
      avatar: "/avatars/matt.jpg",
      followed: false,
    },
    {
      id: 5,
      name: "Matthew Perry",
      username: "matthewperry",
      avatar: "/avatars/matthew.jpg",
      followed: false,
    },
    {
      id: 6,
      name: "David Schwimmer",
      username: "david_schwimmer",
      avatar: "/avatars/david.jpg",
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
                      <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                        <Image
                            src={avatar}
                            alt={name}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover"
                            onError={(e) => {
                              // Fallback to initials if image fails
                              e.target.style.display = 'none';
                            }}
                        />
                      </div>

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