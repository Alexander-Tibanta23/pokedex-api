// ========================================
// REFERENCIAS Y MANIPULACIÓN DEL DOM
// ========================================

// Elementos del DOM
export const elements = {
    // Búsqueda
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    
    // Botones principales
    randomBtn: document.getElementById('randomBtn'),
    favoritesBtn: document.getElementById('favoritesBtn'),
    
    // Contenedores principales
    pokemonCard: document.getElementById('pokemonCard'),
    errorMessage: document.getElementById('errorMessage'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    
    // Panel de comparación
    comparisonPanel: document.getElementById('comparisonPanel'),
    pokemon1: document.getElementById('pokemon1'),
    pokemon2: document.getElementById('pokemon2'),
    closeComparison: document.getElementById('closeComparison'),
    
    // Modal de favoritos
    favoritesModal: document.getElementById('favoritesModal'),
    favoritesList: document.getElementById('favoritesList'),
    closeFavorites: document.getElementById('closeFavorites'),
    overlay: document.getElementById('overlay'),
    
    // Información del Pokémon
    pokemonName: document.getElementById('pokemonName'),
    pokemonNumber: document.getElementById('pokemonNumber'),
    pokemonImage: document.getElementById('pokemonImage'),
    pokemonTypes: document.getElementById('pokemonTypes'),
    pokemonHeight: document.getElementById('pokemonHeight'),
    pokemonWeight: document.getElementById('pokemonWeight'),
    pokemonAbilities: document.getElementById('pokemonAbilities'),
    pokemonStats: document.getElementById('pokemonStats'),
    evolutionChain: document.getElementById('evolutionChain'),
    
    // Botones de acción
    addToFavorites: document.getElementById('addToFavorites'),
    comparePokemon: document.getElementById('comparePokemon'),
    
    // Mensajes
    errorText: document.getElementById('errorText')
};

/**
 * Verifica que todos los elementos del DOM estén disponibles
 * @returns {boolean} True si todos los elementos existen
 */
export function validateElements() {
    const missingElements = [];
    
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            missingElements.push(key);
        }
    }
    
    if (missingElements.length > 0) {
        console.error('Elementos del DOM faltantes:', missingElements);
        return false;
    }
    
    return true;
}

/**
 * Muestra un elemento del DOM
 * @param {HTMLElement} element - Elemento a mostrar
 */
export function showElement(element) {
    if (element) {
        element.classList.remove('hidden');
    }
}

/**
 * Oculta un elemento del DOM
 * @param {HTMLElement} element - Elemento a ocultar
 */
export function hideElement(element) {
    if (element) {
        element.classList.add('hidden');
    }
}

/**
 * Cambia el texto de un elemento
 * @param {HTMLElement} element - Elemento a modificar
 * @param {string} text - Nuevo texto
 */
export function setElementText(element, text) {
    if (element) {
        element.textContent = text;
    }
}

/**
 * Cambia la fuente de una imagen
 * @param {HTMLImageElement} imgElement - Elemento de imagen
 * @param {string} src - Nueva fuente
 * @param {string} alt - Texto alternativo
 */
export function setImageSource(imgElement, src, alt = '') {
    if (imgElement) {
        imgElement.src = src;
        if (alt) {
            imgElement.alt = alt;
        }
    }
} 