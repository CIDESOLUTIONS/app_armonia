// src/components/layout/header.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Globe, Sun, Moon, DollarSign, User, LogIn, LogOut } from 'lucide-react';

interface HeaderProps {
  theme: string;
  setTheme: (theme: string) => void;
  language: string;
  setLanguage: (language: string) => void;
  currency: string;
  setCurrency: (currency: string) => void;
  logout?: () => void;
  isLoggedIn?: boolean;
  complexName?: string | null;
  adminName?: string | null;
}

export function Header({
  theme,
  setTheme,
  language,
  setLanguage,
  currency,
  setCurrency,
  logout,
  isLoggedIn = false,
  complexName = null,
  adminName = null,
}: HeaderProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'Español' ? 'Inglés' : 'Español');
  };

  const toggleTheme = () => {
    setTheme(theme === 'Claro' ? 'Oscuro' : 'Claro');
  };

  const toggleCurrency = () => {
    setCurrency(currency === 'Pesos' ? 'Dólares' : 'Pesos');
  };

  const handleLogin = () => {
    setIsDropdownOpen(false);
    router.push('/login');
  }; 

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center shadow-md">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold italic text-white">
          Armonía
        </h1>
        {isLoggedIn && complexName && (
          <p className="text-sm text-white opacity-75">
            {complexName}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleLanguage}
          className="text-white hover:text-indigo-200 focus:outline-none"
          title={language === 'Español' ? 'Cambiar a Inglés' : 'Switch to Spanish'}
        >
          <Globe className="w-6 h-6" />
        </button>
        <button
          onClick={toggleTheme}
          className="text-white hover:text-indigo-200 focus:outline-none"
          title={theme === 'Claro' ? 'Cambiar a Oscuro' : 'Switch to Light'}
        >
          {theme === 'Claro' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>
        <button
          onClick={toggleCurrency}
          className="text-white hover:text-indigo-200 focus:outline-none"
          title={currency === 'Dólares' ? 'Cambiar a Pesos' : 'Switch to Dollars'}
        >
          <DollarSign className="w-6 h-6" />
        </button>
        {isLoggedIn && adminName && (
          <span className="text-white text-sm truncate max-w-[150px]">
            {adminName}
          </span>
        )}
        <div className="relative">
          <button
            className="text-white hover:text-indigo-200 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <User className="w-6 h-6" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg">
              <button
                className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-indigo-100 dark:hover:bg-indigo-700 flex items-center"
                onClick={() => {
                  if (isLoggedIn && logout) {
                    logout();
                  } else {
                    router.push('/login');
                  }
                  setIsDropdownOpen(false);
                }}
              >
                {isLoggedIn ? (
                  <>
                    <LogOut className="w-4 h-4 mr-2" />
                    {language === 'Español' ? 'Cerrar Sesión' : 'Logout'}
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    {language === 'Español' ? 'Iniciar Sesión' : 'Login'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}