
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const baseClasses = "bg-gray-800/50 backdrop-blur border border-gray-700/50 rounded-lg shadow-lg p-6 relative transition-all duration-300";
  const hoverClasses = onClick ? "hover:border-indigo-500 hover:shadow-indigo-500/10 hover:-translate-y-1" : "";
  
  return (
    <div onClick={onClick} className={`${baseClasses} ${hoverClasses} ${className}`}>
      {children}
    </div>
  );
};

export default Card;
