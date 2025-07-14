// ========================================
// MÓDULO DE API - POKÉAPI
// ========================================

import { CONFIG } from '../../config/config.js';
import { Helpers } from '../utils/helpers.js';

export class PokemonAPI {
    /**
     * Obtiene los datos básicos de un Pokémon
     * @param {string|number} identifier - Nombre o número del Pokémon
     * @returns {Promise<Object>} Datos del Pokémon
     */
    static async fetchPokemonData(identifier) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.LOADING_TIMEOUT);

            const response = await fetch(`${CONFIG.POKEAPI_BASE_URL}/pokemon/${identifier}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error(CONFIG.ERROR_MESSAGES.POKEMON_NOT_FOUND);
                }
                throw new Error(CONFIG.ERROR_MESSAGES.API_ERROR);
            }

            return await response.json();
        } catch (error) {
            throw new Error(Helpers.handleNetworkError(error));
        }
    }

    /**
     * Obtiene la cadena evolutiva de un Pokémon
     * @param {string} speciesUrl - URL de la especie del Pokémon
     * @returns {Promise<Object|null>} Datos de la cadena evolutiva
     */
    static async fetchEvolutionChain(speciesUrl) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.LOADING_TIMEOUT);

            // Primero obtenemos los datos de la especie
            const speciesResponse = await fetch(speciesUrl, {
                signal: controller.signal
            });
            
            if (!speciesResponse.ok) {
                throw new Error('Error obteniendo datos de especie');
            }
            
            const speciesData = await speciesResponse.json();

            // Luego obtenemos la cadena evolutiva
            const evolutionResponse = await fetch(speciesData.evolution_chain.url, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!evolutionResponse.ok) {
                throw new Error('Error obteniendo cadena evolutiva');
            }

            return await evolutionResponse.json();
        } catch (error) {
            console.error('Error obteniendo cadena evolutiva:', error);
            return null;
        }
    }

    /**
     * Obtiene datos adicionales de la especie
     * @param {string} speciesUrl - URL de la especie del Pokémon
     * @returns {Promise<Object|null>} Datos de la especie
     */
    static async fetchSpeciesData(speciesUrl) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.LOADING_TIMEOUT);

            const response = await fetch(speciesUrl, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Error obteniendo datos de especie');
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo datos de especie:', error);
            return null;
        }
    }

    /**
     * Obtiene múltiples Pokémon en paralelo
     * @param {Array<number>} ids - Array de IDs de Pokémon
     * @returns {Promise<Array>} Array de datos de Pokémon
     */
    static async fetchMultiplePokemon(ids) {
        try {
            const promises = ids.map(id => this.fetchPokemonData(id));
            return await Promise.all(promises);
        } catch (error) {
            console.error('Error obteniendo múltiples Pokémon:', error);
            throw error;
        }
    }

    /**
     * Obtiene la lista de todos los Pokémon (limitado a la primera generación)
     * @param {number} limit - Límite de Pokémon a obtener
     * @param {number} offset - Offset para paginación
     * @returns {Promise<Object>} Lista de Pokémon
     */
    static async fetchPokemonList(limit = CONFIG.TOTAL_POKEMON, offset = 0) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.LOADING_TIMEOUT);

            const response = await fetch(`${CONFIG.POKEAPI_BASE_URL}/pokemon?limit=${limit}&offset=${offset}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Error obteniendo lista de Pokémon');
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo lista de Pokémon:', error);
            throw new Error(Helpers.handleNetworkError(error));
        }
    }

    /**
     * Obtiene información de un tipo específico
     * @param {string} typeName - Nombre del tipo
     * @returns {Promise<Object>} Datos del tipo
     */
    static async fetchTypeData(typeName) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.LOADING_TIMEOUT);

            const response = await fetch(`${CONFIG.POKEAPI_BASE_URL}/type/${typeName}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Error obteniendo datos del tipo');
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo datos del tipo:', error);
            throw new Error(Helpers.handleNetworkError(error));
        }
    }

    /**
     * Obtiene información de una habilidad específica
     * @param {string} abilityName - Nombre de la habilidad
     * @returns {Promise<Object>} Datos de la habilidad
     */
    static async fetchAbilityData(abilityName) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONFIG.LOADING_TIMEOUT);

            const response = await fetch(`${CONFIG.POKEAPI_BASE_URL}/ability/${abilityName}`, {
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error('Error obteniendo datos de la habilidad');
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo datos de la habilidad:', error);
            throw new Error(Helpers.handleNetworkError(error));
        }
    }

    /**
     * Valida si una imagen existe
     * @param {string} imageUrl - URL de la imagen
     * @returns {Promise<boolean>} True si la imagen existe
     */
    static async validateImage(imageUrl) {
        try {
            const response = await fetch(imageUrl, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    /**
     * Obtiene una imagen de respaldo si la principal no está disponible
     * @param {Object} sprites - Objeto de sprites del Pokémon
     * @returns {string} URL de la imagen
     */
    static getFallbackImage(sprites) {
        const imagePriority = [
            sprites.other?.['official-artwork']?.front_default,
            sprites.other?.home?.front_default,
            sprites.other?.dream_world?.front_default,
            sprites.front_default,
            sprites.front_shiny
        ];

        return imagePriority.find(url => url) || '/assets/images/pokemon-placeholder.png';
    }
}

export default PokemonAPI; 