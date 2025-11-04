// src/components/Card.jsx
import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-white dark:bg-dark-primary shadow-lg rounded-xl p-6 transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
