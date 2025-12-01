import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, Package, ArrowLeft, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import toast from 'react-hot-toast';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedType, setSelectedType] = useState('RETAIL');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data.data.product);
            setQuantity(1);
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Product not found');
            navigate('/retail');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (selectedType === 'WHOLESALE' && quantity < product.minQtyWholesale) {
            toast.error(`Minimum wholesale quantity is ${product.minQtyWholesale}`);
            return;
        }
        addToCart(product, quantity, selectedType);
    };

    const price = selectedType === 'WHOLESALE'
        ? parseFloat(product?.wholesalePrice)
        : parseFloat(product?.retailPrice);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!product) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-8 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-medium">Back</span>
                </button>

                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="card overflow-hidden">
                            <div className="relative aspect-square bg-gradient-to-br from-primary-50 to-secondary-50">
                                <img
                                    src={product.imageUrl}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                                {product.featured && (
                                    <div className="absolute top-4 right-4">
                                        <span className="px-4 py-2 bg-accent-400 text-white rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                                            <Tag className="w-4 h-4" />
                                            <span>Featured</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="card p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">Category</p>
                                    <p className="text-lg font-bold text-gray-900">{product.category}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 mb-1 text-right">Stock Available</p>
                                    <p className="text-lg font-bold text-primary-600">{product.stock} units</p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Details Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4">
                                {product.name}
                            </h1>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                {product.description}
                            </p>
                        </div>

                        {/* Pricing Type Selector */}
                        <div className="card p-6">
                            <p className="text-sm font-semibold text-gray-600 mb-3">Select Order Type</p>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => {
                                        setSelectedType('RETAIL');
                                        setQuantity(1);
                                    }}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedType === 'RETAIL'
                                            ? 'border-primary-500 bg-primary-50'
                                            : 'border-gray-200 hover:border-primary-300'
                                        }`}
                                >
                                    <div className="text-2xl font-bold text-gray-900">
                                        ${parseFloat(product.retailPrice).toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">Retail Price</div>
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedType('WHOLESALE');
                                        setQuantity(product.minQtyWholesale);
                                    }}
                                    className={`p-4 rounded-xl border-2 transition-all ${selectedType === 'WHOLESALE'
                                            ? 'border-purple-500 bg-purple-50'
                                            : 'border-gray-200 hover:border-purple-300'
                                        }`}
                                >
                                    <div className="text-2xl font-bold text-gray-900">
                                        ${parseFloat(product.wholesalePrice).toFixed(2)}
                                    </div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Wholesale Price
                                        <span className="block text-xs text-purple-600 font-semibold">
                                            Min: {product.minQtyWholesale} units
                                        </span>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Quantity Selector */}
                        <div className="card p-6">
                            <label className="block text-sm font-semibold text-gray-600 mb-3">
                                Quantity
                                {selectedType === 'WHOLESALE' && (
                                    <span className="text-purple-600 ml-2">
                                        (Minimum: {product.minQtyWholesale})
                                    </span>
                                )}
                            </label>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => {
                                        const minQty = selectedType === 'WHOLESALE' ? product.minQtyWholesale : 1;
                                        setQuantity(Math.max(minQty, quantity - 1));
                                    }}
                                    className="w-12 h-12 rounded-xl border-2 border-gray-300 hover:border-primary-500 font-bold text-xl transition-colors"
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value) || 1;
                                        const minQty = selectedType === 'WHOLESALE' ? product.minQtyWholesale : 1;
                                        setQuantity(Math.max(minQty, Math.min(product.stock, val)));
                                    }}
                                    className="flex-1 text-center text-2xl font-bold py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 outline-none"
                                    min={selectedType === 'WHOLESALE' ? product.minQtyWholesale : 1}
                                    max={product.stock}
                                />
                                <button
                                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                                    className="w-12 h-12 rounded-xl border-2 border-gray-300 hover:border-primary-500 font-bold text-xl transition-colors"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Total and Add to Cart */}
                        <div className="card p-6 space-y-4">
                            <div className="flex items-center justify-between text-2xl font-bold">
                                <span className="text-gray-600">Total:</span>
                                <span className="text-primary-600">${(price * quantity).toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className={`w-full btn ${product.stock === 0
                                        ? 'bg-gray-300 cursor-not-allowed'
                                        : selectedType === 'WHOLESALE'
                                            ? 'btn-secondary'
                                            : 'btn-primary'
                                    } flex items-center justify-center space-x-2 text-lg`}
                            >
                                {selectedType === 'WHOLESALE' ? (
                                    <Package className="w-5 h-5" />
                                ) : (
                                    <ShoppingCart className="w-5 h-5" />
                                )}
                                <span>
                                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                </span>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
