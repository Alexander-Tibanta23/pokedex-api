// ========================================
// FUNCIONES DE BÚSQUEDA
// ========================================

import { elements } from '../dom/dom.js';
import { setCurrentPokemon } from './state.js';
import { showLoading, hideLoading, showError, hideError, hidePokemonCard, displayPokemon } from '../ui/ui.js';
import { fetchCompletePokemonData } from '../api/api.js';
import { updateFavoriteButton } from './favorites.js';
import { TOTAL_POKEMON } from '../api/config.js';

/**
 * Maneja la búsqueda de Pokémon
 */
export async function handleSearch() {
    const query = elements.searchInput.value.trim().toLowerCase();
    if (!query) return;
    
    await searchPokemon(query);
}

/**
 * Busca un Pokémon por nombre o número
 * @param {string|number} query - Nombre o número del Pokémon
 */
export async function searchPokemon(query) {
    showLoading();
    hideError();
    hidePokemonCard();
    
    try {
        // Si es un número, validamos el rango
        if (!isNaN(query)) {
            const number = parseInt(query);
            if (number < 1 || number > TOTAL_POKEMON) {
                throw new Error(`Número de Pokémon inválido. Debe estar entre 1 y ${TOTAL_POKEMON}`);
            }
        }
        
        const completeData = await fetchCompletePokemonData(query);
        setCurrentPokemon(completeData.pokemon);
        
        await displayPokemon(completeData.pokemon, completeData.evolution, completeData.species);
        
        // Actualizar botón de favorito
        updateFavoriteButton(completeData.pokemon.id);
        
    } catch (error) {
        console.error('Error buscando Pokémon:', error);
        showError(error.message || 'Error al buscar el Pokémon');
    } finally {
        hideLoading();
    }
}

/**
 * Busca un Pokémon aleatorio
 */
export async function searchRandomPokemon() {
    const randomNumber = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    elements.searchInput.value = randomNumber;
    await searchPokemon(randomNumber);
} 