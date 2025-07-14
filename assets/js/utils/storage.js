// ========================================
// UTILIDADES DE ALMACENAMIENTO LOCAL
// ========================================

import { CONFIG } from '../../config/config.js';

export class StorageManager {
    /**
     * Obtiene los favoritos del localStorage
     * @returns {Array} Array de Pokémon favoritos
     */
    static getFavorites() {
        try {
            const favorites = localStorage.getItem(CONFIG.STORAGE_KEYS.FAVORITES);
            return favorites ? JSON.parse(favorites) : [];
        } catch (error) {
            console.error('Error obteniendo favoritos:', error);
            return [];
        }
    }

    /**
     * Guarda los favoritos en localStorage
     * @param {Array} favorites - Array de Pokémon favoritos
     */
    static saveFavorites(favorites) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
        } catch (error) {
            console.error('Error guardando favoritos:', error);
        }
    }

    /**
     * Agrega un Pokémon a favoritos
     * @param {Object} pokemon - Datos del Pokémon
     */
    static addToFavorites(pokemon) {
        const favorites = this.getFavorites();
        const exists = favorites.find(fav => fav.id === pokemon.id);
        
        if (!exists) {
            favorites.push({
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
                types: pokemon.types.map(type => type.type.name)
            });
            this.saveFavorites(favorites);
        }
        
        return favorites;
    }

    /**
     * Remueve un Pokémon de favoritos
     * @param {number} pokemonId - ID del Pokémon
     */
    static removeFromFavorites(pokemonId) {
        const favorites = this.getFavorites();
        const filtered = favorites.filter(fav => fav.id !== pokemonId);
        this.saveFavorites(filtered);
        return filtered;
    }

    /**
     * Verifica si un Pokémon está en favoritos
     * @param {number} pokemonId - ID del Pokémon
     * @returns {boolean}
     */
    static isFavorite(pokemonId) {
        const favorites = this.getFavorites();
        return favorites.some(fav => fav.id === pokemonId);
    }

    /**
     * Obtiene la configuración guardada
     * @returns {Object} Configuración
     */
    static getSettings() {
        try {
            const settings = localStorage.getItem(CONFIG.STORAGE_KEYS.SETTINGS);
            return settings ? JSON.parse(settings) : {};
        } catch (error) {
            console.error('Error obteniendo configuración:', error);
            return {};
        }
    }

    /**
     * Guarda la configuración
     * @param {Object} settings - Configuración a guardar
     */
    static saveSettings(settings) {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
        } catch (error) {
            console.error('Error guardando configuración:', error);
        }
    }

    /**
     * Limpia todos los datos del localStorage
     */
    static clearAll() {
        try {
            localStorage.removeItem(CONFIG.STORAGE_KEYS.FAVORITES);
            localStorage.removeItem(CONFIG.STORAGE_KEYS.SETTINGS);
        } catch (error) {
            console.error('Error limpiando localStorage:', error);
        }
    }
}

export default StorageManager; 