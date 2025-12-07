import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatINR } from '../utils/currency';

const ProductCard = ({ product, orderType = 'RETAIL' }) => {
    const { addToCart } = useCart();

    // NEW: Get default variant or first variant
    const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
    const [selectedVariant, setSelectedVariant] = useState(defaultVariant);

    const isWholesale = orderType === 'WHOLESALE';

    // NEW: Get price from selected variant if available, fallback to product price
    const price = selectedVariant
        ? (isWholesale ? parseFloat(selectedVariant.wholesalePrice) : parseFloat(selectedVariant.retailPrice))
        : (isWholesale ? parseFloat(product.wholesalePrice) : parseFloat(product.retailPrice));

    // NEW: Get stock from selected variant
    const stock = selectedVariant ? selectedVariant.stock : product.stock;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const quantity = isWholesale ? (selectedVariant?.minQtyWholesale || product.minQtyWholesale || 10) : 1;

        // NEW: Pass variant info to cart
        addToCart(product, quantity, orderType, selectedVariant);
    };

    const handleVariantChange = (e, variant) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedVariant(variant);
    };

    return (
        <Link to={`/product/${product.id}`}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                className="card card-hover overflow-hidden group cursor-pointer"
            >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                    />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-700 shadow-lg">
                            {product.category}
                        </span>
                    </div>

                    {/* Featured Badge */}
                    {product.featured && (
                        <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 bg-accent-400 text-white rounded-full text-xs font-bold shadow-lg flex items-center space-x-1">
                                <Tag className="w-3 h-3" />
                                <span>Featured</span>
                            </span>
                        </div>
                    )}

                    {/* Wholesale Badge */}
                    {isWholesale && (
                        <div className="absolute bottom-3 left-3">
                            <span className="px-3 py-1 bg-purple-500 text-white rounded-full text-xs font-bold shadow-lg">
                                Min: {selectedVariant?.minQtyWholesale || product.minQtyWholesale} units
                            </span>
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                                {product.name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {product.description}
                            </p>
                        </div>
                    </div>

                    {/* NEW: Variant Selector (India-specific) */}
                    {product.variants && product.variants.length > 1 && (
                        <div className="flex items-center gap-2 flex-wrap" onClick={(e) => e.preventDefault()}>
                            {product.variants.map((variant) => (
                                <button
                                    key={variant.id}
                                    onClick={(e) => handleVariantChange(e, variant)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedVariant?.id === variant.id
                                            ? 'bg-primary-500 text-white shadow-md scale-105'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {variant.displayName}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                            <div className="flex items-baseline gap-1">
                                {/* NEW: INR Currency Format */}
                                <span className="text-2xl font-bold text-gray-900">
                                    {formatINR(price)}
                                </span>
                                {selectedVariant && (
                                    <span className="text-xs text-gray-500">
                                        /{selectedVariant.displayName}
                                    </span>
                                )}
                            </div>
                            {isWholesale && (
                                <div className="text-xs text-gray-500">per unit</div>
                            )}
                        </div>

                        {/* NEW: Stock Status with Indian style */}
                        <div className="text-sm">
                            {stock === 0 ? (
                                <span className="text-red-600 font-semibold">Out of Stock</span>
                            ) : stock < 10 ? (
                                <span className="text-orange-600 font-semibold">Only {stock} left!</span>
                            ) : (
                                <span className="text-green-600 font-semibold">In Stock</span>
                            )}
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        disabled={stock === 0}
                        className={`w-full btn ${stock === 0
                                ? 'bg-gray-300 cursor-not-allowed'
                                : orderType === 'WHOLESALE'
                                    ? 'btn-secondary'
                                    : 'btn-primary'
                            } flex items-center justify-center space-x-2`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </motion.button>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;
