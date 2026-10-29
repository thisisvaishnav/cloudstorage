import React from 'react'

export default function SecureLockerLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 select-none ${className}`}
    >
      <defs>
        <linearGradient id="sl-bg-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
        <linearGradient id="sl-rim-grad" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="sl-lock-grad" x1="18" y1="26" x2="46" y2="52" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1F5F9" />
        </linearGradient>
        <filter id="sl-shadow" x="12" y="24" width="40" height="32" filterUnits="userSpaceOnUse">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#1E1B4B" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Rounded Squircle Shield */}
      <rect width="64" height="64" rx="16" fill="url(#sl-bg-grad)" />
      <rect x="1" y="1" width="62" height="62" rx="15" stroke="url(#sl-rim-grad)" strokeWidth="2" />

      {/* Security Vault Lock Shackle */}
      <path
        d="M23 29V21C23 16.0294 27.0294 12 32 12C36.9706 12 41 16.0294 41 21V29"
        stroke="#FFFFFF"
        strokeWidth="4.5"
        strokeLinecap="round"
      />

      {/* Main Lock Body */}
      <g filter="url(#sl-shadow)">
        <rect x="18" y="27" width="28" height="23" rx="6" fill="url(#sl-lock-grad)" />
      </g>

      {/* Keyhole Accent */}
      <circle cx="32" cy="36.5" r="3.2" fill="#4F46E5" />
      <path
        d="M30.6 37.5L30 43.5C30 44.0523 30.4477 44.5 31 44.5H33C33.5523 44.5 34 44.0523 34 43.5L33.4 37.5H30.6Z"
        fill="#4F46E5"
      />

      {/* Security Cyber Spark */}
      <circle cx="32" cy="36.5" r="1.2" fill="#38BDF8" />
    </svg>
  )
}
