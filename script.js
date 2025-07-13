// ========================================
// POKÉDEX INTERACTIVA - JAVASCRIPT
// ========================================

// Configuración de la API
const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2';
const TOTAL_POKEMON = 151; // Limitamos a la primera generación para mejor rendimiento

// Estado global de la aplicación
let currentPokemon = null;
let favorites = JSON.parse(localStorage.getItem('pokemonFavorites')) || [];
let comparisonPokemon = { pokemon1: null, pokemon2: null };

// Elementos del DOM
const elements = {
    // Búsqueda
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    
    // Botones principales
    randomBtn: document.getElementById('randomBtn'),
    favoritesBtn: document.getElementById('favoritesBtn'),
    
    // Contenedores principales
    pokemonCard: document.getElementById('pokemonCard'),
    errorMessage: document.getElementById('errorMessage'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    
    // Panel de comparación
    comparisonPanel: document.getElementById('comparisonPanel'),
    pokemon1: document.getElementById('pokemon1'),
    pokemon2: document.getElementById('pokemon2'),
    closeComparison: document.getElementById('closeComparison'),
    
    // Modal de favoritos
    favoritesModal: document.getElementById('favoritesModal'),
    favoritesList: document.getElementById('favoritesList'),
    closeFavorites: document.getElementById('closeFavorites'),
    overlay: document.getElementById('overlay'),
    
    // Información del Pokémon
    pokemonName: document.getElementById('pokemonName'),
    pokemonNumber: document.getElementById('pokemonNumber'),
    pokemonImage: document.getElementById('pokemonImage'),
    pokemonTypes: document.getElementById('pokemonTypes'),
    pokemonHeight: document.getElementById('pokemonHeight'),
    pokemonWeight: document.getElementById('pokemonWeight'),
    pokemonAbilities: document.getElementById('pokemonAbilities'),
    pokemonStats: document.getElementById('pokemonStats'),
    evolutionChain: document.getElementById('evolutionChain'),
    
    // Botones de acción
    addToFavorites: document.getElementById('addToFavorites'),
    comparePokemon: document.getElementById('comparePokemon'),
    
    // Mensajes
    errorText: document.getElementById('errorText')
};

// ========================================
// FUNCIONES PRINCIPALES
// ========================================

/**
 * Inicializa la aplicación
 */
function init() {
    setupEventListeners();
    updateFavoritesButton();
    console.log('Pokédex inicializada correctamente');
}

/**
 * Configura todos los event listeners
 */
function setupEventListeners() {
    // Búsqueda
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
    
    // Botones principales
    elements.randomBtn.addEventListener('click', searchRandomPokemon);
    elements.favoritesBtn.addEventListener('click', showFavoritesModal);
    
    // Botones de acción del Pokémon
    elements.addToFavorites.addEventListener('click', toggleFavorite);
    elements.comparePokemon.addEventListener('click', addToComparison);
    
    // Panel de comparación
    elements.closeComparison.addEventListener('click', hideComparisonPanel);
    
    // Modal de favoritos
    elements.closeFavorites.addEventListener('click', hideFavoritesModal);
    elements.overlay.addEventListener('click', hideFavoritesModal);
    
    // Cerrar modales con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideFavoritesModal();
            hideComparisonPanel();
        }
    });
}

// ========================================
// FUNCIONES DE BÚSQUEDA
// ========================================

/**
 * Maneja la búsqueda de Pokémon
 */
async function handleSearch() {
    const query = elements.searchInput.value.trim().toLowerCase();
    if (!query) return;
    
    await searchPokemon(query);
}

/**
 * Busca un Pokémon por nombre o número
 * @param {string|number} query - Nombre o número del Pokémon
 */
async function searchPokemon(query) {
    showLoading();
    hideError();
    hidePokemonCard();
    
    try {
        // Si es un número, validamos el rango
        if (!isNaN(query)) {
            const number = parseInt(query);
            if (number < 1 || number > TOTAL_POKEMON) {
                throw new Error(`Número de Pokémon inválido. Debe estar entre 1 y ${TOTAL_POKEMON}`);
            }
        }
        
        const pokemonData = await fetchPokemonData(query);
        currentPokemon = pokemonData;
        
        // Obtener datos adicionales
        const [evolutionData, speciesData] = await Promise.all([
            fetchEvolutionChain(pokemonData.species.url),
            fetchSpeciesData(pokemonData.species.url)
        ]);
        
        await displayPokemon(pokemonData, evolutionData, speciesData);
        
    } catch (error) {
        console.error('Error buscando Pokémon:', error);
        showError(error.message || 'Error al buscar el Pokémon');
    } finally {
        hideLoading();
    }
}

