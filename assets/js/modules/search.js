// ========================================
// MÓDULO DE BÚSQUEDA DE POKÉMON
// ========================================

import { CONFIG } from '../../config/config.js';
import { Helpers } from '../utils/helpers.js';
import { PokemonAPI } from './api.js';

export class SearchManager {
    constructor() {
        this.currentPokemon = null;
        this.searchHistory = [];
        this.maxHistoryItems = 10;
    }

    /**
     * Maneja la búsqueda de Pokémon
     * @param {string} query - Consulta de búsqueda
     * @returns {Promise<Object>} Datos del Pokémon encontrado
     */
    async handleSearch(query) {
        const trimmedQuery = query.trim().toLowerCase();
        
        if (!trimmedQuery) {
            throw new Error('Por favor ingresa un nombre o número de Pokémon');
        }

        // Validar si es un número
        if (!isNaN(trimmedQuery)) {
            const number = parseInt(trimmedQuery);
            if (!Helpers.isValidPokemonNumber(number)) {
                throw new Error(CONFIG.ERROR_MESSAGES.INVALID_NUMBER(CONFIG.TOTAL_POKEMON));
            }
        }

        try {
            const pokemonData = await PokemonAPI.fetchPokemonData(trimmedQuery);
            this.currentPokemon = pokemonData;
            
            // Agregar a historial
            this.addToHistory(trimmedQuery);
            
            return pokemonData;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Busca un Pokémon aleatorio
     * @returns {Promise<Object>} Datos del Pokémon aleatorio
     */
    async searchRandomPokemon() {
        const randomNumber = Helpers.getRandomPokemonNumber();
        return await this.handleSearch(randomNumber.toString());
    }

    /**
     * Agrega una búsqueda al historial
     * @param {string} query - Consulta de búsqueda
     */
    addToHistory(query) {
        // Remover si ya existe
        this.searchHistory = this.searchHistory.filter(item => item !== query);
        
        // Agregar al inicio
        this.searchHistory.unshift(query);
        
        // Mantener solo los últimos elementos
        if (this.searchHistory.length > this.maxHistoryItems) {
            this.searchHistory = this.searchHistory.slice(0, this.maxHistoryItems);
        }
        
        // Guardar en localStorage
        this.saveHistory();
    }

    /**
     * Obtiene el historial de búsquedas
     * @returns {Array} Array de búsquedas recientes
     */
    getHistory() {
        return this.searchHistory;
    }

    /**
     * Guarda el historial en localStorage
     */
    saveHistory() {
        try {
            localStorage.setItem('pokedexSearchHistory', JSON.stringify(this.searchHistory));
        } catch (error) {
            console.error('Error guardando historial:', error);
        }
    }

    /**
     * Carga el historial desde localStorage
     */
    loadHistory() {
        try {
            const history = localStorage.getItem('pokedexSearchHistory');
            this.searchHistory = history ? JSON.parse(history) : [];
        } catch (error) {
            console.error('Error cargando historial:', error);
            this.searchHistory = [];
        }
    }

    /**
     * Limpia el historial de búsquedas
     */
    clearHistory() {
        this.searchHistory = [];
        this.saveHistory();
    }

    /**
     * Obtiene el Pokémon actual
     * @returns {Object|null} Datos del Pokémon actual
     */
    getCurrentPokemon() {
        return this.currentPokemon;
    }

    /**
     * Establece el Pokémon actual
     * @param {Object} pokemon - Datos del Pokémon
     */
    setCurrentPokemon(pokemon) {
        this.currentPokemon = pokemon;
    }

    /**
     * Busca Pokémon por tipo
     * @param {string} type - Tipo de Pokémon
     * @returns {Promise<Array>} Array de Pokémon del tipo especificado
     */
    async searchByType(type) {
        try {
            const typeData = await PokemonAPI.fetchTypeData(type);
            const pokemonIds = typeData.pokemon
                .map(p => p.pokemon.url.split('/').slice(-2, -1)[0])
                .filter(id => parseInt(id) <= CONFIG.TOTAL_POKEMON)
                .slice(0, 20); // Limitar a 20 resultados

            return await PokemonAPI.fetchMultiplePokemon(pokemonIds);
        } catch (error) {
            console.error('Error buscando por tipo:', error);
            throw error;
        }
    }

    /**
     * Busca Pokémon por nombre (búsqueda parcial)
     * @param {string} name - Nombre parcial del Pokémon
     * @returns {Promise<Array>} Array de Pokémon que coinciden
     */
    async searchByName(name) {
        try {
            const pokemonList = await PokemonAPI.fetchPokemonList(CONFIG.TOTAL_POKEMON);
            const matchingPokemon = pokemonList.results
                .filter(pokemon => pokemon.name.includes(name.toLowerCase()))
                .slice(0, 10); // Limitar a 10 resultados

            const pokemonIds = matchingPokemon.map(p => p.url.split('/').slice(-2, -1)[0]);
            return await PokemonAPI.fetchMultiplePokemon(pokemonIds);
        } catch (error) {
            console.error('Error buscando por nombre:', error);
            throw error;
        }
    }

    /**
     * Obtiene sugerencias de búsqueda
     * @param {string} query - Consulta parcial
     * @returns {Promise<Array>} Array de sugerencias
     */
    async getSuggestions(query) {
        if (!query || query.length < 2) return [];

        try {
            const pokemonList = await PokemonAPI.fetchPokemonList(CONFIG.TOTAL_POKEMON);
            const suggestions = pokemonList.results
                .filter(pokemon => pokemon.name.includes(query.toLowerCase()))
                .slice(0, 5)
                .map(pokemon => ({
                    name: Helpers.capitalize(pokemon.name),
                    id: pokemon.url.split('/').slice(-2, -1)[0]
                }));

            return suggestions;
        } catch (error) {
            console.error('Error obteniendo sugerencias:', error);
            return [];
        }
    }

    /**
     * Valida si una consulta es válida
     * @param {string} query - Consulta a validar
     * @returns {Object} Objeto con isValid y errorMessage
     */
    validateQuery(query) {
        const trimmed = query.trim();
        
        if (!trimmed) {
            return {
                isValid: false,
                errorMessage: 'Por favor ingresa un nombre o número de Pokémon'
            };
        }

        if (!isNaN(trimmed)) {
            const number = parseInt(trimmed);
            if (!Helpers.isValidPokemonNumber(number)) {
                return {
                    isValid: false,
                    errorMessage: CONFIG.ERROR_MESSAGES.INVALID_NUMBER(CONFIG.TOTAL_POKEMON)
                };
            }
        }

        return { isValid: true, errorMessage: null };
    }
}

export default SearchManager; 