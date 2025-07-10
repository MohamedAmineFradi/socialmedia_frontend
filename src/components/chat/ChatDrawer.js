import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Static conversation data
const conversations = [
  { name: "Lionel Messi", last: "Hey, how are you?", unread: 2 },
  { name: "Bruce Wayne", last: "Meet tonight?", unread: 1 },
  { name: "Superman", last: "Let's catch up!", unread: 0 },
];

function ChatList() {
  return (
    <section className="bg-white rounded-2xl shadow p-4 border border-[#009ddb]/10 max-h-full flex flex-col">
      <h3 className="text-md font-bold text-[#009ddb] mb-4">Messages</h3>
      {/* Scrollable list */}
      <ul className="space-y-3 overflow-y-auto pr-1 flex-1 scrollbar-hide">
        {conversations.map((c, idx) => (
          <li
            key={idx}
            className="flex justify-between items-start text-sm hover:bg-gray-50 p-2 rounded-lg cursor-pointer transition-colors"
          >
            <div className="flex-1">
              <p className="font-semibold text-gray-800 truncate w-40">{c.name}</p>
              <p className="text-gray-500 truncate w-40">{c.last}</p>
            </div>
            {c.unread > 0 && (
              <span className="ml-2 bg-[#fb5c1d] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {c.unread}
              </span>
            )}
          </li>
        ))}
      </ul>
      {/* CTA */}
      <button className="mt-4 bg-[#009ddb] hover:bg-[#fb5c1d] text-white font-bold py-2 px-4 rounded-full transition-colors">
        Open Inbox
      </button>
    </section>
  );
}

export default function ChatDrawer() {
  const [open, setOpen] = useState(false);

  // Animation variants
  const desktopVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 },
    exit: { x: '100%' }
  };
  const mobileVariants = {
    hidden: { y: '100%' },
    visible: { y: 0 },
    exit: { y: '100%' }
  };

  return (
    <>
      {/* Floating DM button */}
      <button
        className="fixed z-50 bottom-6 right-6 bg-[#009ddb] text-white rounded-full shadow-lg p-4 flex items-center justify-center hover:bg-[#fb5c1d] transition-colors lg:bottom-8 lg:right-8"
        onClick={() => setOpen(true)}
        aria-label="Open Messages"
      >
        <span className="text-2xl">💬</span>
      </button>

      {/* Overlay and Drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            {/* Drawer: Desktop (right) */}
            <motion.aside
              className="hidden lg:flex flex-col bg-white rounded-l-2xl shadow p-6 overflow-y-auto h-full w-[340px] fixed right-0 top-0 z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={desktopVariants}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#009ddb]">Messages</h3>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#fb5c1d] text-xl">✕</button>
              </div>
              <ChatList />
            </motion.aside>
            {/* Drawer: Mobile (bottom sheet) */}
            <motion.aside
              className="lg:hidden flex flex-col bg-white rounded-t-2xl shadow p-6 overflow-y-auto h-[70vh] w-full fixed left-0 bottom-0 z-50"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={mobileVariants}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#009ddb]">Messages</h3>
                <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-[#fb5c1d] text-xl">✕</button>
              </div>
              <ChatList />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
} 