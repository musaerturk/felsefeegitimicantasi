import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
}

const Loader = ({ size = 'md' }: LoaderProps) => {
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6', 
    lg: 'h-8 w-8'
  }[size];

  return (
    <div className={`loader ${sizeClass} animate-spin rounded-full border-2 border-gray-300 border-t-indigo-400`}>
      {/* Loading spinner */}
    </div>
  );
};

export default Loader;