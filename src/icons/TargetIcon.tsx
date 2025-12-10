import React from 'react';

const TargetIcon = ({ size, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
    <line x1="12" x2="12" y1="2" y2="4" />
    <line x1="12" x2="12" y1="20" y2="22" />
    <line x1="20" x2="22" y1="12" y2="12" />
    <line x1="2" x2="4" y1="12" y2="12" />
  </svg>
);

export default TargetIcon;
