"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import RightSidebar from "../sidebar/RightSidebar";
import ChatDrawer from "../chat/ChatDrawer";
import WhoToFollow from "../sidebar/WhoToFollow";
import Navigation from "@/components/sidebar/Navigation";
import Footer from "@/components/ui/Footer";

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isHome = pathname === "/";

  // If we're on the home page, just render children (banner/landing etc.)
  if (isHome) {
    return <>{children}</>;
  }

  return (
      <>
    <div className="bg-gray-100 text-sm lg:grid lg:grid-cols-[280px_1fr_300px] lg:gap-6 lg:h-screen lg:overflow-hidden">
      <Navigation/>

      <main className="pt-4 lg:pt-6 px-4 lg:px-0 max-w-2xl w-full mx-auto space-y-6 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-[#009ddb]/30">
        {children}
      </main>

      <aside className="hidden lg:flex flex-col space-y-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#009ddb]/30 bg-white shadow-sm rounded-2xl p-6 h-full">
        <RightSidebar />
        <WhoToFollow />
      </aside>

      <ChatDrawer />
    </div>

    {!isHome && <Footer />}
      </>
);
} 