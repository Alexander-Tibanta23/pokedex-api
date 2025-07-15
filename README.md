# Pokédex Interactiva

Una Pokédex web interactiva y moderna que consume la PokéAPI para mostrar información detallada de Pokémon con un diseño minimalista inspirado en la Pokédex clásica de la serie animada.

## 🌟 Características

### Funcionalidades Principales
- **Búsqueda por nombre o número**: Busca cualquier Pokémon de la primera generación (1-151)
- **Búsqueda aleatoria**: Descubre Pokémon al azar con un solo clic
- **Información completa**: Imagen oficial, tipos, habilidades, estadísticas, peso, altura
- **Estadísticas visuales**: Barras de progreso animadas para HP, ataque, defensa, etc.
- **Cadena evolutiva**: Visualiza la evolución completa del Pokémon
- **Comparador de Pokémon**: Compara estadísticas entre dos Pokémon
- **Sistema de favoritos**: Guarda tus Pokémon favoritos en localStorage

### Diseño y UX
- **Diseño responsive**: Funciona perfectamente en móviles, tablets y desktop
- **Colores temáticos**: La tarjeta cambia de color según el tipo del Pokémon
- **Animaciones suaves**: Efectos de hover, transiciones y animaciones de carga
- **Interfaz minimalista**: Inspirada en la Pokédex clásica con toques modernos
- **Manejo de errores**: Mensajes claros cuando un Pokémon no existe
- **Loading states**: Indicadores de carga durante las peticiones

### Tecnologías Utilizadas
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con Flexbox, Grid, animaciones y gradientes
- **JavaScript ES6+**: Funcionalidad completa con async/await, fetch API y módulos ES6
- **PokéAPI**: Consumo de datos oficiales de Pokémon
- **Font Awesome**: Iconos modernos y atractivos
- **Google Fonts**: Tipografía Orbitron para el estilo retro-futurista

## 🚀 Cómo usar

1. **Iniciar servidor local**: Ejecuta `python -m http.server 8001` en la terminal
2. **Abrir la aplicación**: Ve a `http://localhost:8001/public/` en tu navegador
3. **Buscar Pokémon**: Escribe el nombre o número del Pokémon en la barra de búsqueda
4. **Explorar**: Usa el botón "Aleatorio" para descubrir nuevos Pokémon
5. **Guardar favoritos**: Haz clic en el corazón para agregar a favoritos
6. **Comparar**: Usa el botón de comparación para comparar dos Pokémon
7. **Ver evolución**: Explora la cadena evolutiva haciendo clic en las evoluciones

## 📱 Funcionalidades Detalladas

### Búsqueda
- Búsqueda por nombre (ej: "pikachu", "charizard")
- Búsqueda por número (ej: "25", "006")
- Búsqueda aleatoria con el botón dedicado
- Validación de entrada y manejo de errores

### Información Mostrada
- **Datos básicos**: Nombre, número, imagen oficial
- **Tipos**: Con colores temáticos y gradientes
- **Estadísticas físicas**: Altura y peso
- **Habilidades**: Normales y ocultas diferenciadas
- **Stats detalladas**: HP, Ataque, Defensa, At. Esp., Def. Esp., Velocidad
- **Cadena evolutiva**: Evoluciones completas con imágenes

### Sistema de Favoritos
- Guardado automático en localStorage
- Contador de favoritos en el header
- Modal dedicado para gestionar favoritos
- Eliminación individual de favoritos
- Acceso rápido a Pokémon favoritos

### Comparador
- Comparación lado a lado de dos Pokémon
- Información visual de ambos Pokémon
- Fácil reemplazo de Pokémon en comparación
- Panel dedicado para comparaciones

## 🎨 Diseño

