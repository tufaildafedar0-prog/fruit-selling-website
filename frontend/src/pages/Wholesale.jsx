import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, Package, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';

const Wholesale = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        fetchCategories();
        fetchProducts();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [searchTerm, selectedCategory]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/products/categories');
            setCategories(response.data.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = { limit: 50 };
            if (searchTerm) params.search = searchTerm;
            if (selectedCategory) params.category = selectedCategory;

            const response = await api.get('/products', { params });
            setProducts(response.data.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 text-white py-16">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                            <Package className="w-5 h-5" />
                            <span>Bulk Orders Available</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                            Wholesale Shop
                        </h1>
                        <p className="text-xl text-purple-50 max-w-2xl mx-auto">
                            Premium fruits at wholesale prices for businesses and bulk orders
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-12">
                {/* Info Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass p-6 rounded-2xl mb-8 border-2 border-purple-200"
                >
                    <div className="flex items-start space-x-4">
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <Package className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Wholesale Pricing Information
                            </h3>
                            <p className="text-gray-600">
                                All products have minimum order quantities for wholesale pricing. Check each product card for specific requirements. Bulk discounts available!
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Search and Filters */}
                <div className="mb-8 space-y-4">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search wholesale products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all outline-none"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === ''
                                    ? 'bg-purple-500 text-white shadow-lg'
                                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-500'
                                }`}
                        >
                            All Categories
                        </button>
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-6 py-2 rounded-full font-medium transition-all ${selectedCategory === category
                                        ? 'bg-purple-500 text-white shadow-lg'
                                        : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-purple-500'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <LoadingSpinner />
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📦</div>
                        <h3 className="text-2xl font-bold text-gray-700 mb-2">No products found</h3>
                        <p className="text-gray-600">Try adjusting your search</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} orderType="WHOLESALE" />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Wholesale;
