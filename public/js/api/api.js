// ========================================
// FUNCIONES DE COMUNICACIÓN CON LA API
// ========================================

import { POKEAPI_BASE_URL } from './config.js';

/**
 * Obtiene los datos básicos de un Pokémon
 * @param {string|number} identifier - Nombre o número del Pokémon
 * @returns {Object} Datos del Pokémon
 */
export async function fetchPokemonData(identifier) {
    const response = await fetch(`${POKEAPI_BASE_URL}/pokemon/${identifier}`);
    
    if (!response.ok) {
        if (response.status === 404) {
            throw new Error('Pokémon no encontrado. Verifica el nombre o número.');
        }
        throw new Error('Error en la conexión con la API');
    }
    
    return await response.json();
}

/**
 * Obtiene la cadena evolutiva de un Pokémon
 * @param {string} speciesUrl - URL de la especie del Pokémon
 * @returns {Object} Datos de la cadena evolutiva
 */
export async function fetchEvolutionChain(speciesUrl) {
    try {
        const speciesResponse = await fetch(speciesUrl);
        const speciesData = await speciesResponse.json();
        
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();
        
        return evolutionData;
    } catch (error) {
        console.error('Error obteniendo cadena evolutiva:', error);
        return null;
    }
}

/**
 * Obtiene datos adicionales de la especie
 * @param {string} speciesUrl - URL de la especie del Pokémon
 * @returns {Object} Datos de la especie
 */
export async function fetchSpeciesData(speciesUrl) {
    try {
        const response = await fetch(speciesUrl);
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo datos de especie:', error);
        return null;
    }
}

/**
 * Obtiene datos completos de un Pokémon incluyendo evolución y especie
 * @param {string|number} identifier - Nombre o número del Pokémon
 * @returns {Object} Datos completos del Pokémon
 */
export async function fetchCompletePokemonData(identifier) {
    const pokemonData = await fetchPokemonData(identifier);
    
    // Obtener datos adicionales en paralelo
    const [evolutionData, speciesData] = await Promise.all([
        fetchEvolutionChain(pokemonData.species.url),
        fetchSpeciesData(pokemonData.species.url)
    ]);
    
    return {
        pokemon: pokemonData,
        evolution: evolutionData,
        species: speciesData
    };
} 