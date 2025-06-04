
# Documentación Completa - Proyecto Loterías Dominicanas

## Descripción General

Aplicación web y móvil para consultar resultados de loterías dominicanas en tiempo real, con herramientas de predicción, generadores de números y estadísticas avanzadas.

## Arquitectura del Proyecto

### Web Application (React + TypeScript)
- **Framework**: React 18 con TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Estado**: React Hooks + Context API
- **API**: Fetch con manejo de errores
- **Routing**: React Router DOM
- **Build**: Vite

### Android Application (Java)
- **Lenguaje**: Java
- **Arquitectura**: MVVM + Repository Pattern
- **UI**: Material Design 3
- **Network**: Retrofit + OkHttp
- **Billing**: Google Play Billing Library
- **Notifications**: Firebase Cloud Messaging

## API Endpoints

### Base URL
```
https://api3.bolillerobingoonlinegratis.com/api
```

### Endpoints Principales

#### 1. Obtener todas las loterías
```
GET /companies/loterias
```

#### 2. Buscar loterías por fecha y empresa
```
GET /companies/buscar/loterias?fecha=2025-01-04&companies=0
```

#### 3. Obtener historial de lotería
```
GET /sorteos/buscar/historial?id={lottery_id}&fecha={date}
```

#### 4. Obtener predicciones
```
GET /predicciones?loteria_id={lottery_id}&fecha={date}
```

#### 5. Obtener estadísticas
```
GET /tabla/create?loteria_id={lottery_id}&fecha={date}&posicion=0
```

### Headers Requeridos
```javascript
{
  'Accept': 'application/json',
  'Origin': 'https://elboletoganador.com',
  'Referer': 'https://elboletoganador.com/'
}
```

## Estructura de Datos

### LotteryResult
```typescript
interface LotteryResult {
  id: number;
  titulo: string;
  nombre: string;
  pais: string;
  hora: string;
  image: string;
  company_id: number;
  ultimo_sorteo?: UltimoSorteo;
  numero_total?: number;
  cantidad_premios?: number;
  descripcion?: string;
}
```

### UltimoSorteo
```typescript
interface UltimoSorteo {
  id: number;
  loteria_id: number;
  fecha_sorteo: string;
  premios: string;
  created_at: string;
  updated_at: string;
}
```

## Categorías de Loterías

### Mapeo por Company ID
```javascript
const categoryMap = {
  1: 'Lotería Nacional',
  2: 'Leidsa', 
  3: 'Loteka',
  4: 'Primera',
  5: 'LoteDom',
  6: 'Real',
  7: 'Anguila',
  8: 'La Suerte',
  9: 'King Lottery',
  10: 'Americanas'
};
```

### Sorteos por Categoría

#### Lotería Nacional
- Juega + Pega +
- Gana Más
- Lotería Nacional

#### Leidsa
- Pega 3 Más
- Loto Pool
- Super Kino TV
- Quiniela Leidsa
- Loto - Loto Más

#### Real
- Quiniela Real
- Loto Pool
- Loto Real

#### Loteka
- Quiniela Loteka
- Mega Chances

#### Americanas
- New York 3:30
- New York 11:30
- Florida Día
- Florida Noche
- Mega Millions
- PowerBall

#### Primera
- La Primera Día
- Primera Noche
- Loto 5

#### La Suerte
- La Suerte MD
- La Suerte 6PM

#### LoteDom
- LoteDom
- El Quemaito Mayor

#### King Lottery
- King Lottery 12:30
- King Lottery 7:30

#### Anguila
- Anguila 10:00 AM
- Anguila 1:00 PM
- Anguila 6:00 PM
- Anguila 9:00 PM

## Funcionalidades Principales

### 1. Consulta de Resultados
- **Filtrado por categoría**: Todas las categorías principales
- **Búsqueda por nombre**: Búsqueda en tiempo real
- **Selección de fecha**: DatePicker para consultas históricas
- **Actualización automática**: Resultados en tiempo real

### 2. Generadores de Números
- **Aleatorio**: Disponible gratis
- **Por Sueños**: Premium - Interpretación de sueños
- **Por Edad**: Premium - Basado en fecha de nacimiento
- **Lectura de Café**: Premium - Interpretación de patrones

### 3. Sistema de Suscripción
- **Plan Mensual**: $2.99/mes
- **Plan Trimestral**: $7.99/3 meses
- **Plan Anual**: $24.99/año (mejor oferta)

#### Beneficios Premium
- Sin anuncios
- Todos los generadores desbloqueados
- Notificaciones diarias personalizadas
- Estadísticas avanzadas
- Herramientas exclusivas

### 4. Notificaciones
- **Firebase Cloud Messaging**: Para notificaciones push
- **Configuración por categoría**: Usuario selecciona categorías
- **Horarios personalizados**: Notificaciones diarias

## Instalación y Configuración

### Web Application

#### Dependencias Principales
```json
{
  "@tanstack/react-query": "^4.29.0",
  "react": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "tailwindcss": "^3.3.0",
  "typescript": "^5.0.0",
  "vite": "^4.4.0",
  "date-fns": "^2.30.0",
  "lucide-react": "^0.263.0"
}
```

#### Comandos de Instalación
```bash
npm install
npm run dev
npm run build
npm run preview
```

### Android Application

