/**
 * Product Display Utility - Single Source of Truth
 * 
 * Ensures consistent product display format across entire application:
 * "Apple - 1 kg - ₹150"
 * 
 * Usage: Import these utilities instead of manually formatting product names
 */

import { formatINR } from './currency.js';

/**
 * Get full product display name with variant and price
 * @param {object} product - Product object
 * @param {object} variant - Optional variant object  
 * @param {string} orderType - 'RETAIL' or 'WHOLESALE'
 * @returns {string} "Apple - 1 kg - ₹150"
 */
export const getProductDisplayName = (product, variant = null, orderType = 'RETAIL') => {
    const productName = product.name;

    // Get variant display name if available
    const variantPart = variant ? ` - ${variant.displayName}` : '';

    // Get price from variant or product
    const price = variant
        ? (orderType === 'WHOLESALE' ? parseFloat(variant.wholesalePrice) : parseFloat(variant.retailPrice))
        : (orderType === 'WHOLESALE' ? parseFloat(product.wholesalePrice) : parseFloat(product.retailPrice));

    const pricePart = ` - ${formatINR(price)}`;

    return `${productName}${variantPart}${pricePart}`;
};

/**
 * Get product short name with variant (no price)
 * @param {object} product - Product object
 * @param {object} variant - Optional variant object
 * @returns {string} "Apple - 1 kg" or "Apple"
 */
export const getProductShortName = (product, variant = null) => {
    const productName = product.name;
    const variantPart = variant ? ` - ${variant.displayName}` : '';
    return `${productName}${variantPart}`;
};

/**
 * Get variant price based on order type
 * @param {object} item - Product or variant object
 * @param {string} orderType - 'RETAIL' or 'WHOLESALE'
 * @returns {number} Price value
 */
export const getVariantPrice = (item, orderType = 'RETAIL') => {
    if (!item) return 0;
    return orderType === 'WHOLESALE'
        ? parseFloat(item.wholesalePrice)
        : parseFloat(item.retailPrice);
};

/**
 * Format product for cart display (standardized)
 * @param {object} product - Product object
 * @param {object} variant - Variant object (if selected)
 * @param {string} orderType - 'RETAIL' or 'WHOLESALE'
 * @param {number} quantity - Quantity selected
 * @returns {object} Standardized cart item
 */
export const formatProductForCart = (product, variant, orderType, quantity) => {
    const price = variant
        ? getVariantPrice(variant, orderType)
        : getVariantPrice(product, orderType);

    return {
        displayName: getProductShortName(product, variant),
        fullDisplayName: getProductDisplayName(product, variant, orderType),
        price,
        totalPrice: price * quantity,
        quantity,
        orderType,
        productId: product.id,
        variantId: variant?.id || null,
        variantDisplayName: variant?.displayName || null
    };
};

/**
 * Get price per unit for comparison
 * @param {object} variant - Variant object
 * @param {string} orderType - 'RETAIL' or 'WHOLESALE'
 * @returns {string} "₹150/kg"
 */
export const getPricePerUnit = (variant, orderType = 'RETAIL') => {
    if (!variant) return '';

    const price = getVariantPrice(variant, orderType);
    const quantity = parseFloat(variant.quantity);
    let unit = variant.unit;
    let normalizedQuantity = quantity;

    // Convert grams to kg for per-unit display
    if (unit === 'g' && quantity >= 1000) {
        normalizedQuantity = quantity / 1000;
        unit = 'kg';
    }

    const pricePerUnit = price / normalizedQuantity;
    return `${formatINR(pricePerUnit)}/${unit}`;
};

/**
 * Get minimum wholesale quantity display
 * @param {object} item - Product or variant
 * @returns {string} "Min: 10 units"
 */
export const getMinWholesaleDisplay = (item) => {
    if (!item) return '';
    const minQty = item.minQtyWholesale || 10;
    return `Min: ${minQty} units`;
};

/**
 * Get stock status display (India style - Zepto/BigBasket)
 * @param {number} stock - Stock quantity
 * @returns {object} { text, color, bgColor }
 */
export const getStockStatus = (stock) => {
    if (stock === 0) {
        return {
            text: 'Out of Stock',
            color: 'text-red-600',
            bgColor: 'bg-red-100'
        };
    }

    if (stock < 10) {
        return {
            text: `Only ${stock} left!`,
            color: 'text-orange-600',
            bgColor: 'bg-orange-100'
        };
    }

    return {
        text: 'In Stock',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
    };
};

export default {
    getProductDisplayName,
    getProductShortName,
    getVariantPrice,
    formatProductForCart,
    getPricePerUnit,
    getMinWholesaleDisplay,
    getStockStatus
};
