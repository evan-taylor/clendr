import { useState, useEffect } from 'react';

interface DarkModeToggleProps {
  className?: string;
}

export const DarkModeToggle = ({ className = '' }: DarkModeToggleProps) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle initial setup after mount to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    
    // Check user preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      
      return newMode;
    });
  };

  if (!isClient) return null; // Avoid rendering during SSR

  return (
    <button
      onClick={toggleDarkMode}
      className={`relative p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${className}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <div className="relative w-10 h-5 transition duration-200 ease-in-out bg-gray-200 dark:bg-gray-700 rounded-full">
        <div
          className={`absolute left-0.5 top-0.5 bg-white dark:bg-primary-500 w-4 h-4 rounded-full shadow transform transition-transform duration-200 ${
            isDarkMode ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </div>
      <span className="sr-only">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  );
};

export default DarkModeToggle; 