/**
 * Busca un Pokémon aleatorio
 */
async function searchRandomPokemon() {
    const randomNumber = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    elements.searchInput.value = randomNumber;
    await searchPokemon(randomNumber);
}

// ========================================
// FUNCIONES DE API
// ========================================

/**
 * Obtiene los datos básicos de un Pokémon
 * @param {string|number} identifier - Nombre o número del Pokémon
 * @returns {Object} Datos del Pokémon
 */
async function fetchPokemonData(identifier) {
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
async function fetchEvolutionChain(speciesUrl) {
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
async function fetchSpeciesData(speciesUrl) {
    try {
        const response = await fetch(speciesUrl);
        return await response.json();
    } catch (error) {
        console.error('Error obteniendo datos de especie:', error);
        return null;
    }
}

// ========================================
// FUNCIONES DE VISUALIZACIÓN
// ========================================

/**
 * Muestra la información del Pokémon
 * @param {Object} pokemon - Datos del Pokémon
 * @param {Object} evolutionData - Datos de evolución
 * @param {Object} speciesData - Datos de especie
 */
async function displayPokemon(pokemon, evolutionData, speciesData) {
    // Información básica
    elements.pokemonName.textContent = pokemon.name;
    elements.pokemonNumber.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    elements.pokemonImage.src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    
    // Tipos
    displayTypes(pokemon.types);
    
    // Estadísticas básicas
    elements.pokemonHeight.textContent = `${(pokemon.height / 10).toFixed(1)} m`;
    elements.pokemonWeight.textContent = `${(pokemon.weight / 10).toFixed(1)} kg`;
    
    // Habilidades
    displayAbilities(pokemon.abilities);
    
    // Estadísticas detalladas
    displayStats(pokemon.stats);
    
    // Cadena evolutiva (asíncrona)
    await displayEvolutionChain(evolutionData);
    
    // Actualizar botón de favoritos
    updateFavoriteButton(pokemon.id);
    
    // Mostrar tarjeta
    showPokemonCard();
    
    // Cambiar color de fondo según el tipo principal
    changeCardBackground(pokemon.types[0].type.name);
}

/**
 * Muestra los tipos del Pokémon
 * @param {Array} types - Array de tipos
 */
function displayTypes(types) {
    elements.pokemonTypes.innerHTML = '';
    
    types.forEach(type => {
        const typeBadge = document.createElement('span');
        typeBadge.className = `type-badge type-${type.type.name}`;
        typeBadge.textContent = type.type.name;
        elements.pokemonTypes.appendChild(typeBadge);
    });
}

/**
 * Muestra las habilidades del Pokémon
 * @param {Array} abilities - Array de habilidades
 */
function displayAbilities(abilities) {
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
function displayStats(stats) {
    elements.pokemonStats.innerHTML = '';
    
    const statNames = {
        hp: 'HP',
        attack: 'Ataque',
        defense: 'Defensa',
        'special-attack': 'At. Esp.',
        'special-defense': 'Def. Esp.',
        speed: 'Velocidad'
    };
    
    stats.forEach(stat => {
        const statBar = document.createElement('div');
        statBar.className = 'stat-bar';
        
        const statName = document.createElement('div');
        statName.className = 'stat-name';
        statName.textContent = statNames[stat.stat.name] || stat.stat.name;
        
        const statProgress = document.createElement('div');
        statProgress.className = 'stat-progress';
        
        const statFill = document.createElement('div');
        statFill.className = 'stat-fill';
        statFill.style.width = `${(stat.base_stat / 255) * 100}%`;
        statFill.style.background = getStatColor(stat.base_stat);
        
        const statValue = document.createElement('div');
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
async function displayEvolutionChain(evolutionData) {
    elements.evolutionChain.innerHTML = '';
    
    if (!evolutionData) {
        const noEvolution = document.createElement('p');
        noEvolution.textContent = 'Sin evolución';
        noEvolution.style.textAlign = 'center';
        noEvolution.style.color = '#666';
        elements.evolutionChain.appendChild(noEvolution);
        return;
    }
    
    try {
        const evolutionChain = await buildEvolutionChain(evolutionData.chain);
        
        if (evolutionChain.length === 0) {
            const noEvolution = document.createElement('p');
            noEvolution.textContent = 'Sin evolución';
            noEvolution.style.textAlign = 'center';
            noEvolution.style.color = '#666';
            elements.evolutionChain.appendChild(noEvolution);
            return;
        }
        
        evolutionChain.forEach((evolution, index) => {
            if (index > 0) {
                const arrow = document.createElement('span');
                arrow.className = 'evolution-arrow';
                arrow.innerHTML = '→';
                elements.evolutionChain.appendChild(arrow);
            }
            
            const evolutionItem = document.createElement('div');
            evolutionItem.className = 'evolution-item';
            evolutionItem.onclick = () => searchPokemon(evolution.name);
            
            const img = document.createElement('img');
            img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${evolution.id}.png`;
            img.alt = evolution.name;
            img.onerror = () => {
                img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evolution.id}.png`;
            };
            
            const name = document.createElement('p');
            name.textContent = evolution.name.replace('-', ' ');
            
            evolutionItem.appendChild(img);
            evolutionItem.appendChild(name);
            elements.evolutionChain.appendChild(evolutionItem);
        });
    } catch (error) {
        console.error('Error mostrando cadena evolutiva:', error);
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Error al cargar la evolución';
        errorMsg.style.textAlign = 'center';
        errorMsg.style.color = '#ff6b6b';
        elements.evolutionChain.appendChild(errorMsg);
    }
}

/**
 * Construye la cadena evolutiva desde los datos de la API
 * @param {Object} chain - Cadena evolutiva de la API
 * @returns {Array} Array de evoluciones
 */
async function buildEvolutionChain(chain) {
    const evolutions = [];
    
    try {
        // Obtener datos del Pokémon base
        const basePokemon = await fetchPokemonData(chain.species.name);
        evolutions.push({
            id: basePokemon.id,
            name: basePokemon.name
        });
        
        // Obtener evoluciones de primer nivel
        if (chain.evolves_to && chain.evolves_to.length > 0) {
            for (const evolution of chain.evolves_to) {
                try {
                    const evolutionPokemon = await fetchPokemonData(evolution.species.name);
                    evolutions.push({
                        id: evolutionPokemon.id,
                        name: evolutionPokemon.name
                    });
                    
                    // Obtener evoluciones de segundo nivel
                    if (evolution.evolves_to && evolution.evolves_to.length > 0) {
                        for (const secondEvolution of evolution.evolves_to) {
                            try {
                                const secondEvolutionPokemon = await fetchPokemonData(secondEvolution.species.name);
                                evolutions.push({
                                    id: secondEvolutionPokemon.id,
                                    name: secondEvolutionPokemon.name
                                });
                            } catch (error) {
                                console.error('Error obteniendo evolución de segundo nivel:', error);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error obteniendo evolución de primer nivel:', error);
                }
            }
        }
    } catch (error) {
        console.error('Error obteniendo Pokémon base:', error);
    }
    
    return evolutions;
}

/**
 * Cambia el color de fondo de la tarjeta según el tipo
 * @param {string} type - Tipo del Pokémon
 */
function changeCardBackground(type) {
    const card = elements.pokemonCard;
    card.className = 'pokemon-card';
    
    // Remover clases de tipo anteriores
    card.classList.remove('type-fire', 'type-water', 'type-grass', 'type-electric', 
                         'type-ice', 'type-fighting', 'type-poison', 'type-ground',
                         'type-flying', 'type-psychic', 'type-bug', 'type-rock',
                         'type-ghost', 'type-dragon', 'type-dark', 'type-steel', 'type-fairy');
    
    // Agregar clase del tipo actual
    card.classList.add(`type-${type}`);
}

/**
 * Obtiene el color para las barras de estadísticas
 * @param {number} stat - Valor de la estadística
 * @returns {string} Color en formato CSS
 */
function getStatColor(stat) {
    if (stat >= 100) return 'linear-gradient(45deg, #4caf50, #66bb6a)';
    if (stat >= 80) return 'linear-gradient(45deg, #ff9800, #ffb74d)';
    if (stat >= 60) return 'linear-gradient(45deg, #2196f3, #64b5f6)';
    if (stat >= 40) return 'linear-gradient(45deg, #9c27b0, #ba68c8)';
    return 'linear-gradient(45deg, #f44336, #ef5350)';
}

// ========================================
// FUNCIONES DE FAVORITOS
// ========================================

/**
 * Alterna el estado de favorito del Pokémon actual
 */
function toggleFavorite() {
    if (!currentPokemon) return;
    
    const pokemonId = currentPokemon.id;
    const index = favorites.findIndex(fav => fav.id === pokemonId);
    
    if (index === -1) {
        // Agregar a favoritos
        favorites.push({
            id: pokemonId,
            name: currentPokemon.name,
            types: currentPokemon.types.map(t => t.type.name)
        });
        showNotification('¡Agregado a favoritos!', 'success');
    } else {
        // Remover de favoritos
        favorites.splice(index, 1);
        showNotification('Removido de favoritos', 'info');
    }
    
    // Guardar en localStorage
    localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
    
    // Actualizar botones
    updateFavoriteButton(pokemonId);
    updateFavoritesButton();
}

/**
 * Actualiza el botón de favoritos del Pokémon actual
 * @param {number} pokemonId - ID del Pokémon
 */
function updateFavoriteButton(pokemonId) {
    const isFavorite = favorites.some(fav => fav.id === pokemonId);
    const icon = elements.addToFavorites.querySelector('i');
    
    if (isFavorite) {
        icon.className = 'fas fa-heart';
        elements.addToFavorites.style.background = 'linear-gradient(45deg, #ff6b6b, #ff8e8e)';
    } else {
        icon.className = 'far fa-heart';
        elements.addToFavorites.style.background = 'linear-gradient(45deg, #ff69b4, #ff8ac4)';
    }
}

/**
 * Actualiza el botón de favoritos en el header
 */
function updateFavoritesButton() {
    const count = favorites.length;
    elements.favoritesBtn.innerHTML = `<i class="fas fa-heart"></i> Favoritos ${count > 0 ? `(${count})` : ''}`;
}

/**
 * Muestra el modal de favoritos
 */
async function showFavoritesModal() {
    elements.favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.textContent = 'No tienes Pokémon favoritos aún. ¡Busca algunos y agrégalos!';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.color = '#666';
        elements.favoritesList.appendChild(emptyMessage);
    } else {
        for (const favorite of favorites) {
            const favoriteItem = await createFavoriteItem(favorite);
            elements.favoritesList.appendChild(favoriteItem);
        }
    }
    
    showModal(elements.favoritesModal);
}

/**
 * Crea un elemento de favorito
 * @param {Object} favorite - Datos del favorito
 * @returns {HTMLElement} Elemento del favorito
 */
async function createFavoriteItem(favorite) {
    const item = document.createElement('div');
    item.className = 'favorite-item';
    
    const img = document.createElement('img');
    img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${favorite.id}.png`;
    img.alt = favorite.name;
    img.onerror = () => {
        img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${favorite.id}.png`;
    };
    
    const info = document.createElement('div');
    info.className = 'favorite-info';
    
    const name = document.createElement('div');
    name.className = 'favorite-name';
    name.textContent = favorite.name.replace('-', ' ');
    
    const number = document.createElement('div');
    number.className = 'favorite-number';
    number.textContent = `#${favorite.id.toString().padStart(3, '0')}`;
    
    const types = document.createElement('div');
    types.className = 'favorite-types';
    favorite.types.forEach(type => {
        const typeBadge = document.createElement('span');
        typeBadge.className = `favorite-type type-${type}`;
        typeBadge.textContent = type;
        types.appendChild(typeBadge);
    });
    
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-favorite';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.onclick = (e) => {
        e.stopPropagation();
        removeFavorite(favorite.id);
    };
    
    info.appendChild(name);
    info.appendChild(number);
    info.appendChild(types);
    
    item.appendChild(img);
    item.appendChild(info);
    item.appendChild(removeBtn);
    
    // Hacer clickeable para buscar el Pokémon
    item.onclick = () => {
        searchPokemon(favorite.id);
        hideFavoritesModal();
    };
    
    return item;
}

/**
 * Remueve un Pokémon de favoritos
 * @param {number} pokemonId - ID del Pokémon
 */
function removeFavorite(pokemonId) {
    const index = favorites.findIndex(fav => fav.id === pokemonId);
    if (index !== -1) {
        favorites.splice(index, 1);
        localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
        showFavoritesModal(); // Refrescar la lista
        updateFavoritesButton();
        updateFavoriteButton(pokemonId);
    }
}

// ========================================
// FUNCIONES DE COMPARACIÓN
// ========================================

/**
 * Agrega el Pokémon actual al comparador
 */
function addToComparison() {
    if (!currentPokemon) return;
    
    if (!comparisonPokemon.pokemon1) {
        comparisonPokemon.pokemon1 = currentPokemon;
        updateComparisonCard(elements.pokemon1, currentPokemon);
    } else if (!comparisonPokemon.pokemon2) {
        comparisonPokemon.pokemon2 = currentPokemon;
        updateComparisonCard(elements.pokemon2, currentPokemon);
        showComparisonPanel();
    } else {
        // Reemplazar el segundo Pokémon
        comparisonPokemon.pokemon2 = currentPokemon;
        updateComparisonCard(elements.pokemon2, currentPokemon);
    }
}

/**
 * Actualiza una tarjeta de comparación
 * @param {HTMLElement} cardElement - Elemento de la tarjeta
 * @param {Object} pokemon - Datos del Pokémon
 */
function updateComparisonCard(cardElement, pokemon) {
    cardElement.innerHTML = '';
    cardElement.classList.add('has-pokemon');
    
    const img = document.createElement('img');
    img.src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    img.alt = pokemon.name;
    img.style.width = '80px';
    img.style.height = '80px';
    
    const name = document.createElement('p');
    name.textContent = pokemon.name.replace('-', ' ');
    name.style.fontWeight = '700';
    name.style.marginTop = '0.5rem';
    
    const number = document.createElement('p');
    number.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;
    number.style.color = '#666';
    number.style.fontSize = '0.9rem';
    
    cardElement.appendChild(img);
    cardElement.appendChild(name);
    cardElement.appendChild(number);
}

/**
 * Muestra el panel de comparación
 */
function showComparisonPanel() {
    elements.comparisonPanel.classList.remove('hidden');
    elements.comparisonPanel.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Oculta el panel de comparación
 */
function hideComparisonPanel() {
    elements.comparisonPanel.classList.add('hidden');
    comparisonPokemon = { pokemon1: null, pokemon2: null };
    elements.pokemon1.innerHTML = '<p>Selecciona un Pokémon</p>';
    elements.pokemon2.innerHTML = '<p>Selecciona un Pokémon</p>';
    elements.pokemon1.classList.remove('has-pokemon');
    elements.pokemon2.classList.remove('has-pokemon');
}

// ========================================
// FUNCIONES DE UTILIDAD
// ========================================

/**
 * Muestra el loading spinner
 */
function showLoading() {
    elements.loadingSpinner.classList.remove('hidden');
}

/**
 * Oculta el loading spinner
 */
function hideLoading() {
    elements.loadingSpinner.classList.add('hidden');
}

/**
 * Muestra la tarjeta del Pokémon
 */
function showPokemonCard() {
    elements.pokemonCard.classList.remove('hidden');
}

/**
 * Oculta la tarjeta del Pokémon
 */
function hidePokemonCard() {
    elements.pokemonCard.classList.add('hidden');
}

/**
 * Muestra el mensaje de error
 * @param {string} message - Mensaje de error
 */
function showError(message) {
    elements.errorText.textContent = message;
    elements.errorMessage.classList.remove('hidden');
}

/**
 * Oculta el mensaje de error
 */
function hideError() {
    elements.errorMessage.classList.add('hidden');
}

/**
 * Muestra un modal
 * @param {HTMLElement} modal - Elemento del modal
 */
function showModal(modal) {
    modal.classList.remove('hidden');
    elements.overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

/**
 * Oculta el modal de favoritos
 */
function hideFavoritesModal() {
    elements.favoritesModal.classList.add('hidden');
    elements.overlay.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

/**
 * Muestra una notificación
 * @param {string} message - Mensaje de la notificación
 * @param {string} type - Tipo de notificación (success, error, info)
 */
function showNotification(message, type = 'info') {
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
    notification.style.fontWeight = '700';
    notification.style.zIndex = '10000';
    notification.style.transform = 'translateX(100%)';
    notification.style.transition = 'transform 0.3s ease';
    
    // Colores según tipo
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #4caf50, #66bb6a)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #f44336, #ef5350)';
            break;
        default:
            notification.style.background = 'linear-gradient(45deg, #2196f3, #64b5f6)';
    }
    
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ========================================
// INICIALIZACIÓN
// ========================================

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', init);

// Cargar un Pokémon por defecto (Pikachu)
window.addEventListener('load', () => {
    setTimeout(() => {
        if (!currentPokemon) {
            searchPokemon('pikachu');
        }
    }, 1000);
}); 