// ========================================
// MÓDULO DE CADENAS EVOLUTIVAS
// ========================================

import { PokemonAPI } from './api.js';
import { Helpers } from '../utils/helpers.js';

export class EvolutionManager {
    constructor() {
        this.evolutionCache = new Map();
    }

    /**
     * Obtiene la cadena evolutiva completa de un Pokémon
     * @param {string} speciesUrl - URL de la especie del Pokémon
     * @returns {Promise<Object>} Datos de la cadena evolutiva
     */
    async getEvolutionChain(speciesUrl) {
        try {
            const evolutionData = await PokemonAPI.fetchEvolutionChain(speciesUrl);
            if (!evolutionData) {
                return null;
            }

            return await this.buildEvolutionChain(evolutionData.chain);
        } catch (error) {
            console.error('Error obteniendo cadena evolutiva:', error);
            return null;
        }
    }

    /**
     * Construye la cadena evolutiva recursivamente
     * @param {Object} chain - Datos de la cadena evolutiva
     * @returns {Promise<Object>} Cadena evolutiva construida
     */
    async buildEvolutionChain(chain) {
        if (!chain) return null;

        const evolutionChain = {
            pokemon: null,
            evolutions: [],
            level: 0
        };

        try {
            // Obtener datos del Pokémon base
            const pokemonData = await PokemonAPI.fetchPokemonData(chain.species.name);
            evolutionChain.pokemon = {
                id: pokemonData.id,
                name: pokemonData.name,
                image: PokemonAPI.getFallbackImage(pokemonData.sprites),
                types: pokemonData.types.map(type => type.type.name)
            };

            // Procesar evoluciones
            if (chain.evolves_to && chain.evolves_to.length > 0) {
                for (const evolution of chain.evolves_to) {
                    const evolutionData = await this.processEvolution(evolution, 1);
                    if (evolutionData) {
                        evolutionChain.evolutions.push(evolutionData);
                    }
                }
            }

            return evolutionChain;
        } catch (error) {
            console.error('Error construyendo cadena evolutiva:', error);
            return null;
        }
    }

    /**
     * Procesa una evolución específica
     * @param {Object} evolution - Datos de la evolución
     * @param {number} level - Nivel de profundidad en la cadena
     * @returns {Promise<Object>} Datos de la evolución procesada
     */
    async processEvolution(evolution, level) {
        if (!evolution) return null;

        const evolutionData = {
            pokemon: null,
            evolutions: [],
            level: level,
            evolutionDetails: this.parseEvolutionDetails(evolution.evolution_details)
        };

        try {
            // Obtener datos del Pokémon evolucionado
            const pokemonData = await PokemonAPI.fetchPokemonData(evolution.species.name);
            evolutionData.pokemon = {
                id: pokemonData.id,
                name: pokemonData.name,
                image: PokemonAPI.getFallbackImage(pokemonData.sprites),
                types: pokemonData.types.map(type => type.type.name)
            };

            // Procesar evoluciones adicionales (evoluciones de evolución)
            if (evolution.evolves_to && evolution.evolves_to.length > 0) {
                for (const subEvolution of evolution.evolves_to) {
                    const subEvolutionData = await this.processEvolution(subEvolution, level + 1);
                    if (subEvolutionData) {
                        evolutionData.evolutions.push(subEvolutionData);
                    }
                }
            }

            return evolutionData;
        } catch (error) {
            console.error('Error procesando evolución:', error);
            return null;
        }
    }

    /**
     * Parsea los detalles de evolución
     * @param {Array} evolutionDetails - Detalles de la evolución
     * @returns {Object} Detalles parseados
     */
    parseEvolutionDetails(evolutionDetails) {
        if (!evolutionDetails || evolutionDetails.length === 0) {
            return null;
        }

        const details = evolutionDetails[0];
        const parsedDetails = {};

        // Tipo de evolución
        if (details.trigger) {
            parsedDetails.trigger = details.trigger.name;
        }

        // Nivel requerido
        if (details.min_level) {
            parsedDetails.minLevel = details.min_level;
        }

        // Item requerido
        if (details.item) {
            parsedDetails.item = details.item.name;
        }

        // Hora del día
        if (details.time_of_day) {
            parsedDetails.timeOfDay = details.time_of_day;
        }

        // Género
        if (details.gender) {
            parsedDetails.gender = details.gender;
        }

        // Movimiento requerido
        if (details.known_move) {
            parsedDetails.knownMove = details.known_move.name;
        }

        // Tipo de movimiento requerido
        if (details.known_move_type) {
            parsedDetails.knownMoveType = details.known_move_type.name;
        }

        // Ubicación
        if (details.location) {
            parsedDetails.location = details.location.name;
        }

        // Felicidad
        if (details.min_happiness) {
            parsedDetails.minHappiness = details.min_happiness;
        }

        // Belleza
        if (details.min_beauty) {
            parsedDetails.minBeauty = details.min_beauty;
        }

        // Afinidad
        if (details.min_affection) {
            parsedDetails.minAffection = details.min_affection;
        }

        // Pokémon en el equipo
        if (details.party_species) {
            parsedDetails.partySpecies = details.party_species.name;
        }

        // Tipo de Pokémon en el equipo
        if (details.party_type) {
            parsedDetails.partyType = details.party_type.name;
        }

        // Relación física
        if (details.relative_physical_stats) {
            parsedDetails.relativePhysicalStats = details.relative_physical_stats;
        }

        return parsedDetails;
    }

