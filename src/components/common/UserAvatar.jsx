import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export const UserAvatar = ({
  user,
  src,
  name,
  size = 'md',
  showStatus = false,
  className = '',
}) => {
  const photoSrc = src !== undefined ? src : user?.avatar;
  const displayName = name || user?.name || 'Admin';
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [photoSrc]);

  const sizeClasses = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-24 h-24 text-2xl',
  }[size] || 'w-9 h-9 text-sm';

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-12 h-12',
  }[size] || 'w-5 h-5';

  const statusDotSizes = {
    xs: 'w-2 h-2',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  }[size] || 'w-2.5 h-2.5';

  // Render custom photo only if it's an uploaded data URL or explicit custom image
  // Otherwise, render the exact dark navy circle with white user silhouette matching the user screenshot!
  const isCustomUploaded =
    photoSrc &&
    typeof photoSrc === 'string' &&
    photoSrc.trim().length > 0 &&
    !photoSrc.includes('unsplash.com') &&
    !photoSrc.includes('dicebear.com') &&
    !imgError;

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {isCustomUploaded ? (
        <img
          src={photoSrc}
          alt={displayName}
          onError={() => setImgError(true)}
          className={`${sizeClasses} rounded-full object-cover border-2 border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-2xs`}
        />
      ) : (
        /* Dark Navy Circle with Clean White User Silhouette matching screenshot exactly */
        <div
          className={`${sizeClasses} rounded-full bg-gradient-to-br from-[#0c1f38] via-[#09182d] to-[#061222] border-2 border-slate-300/80 dark:border-slate-700 flex items-center justify-center text-white shadow-2xs overflow-hidden`}
          title={displayName}
        >
          <User className={`${iconSizes} text-white fill-white/10`} />
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 ${statusDotSizes} bg-emerald-500 border-2 border-white dark:border-[#0d1527] rounded-full shadow-2xs`}
        />
      )}
    </div>
  );
};

export default UserAvatar;
