// ========================================
// MÓDULO DE FAVORITOS
// ========================================

import { StorageManager } from '../utils/storage.js';
import { Helpers } from '../utils/helpers.js';
import { CONFIG } from '../../config/config.js';

export class FavoritesManager {
    constructor() {
        this.favorites = StorageManager.getFavorites();
        this.maxFavorites = 50; // Límite de favoritos
    }

    /**
     * Obtiene todos los favoritos
     * @returns {Array} Array de Pokémon favoritos
     */
    getFavorites() {
        return this.favorites;
    }

    /**
     * Agrega un Pokémon a favoritos
     * @param {Object} pokemon - Datos del Pokémon
     * @returns {boolean} True si se agregó exitosamente
     */
    addToFavorites(pokemon) {
        if (this.favorites.length >= this.maxFavorites) {
            throw new Error(`No puedes tener más de ${this.maxFavorites} favoritos`);
        }

        const exists = this.favorites.find(fav => fav.id === pokemon.id);
        
        if (exists) {
            throw new Error('Este Pokémon ya está en tus favoritos');
        }

        const favoritePokemon = {
            id: pokemon.id,
            name: pokemon.name,
            image: pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default,
            types: pokemon.types.map(type => type.type.name),
            addedAt: new Date().toISOString()
        };

        this.favorites.push(favoritePokemon);
        StorageManager.saveFavorites(this.favorites);
        
        Helpers.showNotification(CONFIG.SUCCESS_MESSAGES.ADDED_TO_FAVORITES, 'success');
        return true;
    }

    /**
     * Remueve un Pokémon de favoritos
     * @param {number} pokemonId - ID del Pokémon
     * @returns {boolean} True si se removió exitosamente
     */
    removeFromFavorites(pokemonId) {
        const initialLength = this.favorites.length;
        this.favorites = this.favorites.filter(fav => fav.id !== pokemonId);
        
        if (this.favorites.length < initialLength) {
            StorageManager.saveFavorites(this.favorites);
            Helpers.showNotification(CONFIG.SUCCESS_MESSAGES.REMOVED_FROM_FAVORITES, 'info');
            return true;
        }
        
        return false;
    }

    /**
     * Verifica si un Pokémon está en favoritos
     * @param {number} pokemonId - ID del Pokémon
     * @returns {boolean}
     */
    isFavorite(pokemonId) {
        return this.favorites.some(fav => fav.id === pokemonId);
    }

    /**
     * Obtiene el número total de favoritos
     * @returns {number}
     */
    getFavoritesCount() {
        return this.favorites.length;
    }

    /**
     * Limpia todos los favoritos
     */
    clearFavorites() {
        this.favorites = [];
        StorageManager.saveFavorites(this.favorites);
        Helpers.showNotification('Todos los favoritos han sido eliminados', 'info');
    }

    /**
     * Obtiene favoritos ordenados por fecha de agregado
     * @param {string} order - 'asc' o 'desc'
     * @returns {Array}
     */
    getFavoritesByDate(order = 'desc') {
        return [...this.favorites].sort((a, b) => {
            const dateA = new Date(a.addedAt);
            const dateB = new Date(b.addedAt);
            return order === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }

    /**
     * Obtiene favoritos ordenados por nombre
     * @param {string} order - 'asc' o 'desc'
     * @returns {Array}
     */
    getFavoritesByName(order = 'asc') {
        return [...this.favorites].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
        });
    }

    /**
     * Obtiene favoritos ordenados por ID
     * @param {string} order - 'asc' o 'desc'
     * @returns {Array}
     */
    getFavoritesById(order = 'asc') {
        return [...this.favorites].sort((a, b) => {
            return order === 'asc' ? a.id - b.id : b.id - a.id;
        });
    }

    /**
     * Filtra favoritos por tipo
     * @param {string} type - Tipo de Pokémon
     * @returns {Array}
     */
    getFavoritesByType(type) {
        return this.favorites.filter(fav => 
            fav.types.some(t => t === type.toLowerCase())
        );
    }

    /**
     * Busca favoritos por nombre
     * @param {string} query - Consulta de búsqueda
     * @returns {Array}
     */
    searchFavorites(query) {
        const searchTerm = query.toLowerCase();
        return this.favorites.filter(fav => 
            fav.name.toLowerCase().includes(searchTerm) ||
            fav.id.toString().includes(searchTerm)
        );
    }

    /**
     * Obtiene estadísticas de favoritos
     * @returns {Object}
     */
    getFavoritesStats() {
        const stats = {
            total: this.favorites.length,
            types: {},
            recent: 0
        };

        // Contar tipos
        this.favorites.forEach(fav => {
            fav.types.forEach(type => {
                stats.types[type] = (stats.types[type] || 0) + 1;
            });
        });

        // Contar recientes (últimos 7 días)
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        
        stats.recent = this.favorites.filter(fav => 
            new Date(fav.addedAt) > weekAgo
        ).length;

        return stats;
    }

    /**
     * Exporta favoritos como JSON
     * @returns {string}
     */
    exportFavorites() {
        const data = {
            favorites: this.favorites,
            exportedAt: new Date().toISOString(),
            version: '1.0'
        };
        
        return JSON.stringify(data, null, 2);
    }

    /**
     * Importa favoritos desde JSON
     * @param {string} jsonData - Datos JSON
     * @returns {boolean} True si se importó exitosamente
     */
    importFavorites(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            if (!data.favorites || !Array.isArray(data.favorites)) {
                throw new Error('Formato de datos inválido');
            }

            // Validar estructura de cada favorito
            const validFavorites = data.favorites.filter(fav => 
                fav.id && fav.name && fav.image && Array.isArray(fav.types)
            );

            if (validFavorites.length === 0) {
                throw new Error('No se encontraron favoritos válidos');
            }

            // Combinar con favoritos existentes (sin duplicados)
            const existingIds = new Set(this.favorites.map(f => f.id));
            const newFavorites = validFavorites.filter(fav => !existingIds.has(fav.id));

            this.favorites = [...this.favorites, ...newFavorites];
            
            // Limitar al máximo permitido
            if (this.favorites.length > this.maxFavorites) {
                this.favorites = this.favorites.slice(0, this.maxFavorites);
            }

            StorageManager.saveFavorites(this.favorites);
            Helpers.showNotification(`${newFavorites.length} favoritos importados exitosamente`, 'success');
            
            return true;
        } catch (error) {
            console.error('Error importando favoritos:', error);
            Helpers.showNotification('Error importando favoritos: ' + error.message, 'error');
            return false;
        }
    }

    /**
     * Obtiene el límite de favoritos
     * @returns {number}
     */
    getMaxFavorites() {
        return this.maxFavorites;
    }

    /**
     * Establece el límite de favoritos
     * @param {number} max - Nuevo límite
     */
    setMaxFavorites(max) {
        if (max < 1 || max > 100) {
            throw new Error('El límite debe estar entre 1 y 100');
        }
        
        this.maxFavorites = max;
        
        // Si hay más favoritos que el nuevo límite, remover los más antiguos
        if (this.favorites.length > max) {
            this.favorites = this.getFavoritesByDate('desc').slice(0, max);
            StorageManager.saveFavorites(this.favorites);
        }
    }
}

export default FavoritesManager; 