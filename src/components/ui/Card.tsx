import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, className = '', onClick }: CardProps) => (
  <div 
    className={`card ${className}`}
    onClick={onClick}
    style={onClick ? { cursor: 'pointer' } : {}}
  >
    {children}
  </div>
);

export default Card;