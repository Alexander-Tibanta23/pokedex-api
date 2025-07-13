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
- **JavaScript ES6+**: Funcionalidad completa con async/await y fetch API
- **PokéAPI**: Consumo de datos oficiales de Pokémon
- **Font Awesome**: Iconos modernos y atractivos
- **Google Fonts**: Tipografía Orbitron para el estilo retro-futurista

## 🚀 Cómo usar

1. **Abrir la aplicación**: Simplemente abre `index.html` en tu navegador
2. **Buscar Pokémon**: Escribe el nombre o número del Pokémon en la barra de búsqueda
3. **Explorar**: Usa el botón "Aleatorio" para descubrir nuevos Pokémon
4. **Guardar favoritos**: Haz clic en el corazón para agregar a favoritos
5. **Comparar**: Usa el botón de comparación para comparar dos Pokémon
6. **Ver evolución**: Explora la cadena evolutiva haciendo clic en las evoluciones

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
pokedex-eslint/
├── index.html          # Estructura principal
├── styles.css          # Estilos y diseño
├── script.js           # Funcionalidad JavaScript
└── README.md           # Documentación
```

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

### JavaScript
- **ES6+ Features**: Arrow functions, destructuring, template literals
- **Async/Await**: Manejo asíncrono de peticiones
- **Fetch API**: Peticiones HTTP modernas
- **LocalStorage**: Persistencia de favoritos
- **Event Delegation**: Manejo eficiente de eventos

### CSS
- **Flexbox & Grid**: Layouts modernos y responsive
- **CSS Variables**: Colores y valores reutilizables
- **Animaciones**: Transiciones suaves y keyframes
- **Gradientes**: Efectos visuales modernos
- **Media Queries**: Diseño responsive completo

### HTML
- **Semántica**: Estructura HTML5 semántica
- **Accesibilidad**: ARIA labels y navegación por teclado
- **SEO**: Meta tags y estructura optimizada

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet para consumir la PokéAPI

### Instalación
1. Clona o descarga el proyecto
2. Abre `index.html` en tu navegador
3. ¡Disfruta explorando la Pokédex!

### Desarrollo
- No requiere servidor local
- Funciona directamente desde el sistema de archivos
- Compatible con cualquier editor de código

## 🎮 Funcionalidades Interactivas

### Navegación
- **Enter**: Buscar Pokémon
- **Escape**: Cerrar modales
- **Click**: Navegación por la interfaz

### Animaciones
- **Hover effects**: En botones, tarjetas y elementos interactivos
- **Loading animations**: Spinner durante las peticiones
- **Transition effects**: Cambios suaves entre estados
- **Shimmer effects**: En barras de estadísticas

## 🔮 Futuras Mejoras

- [ ] Soporte para más generaciones de Pokémon
- [ ] Modo oscuro/claro
- [ ] Filtros por tipo y región
- [ ] Sonidos de la Pokédex clásica
- [ ] Exportar/importar favoritos
- [ ] PWA (Progressive Web App)
- [ ] Más estadísticas y comparaciones

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para sugerir mejoras.

---

**¡Disfruta explorando el mundo Pokémon con esta Pokédex interactiva!** 🎮✨