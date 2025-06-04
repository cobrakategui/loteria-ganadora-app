
# Loterías Dominicanas - Android Studio Project

## Estructura del Proyecto Android

Este directorio contiene todos los archivos necesarios para implementar la aplicación de Loterías Dominicanas en Android Studio usando Java.

### Características Implementadas:

1. **API Integration**: Conexión completa con las APIs de loterías
2. **AdMob Integration**: Banner, interstitial y rewarded ads
3. **In-App Purchases**: Suscripciones mensuales, trimestrales y anuales
4. **Firebase Push Notifications**: Notificaciones para nuevos resultados
5. **Number Generation Tools**: Todas las herramientas de generación de números
6. **Material Design**: UI moderna siguiendo las guías de Material Design

### Estructura de Archivos:

```
app/
├── src/main/java/com/loterias/dominicanas/
│   ├── activities/
│   ├── adapters/
│   ├── fragments/
│   ├── models/
│   ├── services/
│   ├── utils/
│   └── MainActivity.java
├── src/main/res/
│   ├── layout/
│   ├── values/
│   ├── drawable/
│   └── menu/
└── build.gradle
```

### Configuración Requerida:

1. **Android SDK**: Mínimo API 21 (Android 5.0)
2. **Google Play Services**: Para AdMob y compras integradas
3. **Firebase**: Para notificaciones push
4. **Retrofit**: Para llamadas a la API
5. **Glide**: Para carga de imágenes

### Pasos de Instalación:

1. Crear nuevo proyecto en Android Studio
2. Copiar todos los archivos de este directorio
3. Configurar Firebase y AdMob
4. Añadir las dependencias en build.gradle
5. Configurar permisos en AndroidManifest.xml
