import React from 'react';

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`card ${className}`}>
    {children}
  </div>
);

export default Card;