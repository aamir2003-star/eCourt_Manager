// src/components/ThemeToggle.jsx
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-light-primary dark:focus:ring-dark-secondary bg-light-secondary dark:bg-dark-primary"
      aria-label="Toggle theme"
    >
      {/* Sliding circle */}
      <span
        className={`absolute left-1 top-1 w-6 h-6 rounded-full transition-transform duration-300 ease-in-out bg-white dark:bg-dark-secondary ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
      
      {/* Icons */}
      <span className="absolute left-2 flex items-center">
        <Sun 
          className={`h-4 w-4 transition-opacity duration-300 ${
            isDark ? 'opacity-0' : 'opacity-100 text-light-primary'
          }`}
        />
      </span>
      <span className="absolute right-2 flex items-center">
        <Moon 
          className={`h-4 w-4 transition-opacity duration-300 ${
            isDark ? 'opacity-100 text-dark-secondary' : 'opacity-0'
          }`}
        />
      </span>
    </button>
  );
};

export default ThemeToggle;
