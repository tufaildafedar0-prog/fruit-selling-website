import { motion } from 'framer-motion';
import { Save } from 'lucide-react';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { useSettings } from './hooks/useSettings';
import GeneralSettings from './components/GeneralSettings';
import ContactSettings from './components/ContactSettings';
import SocialSettings from './components/SocialSettings';
import FooterSettings from './components/FooterSettings';
import AdvancedSettings from './components/AdvancedSettings';

/**
 * Main Admin Settings Page - Component-Based Architecture
 * Refactored for better maintainability and structure
 */
const Settings = () => {
    const {
        settings,
        loading,
        saving,
        errors,
        updateSettings,
        handleChange
    } = useSettings();

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

            {/* Settings Form */}
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={updateSettings}
                className="space-y-6"
            >
                {/* General Settings */}
                <GeneralSettings
                    settings={settings}
                    onChange={handleChange}
                    errors={errors}
                />

                {/* Contact Information */}
                <ContactSettings
                    settings={settings}
                    onChange={handleChange}
                    errors={errors}
                />

                {/* Social Media */}
                <SocialSettings
                    settings={settings}
                    onChange={handleChange}
                    errors={errors}
                />

                {/* Footer */}
                <FooterSettings
                    settings={settings}
                    onChange={handleChange}
                />

                {/* Advanced */}
                <AdvancedSettings
                    settings={settings}
                    onChange={handleChange}
                />

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
