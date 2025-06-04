
# 📱 Loterías Dominicanas Today - Documentación Completa

## 🌐 Versión Web

### Tecnologías Utilizadas
- **React 18** con TypeScript
- **Vite** como bundler
- **Tailwind CSS** para estilos
- **Shadcn/UI** para componentes
- **React Router** para navegación
- **TanStack Query** para manejo de estado
- **Lucide React** para iconos

### Características Principales
1. **Resultados en Tiempo Real**: Integración con API de loterías dominicanas.
2. **Sistema de Temas**: Modo claro/oscuro configurable.
3. **Herramientas de Números**: Múltiples generadores de números personalizados.
4. **Diseño Responsivo**: Interfaz tipo aplicación móvil con navegación inferior.
5. **Filtros Avanzados**: Por fecha, categoría, empresa y búsqueda en tiempo real.
6. **Sistema de Favoritos**: Marcar y destacar loterías favoritas.

### Estructura de API

La aplicación se comunica con la siguiente API principal:

```
https://api3.bolillerobingoonlinegratis.com/api/companies/loterias
```

#### Endpoints Principales:

| Endpoint | Descripción | Parámetros |
|----------|-------------|------------|
| `/companies/loterias` | Obtiene todos los resultados del día | - |
| `/companies/buscar/loterias` | Filtra resultados | `fecha`, `companies` |
| `/loterias/{id}` | Obtiene detalles de una lotería | `id` |
| `/sorteos/buscar/historial` | Historial de sorteos | `id`, `fecha` |
| `/predicciones` | Predicciones de números | `loteria_id`, `fecha` |
| `/tabla/create` | Estadísticas de números | `loteria_id`, `fecha`, `posicion` |
| `/loterias` | Categorías de loterías | - |
| `/loto` | Resultados de lotos | - |

#### Headers Requeridos:

```javascript
{
  'accept': 'application/json',
  'accept-language': 'en,es-ES;q=0.9,es;q=0.8',
  'origin': 'https://elboletoganador.com',
  'referer': 'https://elboletoganador.com/',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site'
}
```

### Estructura de Archivos Web
```
src/
├── components/
│   ├── ui/              # Componentes base de Shadcn
│   ├── Header.tsx       # Encabezado con logo y controles
│   ├── BottomNavigation.tsx # Navegación tipo app móvil
│   ├── LotteryCard.tsx  # Tarjeta de resultado de lotería
│   ├── DelayedNumbers.tsx # Componente de números atrasados
│   ├── ThemeToggle.tsx  # Selector de tema
│   └── LoadingSpinner.tsx # Indicador de carga
├── contexts/
│   ├── ThemeContext.tsx # Contexto para manejo de temas
│   └── LanguageContext.tsx # Contexto para internacionalización
├── hooks/
│   ├── useLocalStorage.ts # Hook para almacenamiento local
│   └── useTheme.tsx      # Hook para acceder al tema
├── pages/
│   ├── Results.tsx      # Página principal de resultados
│   ├── Categories.tsx   # Categorías de sorteos
│   ├── HotNumbers.tsx   # Números calientes
│   ├── Generator.tsx    # Generadores de números
│   └── Settings.tsx     # Configuraciones
├── services/
│   └── lotteryApi.ts    # Servicio de API
├── types/
│   └── lottery.ts       # Tipos TypeScript
├── utils/
│   └── numberGenerator.ts # Utilidades para generar números
└── App.tsx              # Componente principal
```

### Funcionalidades por Página

#### 🏠 Página de Resultados
- Filtrado por fecha usando date picker
- Filtrado por categoría de lotería
- Búsqueda en tiempo real por nombre
- Agrupación por empresa
- Sistema de favoritos
- Visualización en grid o lista
- Números atrasados destacados

#### 📅 Categorías de Sorteos
- Listado de todas las categorías
- Búsqueda de categorías
- Indicadores de tipo (Quiniela/Loto)
- Descripción detallada de cada categoría

#### 🔥 Números Calientes
- Selección de lotería específica
- Visualización de números con más retraso
- Estadísticas de aparición
- Filtrado y búsqueda

#### 🎲 Generador de Números
- Generador aleatorio básico
- Generador por sueños (premium)
- Generador por nombre y edad (premium)
- Generador por lectura de café (premium)
- Control de cantidad de números a generar

#### ⚙️ Configuraciones
- Selector de tema claro/oscuro
- Selector de idioma
- Opciones para compartir la aplicación
- Información y políticas de privacidad

---

## 📱 Aplicación Android Studio

