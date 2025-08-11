import React, { memo } from 'react';
import useProfile from '@/hooks/useProfile';

const UserDisplay = memo(function UserDisplay({
                                                  userId,
                                                  size = 'md',
                                                  showUsername = false,
                                                  showFullName = true,
                                                  className = ''
                                              }) {
    const { profile, loading: profileLoading } = useProfile(userId || null);


    const getDisplayName = () => {
        if (profileLoading) return 'Loading...';
        if (!profile) return 'User Not Found';

        if (showFullName && (profile.firstName || profile.lastName)) {
            return `${profile.firstName || ''} ${profile.lastName || ''}`.trim();
        }

        return profile.username || 'Unknown User';
    };

    const getInitials = () => {
        if (profileLoading) return '...';
        if (!profile) return '?';

        if (profile.firstName || profile.lastName) {
            const first = profile.firstName?.charAt(0) || '';
            const last = profile.lastName?.charAt(0) || '';
            return (first + last).toUpperCase();
        }

        return (profile.username?.charAt(0) || '?').toUpperCase();
    };

    const getAvatarSize = () => {
        switch (size) {
            case 'sm': return 'w-8 h-8 text-sm';
            case 'md': return 'w-10 h-10 text-base';
            case 'lg': return 'w-12 h-12 text-lg';
            case 'xl': return 'w-16 h-16 text-xl';
            default: return 'w-10 h-10 text-base';
        }
    };

    const getTextSize = () => {
        switch (size) {
            case 'sm': return 'text-sm';
            case 'md': return 'text-base';
            case 'lg': return 'text-lg';
            case 'xl': return 'text-xl';
            default: return 'text-base';
        }
    };

    // Safety check for userId
    if (!userId) {
        return (
            <div className={`flex items-center space-x-3 ${className}`}>
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-600 font-medium text-sm">?</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">Unknown User</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex items-center space-x-3 ${className}`}>
            {/* Avatar */}
            <div
                className={`${getAvatarSize()} rounded-full flex items-center justify-center flex-shrink-0 ${
                    profile?.avatar
                        ? 'bg-cover bg-center'
                        : 'bg-gray-300 text-gray-600 font-medium'
                }`}
                style={profile?.avatar ? { backgroundImage: `url(${profile.avatar})` } : {}}
            >
                {!profile?.avatar && getInitials()}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${getTextSize()} text-gray-900`}>
                    {getDisplayName()}
                </p>
                {showUsername && profile?.username && (profile.firstName || profile.lastName) && (
                    <p className="text-sm text-gray-500 truncate">{profile.username}</p>
                )}
            </div>
        </div>
    );
});

export default UserDisplay;