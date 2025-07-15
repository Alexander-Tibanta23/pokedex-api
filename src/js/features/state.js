// ========================================
// ESTADO GLOBAL DE LA APLICACIÓN
// ========================================

import { STORAGE_KEYS } from '../api/config.js';

// Estado global de la aplicación
export let currentPokemon = null;
export let favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
export let comparisonPokemon = { pokemon1: null, pokemon2: null };

/**
 * Actualiza el Pokémon actual
 * @param {Object} pokemon - Datos del Pokémon
 */
export function setCurrentPokemon(pokemon) {
    currentPokemon = pokemon;
}

/**
 * Obtiene el Pokémon actual
 * @returns {Object|null} Pokémon actual
 */
export function getCurrentPokemon() {
    return currentPokemon;
}

/**
 * Actualiza la lista de favoritos
 * @param {Array} newFavorites - Nueva lista de favoritos
 */
export function setFavorites(newFavorites) {
    favorites = newFavorites;
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
}

/**
 * Obtiene la lista de favoritos
 * @returns {Array} Lista de favoritos
 */
export function getFavorites() {
    return favorites;
}

/**
 * Actualiza el estado de comparación
 * @param {Object} newComparison - Nuevo estado de comparación
 */
export function setComparisonPokemon(newComparison) {
    comparisonPokemon = newComparison;
}

/**
 * Obtiene el estado de comparación
 * @returns {Object} Estado de comparación
 */
export function getComparisonPokemon() {
    return comparisonPokemon;
} 