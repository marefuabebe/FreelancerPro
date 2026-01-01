/**
 * Centralized validation utilities for frontend forms
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateEmail = (email) => {
    if (!email || !email.trim()) {
        return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true, error: '' };
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} { isValid: boolean, error: string, strength: number }
 */
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, error: 'Password is required', strength: 0 };
    }

    if (password.length < 8) {
        return { isValid: false, error: 'Password must be at least 8 characters', strength: 1 };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let strength = 1;
    if (password.length >= 8) strength++;
    if (hasUpperCase && hasLowerCase) strength++;
    if (hasNumber) strength++;
    if (hasSpecialChar) strength++;

    // Strong password: 8+ chars, uppercase, lowercase, number
    if (password.length >= 8 && hasUpperCase && hasLowerCase && hasNumber) {
        return { isValid: true, error: '', strength: Math.min(strength, 3) };
    }

    return {
        isValid: false,
        error: 'Password must contain uppercase, lowercase, and numbers',
        strength: Math.min(strength, 3)
    };
};

/**
 * Validate name (first name, last name)
 * @param {string} name - Name to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateName = (name, fieldName = 'Name') => {
    if (!name || !name.trim()) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    if (name.trim().length < 2) {
        return { isValid: false, error: `${fieldName} must be at least 2 characters` };
    }

    if (name.trim().length > 50) {
        return { isValid: false, error: `${fieldName} cannot exceed 50 characters` };
    }

    return { isValid: true, error: '' };
};

/**
 * Validate string length
 * @param {string} value - Value to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateLength = (value, min, max, fieldName = 'Field') => {
    if (!value || !value.trim()) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    const length = value.trim().length;

    if (length < min) {
        return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
    }

    if (max && length > max) {
        return { isValid: false, error: `${fieldName} cannot exceed ${max} characters` };
    }

    return { isValid: true, error: '' };
};

/**
 * Validate numeric value
 * @param {number|string} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value (optional)
 * @param {string} fieldName - Field name for error message
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateNumber = (value, min = 0, max = null, fieldName = 'Value') => {
    if (value === '' || value === null || value === undefined) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    const num = Number(value);

    if (isNaN(num)) {
        return { isValid: false, error: `${fieldName} must be a valid number` };
    }

    if (num < min) {
        return { isValid: false, error: `${fieldName} must be at least ${min}` };
    }

    if (max !== null && num > max) {
        return { isValid: false, error: `${fieldName} cannot exceed ${max}` };
    }

    return { isValid: true, error: '' };
};

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @param {boolean} required - Whether URL is required
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateUrl = (url, required = false) => {
    if (!url || !url.trim()) {
        if (required) {
            return { isValid: false, error: 'URL is required' };
        }
        return { isValid: true, error: '' };
    }

    try {
        new URL(url);
        return { isValid: true, error: '' };
    } catch {
        return { isValid: false, error: 'Please enter a valid URL' };
    }
};

/**
 * Validate array has minimum items
 * @param {Array} array - Array to validate
 * @param {number} min - Minimum number of items
 * @param {string} fieldName - Field name for error message
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateArray = (array, min = 1, fieldName = 'Items') => {
    if (!array || !Array.isArray(array)) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    if (array.length < min) {
        return { isValid: false, error: `Please select at least ${min} ${fieldName.toLowerCase()}` };
    }

    return { isValid: true, error: '' };
};

/**
 * Validate required field
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'Field') => {
    if (value === null || value === undefined || value === '') {
        return { isValid: false, error: `${fieldName} is required` };
    }

    if (typeof value === 'string' && !value.trim()) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    return { isValid: true, error: '' };
};

/**
 * Validate date
 * @param {string|Date} date - Date to validate
 * @param {boolean} required - Whether date is required
 * @param {boolean} futureOnly - Whether date must be in the future
 * @returns {object} { isValid: boolean, error: string }
 */
export const validateDate = (date, required = false, futureOnly = false) => {
    if (!date) {
        if (required) {
            return { isValid: false, error: 'Date is required' };
        }
        return { isValid: true, error: '' };
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        return { isValid: false, error: 'Please enter a valid date' };
    }

    if (futureOnly && dateObj < new Date()) {
        return { isValid: false, error: 'Date must be in the future' };
    }

    return { isValid: true, error: '' };
};

/**
 * Get password strength indicator
 * @param {string} password - Password to check
 * @returns {object} { strength: number (1-3), label: string, color: string }
 */
export const getPasswordStrength = (password) => {
    if (!password || password.length === 0) {
        return { strength: 0, label: '', color: '' };
    }

    if (password.length < 8) {
        return { strength: 1, label: 'Weak', color: 'text-red-500' };
    }

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar) {
        return { strength: 3, label: 'Strong', color: 'text-green-500' };
    }

    if (hasUpperCase && hasLowerCase && hasNumber) {
        return { strength: 3, label: 'Strong', color: 'text-green-500' };
    }

    return { strength: 2, label: 'Fair', color: 'text-yellow-500' };
};

export default {
    validateEmail,
    validatePassword,
    validateName,
    validateLength,
    validateNumber,
    validateUrl,
    validateArray,
    validateRequired,
    validateDate,
    getPasswordStrength,
};
