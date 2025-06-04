
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-lottery-gradient">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo vilug.com */}
        <div className="flex items-center space-x-2">
          <div className="text-white font-bold text-lg">
            vilug.com
          </div>
        </div>
        
        {/* Title */}
        <div className="flex-1 text-center">
          <h1 className="text-white font-bold text-lg">
            Loterías Dominicanas
          </h1>
        </div>
        
        {/* Theme Toggle Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-9 w-9 text-white hover:bg-white/20"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
