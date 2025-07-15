// ========================================
// FUNCIONES DE INTERFAZ DE USUARIO
// ========================================

import { elements, showElement, hideElement, setElementText, setImageSource } from '../dom/dom.js';
import { POKEMON_TYPES, STAT_COLORS } from '../api/config.js';

// ========================================
// FUNCIONES DE LOADING Y ERRORES
// ========================================

/**
 * Muestra el spinner de carga
 */
export function showLoading() {
    hideElement(elements.pokemonCard);
    hideElement(elements.errorMessage);
    showElement(elements.loadingSpinner);
}

/**
 * Oculta el spinner de carga
 */
export function hideLoading() {
    hideElement(elements.loadingSpinner);
}

/**
 * Muestra un mensaje de error
 * @param {string} message - Mensaje de error
 */
export function showError(message) {
    hideElement(elements.pokemonCard);
    hideElement(elements.loadingSpinner);
    setElementText(elements.errorText, message);
    showElement(elements.errorMessage);
}

/**
 * Oculta el mensaje de error
 */
export function hideError() {
    hideElement(elements.errorMessage);
}

// ========================================
// FUNCIONES DE VISUALIZACIÓN DEL POKÉMON
// ========================================

/**
 * Muestra la tarjeta del Pokémon
 */
export function showPokemonCard() {
    hideElement(elements.errorMessage);
    hideElement(elements.loadingSpinner);
    showElement(elements.pokemonCard);
}

/**
 * Oculta la tarjeta del Pokémon
 */
export function hidePokemonCard() {
    hideElement(elements.pokemonCard);
}

/**
 * Muestra la información del Pokémon
 * @param {Object} pokemon - Datos del Pokémon
 * @param {Object} evolutionData - Datos de evolución
 * @param {Object} speciesData - Datos de especie
 */
export async function displayPokemon(pokemon, evolutionData, speciesData) {
    // Información básica
    setElementText(elements.pokemonName, pokemon.name);
    setElementText(elements.pokemonNumber, `#${pokemon.id.toString().padStart(3, '0')}`);
    setImageSource(elements.pokemonImage, pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default, pokemon.name);
    
    // Tipos
    displayTypes(pokemon.types);
    
    // Estadísticas básicas
    setElementText(elements.pokemonHeight, `${(pokemon.height / 10).toFixed(1)} m`);
    setElementText(elements.pokemonWeight, `${(pokemon.weight / 10).toFixed(1)} kg`);
    
    // Habilidades
    displayAbilities(pokemon.abilities);
    
    // Estadísticas detalladas
    displayStats(pokemon.stats);
    
    // Cadena evolutiva
    if (evolutionData) {
        await displayEvolutionChain(evolutionData);
    }
    
    // Cambiar color de fondo según el tipo principal
    const primaryType = pokemon.types[0].type.name;
    changeCardBackground(primaryType);
    
    showPokemonCard();
}

/**
 * Muestra los tipos del Pokémon
 * @param {Array} types - Array de tipos
 */
export function displayTypes(types) {
    elements.pokemonTypes.innerHTML = '';
    
    types.forEach(type => {
        const typeData = POKEMON_TYPES[type.type.name];
        if (typeData) {
            const typeBadge = document.createElement('span');
            typeBadge.className = `type-badge type-${type.type.name}`;
            typeBadge.textContent = typeData.name;
            elements.pokemonTypes.appendChild(typeBadge);
        }
    });
}

/**
 * Muestra las habilidades del Pokémon
 * @param {Array} abilities - Array de habilidades
 */
export function displayAbilities(abilities) {
    elements.pokemonAbilities.innerHTML = '';
    
    abilities.forEach(ability => {
        const abilityBadge = document.createElement('span');
        abilityBadge.className = `ability-badge ${ability.is_hidden ? 'ability-hidden' : ''}`;
        abilityBadge.textContent = ability.ability.name.replace('-', ' ');
        
        if (ability.is_hidden) {
            abilityBadge.title = 'Habilidad oculta';
        }
        
        elements.pokemonAbilities.appendChild(abilityBadge);
    });
}

/**
 * Muestra las estadísticas del Pokémon
 * @param {Array} stats - Array de estadísticas
 */
export function displayStats(stats) {
    elements.pokemonStats.innerHTML = '';
    
    stats.forEach(stat => {
        const statBar = document.createElement('div');
        statBar.className = 'stat-bar';
        
        const statName = document.createElement('span');
        statName.className = 'stat-name';
        statName.textContent = getStatDisplayName(stat.stat.name);
        
        const statProgress = document.createElement('div');
        statProgress.className = 'stat-progress';
        
        const statFill = document.createElement('div');
        statFill.className = 'stat-fill';
        statFill.style.width = `${(stat.base_stat / 255) * 100}%`;
        statFill.style.backgroundColor = STAT_COLORS[stat.stat.name] || '#666';
        
        const statValue = document.createElement('span');
        statValue.className = 'stat-value-num';
        statValue.textContent = stat.base_stat;
        
        statProgress.appendChild(statFill);
        statBar.appendChild(statName);
        statBar.appendChild(statProgress);
        statBar.appendChild(statValue);
        elements.pokemonStats.appendChild(statBar);
    });
}

/**
 * Muestra la cadena evolutiva
 * @param {Object} evolutionData - Datos de evolución
 */
export async function displayEvolutionChain(evolutionData) {
    elements.evolutionChain.innerHTML = '';
    
    if (!evolutionData || !evolutionData.chain) {
        const noEvolution = document.createElement('p');
        noEvolution.textContent = 'Este Pokémon no evoluciona';
        noEvolution.style.textAlign = 'center';
        noEvolution.style.color = '#666';
        elements.evolutionChain.appendChild(noEvolution);
        return;
    }
    
    await buildEvolutionChain(evolutionData.chain);
}

