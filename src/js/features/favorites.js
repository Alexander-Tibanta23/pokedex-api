// ========================================
// LÓGICA DE FAVORITOS
// ========================================

import { elements, showElement, hideElement, setElementText, setImageSource } from '../dom/dom.js';
import { getCurrentPokemon, getFavorites, setFavorites } from './state.js';
import { showNotification } from '../ui/ui.js';
import { POKEMON_TYPES } from '../api/config.js';

/**
 * Alterna el estado de favorito del Pokémon actual
 */
export function toggleFavorite() {
    const currentPokemon = getCurrentPokemon();
    if (!currentPokemon) return;
    
    const favorites = getFavorites();
    const isFavorite = favorites.some(fav => fav.id === currentPokemon.id);
    
    if (isFavorite) {
        removeFavorite(currentPokemon.id);
        showNotification(`${currentPokemon.name} removido de favoritos`, 'info');
    } else {
        addFavorite(currentPokemon);
        showNotification(`${currentPokemon.name} agregado a favoritos`, 'success');
    }
    
    updateFavoriteButton(currentPokemon.id);
    updateFavoritesButton();
}

/**
 * Agrega un Pokémon a favoritos
 * @param {Object} pokemon - Datos del Pokémon
 */
export function addFavorite(pokemon) {
    const favorites = getFavorites();
    const newFavorite = {
        id: pokemon.id,
        name: pokemon.name,
        types: pokemon.types,
        image: pokemon.sprites.front_default
    };
    
    favorites.push(newFavorite);
    setFavorites(favorites);
}

/**
 * Remueve un Pokémon de favoritos
 * @param {number} pokemonId - ID del Pokémon
 */
export function removeFavorite(pokemonId) {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(fav => fav.id !== pokemonId);
    setFavorites(updatedFavorites);
}

/**
 * Actualiza el botón de favorito según el estado
 * @param {number} pokemonId - ID del Pokémon
 */
export function updateFavoriteButton(pokemonId) {
    const favorites = getFavorites();
    const isFavorite = favorites.some(fav => fav.id === pokemonId);
    
    const icon = elements.addToFavorites.querySelector('i');
    if (isFavorite) {
        icon.className = 'fas fa-heart';
        elements.addToFavorites.style.backgroundColor = '#ff69b4';
    } else {
        icon.className = 'far fa-heart';
        elements.addToFavorites.style.backgroundColor = '#ddd';
    }
}

/**
 * Actualiza el contador del botón de favoritos
 */
export function updateFavoritesButton() {
    const favorites = getFavorites();
    const count = favorites.length;
    setElementText(elements.favoritesBtn, `❤️ Favoritos (${count})`);
}

/**
 * Muestra el modal de favoritos
 */
export async function showFavoritesModal() {
    const favorites = getFavorites();
    
    if (favorites.length === 0) {
        elements.favoritesList.innerHTML = '<p style="text-align: center; color: #666;">No tienes favoritos aún</p>';
    } else {
        elements.favoritesList.innerHTML = '';
        
        for (const favorite of favorites) {
            const favoriteItem = await createFavoriteItem(favorite);
            elements.favoritesList.appendChild(favoriteItem);
        }
    }
    
    showElement(elements.favoritesModal);
    showElement(elements.overlay);
}

/**
 * Crea un elemento de favorito para el modal
 * @param {Object} favorite - Datos del favorito
 * @returns {HTMLElement} Elemento del favorito
 */
export async function createFavoriteItem(favorite) {
    const favoriteItem = document.createElement('div');
    favoriteItem.className = 'favorite-item';
    
    // Imagen del Pokémon
    const img = document.createElement('img');
    img.src = favorite.image;
    img.alt = favorite.name;
    
    // Información del Pokémon
    const info = document.createElement('div');
    info.className = 'favorite-info';
    
    const name = document.createElement('h4');
    name.className = 'favorite-name';
    name.textContent = favorite.name;
    
    const number = document.createElement('span');
    number.className = 'favorite-number';
    number.textContent = `#${favorite.id.toString().padStart(3, '0')}`;
    
    const types = document.createElement('div');
    types.className = 'favorite-types';
    
    favorite.types.forEach(type => {
        const typeData = POKEMON_TYPES[type.type.name];
        if (typeData) {
            const typeBadge = document.createElement('span');
            typeBadge.className = `favorite-type type-${type.type.name}`;
            typeBadge.textContent = typeData.name;
            types.appendChild(typeBadge);
        }
    });
    
    // Botón de eliminar
    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove-favorite';
    removeBtn.innerHTML = '<i class="fas fa-times"></i>';
    removeBtn.onclick = () => {
        removeFavorite(favorite.id);
        favoriteItem.remove();
        updateFavoritesButton();
        updateFavoriteButton(favorite.id);
        showNotification(`${favorite.name} removido de favoritos`, 'info');
        
        // Si no quedan favoritos, mostrar mensaje
        if (getFavorites().length === 0) {
            elements.favoritesList.innerHTML = '<p style="text-align: center; color: #666;">No tienes favoritos aún</p>';
        }
    };
    
    info.appendChild(name);
    info.appendChild(number);
    info.appendChild(types);
    
    favoriteItem.appendChild(img);
    favoriteItem.appendChild(info);
    favoriteItem.appendChild(removeBtn);
    
    return favoriteItem;
} 