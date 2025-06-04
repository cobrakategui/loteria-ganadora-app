
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Settings as SettingsIcon } from 'lucide-react';

interface HeaderProps {
  onSettingsClick: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-lottery-gradient flex items-center justify-center">
            <span className="text-white font-bold text-lg">LD</span>
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">
              {t('app.title')}
            </h1>
            <p className="text-xs text-muted-foreground">
              Resultados diarios
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={onSettingsClick}
          className="h-9 w-9"
        >
          <SettingsIcon className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