### Paleta de Colores
- **Primario**: Dorado (#ffd700) - Inspirado en la Pokédex clásica
- **Secundario**: Azul gradiente (#1e3c72 → #2a5298)
- **Tipos**: Colores oficiales de Pokémon con gradientes
- **Estados**: Verde (éxito), Rojo (error), Azul (info)

### Tipografía
- **Orbitron**: Fuente principal con estilo retro-futurista
- **Pesos**: 400 (normal), 700 (bold), 900 (black)

### Responsive Design
- **Desktop**: Layout completo con todas las funcionalidades
- **Tablet**: Adaptación de grid y espaciado
- **Mobile**: Stack vertical, botones adaptados, navegación optimizada

## 🔧 Estructura del Proyecto

```
pokedex-api/
├── public/
│   └── index.html
├── src/
│   ├── css/
│   │   ├── main.css (archivo principal que importa todos los módulos)
│   │   ├── base/
│   │   │   ├── variables.css (variables CSS y utilidades)
│   │   │   └── reset.css (reset y configuración base)
│   │   ├── components/
│   │   │   ├── header.css (estilos del header)
│   │   │   ├── buttons.css (estilos de botones)
│   │   │   ├── search.css (barra de búsqueda)
│   │   │   ├── pokemon-card.css (tarjeta principal del Pokémon)
│   │   │   ├── comparison.css (panel de comparación)
│   │   │   └── modal.css (modales y overlay)
│   │   ├── types/
│   │   │   └── pokemon-types.css (estilos de tipos de Pokémon)
│   │   └── responsive/
│   │       └── media-queries.css (responsive design)
│   └── js/
│       ├── core/
│       │   └── main.js (punto de entrada de la aplicación)
│       ├── dom/
│       │   └── dom.js (referencias y manipulación del DOM)
│       ├── api/
│       │   ├── api.js (funciones de comunicación con la API)
│       │   └── config.js (configuración y constantes)
│       ├── features/
│       │   ├── search.js (funciones de búsqueda)
│       │   ├── favorites.js (lógica de favoritos)
│       │   ├── comparison.js (lógica de comparación)
│       │   └── state.js (estado global de la aplicación)
│       └── ui/
│           └── ui.js (funciones de interfaz de usuario)
├── README.md
└── .gitignore
```

### Arquitectura Modular

#### JavaScript Modules (ES6)
- **`core/main.js`**: Punto de entrada, inicialización y coordinación de módulos
- **`dom/dom.js`**: Referencias del DOM y funciones de manipulación
- **`api/config.js`**: Configuración, constantes y endpoints de API
- **`api/api.js`**: Todas las llamadas a la PokéAPI y manejo de datos
- **`features/search.js`**: Lógica de búsqueda y filtrado
- **`features/favorites.js`**: Gestión del sistema de favoritos
- **`features/comparison.js`**: Lógica de comparación de Pokémon
- **`features/state.js`**: Estado global y gestión de datos
- **`ui/ui.js`**: Manipulación del DOM y actualizaciones de interfaz

#### CSS Modules (Modular Architecture)
- **`main.css`**: Archivo principal que importa todos los módulos CSS
- **`base/variables.css`**: Variables CSS, colores, sombras y animaciones
- **`base/reset.css`**: Reset CSS y configuración base del body
- **`components/`**: Estilos modulares por componente
  - `header.css`: Estilos del encabezado y navegación
  - `buttons.css`: Componentes de botones y estados
  - `search.css`: Interfaz de búsqueda y formularios
  - `pokemon-card.css`: Tarjetas de Pokémon y estadísticas
  - `comparison.css`: Panel de comparación
  - `modal.css`: Diálogos modales y overlay
- **`types/pokemon-types.css`**: Badges y colores de tipos de Pokémon
- **`responsive/media-queries.css`**: Media queries y diseño responsive

## 🌐 APIs Utilizadas

### PokéAPI Endpoints
- `GET /pokemon/{id or name}` - Datos básicos del Pokémon
- `GET /pokemon-species/{id or name}` - Información de especie
- `GET /evolution-chain/{id}` - Cadena evolutiva

### Características de la API
- Rate limiting automático
- Manejo de errores robusto
- Caché de imágenes con fallbacks
- Validación de respuestas

## 🎯 Características Técnicas

### JavaScript (Arquitectura Modular ES6)
- **ES6 Modules**: Import/export para organización modular
- **Async/Await**: Manejo asíncrono de peticiones
- **Fetch API**: Peticiones HTTP modernas
- **LocalStorage**: Persistencia de favoritos
- **Event Delegation**: Manejo eficiente de eventos
- **Single Responsibility**: Cada módulo tiene una responsabilidad específica
- **Error Handling**: Manejo robusto de errores en cada módulo
- **State Management**: Gestión centralizada del estado de la aplicación

### CSS (Arquitectura Modular)
- **CSS Variables**: Colores y valores reutilizables centralizados
- **Modular Structure**: Estilos organizados por componente y funcionalidad
- **Flexbox & Grid**: Layouts modernos y responsive
- **Animaciones**: Transiciones suaves y keyframes optimizados
- **Gradientes**: Efectos visuales modernos y atractivos
- **Media Queries**: Diseño responsive completo y optimizado
- **BEM Methodology**: Convenciones de nomenclatura consistentes
- **Import System**: Sistema de imports para organización modular

### HTML
- **Semántica**: Estructura HTML5 semántica y accesible
- **Accesibilidad**: ARIA labels y navegación por teclado
- **SEO**: Meta tags y estructura optimizada
- **Modular Scripts**: Carga de módulos JavaScript organizados
- **Public Directory**: Separación clara entre archivos públicos y código fuente

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para consumir la PokéAPI
- Python 3.x (para servidor local)

### Instalación y Ejecución
1. Clona o descarga el proyecto
2. Abre una terminal en el directorio del proyecto
3. Ejecuta: `python -m http.server 8001`
4. Abre tu navegador y ve a: `http://localhost:8001/public/`
5. ¡Disfruta explorando la Pokédex!

### Desarrollo
- **Servidor local requerido**: Para evitar problemas de CORS con módulos ES6
- **Arquitectura modular**: Fácil mantenimiento y escalabilidad
- **Separación de responsabilidades**: Código organizado y reutilizable
- **Compatibilidad**: Funciona con cualquier editor de código moderno

## 🎮 Funcionalidades Interactivas

### Navegación
- **Enter**: Buscar Pokémon
- **Escape**: Cerrar modales
- **Click**: Navegación por la interfaz

### Animaciones
- **Hover effects**: En botones, tarjetas y elementos interactivos
- **Loading animations**: Spinner durante las peticiones
- **Transition effects**: Cambios suaves entre estados
- **Shimmer effects**: En barras de estadísticas (25s de duración)
- **Pulse animations**: En elementos del header

## 🔮 Futuras Mejoras

- [ ] Soporte para más generaciones de Pokémon
- [ ] Modo oscuro/claro
- [ ] Filtros por tipo y región
- [ ] Sonidos de la Pokédex clásica
- [ ] Exportar/importar favoritos
- [ ] PWA (Progressive Web App)
- [ ] Más estadísticas y comparaciones
- [ ] Lazy loading de módulos
- [ ] Testing unitario para módulos
- [ ] Optimización de rendimiento
- [ ] Bundle optimization con Webpack/Vite
- [ ] TypeScript migration
- [ ] Component library para reutilización

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerir mejoras.

---

**¡Disfruta explorando el mundo Pokémon con esta Pokédex interactiva!** 🎮✨