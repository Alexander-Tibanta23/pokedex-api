// ========================================
// MÓDULO DE COMPARACIÓN DE POKÉMON
// ========================================

import { PokemonAPI } from './api.js';
import { Helpers } from '../utils/helpers.js';
import { CONFIG } from '../../config/config.js';

export class ComparisonManager {
    constructor() {
        this.comparisonPokemon = { pokemon1: null, pokemon2: null };
        this.maxComparisons = 2;
    }

    /**
     * Agrega un Pokémon al comparador
     * @param {Object} pokemon - Datos del Pokémon
     * @returns {boolean} True si se agregó exitosamente
     */
    addToComparison(pokemon) {
        if (!pokemon) {
            throw new Error('Datos de Pokémon inválidos');
        }

        // Verificar si ya está en comparación
        if (this.comparisonPokemon.pokemon1?.id === pokemon.id || 
            this.comparisonPokemon.pokemon2?.id === pokemon.id) {
            throw new Error('Este Pokémon ya está en la comparación');
        }

        // Agregar al primer slot disponible
        if (!this.comparisonPokemon.pokemon1) {
            this.comparisonPokemon.pokemon1 = pokemon;
        } else if (!this.comparisonPokemon.pokemon2) {
            this.comparisonPokemon.pokemon2 = pokemon;
        } else {
            throw new Error('Ya tienes 2 Pokémon en comparación. Remueve uno primero.');
        }

        Helpers.showNotification(CONFIG.SUCCESS_MESSAGES.COMPARISON_ADDED, 'success');
        return true;
    }

    /**
     * Remueve un Pokémon del comparador
     * @param {number} slot - Slot a limpiar (1 o 2)
     * @returns {boolean} True si se removió exitosamente
     */
    removeFromComparison(slot) {
        if (slot === 1 && this.comparisonPokemon.pokemon1) {
            this.comparisonPokemon.pokemon1 = null;
            return true;
        } else if (slot === 2 && this.comparisonPokemon.pokemon2) {
            this.comparisonPokemon.pokemon2 = null;
            return true;
        }
        return false;
    }

    /**
     * Limpia todo el comparador
     */
    clearComparison() {
        this.comparisonPokemon = { pokemon1: null, pokemon2: null };
    }

    /**
     * Obtiene los Pokémon en comparación
     * @returns {Object} Objeto con pokemon1 y pokemon2
     */
    getComparisonPokemon() {
        return this.comparisonPokemon;
    }

    /**
     * Verifica si el comparador está completo
     * @returns {boolean}
     */
    isComparisonComplete() {
        return this.comparisonPokemon.pokemon1 && this.comparisonPokemon.pokemon2;
    }

    /**
     * Obtiene el número de Pokémon en comparación
     * @returns {number}
     */
    getComparisonCount() {
        let count = 0;
        if (this.comparisonPokemon.pokemon1) count++;
        if (this.comparisonPokemon.pokemon2) count++;
        return count;
    }

    /**
     * Compara las estadísticas de dos Pokémon
     * @returns {Object} Resultado de la comparación
     */
    compareStats() {
        if (!this.isComparisonComplete()) {
            throw new Error('Se necesitan 2 Pokémon para comparar');
        }

        const p1 = this.comparisonPokemon.pokemon1;
        const p2 = this.comparisonPokemon.pokemon2;

        const comparison = {
            pokemon1: {
                name: p1.name,
                id: p1.id,
                totalStats: 0,
                stats: {}
            },
            pokemon2: {
                name: p2.name,
                id: p2.id,
                totalStats: 0,
                stats: {}
            },
            winner: null,
            differences: {}
        };

        // Comparar cada estadística
        p1.stats.forEach(stat1 => {
            const stat2 = p2.stats.find(s => s.stat.name === stat1.stat.name);
            if (stat2) {
                const statName = stat1.stat.name;
                const value1 = stat1.base_stat;
                const value2 = stat2.base_stat;

                comparison.pokemon1.stats[statName] = value1;
                comparison.pokemon2.stats[statName] = value2;
                comparison.pokemon1.totalStats += value1;
                comparison.pokemon2.totalStats += value2;

                comparison.differences[statName] = {
                    difference: value1 - value2,
                    winner: value1 > value2 ? p1.name : value2 > value1 ? p2.name : 'tie'
                };
            }
        });

        // Determinar ganador general
        if (comparison.pokemon1.totalStats > comparison.pokemon2.totalStats) {
            comparison.winner = p1.name;
        } else if (comparison.pokemon2.totalStats > comparison.pokemon1.totalStats) {
            comparison.winner = p2.name;
        } else {
            comparison.winner = 'tie';
        }

        return comparison;
    }

