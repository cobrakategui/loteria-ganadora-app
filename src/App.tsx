
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { Header } from '@/components/Header';
import { BottomNavigation, NavItem } from '@/components/BottomNavigation';
import { Results } from '@/pages/Results';
import { Categories } from '@/pages/Categories';
import { HotNumbers } from '@/pages/HotNumbers';
import { Generator } from '@/pages/Generator';
import { Settings } from '@/pages/Settings';

const queryClient = new QueryClient();

const App = () => {
  const [activeTab, setActiveTab] = useState<NavItem>('results');

  const renderContent = () => {
    switch (activeTab) {
      case 'results':
        return <Results />;
      case 'categories':
        return <Categories />;
      case 'hot-numbers':
        return <HotNumbers />;
      case 'generator':
        return <Generator />;
      case 'settings':
        return <Settings />;
      default:
        return <Results />;
    }
  };

  const handleTabChange = (tab: NavItem) => {
    setActiveTab(tab);
  };

  const handleSettingsClick = () => {
    setActiveTab('settings');
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <TooltipProvider>
            <div className="min-h-screen bg-background text-foreground">
              <Header onSettingsClick={handleSettingsClick} />
              
              <main className="container mx-auto px-4 py-6 pb-24">
                {renderContent()}
              </main>

              <BottomNavigation 
                activeTab={activeTab} 
                onTabChange={handleTabChange} 
              />

              <Toaster />
              <Sonner />
            </div>
          </TooltipProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
