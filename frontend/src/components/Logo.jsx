import React from 'react';

const Logo = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#0D1B2A"/>
    <path d="M12 28L18 18L24 22L30 12" stroke="#00BFA6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="30" cy="12" r="3" fill="#00BFA6"/>
    <circle cx="12" cy="28" r="2" fill="#00E5C0"/>
    <circle cx="18" cy="18" r="2" fill="#00E5C0"/>
    <circle cx="24" cy="22" r="2" fill="#00E5C0"/>
  </svg>
);

export default Logo;
