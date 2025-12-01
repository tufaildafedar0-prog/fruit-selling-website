import { motion } from 'framer-motion';
import { ShoppingCart, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, orderType = 'RETAIL' }) => {
    const { addToCart } = useCart();

    const isWholesale = orderType === 'WHOLESALE';
    const price = isWholesale
        ? parseFloat(product.wholesalePrice)
        : parseFloat(product.retailPrice);

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const quantity = isWholesale ? product.minQtyWholesale || 10 : 1;
        addToCart(product, quantity, orderType);
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
                                Min: {product.minQtyWholesale} units
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

                    {/* Price and Stock */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                ${price.toFixed(2)}
                            </div>
                            {isWholesale && (
                                <div className="text-xs text-gray-500">per unit</div>
                            )}
                        </div>
                        <div className="text-sm text-gray-500">
                            Stock: <span className="font-semibold text-gray-700">{product.stock}</span>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        className={`w-full btn ${product.stock === 0
                                ? 'bg-gray-300 cursor-not-allowed'
                                : orderType === 'WHOLESALE'
                                    ? 'btn-secondary'
                                    : 'btn-primary'
                            } flex items-center justify-center space-x-2`}
                    >
                        <ShoppingCart className="w-4 h-4" />
                        <span>{product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                    </motion.button>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProductCard;
