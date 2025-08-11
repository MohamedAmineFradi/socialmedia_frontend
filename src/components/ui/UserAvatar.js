import React from 'react';
import { useSelector } from 'react-redux';

export default function UserAvatar({
                                       userId,
                                       size = 'md',
                                       className = ''
                                   }) {
    const profiles = useSelector(s => s.profile.entities);
    const profile = profiles[userId];

    const getInitials = () => {
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
            case 'sm': return 'w-6 h-6 text-xs';
            case 'md': return 'w-8 h-8 text-sm';
            case 'lg': return 'w-10 h-10 text-base';
            case 'xl': return 'w-12 h-12 text-lg';
            case '2xl': return 'w-16 h-16 text-xl';
            default: return 'w-8 h-8 text-sm';
        }
    };

    return (
        <div className={`${getAvatarSize()} rounded-full flex items-center justify-center flex-shrink-0 ${
            profile?.avatar
                ? 'bg-cover bg-center'
                : 'bg-gray-300 text-gray-600 font-medium'
        } ${className}`}
             style={profile?.avatar ? { backgroundImage: `url(${profile.avatar})` } : {}}
        >
            {!profile?.avatar && getInitials()}
        </div>
    );
} 