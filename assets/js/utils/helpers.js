// ========================================
// FUNCIONES AUXILIARES Y UTILIDADES
// ========================================

import { CONFIG } from '../../config/config.js';

export class Helpers {
    /**
     * Capitaliza la primera letra de una cadena
     * @param {string} str - Cadena a capitalizar
     * @returns {string}
     */
    static capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    /**
     * Formatea el número del Pokémon con ceros a la izquierda
     * @param {number} id - ID del Pokémon
     * @returns {string}
     */
    static formatPokemonNumber(id) {
        return `#${id.toString().padStart(3, '0')}`;
    }

    /**
     * Convierte decímetros a metros
     * @param {number} decimeters - Altura en decímetros
     * @returns {string}
     */
    static formatHeight(decimeters) {
        return `${(decimeters / 10).toFixed(1)} m`;
    }

    /**
     * Convierte hectogramos a kilogramos
     * @param {number} hectograms - Peso en hectogramos
     * @returns {string}
     */
    static formatWeight(hectograms) {
        return `${(hectograms / 10).toFixed(1)} kg`;
    }

    /**
     * Genera un color aleatorio para elementos sin tipo específico
     * @returns {string}
     */
    static getRandomColor() {
        const colors = [
            '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
            '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    /**
     * Obtiene el color de un tipo de Pokémon
     * @param {string} type - Tipo del Pokémon
     * @returns {Object} Objeto con colores primary y secondary
     */
    static getTypeColor(type) {
        return CONFIG.TYPE_COLORS[type] || {
            primary: this.getRandomColor(),
            secondary: this.getRandomColor()
        };
    }

    /**
     * Obtiene el nombre en español de una estadística
     * @param {string} statName - Nombre de la estadística en inglés
     * @returns {string}
     */
    static getStatName(statName) {
        return CONFIG.STAT_NAMES[statName] || statName;
    }

    /**
     * Calcula el color de una barra de estadística basado en su valor
     * @param {number} value - Valor de la estadística
     * @returns {string}
     */
    static getStatColor(value) {
        if (value >= 100) return '#4ecdc4'; // Verde para valores altos
        if (value >= 70) return '#45b7d1';  // Azul para valores medios-altos
        if (value >= 50) return '#feca57';  // Amarillo para valores medios
        if (value >= 30) return '#ff9f43';  // Naranja para valores bajos
        return '#ff6b6b';                   // Rojo para valores muy bajos
    }

    /**
     * Valida si un número está en el rango válido de Pokémon
     * @param {number} number - Número a validar
     * @returns {boolean}
     */
    static isValidPokemonNumber(number) {
        return number >= 1 && number <= CONFIG.TOTAL_POKEMON;
    }

    /**
     * Genera un número aleatorio de Pokémon
     * @returns {number}
     */
    static getRandomPokemonNumber() {
        return Math.floor(Math.random() * CONFIG.TOTAL_POKEMON) + 1;
    }

    /**
     * Debounce function para optimizar búsquedas
     * @param {Function} func - Función a ejecutar
     * @param {number} wait - Tiempo de espera en ms
     * @returns {Function}
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function para limitar la frecuencia de ejecución
     * @param {Function} func - Función a ejecutar
     * @param {number} limit - Límite de tiempo en ms
     * @returns {Function}
     */
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Maneja errores de red de manera uniforme
     * @param {Error} error - Error capturado
     * @returns {string} Mensaje de error amigable
     */
    static handleNetworkError(error) {
        console.error('Error de red:', error);
        
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            return CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
        }
        
        if (error.name === 'AbortError') {
            return CONFIG.ERROR_MESSAGES.TIMEOUT_ERROR;
        }
        
        return error.message || CONFIG.ERROR_MESSAGES.API_ERROR;
    }

    /**
     * Crea un elemento DOM con atributos
     * @param {string} tag - Tag del elemento
     * @param {Object} attributes - Atributos del elemento
     * @param {string} textContent - Contenido de texto
     * @returns {HTMLElement}
     */
    static createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'style' && typeof value === 'object') {
                Object.assign(element.style, value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    /**
     * Muestra una notificación temporal
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo de notificación (success, error, info)
     * @param {number} duration - Duración en ms
     */
    static showNotification(message, type = 'info', duration = 3000) {
        const notification = this.createElement('div', {
            className: `notification notification-${type}`,
            style: {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 'bold',
                zIndex: '10000',
                transform: 'translateX(100%)',
                transition: 'transform 0.3s ease'
            }
        }, message);

        document.body.appendChild(notification);

        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remover después del tiempo especificado
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
}

export default Helpers; 