### Configuración del Proyecto

#### 1. Aspectos Básicos
```
Nombre: Loterías Dominicanas Today
Package: com.loterias.dominicanas
Versión mínima: API 21 (Android 5.0 Lollipop)
Target SDK: API 34 (Android 14)
Lenguaje: Java
```

#### 2. Dependencias Principales
```gradle
dependencies {
    // AndroidX y Material
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    
    // Networking
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.12.0'
    
    // Imágenes
    implementation 'com.github.bumptech.glide:glide:4.16.0'
    
    // Monetización
    implementation 'com.google.android.gms:play-services-ads:22.6.0'
    implementation 'com.android.billingclient:billing:6.1.0'
    
    // Firebase
    implementation platform('com.google.firebase:firebase-bom:32.7.1')
    implementation 'com.google.firebase:firebase-messaging'
    implementation 'com.google.firebase:firebase-analytics'
    
    // Ubicación
    implementation 'com.google.android.gms:play-services-location:21.0.1'
}
```

### Estructura del Proyecto Android

#### 1. 🗂️ Paquetes Principales

```
java/com/loterias/dominicanas/
├── activities/        # Actividades principales
├── fragments/         # Fragmentos de UI
├── adapters/          # Adaptadores para RecyclerView
├── models/            # Modelos de datos
├── services/          # Servicios de API y subscripciones
├── repositories/      # Repositorios de datos
└── utils/             # Utilidades y ayudantes
```

#### 2. 📱 Actividades y Fragmentos

| Clase | Descripción |
|-------|-------------|
| `MainActivity` | Actividad principal con navegación inferior |
| `SplashActivity` | Pantalla de inicio con carga de datos |
| `HomeFragment` | Fragmento principal con resultados de lotería |
| `CategoriesFragment` | Categorías de sorteos |
| `HotNumbersFragment` | Números calientes |
| `GeneratorFragment` | Generadores de números |
| `SettingsFragment` | Configuraciones de la app |
| `SubscriptionFragment` | Gestión de suscripciones |

#### 3. 🧰 Componentes Clave

1. **LotteryRepository**: Maneja toda la comunicación con la API
2. **PreferenceManager**: Almacena preferencias del usuario y favoritos
3. **AdManager**: Administra anuncios banner, intersticiales y de recompensa
4. **SubscriptionManager**: Integra Google Play Billing para suscripciones
5. **NumberGenerator**: Implementa algoritmos para generación de números
6. **NotificationManager**: Maneja notificaciones push con Firebase

### Integración de AdMob

#### 1. Configuración Básica
```java
// Inicialización en MainActivity
MobileAds.initialize(this, initializationStatus -> {
    // AdMob inicializado correctamente
});
```

#### 2. Tipos de Anuncios Implementados

1. **Banner**: En la parte inferior de la aplicación
```java
AdRequest adRequest = new AdRequest.Builder().build();
bannerAdView.loadAd(adRequest);
```

2. **Interstitial**: Entre navegaciones importantes
```java
InterstitialAd.load(context, INTERSTITIAL_AD_UNIT_ID, adRequest, 
    new InterstitialAdLoadCallback() {
        @Override
        public void onAdLoaded(@NonNull InterstitialAd interstitialAd) {
            mInterstitialAd = interstitialAd;
        }
    });
```

3. **Rewarded**: Para desbloquear temporalmente funciones premium
```java
RewardedAd.load(context, REWARDED_AD_UNIT_ID, adRequest,
    new RewardedAdLoadCallback() {
        @Override
        public void onAdLoaded(@NonNull RewardedAd rewardedAd) {
            mRewardedAd = rewardedAd;
        }
    });
```

### Sistema de Suscripciones

#### 1. Productos Configurados

| SKU | Descripción | Precio |
|-----|-------------|--------|
| `premium_monthly` | Suscripción mensual | $2.99/mes |
| `premium_quarterly` | Suscripción trimestral | $7.99/trimestre |
| `premium_yearly` | Suscripción anual | $19.99/año |

#### 2. Beneficios Premium

- Eliminación de todos los anuncios
- Acceso a todos los generadores de números
- Notificaciones de resultados personalizadas
- Funciones de estadísticas avanzadas

#### 3. Implementación de Google Play Billing

```java
private BillingClient billingClient;

private void initializeBilling() {
    billingClient = BillingClient.newBuilder(context)
        .setListener(purchasesUpdatedListener)
        .enablePendingPurchases()
        .build();
    
    billingClient.startConnection(new BillingClientStateListener() {
        @Override
        public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                // El servicio de facturación está listo
                querySubscriptions();
            }
        }
        
        @Override
        public void onBillingServiceDisconnected() {
            // Intentar reconectar
        }
    });
}
```

