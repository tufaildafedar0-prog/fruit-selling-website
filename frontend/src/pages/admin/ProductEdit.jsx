import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, ArrowLeft, Plus, Trash2, Eye } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatINR } from '../../utils/currency';

const ProductEditWithVariants = () => {
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
        defaultUnit: 'kg',
    });

    // NEW: Variants state
    const [variants, setVariants] = useState([]);
    const [showPreview, setShowPreview] = useState(false);

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
            const product = response.data.data.product;
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
                defaultUnit: product.defaultUnit || 'kg',
            });

            // Load variants if they exist (convert numbers to strings for form)
            if (product.variants && product.variants.length > 0) {
                setVariants(product.variants.map(v => ({
                    ...v,
                    quantity: String(v.quantity),
                    retailPrice: String(v.retailPrice),
                    wholesalePrice: String(v.wholesalePrice),
                    stock: String(v.stock || 0)
                })));
            }
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
            const submitData = {
                ...formData,
                variants: variants.map((v, index) => ({
                    id: v.id, // Include ID for existing variants
                    quantity: parseFloat(v.quantity),
                    unit: v.unit,
                    displayName: v.displayName,
                    retailPrice: parseFloat(v.retailPrice),
                    wholesalePrice: parseFloat(v.wholesalePrice),
                    minQtyWholesale: parseInt(v.minQtyWholesale || formData.minQtyWholesale),
                    stock: parseInt(v.stock),
                    sortOrder: index,
                    isDefault: v.isDefault || index === 0
                }))
            };

            if (isEditMode) {
                await api.put(`/products/${id}`, submitData);
                toast.success('Product updated successfully');
            } else {
                await api.post('/products', submitData);
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

    // NEW: Variant management functions
    const addVariant = () => {
        const newVariant = {
            quantity: '',
            unit: formData.defaultUnit,
            displayName: '',
            retailPrice: formData.retailPrice || '',
            wholesalePrice: formData.wholesalePrice || '',
            minQtyWholesale: formData.minQtyWholesale || 10,
            stock: 0,
            isDefault: variants.length === 0
        };
        setVariants([...variants, newVariant]);
    };

    const removeVariant = (index) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const updateVariant = (index, field, value) => {
        const updated = [...variants];
        updated[index] = { ...updated[index], [field]: value };

        // Auto-generate display name
        if (field === 'quantity' || field === 'unit') {
            const qty = field === 'quantity' ? value : updated[index].quantity;
            const unit = field === 'unit' ? value : updated[index].unit;
            updated[index].displayName = `${qty} ${unit}`;
        }

        setVariants(updated);
    };

    const setDefaultVariant = (index) => {
        const updated = variants.map((v, i) => ({
            ...v,
            isDefault: i === index
        }));
        setVariants(updated);
    };

    if (loading) {
        return (
            <div className=\"flex items-center justify-center min-h-[60vh]\">
                < LoadingSpinner />
            </div >
        );
    }

return (
    <div className=\"max-w-5xl mx-auto space-y-6\">
{/* Header */ }
<div className=\"flex items-center space-x-4\">
    < button
onClick = {() => navigate('/admin/products')}
className =\"p-2 hover:bg-gray-100 rounded-lg transition-colors\"
    >
    <ArrowLeft className=\"w-6 h-6\" />
                </button >
    <div className=\"flex-1\">
        < h1 className =\"text-3xl font-bold text-gray-900\">
{ isEditMode ? 'Edit Product (India Style)' : 'Add New Product (India Style)' }
                    </h1 >
    <p className=\"text-gray-600 mt-1\">
{ isEditMode ? 'Update product with variants' : 'Create product with Zepto/BigBasket style variants' }
                    </p >
                </div >
    <button
        onClick={() => setShowPreview(!showPreview)}
        className=\"btn btn-outline flex items-center space-x-2\"
            >
            <Eye className=\"w-5 h-5\" />
                < span > { showPreview? 'Hide': 'Show' } Preview</span >
                </button >
            </div >

    {/* Form */ }
    < form onSubmit = { handleSubmit } className =\"space-y-6\">
{/* Basic Info Card */ }
<motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className=\"bg-white rounded-xl p-8 shadow-sm border border-gray-200\"
        >
        <h2 className=\"text-xl font-bold mb-6\">Basic Information</h2>
            < div className =\"space-y-6\">
{/* Product Name */ }
                        <div>
                            <label className=\"block text-sm font-semibold text-gray-700 mb-2\">
                                Product Name *
                            </label>
                            <input
                                type=\"text\"
name =\"name\"
value = { formData.name }
onChange = { handleChange }
required
className =\"input w-full\"
placeholder =\"e.g., Fresh Bananas\"
    />
                        </div >

    {/* Description */ }
    < div >
    <label className=\"block text-sm font-semibold text-gray-700 mb-2\">
Description *
                            </label >
    <textarea
        name=\"description\"
value = { formData.description }
onChange = { handleChange }
required
rows =\"4\"
className =\"input resize-none w-full\"
placeholder =\"Describe the product...\"
    />
                        </div >

    {/* Two Column Grid */ }
    < div className =\"grid md:grid-cols-2 gap-6\">
{/* Category */ }
                            <div>
                                <label className=\"block text-sm font-semibold text-gray-700 mb-2\">
                                    Category *
                                </label>
                                <select
                                    name=\"category\"
value = { formData.category }
onChange = { handleChange }
required
className =\"input w-full\"
    >
    <option value=\"\">Select Category</option>
        < option value =\"Fruits\">Fruits</option>
            < option value =\"Vegetables\">Vegetables</option>
                < option value =\"Citrus\">Citrus</option>
                    < option value =\"Berries\">Berries</option>
                        < option value =\"Tropical\">Tropical</option>
                            < option value =\"Stone Fruits\">Stone Fruits</option>
                                < option value =\"Classic\">Classic</option>
                                    < option value =\"Melons\">Melons</option>
                                </select >
                            </div >

    {/* Default Unit */ }
    < div >
    <label className=\"block text-sm font-semibold text-gray-700 mb-2\">
                                    Default Unit *
                                </label >
    <select
        name=\"defaultUnit\"
value = { formData.defaultUnit }
onChange = { handleChange }
className =\"input w-full\"
    >
    <option value=\"g\">Grams (g)</option>
        < option value =\"kg\">Kilograms (kg)</option>
            < option value =\"pcs\">Pieces (pcs)</option>
                < option value =\"dozen\">Dozen</option>
                    < option value =\"box\">Box</option>
                        < option value =\"crate\">Crate</option>
                            < option value =\"sack\">Sack</option>
                                </select >
                            </div >

    {/* Retail Price (₹) */ }
    < div >
    <label className=\"block text-sm font-semibold text-gray-700 mb-2\">
                                    Base Retail Price(₹) *
                                </label >
    <input
        type=\"number\"
name =\"retailPrice\"
value = { formData.retailPrice }
onChange = { handleChange }
required
step =\"1\"
min =\"0\"
className =\"input w-full\"
placeholder =\"150\"
    />
    <p className=\"text-xs text-gray-500 mt-1\">Used as fallback if no variants</p>
                            </div >

    {/* Wholesale Price (₹) */ }
    < div >
    <label className=\"block text-sm font-semibold text-gray-700 mb-2\">
                                    Base Wholesale Price(₹) *
                                </label >
    <input
        type=\"number\"
name =\"wholesalePrice\"
value = { formData.wholesalePrice }
onChange = { handleChange }
required
step =\"1\"
min =\"0\"
className =\"input w-full\"
placeholder =\"110\"
    />
                            </div >

    {/* Min Wholesale Quantity */ }
    < div >
    <label className=\"block text-sm font-semibold text-gray-700 mb-2\">
                                    Min Wholesale Quantity *
                                </label >
    <input
        type=\"number\"
name =\"minQtyWholesale\"
value = { formData.minQtyWholesale }
onChange = { handleChange }
required
min =\"1\"
className =\"input w-full\"
placeholder =\"10\"
    />
                            </div >
                        </div >

    {/* Image URL */ }
    < div >
    <label className=\"block text-sm font-semibold text-gray-700 mb-2\">
                                Image URL *
                            </label >
    <input
        type=\"url\"
name =\"imageUrl\"
value = { formData.imageUrl }
onChange = { handleChange }
required
className =\"input w-full\"
placeholder =\"https://images.unsplash.com/...\"
    />
{
    formData.imageUrl && (
        <div className=\"mt-3\">
        <img
                                        src = {formData.imageUrl
}
alt =\"Preview\"
className =\"w-32 h-32 rounded-lg object-cover\"
onError = {(e) => {
    e.target.src = 'https://via.placeholder.com/150?text=Invalid+URL';
}}
                                    />
                                </div >
                            )}
                        </div >

    {/* Featured Checkbox */ }
    < div >
    <label className=\"flex items-center space-x-2 cursor-pointer\">
        < input
type =\"checkbox\"
name =\"featured\"
checked = { formData.featured }
onChange = { handleChange }
className =\"w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500\"
    />
    <span className=\"text-sm font-semibold text-gray-700\">
Mark as Featured Product
                                </span >
                            </label >
                        </div >
                    </div >
                </motion.div >

    {/* VARIANTS SECTION - INDIA SPECIFIC */ }
    < motion.div
initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 0.1 }}
className =\"bg-white rounded-xl p-8 shadow-sm border border-gray-200\"
    >
    <div className=\"flex items-center justify-between mb-6\">
        < div >
        <h2 className=\"text-xl font-bold text-gray-900\">Product Variants (Zepto/BigBasket Style)</h2>
            < p className =\"text-sm text-gray-600 mt-1\">
                                Add quantity options like \"500g - ₹40\", \"1 kg - ₹75\", \"6 pcs - ₹120\"
                            </p >
                        </div >
    <button
        type=\"button\"
