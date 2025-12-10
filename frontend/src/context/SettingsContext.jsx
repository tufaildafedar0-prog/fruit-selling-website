import { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

/**
 * Global Settings Context
 * Provides website settings to all components
 * Fetches once on mount, updates on demand
 */

const SettingsContext = createContext(undefined);

// Default fallback settings
const DEFAULT_SETTINGS = {
    siteName: 'Fruitify',
    logoUrl: '',
    tagline: 'Fresh Fruits Delivered to Your Door',
    contactEmail: 'hello@fruitify.com',
    contactPhone: '+1 (555) 123-4567',
    address: '123 Fruit Street',
    city: 'Fresh City',
    zip: '12345',
    footerText: `© ${new Date().getFullYear()} Fruitify. All rights reserved. Made with ❤️ for fresh fruit lovers.`,
    supportEmail: '',
    facebookUrl: 'https://facebook.com',
    twitterUrl: 'https://twitter.com',
    instagramUrl: 'https://instagram.com',
    maintenanceMode: false,
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);

    // Fetch settings once on mount
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await api.get('/public/settings');
            if (response.data.success && response.data.data) {
                setSettings(prev => ({
                    ...prev,
                    ...response.data.data
                }));
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            // Keep defaults on error
        } finally {
            setLoading(false);
        }
    };

    // Update settings optimistically (used by admin after save)
    const updateSettings = (newSettings) => {
        setSettings(prev => ({
            ...prev,
            ...newSettings
        }));
    };

    // Manual refresh (if needed)
    const refreshSettings = () => {
        setLoading(true);
        fetchSettings();
    };

    const value = {
        settings,
        loading,
        updateSettings,
        refreshSettings
    };

    // Render children immediately with defaults
    // Don't block rendering while loading
    return (
        <SettingsContext.Provider value={value}>
            {children}
        </SettingsContext.Provider>
    );
};

// Custom hook for consuming settings
export const useGlobalSettings = () => {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useGlobalSettings must be used within a SettingsProvider');
    }
    return context;
};
