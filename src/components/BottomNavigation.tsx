
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Home, Calendar, TrendingUp, Sparkles, Settings } from 'lucide-react';

export type NavItem = 'results' | 'categories' | 'hot-numbers' | 'generator' | 'settings';

interface BottomNavigationProps {
  activeTab: NavItem;
  onTabChange: (tab: NavItem) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { t } = useLanguage();

  const navItems = [
    {
      id: 'results' as NavItem,
      label: t('nav.results'),
      icon: Home,
    },
    {
      id: 'categories' as NavItem,
      label: t('nav.categories'),
      icon: Calendar,
    },
    {
      id: 'hot-numbers' as NavItem,
      label: t('nav.hot-numbers'),
      icon: TrendingUp,
    },
    {
      id: 'generator' as NavItem,
      label: t('nav.generator'),
      icon: Sparkles,
    },
    {
      id: 'settings' as NavItem,
      label: t('nav.settings'),
      icon: Settings,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="container px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className={`h-5 w-5 mb-1 ${isActive ? 'text-white' : 'text-muted-foreground'}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-white' : 'text-muted-foreground'}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
