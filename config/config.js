// ========================================
// CONFIGURACIÓN GLOBAL DE LA POKÉDEX
// ========================================

export const CONFIG = {
    // API Configuration
    POKEAPI_BASE_URL: 'https://pokeapi.co/api/v2',
    TOTAL_POKEMON: 151, // Limitamos a la primera generación para mejor rendimiento
    
    // UI Configuration
    ANIMATION_DURATION: 300,
    LOADING_TIMEOUT: 10000,
    
    // Storage Keys
    STORAGE_KEYS: {
        FAVORITES: 'pokemonFavorites',
        SETTINGS: 'pokedexSettings'
    },
    
    // Pokemon Types Colors (for dynamic styling)
    TYPE_COLORS: {
        normal: { primary: '#a8a878', secondary: '#c6c6a7' },
        fire: { primary: '#f08030', secondary: '#f5ac78' },
        water: { primary: '#6890f0', secondary: '#9db7f5' },
        electric: { primary: '#f8d030', secondary: '#fae078' },
        grass: { primary: '#78c850', secondary: '#a7db8d' },
        ice: { primary: '#98d8d8', secondary: '#bce6e6' },
        fighting: { primary: '#c03028', secondary: '#d67873' },
        poison: { primary: '#a040a0', secondary: '#c183c1' },
        ground: { primary: '#e0c068', secondary: '#ebd69d' },
        flying: { primary: '#a890f0', secondary: '#c6b7f5' },
        psychic: { primary: '#f85888', secondary: '#fa92b2' },
        bug: { primary: '#a8b820', secondary: '#c6d16e' },
        rock: { primary: '#b8a038', secondary: '#d1c17d' },
        ghost: { primary: '#705898', secondary: '#a292bc' },
        dragon: { primary: '#7038f8', secondary: '#a27dfa' },
        dark: { primary: '#705848', secondary: '#a29288' },
        steel: { primary: '#b8b8d0', secondary: '#d1d1e0' },
        fairy: { primary: '#ee99ac', secondary: '#f4bdc9' }
    },
    
    // Stat Names (Spanish)
    STAT_NAMES: {
        hp: 'HP',
        attack: 'Ataque',
        defense: 'Defensa',
        'special-attack': 'At. Esp.',
        'special-defense': 'Def. Esp.',
        speed: 'Velocidad'
    },
    
    // Error Messages
    ERROR_MESSAGES: {
        POKEMON_NOT_FOUND: 'Pokémon no encontrado. Verifica el nombre o número.',
        API_ERROR: 'Error en la conexión con la API',
        INVALID_NUMBER: (max) => `Número de Pokémon inválido. Debe estar entre 1 y ${max}`,
        NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
        TIMEOUT_ERROR: 'La búsqueda tardó demasiado. Intenta de nuevo.'
    },
    
    // Success Messages
    SUCCESS_MESSAGES: {
        ADDED_TO_FAVORITES: 'Pokémon agregado a favoritos',
        REMOVED_FROM_FAVORITES: 'Pokémon removido de favoritos',
        COMPARISON_ADDED: 'Pokémon agregado al comparador'
    }
};

export default CONFIG; 