import React from 'react';

const Spinner = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-10 h-10 border-3',
    large: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex justify-center items-center py-8 ${className}`}>
      <div 
        className={`${sizeClasses[size]} border-brand-primary border-t-transparent rounded-full animate-spin`}
        role="status"
        aria-label="loading"
      />
    </div>
  );
};

export default Spinner;
