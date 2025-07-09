"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
// import 'long-press-event';

export default function Feed() {
  useEffect(() => {
    import('long-press-event');
  }, []);
  // Local state just for demo; swap with SWR / React Query later.
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Batman",
      minutesAgo: 3,
      content: "Hello World",
      likes: 25,
      dislikes: 50,
      comments: 15,
      tags: ["design", "creative"],
    },
  ]);

  const [draft, setDraft] = useState("");
  const [pickerPostId, setPickerPostId] = useState(null);

  async function handlePublish(e) {
    e.preventDefault();
    if (!draft.trim()) return;

    // 🔜 Replace with API call
    const newPost = {
      id: Date.now(),
      author: "You",
      minutesAgo: 0,
      content: draft,
      likes: 0,
      dislikes: 0,
      comments: 0,
      tags: [],
    };
    setPosts([newPost, ...posts]);
    setDraft("");
  }

  function handleLongPress(postId) {
    setPickerPostId(postId);
  }
  function handleClosePicker() {
    setPickerPostId(null);
  }
  function handlePickReaction(postId, emoji) {
    // Here you would update the post's reactions
    setPickerPostId(null);
    // For demo, just alert
    alert(`Reacted to post ${postId} with ${emoji}`);
  }

  return (
    <div className="relative flex flex-col gap-6 min-h-[600px]">
      {/* Background Logo */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center z-0">
        <Image
          src="/logo_with_transperent_bg.png"
          alt=""                /* decorative */
          width={500}
          height={500}
          className="opacity-10"
          aria-hidden="true"
          loading="lazy"
          priority={false}
        />
      </div>

      {/* Feed Content */}
      <div className="relative z-10 flex flex-col gap-6">
        {/* Publish Post */}
        <form
          onSubmit={handlePublish}
          className="bg-[#009ddb] rounded-2xl shadow p-6 border border-[#009ddb]/10 mb-4 flex flex-col sm:flex-row items-center gap-4"
        >
          <input
            type="text"
            placeholder="What's on your mind?"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="flex-1 rounded-full px-4 py-2 text-gray-800 bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#009ddb]"
            aria-label="Post content"
          />
          <button
            type="submit"
            className="bg-[#fb5c1d] hover:bg-[#fa5c1a] text-white font-bold py-2 px-6 rounded-full transition-colors disabled:opacity-50"
            disabled={!draft.trim()}
          >
            Publish
          </button>
        </form>

        {/* Posts */}
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <PostCard
                post={post}
                onLongPress={() => handleLongPress(post.id)}
                showPicker={pickerPostId === post.id}
                onClosePicker={handleClosePicker}
                onPickReaction={(emoji) => handlePickReaction(post.id, emoji)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ReactionPicker({ onPick, onClose }) {
  const emojis = ["👍"];
  return (
    <div className="absolute bottom-12 left-0 bg-white border rounded-xl shadow-lg p-2 flex gap-2 z-50">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          className="text-2xl hover:scale-125 transition-transform"
          onClick={() => onPick(emoji)}
        >
          {emoji}
        </button>
      ))}
      <button onClick={onClose} className="ml-2 text-gray-400">✕</button>
    </div>
  );
}

function PostCard({ post, onLongPress, showPicker, onClosePicker, onPickReaction }) {
  // For demo, the picker is absolutely positioned relative to the post card
  return (
    <article className="bg-white/100 hover:bg-white transition-all duration-200 rounded-2xl shadow p-6 border border-[#009ddb]/10 backdrop-blur-sm cursor-pointer relative">
      <header className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-full bg-[#009ddb]" />
        <div>
          <h4 className="font-bold text-[#009ddb]">{post.author}</h4>
          <time className="text-xs text-gray-400">{post.minutesAgo} min ago</time>
        </div>
      </header>
      <p className="mb-3 text-gray-700 whitespace-pre-line">{post.content}</p>
      {/* Tags */}
      <ul className="flex gap-2 mb-2">
        {post.tags.map((tag) => (
          <li
            key={tag}
            className="bg-[#fde848] text-[#fb5c1d] text-xs px-2 py-1 rounded-full"
          >
            #{tag}
          </li>
        ))}
      </ul>
      {/* Stats */}
      <footer className="flex gap-6 text-sm text-gray-500 mt-2 relative">
        <span
          onPointerDown={onLongPress}
          data-long-press-delay="400"
          className="cursor-pointer relative"
        >
          👍 {post.likes}
          {showPicker && (
            <ReactionPicker onPick={onPickReaction} onClose={onClosePicker} />
          )}
        </span>
        <span>👎 {post.dislikes}</span>
        <span>💬 {post.comments}</span>
      </footer>
    </article>
  );
}
