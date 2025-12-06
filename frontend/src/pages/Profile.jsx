import { motion } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Save } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        address: user?.address || '',
        city: user?.city || '',
        zip: user?.zip || '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.put('/auth/profile', formData);

            // Update local storage
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                const updatedUser = { ...JSON.parse(storedUser), ...response.data.data.user };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }

            toast.success(response.data.message);
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container-custom max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account information</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card p-6 md:p-8"
                >
                    {/* Email (Read-only) */}
                    <div className="mb-6 pb-6 border-b">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <Mail className="w-4 h-4 inline mr-2" />
                            Email Address
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="email"
                                value={user?.email || ''}
                                disabled
                                className="input bg-gray-50"
                            />
                            {user?.emailVerified ? (
                                <span className="text-green-600 text-sm font-medium whitespace-nowrap">✓ Verified</span>
                            ) : (
                                <span className="text-yellow-600 text-sm font-medium whitespace-nowrap">⚠ Unverified</span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            Email cannot be changed. Contact support if needed.
                        </p>
                    </div>

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <User className="w-4 h-4 inline mr-2" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="input"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <Phone className="w-4 h-4 inline mr-2" />
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                className="input"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                <MapPin className="w-4 h-4 inline mr-2" />
                                Street Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                className="input"
                                placeholder="123 Main Street"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="New York"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    ZIP Code
                                </label>
                                <input
                                    type="text"
                                    name="zip"
                                    value={formData.zip}
                                    onChange={handleChange}
                                    className="input"
                                    placeholder="10001"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </motion.div>

                {/* Security Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="card p-6 md:p-8 mt-6"
                >
                    <h2 className="text-xl font-bold mb-4">Security</h2>
                    <div className="space-y-3">
                        <a
                            href="/forgot-password"
                            className="block p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <h3 className="font-semibold mb-1">Change Password</h3>
                            <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                        </a>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Profile;