/**
 * Construye la cadena evolutiva recursivamente
 * @param {Object} chain - Cadena evolutiva
 */
export async function buildEvolutionChain(chain) {
    if (!chain) return;
    
    // Crear elemento para el Pokémon actual
    const evolutionItem = document.createElement('div');
    evolutionItem.className = 'evolution-item';
    
    try {
        const pokemonData = await fetch(`https://pokeapi.co/api/v2/pokemon/${chain.species.name}`);
        const pokemon = await pokemonData.json();
        
        const img = document.createElement('img');
        img.src = pokemon.sprites.front_default;
        img.alt = pokemon.name;
        
        const name = document.createElement('p');
        name.textContent = pokemon.name;
        
        // Agregar ícono de clic
        const clickIcon = document.createElement('i');
        clickIcon.className = 'fas fa-mouse-pointer';
        clickIcon.style.fontSize = '0.8rem';
        clickIcon.style.color = '#ffd700';
        clickIcon.style.marginLeft = '0.5rem';
        
        // Hacer el elemento clickeable
        evolutionItem.style.cursor = 'pointer';
        evolutionItem.title = `Haz clic para ver ${pokemon.name}`;
        
        // Agregar el ícono al nombre
        name.appendChild(clickIcon);
        
        // Agregar event listener para mostrar el Pokémon
        evolutionItem.addEventListener('click', async () => {
            try {
                // Mostrar loading mientras se carga
                showLoading();
                
                // Importar las funciones necesarias
                const { searchPokemon } = await import('../features/search.js');
                const { setElementText } = await import('../dom/dom.js');
                
                // Actualizar el input de búsqueda
                setElementText(elements.searchInput, pokemon.name);
                
                // Buscar el Pokémon
                await searchPokemon(pokemon.name);
                
                // Hacer scroll hacia arriba para mostrar la tarjeta
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
                // Mostrar notificación
                showNotification(`Mostrando ${pokemon.name}`, 'success');
                
            } catch (error) {
                console.error('Error al mostrar evolución:', error);
                showError('Error al cargar la evolución');
            }
        });
        
        evolutionItem.appendChild(img);
        evolutionItem.appendChild(name);
        elements.evolutionChain.appendChild(evolutionItem);
        
        // Agregar flecha si hay evolución
        if (chain.evolves_to && chain.evolves_to.length > 0) {
            const arrow = document.createElement('div');
            arrow.className = 'evolution-arrow';
            arrow.innerHTML = '<i class="fas fa-arrow-right"></i>';
            elements.evolutionChain.appendChild(arrow);
            
            // Procesar evoluciones
            for (const evolution of chain.evolves_to) {
                await buildEvolutionChain(evolution);
            }
        }
    } catch (error) {
        console.error('Error obteniendo datos de evolución:', error);
    }
}

/**
 * Cambia el color de fondo de la tarjeta según el tipo
 * @param {string} type - Tipo del Pokémon
 */
export function changeCardBackground(type) {
    const typeData = POKEMON_TYPES[type];
    if (typeData) {
        elements.pokemonCard.style.borderColor = typeData.color;
        elements.pokemonCard.style.boxShadow = `0 10px 30px rgba(${hexToRgb(typeData.color)}, 0.3)`;
    }
}

/**
 * Obtiene el color de una estadística
 * @param {string} stat - Nombre de la estadística
 * @returns {string} Color de la estadística
 */
export function getStatColor(stat) {
    return STAT_COLORS[stat] || '#666';
}

/**
 * Obtiene el nombre de visualización de una estadística
 * @param {string} statName - Nombre de la estadística
 * @returns {string} Nombre de visualización
 */
export function getStatDisplayName(statName) {
    const statNames = {
        'hp': 'HP',
        'attack': 'Ataque',
        'defense': 'Defensa',
        'special-attack': 'Ataque Esp.',
        'special-defense': 'Defensa Esp.',
        'speed': 'Velocidad'
    };
    return statNames[statName] || statName;
}

/**
 * Convierte un color hexadecimal a RGB
 * @param {string} hex - Color hexadecimal
 * @returns {string} Color RGB
 */
export function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '0, 0, 0';
}

// ========================================
// FUNCIONES DE MODALES
// ========================================

/**
 * Muestra un modal
 * @param {HTMLElement} modal - Elemento modal
 */
export function showModal(modal) {
    if (modal) {
        showElement(elements.overlay);
        showElement(modal);
    }
}

/**
 * Oculta el modal de favoritos
 */
export function hideFavoritesModal() {
    hideElement(elements.favoritesModal);
    hideElement(elements.overlay);
}

/**
 * Muestra el panel de comparación
 */
export function showComparisonPanel() {
    showElement(elements.comparisonPanel);
}

/**
 * Oculta el panel de comparación
 */
export function hideComparisonPanel() {
    hideElement(elements.comparisonPanel);
}

/**
 * Muestra una notificación
 * @param {string} message - Mensaje de la notificación
 * @param {string} type - Tipo de notificación (info, success, error)
 */
export function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Estilos básicos
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.padding = '1rem 1.5rem';
    notification.style.borderRadius = '10px';
    notification.style.color = 'white';
    notification.style.fontWeight = 'bold';
    notification.style.zIndex = '1000';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    
    // Colores según tipo
    const colors = {
        info: '#4ecdc4',
        success: '#78c850',
        error: '#ff6b6b'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
} 