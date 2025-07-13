"use client";

import Image from "next/image";
import { useAuth } from "@/components/auth/AuthProvider";
import { useRouter } from "next/navigation";

export default function Home() {
  const { isAuthenticated, login } = useAuth();
  const router = useRouter();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/posts');
    } else {
      login();
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#1da1f2] p-0">
      <div className="flex flex-1 flex-col md:flex-row items-center justify-center gap-0 md:gap-12 w-full max-w-5xl mx-auto py-12">
        {/* Logo section (left on desktop, top on mobile) */}
        <div className="flex-1 flex items-center justify-center p-4">
          <Image
            src="/logo_with_blue_bg.png"
            alt="Libertalk Logo"
            width={260}
            height={260}
            priority
            className="rounded-3xl shadow-2xl"
          />
        </div>
        <div className="flex-1 flex flex-col items-center md:items-start justify-center gap-6 bg-white/80 rounded-3xl shadow-lg px-8 py-12 max-w-xl w-full mx-4">
          <h1 className="text-4xl font-bold text-[#ff9800] text-center md:text-left drop-shadow-sm">Libertalk</h1>
          <p className="text-lg text-[#fbc02d] font-medium text-center md:text-left max-w-md">
            Chat and Share without chains.<br />
            <span className="text-[#1976d2] font-semibold">Liberty</span>, <span className="text-[#1976d2] font-semibold">Peace</span>, and <span className="text-[#1976d2] font-semibold">Respect</span> for all.
          </p>
          <button
            onClick={handleGetStarted}
            className="mt-6 bg-[#ff9800] hover:bg-[#fbc02d] text-white font-bold py-3 px-8 rounded-full shadow transition-colors text-lg"
          >
            {isAuthenticated ? 'Go to Feed' : 'Join Now'}
          </button>
        </div>
      </div>
      <footer className="w-full py-6 text-white/80 text-sm text-center bg-transparent">
        &copy; {new Date().getFullYear()} Libertalk. All rights reserved.
      </footer>
    </div>
  );
}