    /**
     * Obtiene el texto descriptivo de los requisitos de evolución
     * @param {Object} evolutionDetails - Detalles de la evolución
     * @returns {string} Descripción de los requisitos
     */
    getEvolutionRequirementsText(evolutionDetails) {
        if (!evolutionDetails) {
            return 'Evolución natural';
        }

        const requirements = [];

        if (evolutionDetails.minLevel) {
            requirements.push(`Nivel ${evolutionDetails.minLevel}`);
        }

        if (evolutionDetails.item) {
            requirements.push(`Piedra ${Helpers.capitalize(evolutionDetails.item.replace('-', ' '))}`);
        }

        if (evolutionDetails.timeOfDay) {
            requirements.push(evolutionDetails.timeOfDay === 'day' ? 'Durante el día' : 'Durante la noche');
        }

        if (evolutionDetails.gender) {
            requirements.push(evolutionDetails.gender === 1 ? 'Solo hembra' : 'Solo macho');
        }

        if (evolutionDetails.knownMove) {
            requirements.push(`Conocer ${Helpers.capitalize(evolutionDetails.knownMove.replace('-', ' '))}`);
        }

        if (evolutionDetails.knownMoveType) {
            requirements.push(`Conocer movimiento tipo ${Helpers.capitalize(evolutionDetails.knownMoveType)}`);
        }

        if (evolutionDetails.minHappiness) {
            requirements.push(`Felicidad ${evolutionDetails.minHappiness}+`);
        }

        if (evolutionDetails.minAffection) {
            requirements.push(`Afinidad ${evolutionDetails.minAffection}+`);
        }

        if (evolutionDetails.relativePhysicalStats) {
            const stats = evolutionDetails.relativePhysicalStats;
            if (stats === 1) {
                requirements.push('Ataque > Defensa');
            } else if (stats === -1) {
                requirements.push('Defensa > Ataque');
            } else if (stats === 0) {
                requirements.push('Ataque = Defensa');
            }
        }

        if (requirements.length === 0) {
            return 'Evolución natural';
        }

        return requirements.join(' + ');
    }

    /**
     * Obtiene el número total de evoluciones en una cadena
     * @param {Object} evolutionChain - Cadena evolutiva
     * @returns {number} Número total de evoluciones
     */
    getTotalEvolutions(evolutionChain) {
        if (!evolutionChain) return 0;

        let count = 0;

        // Contar evoluciones directas
        count += evolutionChain.evolutions.length;

        // Contar evoluciones de evoluciones (recursivo)
        evolutionChain.evolutions.forEach(evolution => {
            count += this.getTotalEvolutions(evolution);
        });

        return count;
    }

    /**
     * Obtiene la profundidad máxima de la cadena evolutiva
     * @param {Object} evolutionChain - Cadena evolutiva
     * @returns {number} Profundidad máxima
     */
    getMaxEvolutionDepth(evolutionChain) {
        if (!evolutionChain) return 0;

        let maxDepth = 0;

        evolutionChain.evolutions.forEach(evolution => {
            const depth = this.getMaxEvolutionDepth(evolution);
            maxDepth = Math.max(maxDepth, depth + 1);
        });

        return maxDepth;
    }

    /**
     * Obtiene todos los Pokémon en una cadena evolutiva
     * @param {Object} evolutionChain - Cadena evolutiva
     * @returns {Array} Array de todos los Pokémon en la cadena
     */
    getAllPokemonInChain(evolutionChain) {
        if (!evolutionChain) return [];

        const pokemon = [evolutionChain.pokemon];

        evolutionChain.evolutions.forEach(evolution => {
            pokemon.push(...this.getAllPokemonInChain(evolution));
        });

        return pokemon;
    }

    /**
     * Verifica si un Pokémon puede evolucionar
     * @param {Object} evolutionChain - Cadena evolutiva
     * @returns {boolean}
     */
    canEvolve(evolutionChain) {
        return evolutionChain && evolutionChain.evolutions.length > 0;
    }

    /**
     * Obtiene la siguiente evolución de un Pokémon
     * @param {Object} evolutionChain - Cadena evolutiva
     * @param {number} pokemonId - ID del Pokémon actual
     * @returns {Object|null} Siguiente evolución
     */
    getNextEvolution(evolutionChain, pokemonId) {
        if (!evolutionChain) return null;

        // Buscar en evoluciones directas
        for (const evolution of evolutionChain.evolutions) {
            if (evolution.pokemon.id === pokemonId) {
                return evolution;
            }
        }

        // Buscar recursivamente
        for (const evolution of evolutionChain.evolutions) {
            const nextEvolution = this.getNextEvolution(evolution, pokemonId);
            if (nextEvolution) {
                return nextEvolution;
            }
        }

        return null;
    }

    /**
     * Obtiene la evolución anterior de un Pokémon
     * @param {Object} evolutionChain - Cadena evolutiva
     * @param {number} pokemonId - ID del Pokémon actual
     * @returns {Object|null} Evolución anterior
     */
    getPreviousEvolution(evolutionChain, pokemonId) {
        if (!evolutionChain) return null;

        // Verificar si el Pokémon actual es una evolución directa
        for (const evolution of evolutionChain.evolutions) {
            if (evolution.pokemon.id === pokemonId) {
                return evolutionChain.pokemon;
            }
        }

        // Buscar recursivamente
        for (const evolution of evolutionChain.evolutions) {
            const previousEvolution = this.getPreviousEvolution(evolution, pokemonId);
            if (previousEvolution) {
                return previousEvolution;
            }
        }

        return null;
    }

    /**
     * Limpia la caché de evoluciones
     */
    clearCache() {
        this.evolutionCache.clear();
    }
}

export default EvolutionManager; 