import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const Settings = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        siteName: '',
        logoUrl: '',
        tagline: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        city: '',
        zip: '',
        footerText: '',
        supportEmail: '',
        facebookUrl: '',
        twitterUrl: '',
        instagramUrl: '',
        maintenanceMode: false,
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/admin/settings');
            setSettings(response.data.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await api.put('/admin/settings', settings);
            toast.success('Settings updated successfully');
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings((prev) => ({
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
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Website Settings</h1>
                <p className="text-gray-600 mt-1">Configure your website information</p>
            </div>

            {/* Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                {/* General Settings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">General Settings</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Site Name
                            </label>
                            <input
                                type="text"
                                name="siteName"
                                value={settings.siteName}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="Fruitify"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Logo URL
                            </label>
                            <input
                                type="url"
                                name="logoUrl"
                                value={settings.logoUrl || ''}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Tagline
                            </label>
                            <input
                                type="text"
                                name="tagline"
                                value={settings.tagline || ''}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="Fresh Fruits Delivered to Your Door"
                            />
                        </div>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Contact Email
                            </label>
                            <input
                                type="email"
                                name="contactEmail"
                                value={settings.contactEmail}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="contact@fruitify.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Support Email
                            </label>
                            <input
                                type="email"
                                name="supportEmail"
                                value={settings.supportEmail || ''}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="support@fruitify.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="contactPhone"
                                value={settings.contactPhone || ''}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="+1 (555) 123-4567"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                ZIP Code
                            </label>
                            <input
                                type="text"
                                name="zip"
                                value={settings.zip || ''}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="12345"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={settings.address || ''}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="123 Main St"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={settings.city || ''}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="New York"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer Settings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Footer Settings</h2>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Footer Text
                        </label>
                        <textarea
                            name="footerText"
                            value={settings.footerText || ''}
                            onChange={handleChange}
                            rows="3"
                            className="input resize-none w-full"
                            placeholder="© 2025 Fruitify. All rights reserved."
                        />
                    </div>
                </div>

                {/* Social Media */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Social Media Links</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Facebook URL
                            </label>
                            <input
                                type="url"
                                name="facebookUrl"
                                value={settings.facebookUrl || ''}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="https://facebook.com/yourpage"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Twitter URL
                            </label>
                            <input
                                type="url"
                                name="twitterUrl"
                                value={settings.twitterUrl || ''}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="https://twitter.com/yourhandle"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Instagram URL
                            </label>
                            <input
                                type="url"
                                name="instagramUrl"
                                value={settings.instagramUrl || ''}
                                onChange={handleChange}
                                className="input w-full"
                                placeholder="https://instagram.com/yourprofile"
                            />
                        </div>
                    </div>
                </div>

                {/* Advanced Settings */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Advanced</h2>
                    <div>
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="maintenanceMode"
                                checked={settings.maintenanceMode}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                            />
                            <span className="text-sm font-semibold text-gray-700">
                                Enable Maintenance Mode
                            </span>
                        </label>
                        <p className="text-xs text-gray-500 mt-2 ml-7">
                            When enabled, the website will show a maintenance page to customers
                        </p>
                    </div>
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary flex items-center space-x-2"
                    >
                        <Save className="w-5 h-5" />
                        <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                </div>
            </motion.form>
        </div>
    );
};

export default Settings;
