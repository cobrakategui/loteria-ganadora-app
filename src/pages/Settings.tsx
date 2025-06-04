
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Moon, Bell, Share, Download, Info, Settings as SettingsIcon, Heart } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  const handleShare = () => {
    const text = '¡Descubre los resultados de las loterías dominicanas en tiempo real con Loterías Dominicanas Today! 🎰✨';
    if (navigator.share) {
      navigator.share({
        title: 'Loterías Dominicanas Today',
        text,
        url: window.location.origin
      });
    } else {
      navigator.clipboard.writeText(`${text} ${window.location.origin}`);
      toast.success('Enlace copiado al portapapeles');
    }
  };

  const openAppStore = (store: 'ios' | 'android') => {
    const urls = {
      ios: 'https://apps.apple.com/app/loterias-dominicanas',
      android: 'https://play.google.com/store/apps/details?id=com.loterias.dominicanas'
    };
    // For demo purposes, show toast since apps don't exist yet
    toast.info(`Próximamente disponible en ${store === 'ios' ? 'App Store' : 'Google Play'}`);
  };

  return (
    <div className="space-y-6 pb-20">
      <h1 className="text-2xl font-bold gradient-text">
        {t('settings.title')}
      </h1>

      {/* Theme Settings */}
      <Card className="lottery-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Moon className="h-5 w-5 mr-2 text-lottery-pink" />
            {t('settings.theme')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Modo oscuro</p>
              <p className="text-sm text-muted-foreground">
                {theme === 'dark' ? t('theme.dark') : t('theme.light')}
              </p>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
            />
          </div>
        </CardContent>
      </Card>

      {/* Language Settings */}
      <Card className="lottery-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Bell className="h-5 w-5 mr-2 text-lottery-pink" />
            {t('settings.language')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover">
              <SelectItem value="es">{t('language.spanish')}</SelectItem>
              <SelectItem value="en">{t('language.english')}</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Contact & Social */}
      <Card className="lottery-card">
        <CardHeader>
          <CardTitle>{t('settings.contact')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={() => window.open('https://instagram.com/loteriasrdtoday', '_blank')}
          >
            <span className="mr-2">📱</span>
            @loteriasrdtoday
          </Button>
        </CardContent>
      </Card>

      {/* App Actions */}
      <Card className="lottery-card">
        <CardContent className="space-y-3 pt-6">
          <Button onClick={handleShare} className="w-full bg-lottery-gradient">
            <Share className="h-4 w-4 mr-2" />
            {t('settings.share')}
          </Button>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                {t('settings.download')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Descargar la App</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Button
                  onClick={() => openAppStore('ios')}
                  className="w-full"
                  variant="outline"
                >
                  📱 Descargar para iOS
                </Button>
                <Button
                  onClick={() => openAppStore('android')}
                  className="w-full"
                  variant="outline"
                >
                  🤖 Descargar para Android
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Info className="h-4 w-4 mr-2" />
                {t('settings.about')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card">
              <DialogHeader>
                <DialogTitle>Acerca de</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-lottery-gradient flex items-center justify-center">
                    <span className="text-white font-bold text-xl">LD</span>
                  </div>
                  <h3 className="text-lg font-semibold">Loterías Dominicanas Today</h3>
                  <p className="text-sm text-muted-foreground">Versión 1.0.0</p>
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  <p>{t('developed.by')} <span className="font-semibold text-lottery-pink">Lovable</span></p>
                  <p className="flex items-center justify-center mt-1">
                    {t('developed.with.love')} <Heart className="h-4 w-4 ml-1 text-red-500" />
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <SettingsIcon className="h-4 w-4 mr-2" />
                {t('settings.privacy')}
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Políticas de Privacidad</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 text-sm">
                <p>
                  En Loterías Dominicanas Today, respetamos tu privacidad y nos comprometemos a proteger tu información personal.
                </p>
                <div>
                  <h4 className="font-semibold mb-2">Información que recopilamos:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Preferencias de tema y idioma (almacenadas localmente)</li>
                    <li>Historial de números generados (almacenado localmente)</li>
                    <li>Datos de uso anónimos para mejorar la experiencia</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cómo usamos tu información:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Para personalizar tu experiencia en la aplicación</li>
                    <li>Para proporcionar resultados de loterías actualizados</li>
                    <li>Para mejorar nuestros servicios</li>
                  </ul>
                </div>
                <p className="text-muted-foreground">
                  No compartimos tu información personal con terceros. Todos los datos se almacenan de forma segura en tu dispositivo.
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Copyright */}
      <div className="text-center text-xs text-muted-foreground py-4">
        {t('common.copyright')}
      </div>
    </div>
  );
}
