// ========================================
// LÓGICA DE COMPARACIÓN DE POKÉMON
// ========================================

import { elements, showElement, hideElement, setElementText, setImageSource } from '../dom/dom.js';
import { getCurrentPokemon, getComparisonPokemon, setComparisonPokemon } from './state.js';
import { showNotification, showComparisonPanel, hideComparisonPanel } from '../ui/ui.js';
import { POKEMON_TYPES } from '../api/config.js';

/**
 * Agrega el Pokémon actual al comparador
 */
export function addToComparison() {
    const currentPokemon = getCurrentPokemon();
    if (!currentPokemon) {
        showNotification('No hay Pokémon seleccionado para comparar', 'error');
        return;
    }
    
    const comparison = getComparisonPokemon();
    
    if (!comparison.pokemon1) {
        comparison.pokemon1 = currentPokemon;
        updateComparisonCard(elements.pokemon1, currentPokemon);
        showNotification(`${currentPokemon.name} agregado al comparador`, 'success');
    } else if (!comparison.pokemon2) {
        comparison.pokemon2 = currentPokemon;
        updateComparisonCard(elements.pokemon2, currentPokemon);
        showNotification(`${currentPokemon.name} agregado al comparador`, 'success');
    } else {
        showNotification('El comparador está lleno. Cierra el panel para limpiar', 'info');
    }
    
    setComparisonPokemon(comparison);
    
    if (comparison.pokemon1 && comparison.pokemon2) {
        showComparisonPanel();
    }
}

/**
 * Actualiza una tarjeta de comparación
 * @param {HTMLElement} cardElement - Elemento de la tarjeta
 * @param {Object} pokemon - Datos del Pokémon
 */
export function updateComparisonCard(cardElement, pokemon) {
    if (!cardElement || !pokemon) return;
    
    cardElement.innerHTML = '';
    cardElement.classList.add('has-pokemon');
    
    // Imagen del Pokémon
    const img = document.createElement('img');
    img.src = pokemon.sprites.front_default;
    img.alt = pokemon.name;
    
    // Nombre del Pokémon
    const name = document.createElement('h4');
    name.textContent = pokemon.name;
    
    // Número del Pokémon
    const number = document.createElement('span');
    number.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    
    // Tipos del Pokémon
    const types = document.createElement('div');
    types.className = 'comparison-types';
    
    pokemon.types.forEach(type => {
        const typeData = POKEMON_TYPES[type.type.name];
        if (typeData) {
            const typeBadge = document.createElement('span');
            typeBadge.className = `type-badge type-${type.type.name}`;
            typeBadge.textContent = typeData.name;
            types.appendChild(typeBadge);
        }
    });
    
    // Estadísticas básicas
    const stats = document.createElement('div');
    stats.className = 'comparison-stats';
    
    const height = document.createElement('div');
    height.textContent = `Altura: ${(pokemon.height / 10).toFixed(1)}m`;
    
    const weight = document.createElement('div');
    weight.textContent = `Peso: ${(pokemon.weight / 10).toFixed(1)}kg`;
    
    stats.appendChild(height);
    stats.appendChild(weight);
    
    // Agregar elementos a la tarjeta
    cardElement.appendChild(img);
    cardElement.appendChild(name);
    cardElement.appendChild(number);
    cardElement.appendChild(types);
    cardElement.appendChild(stats);
}

/**
 * Limpia el comparador
 */
export function clearComparison() {
    setComparisonPokemon({ pokemon1: null, pokemon2: null });
    
    // Limpiar tarjetas
    elements.pokemon1.innerHTML = '<p>Selecciona un Pokémon</p>';
    elements.pokemon1.classList.remove('has-pokemon');
    
    elements.pokemon2.innerHTML = '<p>Selecciona un Pokémon</p>';
    elements.pokemon2.classList.remove('has-pokemon');
    
    hideComparisonPanel();
    showNotification('Comparador limpiado', 'info');
}

/**
 * Maneja el cierre del panel de comparación
 */
export function handleCloseComparison() {
    clearComparison();
} 