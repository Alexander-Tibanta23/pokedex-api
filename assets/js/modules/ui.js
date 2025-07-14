// ========================================
// MÓDULO DE INTERFAZ DE USUARIO
// ========================================

import { Helpers } from '../utils/helpers.js';
import { CONFIG } from '../../config/config.js';

export class UIManager {
    constructor() {
        this.elements = this.initializeElements();
        this.currentPokemon = null;
        this.isLoading = false;
    }

    /**
     * Inicializa todos los elementos del DOM
     * @returns {Object} Objeto con todos los elementos
     */
    initializeElements() {
        return {
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
    }

    /**
     * Configura todos los event listeners
     * @param {Object} handlers - Objeto con funciones manejadoras
     */
    setupEventListeners(handlers) {
        // Búsqueda
        this.elements.searchBtn.addEventListener('click', handlers.handleSearch);
        this.elements.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handlers.handleSearch();
        });
        
        // Botones principales
        this.elements.randomBtn.addEventListener('click', handlers.handleRandomSearch);
        this.elements.favoritesBtn.addEventListener('click', handlers.handleShowFavorites);
        
        // Botones de acción del Pokémon
        this.elements.addToFavorites.addEventListener('click', handlers.handleToggleFavorite);
        this.elements.comparePokemon.addEventListener('click', handlers.handleAddToComparison);
        
        // Panel de comparación
        this.elements.closeComparison.addEventListener('click', handlers.handleCloseComparison);
        
        // Modal de favoritos
        this.elements.closeFavorites.addEventListener('click', handlers.handleCloseFavorites);
        this.elements.overlay.addEventListener('click', handlers.handleCloseFavorites);
        
