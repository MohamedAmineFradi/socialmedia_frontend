"use client";

import { useState } from "react";
import Logo from "@/components/ui/Logo";
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import { useAuth } from "@/components/auth/AuthProvider";

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated, user, login, logout, isSuperAdmin } = useAuth();

    // Debug logging
    console.log('Navigation - Current user:', user);
    console.log('Navigation - User roles:', user?.roles);
    console.log('Navigation - Is superAdmin:', isSuperAdmin());

    const toggleMenu = () => setIsOpen(!isOpen);

    const navigationItems = [
        {
            icon: "🏠",
            label: "News Feed",
            href: "/posts",
            description: "Return to main feed"
        },
        {
            icon: "💬",
            label: "Messages",
            href: "/messages",
            description: "View your messages"
        },
        {
            icon: "🔔",
            label: "Notifications",
            href: "/notifications",
            description: "Check notifications"
        },
        {
            icon: "⚙️",
            label: "Settings",
            href: "/settings",
            description: "Modify your profile"
        }
    ];

    // Add admin link for superAdmin users
    const adminItem = {
        icon: "👑",
        label: "Admin",
        href: "/admin",
        description: "Admin dashboard"
    };

    const allNavigationItems = isSuperAdmin() 
        ? [...navigationItems, adminItem]
        : navigationItems;

    const handleAuthAction = () => {
        if (isAuthenticated) {
            logout();
        } else {
            login();
        }
    };

    return (
        <nav className="fixed bottom-0 z-40 flex w-full items-start justify-start bg-gradient-to-b from-[#009ddb] to-[#007bb5] py-2 text-white lg:static lg:flex-col lg:py-6 lg:h-screen lg:w-[280px] lg:shadow-xl lg:overflow-y-auto transition-all ease-in-out duration-300">
            {/* Logo Section */}
            <div className="hidden lg:flex flex-col items-center w-full mb-6 pb-4 border-b border-white/20">
                <Logo />
            </div>

    
            {/* Navigation List */}
            <div className="hidden lg:block w-full">
                <div className="px-4 mb-4">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider">Navigation</h3>
                </div>
                <ul className="px-2 space-y-2">
                    {allNavigationItems.map((item, index) => (
                        <li key={index}>
                            <a
                                href={item.href}
                                className="flex items-center w-full px-4 py-3 text-left rounded-lg transition-all duration-200 group hover:bg-[#ffcc00]/20 hover:text-[#ffcc00]"
                            >
                                <span className="text-xl mr-3 group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </span>
                                <div>
                                    <span className="block font-medium">{item.label}</span>
                                    <span className="block text-xs text-white/70 group-hover:text-[#ffcc00]/70">
                                        {item.description}
                                    </span>
                                </div>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Mobile Toggle Button */}
            <div
                className="lg:hidden fixed bottom-4 right-4 bg-[#ffcc00] p-3 rounded-full cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 z-50"
                onClick={toggleMenu}
            >
                <span className="text-black text-2xl font-bold">☰</span>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={toggleMenu}
                />
            )}

            {/* Mobile Menu */}
            <div
                className={`lg:hidden fixed top-0 right-0 h-screen w-80 bg-gradient-to-b from-[#009ddb] to-[#007bb5] z-50 flex flex-col overflow-y-auto transition-transform duration-300 transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* Mobile Close Button */}
                <div className="flex justify-end p-4">
                    <button
                        onClick={toggleMenu}
                        className="text-white text-3xl hover:text-[#ffcc00] transition-colors"
                    >
                        ×
                    </button>
                </div>

                {/* Mobile Logo */}
                <div className="flex justify-center mb-6">
                    <Logo />
                </div>

                {/* Mobile Profile Section */}
                <div className="px-4 mb-6">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Profile</h3>
                    <div className="space-y-3">
                        {isAuthenticated ? (
                            <>
                                <ProfileSidebar />
                                <a
                                    href="/me"
                                    className="flex items-center w-full px-4 py-3 text-left rounded-lg transition-all duration-200 group hover:bg-white/20"
                                >
                                    <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">👤</span>
                                    <div>
                                        <span className="block font-medium text-lg">Your Profile</span>
                                        <span className="block text-sm text-white/70">View and edit posts</span>
                                    </div>
                                </a>
                                <button
                                    onClick={handleAuthAction}
                                    className="flex items-center w-full px-4 py-3 text-left bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all duration-200 group"
                                >
                                    <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">🔒</span>
                                    <div>
                                        <span className="block font-medium text-lg">Sign Out</span>
                                        <span className="block text-sm text-white/70">End your session</span>
                                    </div>
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={handleAuthAction}
                                className="flex items-center w-full px-4 py-3 text-left bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-all duration-200 group"
                            >
                                <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">🔑</span>
                                <div>
                                    <span className="block font-medium text-lg">Sign In</span>
                                    <span className="block text-sm text-white/70">Start your session</span>
                                </div>
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation List */}
                <div className="px-4 mb-6">
                    <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-4">Navigation</h3>
                    <ul className="space-y-3">
                        {allNavigationItems.map((item, index) => (
                            <li key={index}>
                                <a
                                    href={item.href}
                                    className="flex items-center w-full px-4 py-3 text-left rounded-lg transition-all duration-200 group hover:bg-[#ffcc00]/20 hover:text-[#ffcc00]"
                                    onClick={toggleMenu}
                                >
                                    <span className="text-2xl mr-4 group-hover:scale-110 transition-transform">
                                        {item.icon}
                                    </span>
                                    <div>
                                        <span className="block font-medium text-lg">{item.label}</span>
                                        <span className="block text-sm text-white/70 group-hover:text-[#ffcc00]/70">
                                            {item.description}
                                        </span>
                                    </div>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;