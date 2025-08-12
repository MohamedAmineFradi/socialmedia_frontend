import { useState } from 'react';
import Image from 'next/image';
import PropTypes from 'prop-types';

export default function Avatar({ 
  src, 
  fallback, 
  size = 'md', 
  className = '',
  name = ''
}) {
  const [error, setError] = useState(false);
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg'
  };

  const handleError = () => {
    setError(true);
  };

  if (src && !error) {
    return (
      <div className={`rounded-full object-cover border border-gray-200 ${sizeClasses[size]} ${className} overflow-hidden`}>
        <Image 
          src={src}
          alt={name}
          width={size === 'sm' ? 32 : size === 'md' ? 40 : 64}
          height={size === 'sm' ? 32 : size === 'md' ? 40 : 64}
          onError={handleError}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase()
    : fallback || '?';
    
  return (
    <div 
      className={`rounded-full bg-[#009ddb] text-white flex items-center justify-center ${sizeClasses[size]} ${className}`}
    >
      {initials}
    </div>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  fallback: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  name: PropTypes.string
};
