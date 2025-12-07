/**
 * Currency Utility for India Market
 * 
 * Formats prices in Indian Rupees (₹ INR)
 * Follows Indian number formatting standards
 */

/**
 * Format price in Indian Rupees
 * @param {number} amount - Price amount
 * @param {object} options - Formatting options
 * @returns {string} Formatted price (₹1,250)
 */
export const formatINR = (amount, options = {}) => {
    const {
        showDecimals = false, // Hide decimals by default for fruits
        showSymbol = true
    } = options;

    const formatted = new Intl.NumberFormat('en-IN', {
        style: showSymbol ? 'currency' : 'decimal',
        currency: 'INR',
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0
    }).format(amount);

    return formatted;
};

/**
 * Format variant display name with price
 * @param {object} variant - Variant object
 * @param {string} priceType - 'retail' or 'wholesale'
 * @returns {string} Formatted string (e.g., "1 kg - ₹150")
 */
export const formatVariantWithPrice = (variant, priceType = 'retail') => {
    const price = priceType === 'wholesale' ? variant.wholesalePrice : variant.retailPrice;
    return `${variant.displayName} - ${formatINR(price)}`;
};

/**
 * Get price per unit for comparison
 * @param {number} price - Total price
 * @param {number} quantity - Quantity
 * @param {string} unit - Unit (kg, g, pcs, etc.)
 * @returns {string} Price per unit (e.g., "₹150/kg")
 */
export const formatPricePerUnit = (price, quantity, unit) => {
    // Normalize to standard unit
    let normalizedQuantity = quantity;
    let normalizedUnit = unit;

    // Convert grams to kg for per-unit display
    if (unit === 'g') {
        normalizedQuantity = quantity / 1000;
        normalizedUnit = 'kg';
    }

    const pricePerUnit = price / normalizedQuantity;
    return `${formatINR(pricePerUnit)}/${normalizedUnit}`;
};

/**
 * Parse price string to number
 * @param {string} priceString - Price string (e.g., "₹1,250" or "1250")
 * @returns {number} Price as number
 */
export const parsePrice = (priceString) => {
    if (typeof priceString === 'number') return priceString;
    return parseFloat(priceString.toString().replace(/[₹,]/g, ''));
};

export default formatINR;
