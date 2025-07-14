// ========================================
// POKÉDEX INTERACTIVA - ARCHIVO PRINCIPAL
// ========================================

import { CONFIG } from '../config/config.js';
import { SearchManager } from './modules/search.js';
import { FavoritesManager } from './modules/favorites.js';
import { ComparisonManager } from './modules/comparison.js';
import { EvolutionManager } from './modules/evolution.js';
import { UIManager } from './modules/ui.js';
import { PokemonAPI } from './modules/api.js';
import { Helpers } from './utils/helpers.js';

export class PokedexApp {
    constructor() {
        this.searchManager = new SearchManager();
        this.favoritesManager = new FavoritesManager();
        this.comparisonManager = new ComparisonManager();
        this.evolutionManager = new EvolutionManager();
        this.uiManager = new UIManager();
        
        this.init();
    }

    /**
     * Inicializa la aplicación
     */
    init() {
        try {
            // Configurar event listeners
            this.setupEventHandlers();
            
            // Cargar datos iniciales
            this.loadInitialData();
            
            // Actualizar UI inicial
            this.uiManager.updateFavoritesButton();
            
            console.log('Pokédex inicializada correctamente');
        } catch (error) {
            console.error('Error inicializando la Pokédex:', error);
            this.uiManager.showError('Error inicializando la aplicación');
        }
    }

    /**
     * Configura todos los manejadores de eventos
     */
    setupEventHandlers() {
        const handlers = {
            handleSearch: () => this.handleSearch(),
            handleRandomSearch: () => this.handleRandomSearch(),
            handleShowFavorites: () => this.handleShowFavorites(),
            handleToggleFavorite: () => this.handleToggleFavorite(),
            handleAddToComparison: () => this.handleAddToComparison(),
            handleCloseComparison: () => this.handleCloseComparison(),
            handleCloseFavorites: () => this.handleCloseFavorites()
        };

        this.uiManager.setupEventListeners(handlers);
    }

    /**
     * Carga datos iniciales
     */
    loadInitialData() {
        // Cargar historial de búsquedas
        this.searchManager.loadHistory();
        
        // Cargar favoritos
        this.favoritesManager.getFavorites();
    }

    /**
     * Maneja la búsqueda de Pokémon
     */
    async handleSearch() {
        const query = this.uiManager.getSearchValue();
        
        if (!query) {
            this.uiManager.showError('Por favor ingresa un nombre o número de Pokémon');
            return;
        }

        try {
            this.uiManager.showLoading();
            this.uiManager.hideError();
            this.uiManager.hidePokemonCard();

            const pokemonData = await this.searchManager.handleSearch(query);
            
            // Obtener datos adicionales
            const [evolutionData, speciesData] = await Promise.all([
                this.evolutionManager.getEvolutionChain(pokemonData.species.url),
                PokemonAPI.fetchSpeciesData(pokemonData.species.url)
            ]);

            // Actualizar UI
            this.uiManager.updatePokemonInfo(pokemonData, evolutionData, speciesData);
            this.uiManager.showPokemonCard();

        } catch (error) {
            console.error('Error en búsqueda:', error);
            this.uiManager.showError(error.message);
        } finally {
            this.uiManager.hideLoading();
        }
    }

    /**
     * Maneja la búsqueda aleatoria
     */
    async handleRandomSearch() {
        try {
            this.uiManager.showLoading();
            this.uiManager.hideError();
            this.uiManager.hidePokemonCard();

            const pokemonData = await this.searchManager.searchRandomPokemon();
            this.uiManager.setSearchValue(pokemonData.id.toString());

            // Obtener datos adicionales
            const [evolutionData, speciesData] = await Promise.all([
                this.evolutionManager.getEvolutionChain(pokemonData.species.url),
                PokemonAPI.fetchSpeciesData(pokemonData.species.url)
            ]);

            // Actualizar UI
            this.uiManager.updatePokemonInfo(pokemonData, evolutionData, speciesData);
            this.uiManager.showPokemonCard();

        } catch (error) {
            console.error('Error en búsqueda aleatoria:', error);
            this.uiManager.showError(error.message);
        } finally {
            this.uiManager.hideLoading();
        }
    }

    /**
     * Maneja el toggle de favoritos
     */
    async handleToggleFavorite() {
        const currentPokemon = this.uiManager.getCurrentPokemon();
        
        if (!currentPokemon) {
            this.uiManager.showError('No hay Pokémon seleccionado');
            return;
        }

        try {
            const isFavorite = this.favoritesManager.isFavorite(currentPokemon.id);
            
            if (isFavorite) {
                this.favoritesManager.removeFromFavorites(currentPokemon.id);
            } else {
                this.favoritesManager.addToFavorites(currentPokemon);
            }

            // Actualizar UI
            this.uiManager.updateFavoriteButton(currentPokemon.id);
            this.uiManager.updateFavoritesButton();

        } catch (error) {
            console.error('Error manejando favoritos:', error);
            this.uiManager.showError(error.message);
        }
    }

    /**
     * Maneja mostrar el modal de favoritos
     */
    async handleShowFavorites() {
        try {
            const favorites = this.favoritesManager.getFavorites();
            
            if (favorites.length === 0) {
                this.uiManager.showError('No tienes favoritos guardados');
                return;
            }

            this.renderFavoritesList(favorites);
            this.uiManager.showFavoritesModal();

        } catch (error) {
            console.error('Error mostrando favoritos:', error);
            this.uiManager.showError('Error cargando favoritos');
        }
    }

    /**
     * Renderiza la lista de favoritos
     * @param {Array} favorites - Lista de favoritos
     */
    renderFavoritesList(favorites) {
        const favoritesList = this.uiManager.elements.favoritesList;
        favoritesList.innerHTML = '';

        favorites.forEach(favorite => {
            const favoriteItem = this.createFavoriteItem(favorite);
            favoritesList.appendChild(favoriteItem);
        });
    }

