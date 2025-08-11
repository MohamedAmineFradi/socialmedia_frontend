import { useState } from 'react';
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
      <img 
        src={src}
        alt={name}
        onError={handleError}
        className={`rounded-full object-cover border border-gray-200 ${sizeClasses[size]} ${className}`}
      />
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