onClick = { addVariant }
className =\"btn btn-primary flex items-center space-x-2\"
    >
    <Plus className=\"w-5 h-5\" />
        < span > Add Variant</span >
                        </button >
                    </div >

{
    variants.length === 0 ? (
        <div className=\"text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300\">
        <p className =\"text-gray-600 mb-4\">No variants added. Add variants for India-style selling.</p>
        <p className =\"text-sm text-gray-500\">Example: 500g, 1kg, 2kg OR 6 pcs, dozen</p>
                        </div>
                    ) : (
    <div className=\"space-y-4\">
{
    variants.map((variant, index) => (
        <div
            key={index}
            className={`p-6 rounded-lg border-2 ${variant.isDefault ? 'border-primary-500 bg-primary-50' : 'border-gray-200 bg-white'}`}
        >
            <div className=\"flex items-start justify-between mb-4\">
            <div className=\"flex items-center space-x-3\">
            <span className=\"text-lg font-bold text-gray-700\">#{index + 1}</span>
                                            {
            variant.isDefault && (
                <span className=\"px-3 py-1 bg-primary-500 text-white text-xs font-bold rounded-full\">
                                                    DEFAULT
                                                </span>
                                            )
}
                                        </div >
    <div className=\"flex items-center space-x-2\">
{
    !variant.isDefault && (
        <button
            type=\"button\"
    onClick = {() => setDefaultVariant(index)
}
className =\"text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg font-medium\"
    >
    Set as Default
                                                </button >
                                            )}
<button
    type=\"button\"
onClick = {() => removeVariant(index)}
className =\"p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors\"
    >
    <Trash2 className=\"w-5 h-5\" />
                                            </button >
                                        </div >
                                    </div >

    <div className=\"grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4\">
{/* Quantity */ }
                                        <div>
                                            <label className=\"block text-xs font-semibold text-gray-700 mb-1\">
                                                Quantity *
                                            </label>
                                            <input
                                                type=\"number\"
value = { variant.quantity }
onChange = {(e) => updateVariant(index, 'quantity', e.target.value)}
required
step =\"any\"
min =\"0\"
className =\"input w-full text-sm\"
placeholder =\"500\"
    />
                                        </div >

    {/* Unit */ }
    < div >
    <label className=\"block text-xs font-semibold text-gray-700 mb-1\">
Unit *
                                            </label >
    <select
        value={variant.unit}
        onChange={(e) => updateVariant(index, 'unit', e.target.value)}
        className=\"input w-full text-sm\"
            >
            <option value=\"g\">g</option>
                < option value =\"kg\">kg</option>
                    < option value =\"pcs\">pcs</option>
                        < option value =\"dozen\">dozen</option>
                            < option value =\"box\">box</option>
                                < option value =\"crate\">crate</option>
                                    < option value =\"sack\">sack</option>
                                            </select >
                                        </div >

    {/* Display Name (auto-generated) */ }
    < div >
    <label className=\"block text-xs font-semibold text-gray-700 mb-1\">
Display
                                            </label >
    <input
        type=\"text\"
value = { variant.displayName }
onChange = {(e) => updateVariant(index, 'displayName', e.target.value)}
className =\"input w-full text-sm bg-gray-50\"
placeholder =\"Auto\"
    />
                                        </div >

    {/* Retail Price (₹) */ }
    < div >
    <label className=\"block text-xs font-semibold text-gray-700 mb-1\">
                                                ₹ Retail *
                                            </label >
    <input
        type=\"number\"
value = { variant.retailPrice }
onChange = {(e) => updateVariant(index, 'retailPrice', e.target.value)}
required
step =\"1\"
min =\"0\"
className =\"input w-full text-sm\"
placeholder =\"40\"
    />
                                        </div >

    {/* Wholesale Price (₹) */ }
    < div >
    <label className=\"block text-xs font-semibold text-gray-700 mb-1\">
                                                ₹ Wholesale *
                                            </label >
    <input
        type=\"number\"
value = { variant.wholesalePrice }
onChange = {(e) => updateVariant(index, 'wholesalePrice', e.target.value)}
required
step =\"1\"
min =\"0\"
className =\"input w-full text-sm\"
placeholder =\"35\"
    />
                                        </div >

    {/* Stock */ }
    < div >
    <label className=\"block text-xs font-semibold text-gray-700 mb-1\">
Stock *
                                            </label >
    <input
        type=\"number\"
value = { variant.stock }
onChange = {(e) => updateVariant(index, 'stock', e.target.value)}
required
min =\"0\"
className =\"input w-full text-sm\"
placeholder =\"100\"
    />
                                        </div >
                                    </div >

    {/* Preview */ }
    < div className =\"mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200\">
        < p className =\"text-xs text-gray-600 mb-1\">Customer will see:</p>
            < p className =\"font-bold text-gray-900\">
{ formData.name || 'Product Name' } - { variant.displayName || `${variant.quantity} ${variant.unit}` } - { formatINR(parseFloat(variant.retailPrice) || 0)}
                                        </p >
                                    </div >
                                </div >
                            ))}
                        </div >
                    )}
                </motion.div >

    {/* Actions */ }
    < div className =\"flex gap-3 pt-4\">
        < button
type =\"submit\"
disabled = { saving }
className =\"btn btn-primary flex-1 flex items-center justify-center space-x-2\"
    >
    <Save className=\"w-5 h-5\" />
        < span > { saving? 'Saving...': isEditMode ? 'Update Product' : 'Create Product' }</span >
                    </button >
    <button
        type=\"button\"
onClick = {() => navigate('/admin/products')}
className =\"btn btn-outline flex-1\"
    >
    Cancel
                    </button >
                </div >
            </form >
        </div >
    );
};

export default ProductEditWithVariants;