    /**
     * Crea un elemento de favorito
     * @param {Object} favorite - Datos del favorito
     * @returns {HTMLElement} Elemento del favorito
     */
    createFavoriteItem(favorite) {
        const item = Helpers.createElement('div', {
            className: 'favorite-item'
        });

        const image = Helpers.createElement('img', {
            src: favorite.image,
            alt: favorite.name,
            onerror: "this.src='https://via.placeholder.com/64x64?text=?'"
        });

        const info = Helpers.createElement('div', {
            className: 'favorite-info'
        });

        const name = Helpers.createElement('span', {
            className: 'favorite-name'
        }, Helpers.capitalize(favorite.name));

        const number = Helpers.createElement('span', {
            className: 'favorite-number'
        }, Helpers.formatPokemonNumber(favorite.id));

        const types = Helpers.createElement('div', {
            className: 'favorite-types'
        });

        favorite.types.forEach(type => {
            const typeElement = Helpers.createElement('span', {
                className: `favorite-type type-${type}`
            }, Helpers.capitalize(type));
            types.appendChild(typeElement);
        });

        const removeBtn = Helpers.createElement('button', {
            className: 'remove-favorite',
            onclick: () => this.removeFavorite(favorite.id)
        }, '×');

        info.appendChild(name);
        info.appendChild(number);
        info.appendChild(types);

        item.appendChild(image);
        item.appendChild(info);
        item.appendChild(removeBtn);

        // Agregar evento de clic para cargar el Pokémon
        item.addEventListener('click', (e) => {
            if (e.target !== removeBtn) {
                this.loadFavoritePokemon(favorite.id);
            }
        });

        return item;
    }

    /**
     * Remueve un favorito
     * @param {number} pokemonId - ID del Pokémon
     */
    removeFavorite(pokemonId) {
        try {
            this.favoritesManager.removeFromFavorites(pokemonId);
            this.uiManager.updateFavoritesButton();
            
            // Recargar lista de favoritos
            const favorites = this.favoritesManager.getFavorites();
            this.renderFavoritesList(favorites);

        } catch (error) {
            console.error('Error removiendo favorito:', error);
            this.uiManager.showError('Error removiendo favorito');
        }
    }

    /**
     * Carga un Pokémon desde favoritos
     * @param {number} pokemonId - ID del Pokémon
     */
    async loadFavoritePokemon(pokemonId) {
        try {
            this.uiManager.showLoading();
            this.uiManager.hideError();
            this.uiManager.hidePokemonCard();
            this.uiManager.hideFavoritesModal();

            const pokemonData = await PokemonAPI.fetchPokemonData(pokemonId);
            this.uiManager.setSearchValue(pokemonId.toString());

            // Obtener datos adicionales
            const [evolutionData, speciesData] = await Promise.all([
                this.evolutionManager.getEvolutionChain(pokemonData.species.url),
                PokemonAPI.fetchSpeciesData(pokemonData.species.url)
            ]);

            // Actualizar UI
            this.uiManager.updatePokemonInfo(pokemonData, evolutionData, speciesData);
            this.uiManager.showPokemonCard();

        } catch (error) {
            console.error('Error cargando Pokémon favorito:', error);
            this.uiManager.showError('Error cargando Pokémon');
        } finally {
            this.uiManager.hideLoading();
        }
    }

    /**
     * Maneja agregar Pokémon al comparador
     */
    handleAddToComparison() {
        const currentPokemon = this.uiManager.getCurrentPokemon();
        
        if (!currentPokemon) {
            this.uiManager.showError('No hay Pokémon seleccionado');
            return;
        }

        try {
            this.comparisonManager.addToComparison(currentPokemon);
            
            // Actualizar panel de comparación
            const comparisonData = this.comparisonManager.getComparisonPokemon();
            this.uiManager.updateComparisonPanel(comparisonData);
            
            // Mostrar panel si no está visible
            if (!this.uiManager.elements.comparisonPanel.classList.contains('hidden')) {
                this.uiManager.showComparisonPanel();
            }

        } catch (error) {
            console.error('Error agregando a comparación:', error);
            this.uiManager.showError(error.message);
        }
    }

    /**
     * Maneja cerrar el panel de comparación
     */
    handleCloseComparison() {
        this.uiManager.hideComparisonPanel();
    }

    /**
     * Maneja cerrar el modal de favoritos
     */
    handleCloseFavorites() {
        this.uiManager.hideFavoritesModal();
    }

    /**
     * Obtiene estadísticas de la aplicación
     * @returns {Object} Estadísticas
     */
    getAppStats() {
        return {
            searchHistory: this.searchManager.getHistory().length,
            favorites: this.favoritesManager.getFavoritesCount(),
            comparisons: this.comparisonManager.getComparisonCount(),
            maxFavorites: this.favoritesManager.getMaxFavorites()
        };
    }

    /**
     * Limpia todos los datos de la aplicación
     */
    clearAllData() {
        try {
            this.searchManager.clearHistory();
            this.favoritesManager.clearFavorites();
            this.comparisonManager.clearComparison();
            this.evolutionManager.clearCache();
            
            this.uiManager.updateFavoritesButton();
            this.uiManager.hidePokemonCard();
            this.uiManager.hideComparisonPanel();
            this.uiManager.hideFavoritesModal();
            
            Helpers.showNotification('Todos los datos han sido limpiados', 'info');
            
        } catch (error) {
            console.error('Error limpiando datos:', error);
            this.uiManager.showError('Error limpiando datos');
        }
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.pokedexApp = new PokedexApp();
});

export default PokedexApp; 