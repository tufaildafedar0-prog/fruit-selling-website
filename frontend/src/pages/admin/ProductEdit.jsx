import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        retailPrice: '',
        wholesalePrice: '',
        minQtyWholesale: '10',
        imageUrl: '',
        category: '',
        stock: '',
        featured: false,
    });

    const isEditMode = id && id !== 'new';

    useEffect(() => {
        if (isEditMode) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/products/${id}`);
            const product = response.data.data;
            setFormData({
                name: product.name || '',
                description: product.description || '',
                retailPrice: String(product.retailPrice || ''),
                wholesalePrice: String(product.wholesalePrice || ''),
                minQtyWholesale: String(product.minQtyWholesale || '10'),
                imageUrl: product.imageUrl || '',
                category: product.category || '',
                stock: String(product.stock || ''),
                featured: product.featured || false,
            });
        } catch (error) {
            console.error('Error fetching product:', error);
            toast.error('Failed to load product');
            navigate('/admin/products');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            if (isEditMode) {
                await api.put(`/products/${id}`, formData);
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', formData);
                toast.success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (error) {
            console.error('Error saving product:', error);
            toast.error(error.response?.data?.error || 'Failed to save product');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => navigate('/admin/products')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Product' : 'Add New Product'}
                    </h1>
                    <p className="text-gray-600 mt-1">
                        {isEditMode ? 'Update product information' : 'Create a new product'}
                    </p>
                </div>
            </div>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="bg-white rounded-xl p-8 shadow-sm border border-gray-200"
            >
                <div className="space-y-6">
                    {/* Product Name */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Product Name *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="input w-full"
                            placeholder="e.g., Fresh Oranges"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Description *
                        </label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="4"
                            className="input resize-none w-full"
                            placeholder="Describe the product..."
                        />
                    </div>

                    {/* Two Column Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Retail Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Retail Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="retailPrice"
                                value={formData.retailPrice}
                                onChange={handleChange}
                                required
                                step="0.01"
                                min="0"
                                className="input w-full"
                                placeholder="150"
                            />
                        </div>

                        {/* Wholesale Price */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Wholesale Price (₹) *
                            </label>
                            <input
                                type="number"
                                name="wholesalePrice"
                                value={formData.wholesalePrice}
                                onChange={handleChange}
                                required
                                step="0.01"
                                min="0"
                                className="input w-full"
                                placeholder="110"
                            />
                        </div>

                        {/* Min Wholesale Quantity */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Min Wholesale Quantity *
                            </label>
                            <input
                                type="number"
                                name="minQtyWholesale"
                                value={formData.minQtyWholesale}
                                onChange={handleChange}
                                required
                                min="1"
                                className="input w-full"
                                placeholder="10"
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Stock Quantity *
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleChange}
                                required
                                min="0"
                                className="input w-full"
                                placeholder="100"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Category *
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="input w-full"
                            >
                                <option value="">Select Category</option>
                                <option value="Citrus">Citrus</option>
                                <option value="Berries">Berries</option>
                                <option value="Tropical">Tropical</option>
                                <option value="Stone Fruits">Stone Fruits</option>
                                <option value="Classic">Classic</option>
                                <option value="Melons">Melons</option>
                            </select>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Image URL *
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            required
                            className="input w-full"
                            placeholder="https://images.unsplash.com/..."
                        />
                        {formData.imageUrl && (
                            <div className="mt-3">
                                <img
                                    src={formData.imageUrl}
                                    alt="Preview"
                                    className="w-32 h-32 rounded-lg object-cover"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Featured Checkbox */}
                    <div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="featured"
                                checked={formData.featured}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-semibold text-gray-700">
                                Mark as Featured Product
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary flex-1 flex items-center justify-center space-x-2"
                        >
                            <Save className="w-5 h-5" />
                            <span>{saving ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/admin/products')}
                            className="btn btn-outline flex-1"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </motion.form>
        </div>
    );
};

export default ProductEdit;