    /**
     * Compara los tipos de dos Pokémon
     * @returns {Object} Comparación de tipos
     */
    compareTypes() {
        if (!this.isComparisonComplete()) {
            throw new Error('Se necesitan 2 Pokémon para comparar');
        }

        const p1 = this.comparisonPokemon.pokemon1;
        const p2 = this.comparisonPokemon.pokemon2;

        const comparison = {
            pokemon1: {
                types: p1.types.map(t => t.type.name),
                typeCount: p1.types.length
            },
            pokemon2: {
                types: p2.types.map(t => t.type.name),
                typeCount: p2.types.length
            },
            sharedTypes: [],
            uniqueTypes: {
                pokemon1: [],
                pokemon2: []
            }
        };

        // Encontrar tipos compartidos
        p1.types.forEach(type1 => {
            p2.types.forEach(type2 => {
                if (type1.type.name === type2.type.name) {
                    comparison.sharedTypes.push(type1.type.name);
                }
            });
        });

        // Encontrar tipos únicos
        comparison.uniqueTypes.pokemon1 = p1.types
            .filter(t => !comparison.sharedTypes.includes(t.type.name))
            .map(t => t.type.name);

        comparison.uniqueTypes.pokemon2 = p2.types
            .filter(t => !comparison.sharedTypes.includes(t.type.name))
            .map(t => t.type.name);

        return comparison;
    }

    /**
     * Compara las habilidades de dos Pokémon
     * @returns {Object} Comparación de habilidades
     */
    compareAbilities() {
        if (!this.isComparisonComplete()) {
            throw new Error('Se necesitan 2 Pokémon para comparar');
        }

        const p1 = this.comparisonPokemon.pokemon1;
        const p2 = this.comparisonPokemon.pokemon2;

        const comparison = {
            pokemon1: {
                abilities: p1.abilities.map(a => ({
                    name: a.ability.name,
                    isHidden: a.is_hidden
                })),
                abilityCount: p1.abilities.length,
                hiddenAbilities: p1.abilities.filter(a => a.is_hidden).length
            },
            pokemon2: {
                abilities: p2.abilities.map(a => ({
                    name: a.ability.name,
                    isHidden: a.is_hidden
                })),
                abilityCount: p2.abilities.length,
                hiddenAbilities: p2.abilities.filter(a => a.is_hidden).length
            },
            sharedAbilities: [],
            uniqueAbilities: {
                pokemon1: [],
                pokemon2: []
            }
        };

        // Encontrar habilidades compartidas
        p1.abilities.forEach(ability1 => {
            p2.abilities.forEach(ability2 => {
                if (ability1.ability.name === ability2.ability.name) {
                    comparison.sharedAbilities.push(ability1.ability.name);
                }
            });
        });

        // Encontrar habilidades únicas
        comparison.uniqueAbilities.pokemon1 = p1.abilities
            .filter(a => !comparison.sharedAbilities.includes(a.ability.name))
            .map(a => a.ability.name);

        comparison.uniqueAbilities.pokemon2 = p2.abilities
            .filter(a => !comparison.sharedAbilities.includes(a.ability.name))
            .map(a => a.ability.name);

        return comparison;
    }

