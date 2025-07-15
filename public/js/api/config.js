// ========================================
// CONFIGURACIÓN DE LA APLICACIÓN
// ========================================

// Configuración de la API
export const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
export const TOTAL_POKEMON = 151; // Limitamos a la primera generación para mejor rendimiento

// Configuración de tipos de Pokémon
export const POKEMON_TYPES = {
    normal: { name: 'Normal', color: '#a8a878' },
    fire: { name: 'Fuego', color: '#f08030' },
    water: { name: 'Agua', color: '#6890f0' },
    electric: { name: 'Eléctrico', color: '#f8d030' },
    grass: { name: 'Planta', color: '#78c850' },
    ice: { name: 'Hielo', color: '#98d8d8' },
    fighting: { name: 'Lucha', color: '#c03028' },
    poison: { name: 'Veneno', color: '#a040a0' },
    ground: { name: 'Tierra', color: '#e0c068' },
    flying: { name: 'Volador', color: '#a890f0' },
    psychic: { name: 'Psíquico', color: '#f85888' },
    bug: { name: 'Bicho', color: '#a8b820' },
    rock: { name: 'Roca', color: '#b8a038' },
    ghost: { name: 'Fantasma', color: '#705898' },
    dragon: { name: 'Dragón', color: '#7038f8' },
    dark: { name: 'Siniestro', color: '#705848' },
    steel: { name: 'Acero', color: '#b8b8d0' },
    fairy: { name: 'Hada', color: '#ee99ac' }
};

// Configuración de colores para estadísticas
export const STAT_COLORS = {
    hp: '#ff6b6b',
    attack: '#ff8e8e',
    defense: '#4ecdc4',
    'special-attack': '#ffd93d',
    'special-defense': '#6c5ce7',
    speed: '#a8e6cf'
};

// Configuración de localStorage
export const STORAGE_KEYS = {
    FAVORITES: 'pokemonFavorites'
}; 