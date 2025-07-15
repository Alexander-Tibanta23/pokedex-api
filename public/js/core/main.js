// ========================================
// PUNTO DE ENTRADA DE LA APLICACIÓN
// ========================================

import { elements, validateElements } from '../dom/dom.js';
import { handleSearch, searchRandomPokemon } from '../features/search.js';
import { toggleFavorite, showFavoritesModal, updateFavoritesButton } from '../features/favorites.js';
import { addToComparison, handleCloseComparison } from '../features/comparison.js';
import { hideFavoritesModal, hideComparisonPanel } from '../ui/ui.js';

/**
 * Inicializa la aplicación
 */
function init() {
    // Verificar que todos los elementos del DOM estén disponibles
    if (!validateElements()) {
        console.error('Error: No se pudieron encontrar todos los elementos del DOM');
        return;
    }
    
    setupEventListeners();
    updateFavoritesButton();
    console.log('Pokédex inicializada correctamente');
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    // Búsqueda
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Botones principales
    elements.randomBtn.addEventListener('click', searchRandomPokemon);
    elements.favoritesBtn.addEventListener('click', showFavoritesModal);
    
    // Botones de acción del Pokémon
    elements.addToFavorites.addEventListener('click', toggleFavorite);
    elements.comparePokemon.addEventListener('click', addToComparison);
    
    // Panel de comparación
    elements.closeComparison.addEventListener('click', handleCloseComparison);
    
    // Modal de favoritos
    elements.closeFavorites.addEventListener('click', hideFavoritesModal);
    elements.overlay.addEventListener('click', hideFavoritesModal);
    
    // Cerrar modales con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideFavoritesModal();
            hideComparisonPanel();
        }
    });
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
} 