        // Cerrar modales con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                handlers.handleCloseFavorites();
                handlers.handleCloseComparison();
            }
        });

        // Búsqueda con debounce
        const debouncedSearch = Helpers.debounce(handlers.handleSearch, 500);
        this.elements.searchInput.addEventListener('input', debouncedSearch);
    }

    /**
     * Muestra el estado de carga
     */
    showLoading() {
        this.isLoading = true;
        this.elements.loadingSpinner.classList.remove('hidden');
        this.elements.searchBtn.disabled = true;
        this.elements.randomBtn.disabled = true;
    }

    /**
     * Oculta el estado de carga
     */
    hideLoading() {
        this.isLoading = false;
        this.elements.loadingSpinner.classList.add('hidden');
        this.elements.searchBtn.disabled = false;
        this.elements.randomBtn.disabled = false;
    }

    /**
     * Muestra la tarjeta del Pokémon
     */
    showPokemonCard() {
        this.elements.pokemonCard.classList.remove('hidden');
        this.elements.pokemonCard.style.animation = 'fadeIn 0.5s ease-in-out';
    }

    /**
     * Oculta la tarjeta del Pokémon
     */
    hidePokemonCard() {
        this.elements.pokemonCard.classList.add('hidden');
    }

    /**
     * Muestra un mensaje de error
     * @param {string} message - Mensaje de error
     */
    showError(message) {
        this.elements.errorText.textContent = message;
        this.elements.errorMessage.classList.remove('hidden');
        this.elements.errorMessage.style.animation = 'shake 0.5s ease-in-out';
    }

    /**
     * Oculta el mensaje de error
     */
    hideError() {
        this.elements.errorMessage.classList.add('hidden');
    }

    /**
     * Muestra el panel de comparación
     */
    showComparisonPanel() {
        this.elements.comparisonPanel.classList.remove('hidden');
        this.elements.comparisonPanel.style.animation = 'slideIn 0.3s ease-out';
    }

    /**
     * Oculta el panel de comparación
     */
    hideComparisonPanel() {
        this.elements.comparisonPanel.classList.add('hidden');
    }

    /**
     * Muestra el modal de favoritos
     */
    showFavoritesModal() {
        this.elements.favoritesModal.classList.remove('hidden');
        this.elements.overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    /**
     * Oculta el modal de favoritos
     */
    hideFavoritesModal() {
        this.elements.favoritesModal.classList.add('hidden');
        this.elements.overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    /**
     * Actualiza la información del Pokémon en la UI
     * @param {Object} pokemon - Datos del Pokémon
     * @param {Object} evolutionData - Datos de evolución
     * @param {Object} speciesData - Datos de especie
     */
    updatePokemonInfo(pokemon, evolutionData, speciesData) {
        this.currentPokemon = pokemon;

        // Información básica
        this.elements.pokemonName.textContent = Helpers.capitalize(pokemon.name);
        this.elements.pokemonNumber.textContent = Helpers.formatPokemonNumber(pokemon.id);
        
        // Imagen
        this.elements.pokemonImage.src = PokemonAPI.getFallbackImage(pokemon.sprites);
        this.elements.pokemonImage.alt = `Imagen de ${pokemon.name}`;

        // Tipos
        this.displayTypes(pokemon.types);

        // Estadísticas básicas
        this.elements.pokemonHeight.textContent = Helpers.formatHeight(pokemon.height);
        this.elements.pokemonWeight.textContent = Helpers.formatWeight(pokemon.weight);

        // Habilidades
        this.displayAbilities(pokemon.abilities);

        // Estadísticas detalladas
        this.displayStats(pokemon.stats);

        // Cadena evolutiva
        if (evolutionData) {
            this.displayEvolutionChain(evolutionData);
        }

        // Cambiar color de fondo según tipo
        this.changeCardBackground(pokemon.types[0].type.name);

        // Actualizar botón de favoritos
        this.updateFavoriteButton(pokemon.id);
    }

    /**
     * Muestra los tipos del Pokémon
     * @param {Array} types - Array de tipos
     */
    displayTypes(types) {
        this.elements.pokemonTypes.innerHTML = '';
        
        types.forEach(type => {
            const typeElement = Helpers.createElement('span', {
                className: `type-badge type-${type.type.name}`
            }, Helpers.capitalize(type.type.name));
            
            this.elements.pokemonTypes.appendChild(typeElement);
        });
    }

    /**
     * Muestra las habilidades del Pokémon
     * @param {Array} abilities - Array de habilidades
     */
    displayAbilities(abilities) {
        this.elements.pokemonAbilities.innerHTML = '';
        
        abilities.forEach(ability => {
            const abilityElement = Helpers.createElement('span', {
                className: `ability-badge ${ability.is_hidden ? 'ability-hidden' : ''}`
            }, Helpers.capitalize(ability.ability.name.replace('-', ' ')));
            
            this.elements.pokemonAbilities.appendChild(abilityElement);
        });
    }

    /**
     * Muestra las estadísticas del Pokémon
     * @param {Array} stats - Array de estadísticas
     */
    displayStats(stats) {
        this.elements.pokemonStats.innerHTML = '';
        
        stats.forEach(stat => {
            const statName = Helpers.getStatName(stat.stat.name);
            const statValue = stat.base_stat;
            const statColor = Helpers.getStatColor(statValue);
            const percentage = (statValue / 255) * 100;

            const statContainer = Helpers.createElement('div', {
                className: 'stat-bar'
            });

            const statNameElement = Helpers.createElement('span', {
                className: 'stat-name'
            }, statName);

            const statProgressElement = Helpers.createElement('div', {
                className: 'stat-progress'
            });

            const statFillElement = Helpers.createElement('div', {
                className: 'stat-fill',
                style: {
                    width: `${percentage}%`,
                    backgroundColor: statColor
                }
            });

            const statValueElement = Helpers.createElement('span', {
                className: 'stat-value-num'
            }, statValue);

            statProgressElement.appendChild(statFillElement);
            statContainer.appendChild(statNameElement);
            statContainer.appendChild(statProgressElement);
            statContainer.appendChild(statValueElement);
            this.elements.pokemonStats.appendChild(statContainer);
        });
    }

    /**
     * Muestra la cadena evolutiva
     * @param {Object} evolutionData - Datos de evolución
     */
    async displayEvolutionChain(evolutionData) {
        this.elements.evolutionChain.innerHTML = '';
        
        if (!evolutionData || !evolutionData.chain) {
            const noEvolutionElement = Helpers.createElement('p', {
                className: 'no-evolution'
            }, 'Este Pokémon no evoluciona');
            this.elements.evolutionChain.appendChild(noEvolutionElement);
            return;
        }

        const evolutionChain = await this.buildEvolutionChain(evolutionData.chain);
        if (evolutionChain) {
            this.renderEvolutionChain(evolutionChain);
        }
    }

    /**
     * Construye la cadena evolutiva para mostrar
     * @param {Object} chain - Datos de la cadena
     * @returns {Promise<Object>} Cadena evolutiva construida
     */
    async buildEvolutionChain(chain) {
        if (!chain) return null;

        const evolutionChain = {
            pokemon: {
                id: chain.species.url.split('/').slice(-2, -1)[0],
                name: chain.species.name,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${chain.species.url.split('/').slice(-2, -1)[0]}.png`
            },
            evolutions: []
        };

        if (chain.evolves_to && chain.evolves_to.length > 0) {
            for (const evolution of chain.evolves_to) {
                const evolutionData = await this.buildEvolutionChain(evolution);
                if (evolutionData) {
                    evolutionChain.evolutions.push(evolutionData);
                }
            }
        }

        return evolutionChain;
    }

    /**
     * Renderiza la cadena evolutiva en el DOM
     * @param {Object} evolutionChain - Cadena evolutiva
     */
    renderEvolutionChain(evolutionChain) {
        const container = Helpers.createElement('div', {
            className: 'evolution-chain-container'
        });

        // Pokémon base
        const basePokemon = this.createEvolutionItem(evolutionChain.pokemon);
        container.appendChild(basePokemon);

        // Evoluciones
        evolutionChain.evolutions.forEach(evolution => {
            const arrow = Helpers.createElement('div', {
                className: 'evolution-arrow'
            }, '→');
            container.appendChild(arrow);

            const evolutionItem = this.createEvolutionItem(evolution.pokemon);
            container.appendChild(evolutionItem);
        });

        this.elements.evolutionChain.appendChild(container);
    }

    /**
     * Crea un elemento de evolución
     * @param {Object} pokemon - Datos del Pokémon
     * @returns {HTMLElement} Elemento de evolución
     */
    createEvolutionItem(pokemon) {
        const item = Helpers.createElement('div', {
            className: 'evolution-item'
        });

        const image = Helpers.createElement('img', {
            src: pokemon.image,
            alt: pokemon.name,
            onerror: "this.src='https://via.placeholder.com/96x96?text=?'"
        });

        const name = Helpers.createElement('p', {}, Helpers.capitalize(pokemon.name));

        item.appendChild(image);
        item.appendChild(name);

        return item;
    }

    /**
     * Cambia el color de fondo de la tarjeta según el tipo
     * @param {string} type - Tipo del Pokémon
     */
    changeCardBackground(type) {
        const colors = Helpers.getTypeColor(type);
        this.elements.pokemonCard.style.background = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
    }

    /**
     * Actualiza el botón de favoritos
     * @param {number} pokemonId - ID del Pokémon
     */
    updateFavoriteButton(pokemonId) {
        // Esta función será implementada cuando se integre con el módulo de favoritos
        const isFavorite = false; // Placeholder
        this.elements.addToFavorites.innerHTML = isFavorite ? 
            '<i class="fas fa-heart"></i>' : 
            '<i class="far fa-heart"></i>';
    }

    /**
     * Actualiza el botón de favoritos en el header
     */
    updateFavoritesButton() {
        // Esta función será implementada cuando se integre con el módulo de favoritos
        const favoritesCount = 0; // Placeholder
        this.elements.favoritesBtn.innerHTML = `<i class="fas fa-heart"></i> Favoritos (${favoritesCount})`;
    }

    /**
     * Actualiza el panel de comparación
     * @param {Object} comparisonData - Datos de comparación
     */
    updateComparisonPanel(comparisonData) {
        if (comparisonData.pokemon1) {
            this.updateComparisonCard(this.elements.pokemon1, comparisonData.pokemon1);
        }
        if (comparisonData.pokemon2) {
            this.updateComparisonCard(this.elements.pokemon2, comparisonData.pokemon2);
        }
    }

    /**
     * Actualiza una tarjeta de comparación
     * @param {HTMLElement} cardElement - Elemento de la tarjeta
     * @param {Object} pokemon - Datos del Pokémon
     */
    updateComparisonCard(cardElement, pokemon) {
        cardElement.innerHTML = '';
        cardElement.classList.add('has-pokemon');

        const image = Helpers.createElement('img', {
            src: PokemonAPI.getFallbackImage(pokemon.sprites),
            alt: pokemon.name
        });

        const name = Helpers.createElement('h4', {}, Helpers.capitalize(pokemon.name));
        const number = Helpers.createElement('p', {}, Helpers.formatPokemonNumber(pokemon.id));

        cardElement.appendChild(image);
        cardElement.appendChild(name);
        cardElement.appendChild(number);
    }

    /**
     * Limpia una tarjeta de comparación
     * @param {HTMLElement} cardElement - Elemento de la tarjeta
     */
    clearComparisonCard(cardElement) {
        cardElement.innerHTML = '<p>Selecciona un Pokémon</p>';
        cardElement.classList.remove('has-pokemon');
    }

    /**
     * Obtiene el valor del campo de búsqueda
     * @returns {string} Valor del campo de búsqueda
     */
    getSearchValue() {
        return this.elements.searchInput.value.trim();
    }

    /**
     * Establece el valor del campo de búsqueda
     * @param {string} value - Valor a establecer
     */
    setSearchValue(value) {
        this.elements.searchInput.value = value;
    }

    /**
     * Limpia el campo de búsqueda
     */
    clearSearch() {
        this.elements.searchInput.value = '';
    }

    /**
     * Enfoca el campo de búsqueda
     */
    focusSearch() {
        this.elements.searchInput.focus();
    }

    /**
     * Verifica si la UI está en estado de carga
     * @returns {boolean}
     */
    isLoading() {
        return this.isLoading;
    }

    /**
     * Obtiene el Pokémon actual
     * @returns {Object|null}
     */
    getCurrentPokemon() {
        return this.currentPokemon;
    }
}

export default UIManager; 