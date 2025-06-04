
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun, Monitor, Globe, Palette, Info, Heart, Mail } from 'lucide-react';
import { toast } from 'sonner';

export function Settings() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();

  const handleClearFavorites = () => {
    localStorage.removeItem('favorite-lotteries');
    toast.success('Favoritos eliminados correctamente');
  };

  const handleClearHistory = () => {
    localStorage.removeItem('generated-numbers-history');
    toast.success('Historial eliminado correctamente');
  };

  const handleExportData = () => {
    const data = {
      favorites: JSON.parse(localStorage.getItem('favorite-lotteries') || '[]'),
      history: JSON.parse(localStorage.getItem('generated-numbers-history') || '[]'),
      theme: theme,
      language: language,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'loterias-data.json';
    a.click();
    
    toast.success('Datos exportados correctamente');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold gradient-text mb-2">
          {t('settings.title')}
        </h1>
        <p className="text-muted-foreground">
          Personaliza tu experiencia con la aplicación
        </p>
      </div>

      {/* Apariencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Apariencia
          </CardTitle>
          <CardDescription>
            Personaliza el tema y la apariencia de la aplicación
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Tema</label>
              <p className="text-xs text-muted-foreground">
                Selecciona tu tema preferido
              </p>
            </div>
            <Select value={theme} onValueChange={(value: 'light' | 'dark' | 'system') => setTheme(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Claro
                  </div>
                </SelectItem>
                <SelectItem value="dark">
                  <div className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Oscuro
                  </div>
                </SelectItem>
                <SelectItem value="system">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    Sistema
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Idioma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Idioma
          </CardTitle>
          <CardDescription>
            Selecciona tu idioma preferido
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Idioma de la aplicación</label>
              <p className="text-xs text-muted-foreground">
                Cambia el idioma de la interfaz
              </p>
            </div>
            <Select value={language} onValueChange={(value: 'es' | 'en') => setLanguage(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Datos de la aplicación
          </CardTitle>
          <CardDescription>
            Gestiona tus datos personales y favoritos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Favoritos</label>
              <p className="text-xs text-muted-foreground">
                Eliminar todas las loterías favoritas
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearFavorites}>
              Limpiar
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Historial</label>
              <p className="text-xs text-muted-foreground">
                Eliminar historial de números generados
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleClearHistory}>
              Limpiar
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <label className="text-sm font-medium">Exportar datos</label>
              <p className="text-xs text-muted-foreground">
                Descarga una copia de tus datos
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExportData}>
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Acerca de
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-lg bg-lottery-gradient flex items-center justify-center">
              <span className="text-white font-bold text-xl">LD</span>
            </div>
            <h3 className="font-semibold text-lg">Loterías Dominicanas</h3>
            <p className="text-sm text-muted-foreground">
              Versión 1.0.0
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              La aplicación más completa para consultar resultados de loterías dominicanas, 
              generar números de la suerte y mantenerte al día con los sorteos.
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-center">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contacto
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
