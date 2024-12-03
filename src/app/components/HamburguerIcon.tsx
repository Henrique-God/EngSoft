// src/app/components/HamburgerIcon.tsx
"use client"; // Ensure this component can use hooks if needed

import React from 'react';

interface HamburgerIconProps {
  onClick: () => void;
}

const HamburgerIcon: React.FC<HamburgerIconProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className="p-2 focus:outline-none">
      <div className="w-8 h-0.5 bg-black mb-1"></div>
      <div className="w-8 h-0.5 bg-black mb-1"></div>
      <div className="w-8 h-0.5 bg-black"></div>
    </button>
  );
};

export default HamburgerIcon;