#### Dependencias (build.gradle)
```gradle
dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.9.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    implementation 'androidx.lifecycle:lifecycle-viewmodel:2.6.1'
    implementation 'androidx.lifecycle:lifecycle-livedata:2.6.1'
    
    // Network
    implementation 'com.squareup.retrofit2:retrofit:2.9.0'
    implementation 'com.squareup.retrofit2:converter-gson:2.9.0'
    implementation 'com.squareup.okhttp3:logging-interceptor:4.10.0'
    
    // Billing
    implementation 'com.android.billingclient:billing:5.0.0'
    
    // Firebase
    implementation 'com.google.firebase:firebase-messaging:23.2.1'
    
    // Ads
    implementation 'com.google.android.gms:play-services-ads:22.2.0'
    
    // Image Loading
    implementation 'com.github.bumptech.glide:glide:4.15.1'
}
```

#### Configuración Firebase
1. Crear proyecto en Firebase Console
2. Añadir app Android con package name
3. Descargar `google-services.json`
4. Configurar Cloud Messaging

#### Configuración Google Play Billing
1. Crear productos en Google Play Console
2. Configurar SKUs en SubscriptionManager
3. Implementar validación en servidor (recomendado)

## Estructura de Archivos

### Web Application
```
src/
├── components/
│   ├── ui/
│   ├── BottomNavigation.tsx
│   ├── Header.tsx
│   ├── ThemeToggle.tsx
│   └── DelayedNumbers.tsx
├── pages/
│   ├── Home.tsx
│   ├── Categories.tsx
│   ├── HotNumbers.tsx
│   ├── Generator.tsx
│   └── Settings.tsx
├── services/
│   └── lotteryApi.ts
├── hooks/
│   └── useTheme.tsx
├── contexts/
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
└── types/
    └── lottery.ts
```

### Android Application
```
app/src/main/java/com/loterias/dominicanas/
├── activities/
│   ├── MainActivity.java
│   ├── SplashActivity.java
│   └── PremiumActivity.java
├── fragments/
│   ├── HomeFragment.java
│   ├── GeneratorFragment.java
│   ├── SubscriptionFragment.java
│   └── ...
├── adapters/
│   └── LotteryAdapter.java
├── models/
│   ├── Lottery.java
│   ├── UltimoSorteo.java
│   └── ...
├── services/
│   ├── ApiClient.java
│   ├── LotteryApiService.java
│   ├── SubscriptionManager.java
│   └── FirebaseMessagingService.java
├── utils/
│   ├── PreferenceManager.java
│   ├── NumberGenerator.java
│   └── AdManager.java
└── repositories/
    └── LotteryRepository.java
```

## Manejo de Estados

### Loading States
```typescript
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### Error Handling
```typescript
try {
  const response = await LotteryAPI.getLotteryResults();
  // Handle success
} catch (error) {
  console.error('Error loading data:', error);
  // Handle error
}
```

## Temas y Estilos

### Sistema de Temas
- **Tema Oscuro**: Por defecto
- **Tema Claro**: Opcional
- **Persistencia**: LocalStorage (web) / SharedPreferences (Android)

### Colores Principales
```css
:root {
  --primary: #6366F1;
  --secondary: #3B82F6;
  --accent: #FFD700;
  --background: #0F172A;
  --surface: #1E293B;
  --text-primary: #FFFFFF;
  --text-secondary: #94A3B8;
}
```

## Funciones Futuras Sugeridas

### Corto Plazo
1. **Favoritos**: Marcar loterías favoritas
2. **Comparador**: Comparar resultados entre fechas
3. **Filtros avanzados**: Por hora, por rango de números
4. **Compartir mejorado**: Plantillas personalizadas

### Mediano Plazo
1. **Análisis predictivo**: IA para predicciones
2. **Gráficos avanzados**: Visualización de tendencias
3. **Alertas personalizadas**: Múltiples tipos de notificaciones
4. **Exportar datos**: PDF, Excel
5. **Modo offline**: Cache de resultados

### Largo Plazo
1. **Comunidad**: Foro de usuarios
2. **Pronósticos grupales**: Predicciones colaborativas
3. **API pública**: Para desarrolladores terceros
4. **Widget**: Para pantalla de inicio
5. **Integración con redes sociales**

## Métricas y Analytics

### Eventos Importantes
- Apertura de app
- Consulta de resultados
- Uso de generadores
- Compras de suscripción
- Compartir resultados

### KPIs Sugeridos
- DAU/MAU (Usuarios activos)
- Retención (1, 7, 30 días)
- Conversión a premium
- Tiempo en app
- Categorías más consultadas

## Seguridad

### API Security
- Rate limiting en el backend
- Validación de headers
- Manejo seguro de tokens

### Data Privacy
- Cumplimiento GDPR
- Política de privacidad clara
- Consentimiento para notificaciones
- Datos mínimos necesarios

## Mantenimiento

### Actualizaciones Regulares
- Verificación de APIs externas
- Actualización de dependencias
- Optimización de rendimiento
- Corrección de bugs reportados

### Monitoreo
- Logs de errores
- Métricas de rendimiento
- Disponibilidad de APIs
- Feedback de usuarios

## Contacto y Soporte

Para cualquier consulta técnica o su implementación, contactar a:
- Email: soporte@loteriasdominicanas.com
- Web: https://loteriasdominicanas.com/contacto

---

*Documentación elaborada para el proyecto Loterías Dominicanas. Todos los derechos reservados.*

*Última actualización: Junio 2025*