    /**
     * Obtiene un resumen de la comparación
     * @returns {Object} Resumen de la comparación
     */
    getComparisonSummary() {
        if (!this.isComparisonComplete()) {
            return null;
        }

        const statsComparison = this.compareStats();
        const typesComparison = this.compareTypes();
        const abilitiesComparison = this.compareAbilities();

        return {
            stats: statsComparison,
            types: typesComparison,
            abilities: abilitiesComparison,
            summary: {
                totalStatsWinner: statsComparison.winner,
                typeAdvantage: this.calculateTypeAdvantage(),
                abilityAdvantage: abilitiesComparison.pokemon1.abilityCount > abilitiesComparison.pokemon2.abilityCount ? 
                    this.comparisonPokemon.pokemon1.name : this.comparisonPokemon.pokemon2.name
            }
        };
    }

    /**
     * Calcula la ventaja de tipo entre dos Pokémon
     * @returns {Object} Ventaja de tipo
     */
    calculateTypeAdvantage() {
        if (!this.isComparisonComplete()) {
            return null;
        }

        const p1 = this.comparisonPokemon.pokemon1;
        const p2 = this.comparisonPokemon.pokemon2;

        // Esta es una implementación simplificada
        // En una implementación completa, se usarían las tablas de efectividad de tipos
        const typeEffectiveness = {
            fire: { grass: 2, water: 0.5, fire: 0.5 },
            water: { fire: 2, grass: 0.5, water: 0.5 },
            grass: { water: 2, fire: 0.5, grass: 0.5 },
            electric: { water: 2, grass: 0.5, electric: 0.5 },
            ice: { grass: 2, fire: 0.5, ice: 0.5 },
            fighting: { normal: 2, ice: 2, rock: 2, steel: 2, dark: 2 },
            poison: { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5 },
            ground: { fire: 2, electric: 2, grass: 0.5, poison: 2, rock: 2, bug: 0.5 },
            flying: { grass: 2, fighting: 2, bug: 2, electric: 0.5, rock: 0.5, steel: 0.5 },
            psychic: { fighting: 2, poison: 2, dark: 0.5, steel: 0.5 },
            bug: { grass: 2, poison: 0.5, fire: 0.5, fighting: 0.5, flying: 0.5, ghost: 0.5, steel: 0.5, fairy: 0.5 },
            rock: { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
            ghost: { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
            steel: { ice: 2, rock: 2, steel: 0.5, fire: 0.5, water: 0.5, electric: 0.5 },
            dragon: { dragon: 2, steel: 0.5, fairy: 0 },
            dark: { psychic: 2, ghost: 2, fighting: 0.5, dark: 0.5, fairy: 0.5 },
            fairy: { fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
        };

        let p1Advantage = 0;
        let p2Advantage = 0;

        p1.types.forEach(type1 => {
            p2.types.forEach(type2 => {
                const effectiveness = typeEffectiveness[type1.type.name]?.[type2.type.name];
                if (effectiveness) {
                    p1Advantage += effectiveness;
                }
            });
        });

        p2.types.forEach(type2 => {
            p1.types.forEach(type1 => {
                const effectiveness = typeEffectiveness[type2.type.name]?.[type1.type.name];
                if (effectiveness) {
                    p2Advantage += effectiveness;
                }
            });
        });

        return {
            pokemon1Advantage: p1Advantage,
            pokemon2Advantage: p2Advantage,
            winner: p1Advantage > p2Advantage ? p1.name : p2Advantage > p1Advantage ? p2.name : 'tie'
        };
    }

    /**
     * Intercambia las posiciones de los Pokémon en comparación
     */
    swapPokemon() {
        if (this.isComparisonComplete()) {
            const temp = this.comparisonPokemon.pokemon1;
            this.comparisonPokemon.pokemon1 = this.comparisonPokemon.pokemon2;
            this.comparisonPokemon.pokemon2 = temp;
        }
    }
}

export default ComparisonManager; 