### Notificaciones Push

La aplicación utiliza Firebase Cloud Messaging (FCM) para:

1. Notificaciones de resultados en tiempo real
2. Alertas de próximos sorteos importantes
3. Notificaciones personalizadas para sorteos favoritos

#### Implementación:

```java
public class FirebaseMessagingService extends com.google.firebase.messaging.FirebaseMessagingService {

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        // Datos de la notificación
        Map<String, String> data = remoteMessage.getData();
        
        if (data.containsKey("lottery_id")) {
            int lotteryId = Integer.parseInt(data.get("lottery_id"));
            showResultNotification(lotteryId);
        }
    }
    
    @Override
    public void onNewToken(String token) {
        // Enviar el token al servidor
        sendRegistrationToServer(token);
    }
}
```

### Funcionalidades de la Aplicación Android

#### 1. Resultados de Lotería
- Visualización de resultados diarios
- Filtrado por empresa y categoría
- Búsqueda en tiempo real
- Historial de resultados por fecha

#### 2. Favoritos
- Marcado de loterías favoritas
- Filtro rápido para ver solo favoritos
- Notificaciones personalizadas para favoritos

#### 3. Números Calientes
- Análisis estadístico de frecuencia
- Visualización de números con mayor retraso
- Filtrado por lotería específica

#### 4. Generadores de Números
- Aleatorio: Disponible para todos los usuarios
- Por sueños: Interpretación de sueños para números
- Por cumpleaños: Basado en nombre y edad
- Por café: Interpretación de patrones en café

#### 5. Configuraciones
- Modo oscuro/claro
- Idioma (Español/Inglés)
- Selección de notificaciones
- Gestión de cuenta premium

---

## 🔧 Guía de Implementación

### Implementación Web

1. **Instalación**:
   ```bash
   npm install
   npm run dev
   ```

2. **Build para producción**:
   ```bash
   npm run build
   ```

3. **Despliegue**:
   - La carpeta `dist` contiene la aplicación compilada
   - Puedes desplegarla en Netlify, Vercel u otro servicio

### Implementación Android

1. **Requisitos**:
   - Android Studio (última versión estable)
   - JDK 11 o superior
   - Cuenta de Google Play Console (para publicación)

2. **Configuración de Firebase**:
   - Crear proyecto en Firebase Console
   - Descargar `google-services.json`
   - Colocar en directorio `app/`

3. **Configuración de AdMob**:
   - Crear cuenta AdMob
   - Configurar IDs de anuncios en `strings.xml`
   - Reemplazar IDs de prueba por IDs reales

4. **Configuración de Billing**:
   - Crear productos de suscripción en Google Play Console
   - Configurar SKUs en `SubscriptionManager.java`

5. **Build y Firma**:
   - Generar key de firma:
     ```bash
     keytool -genkey -v -keystore loterias-dominicanas.keystore -alias loterias -keyalg RSA -keysize 2048 -validity 10000
     ```
   - Configurar signing en `build.gradle`
   - Generar APK firmado o Bundle para Google Play

---

## 📚 Referencias y Recursos

### API
- Base URL: `https://api3.bolillerobingoonlinegratis.com/api`
- Headers específicos para evitar problemas CORS
- Referencia de parámetros y formatos de respuesta incluidos

### Diseño
- Material Design 3 para Android
- Esquema de colores con gradientes púrpura/azul
- Componentes Shadcn/UI para web

### Recursos Adicionales
- Iconos: Lucide React (web) / Material Icons (Android)
- Fuentes: Inter para web, Roboto para Android
- Estructura de navegación tipo aplicación móvil

---

## 🚀 Roadmap y Mejoras Futuras

1. **Sincronización entre dispositivos** usando Firebase Auth
2. **Soporte para widgets** en Android
3. **Estadísticas avanzadas** y análisis de probabilidad
4. **Compartir combinaciones** generadas con amigos
5. **Modo offline** con almacenamiento local más robusto
6. **Mejoras de rendimiento** y optimización de carga
7. **Soporte para iOS** usando React Native o Flutter

---

Este documento serve como guía completa para entender y mantener tanto la aplicación web como la versión para Android de Loterías Dominicanas Today. Para cualquier duda adicional, consultar el código fuente y los comentarios incluidos.

© 2025 Loterías Dominicanas Today. Todos los derechos reservados.
