import { useState, useEffect } from 'react';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing website settings
 * Centralizes all settings state and API logic
 */
export const useSettings = () => {
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
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState({});

    // Fetch settings on mount
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/settings');
            setSettings(response.data.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
            toast.error('Failed to load settings');
        } finally {
            setLoading(false);
        }
    };

    const updateSettings = async (e) => {
        e?.preventDefault();

        // Validate before saving
        const validationErrors = validateSettings(settings);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            toast.error('Please fix validation errors');
            return;
        }

        setSaving(true);
        try {
            await api.put('/admin/settings', settings);
            toast.success('Settings updated successfully');
            setErrors({});
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error(error.response?.data?.message || 'Failed to update settings');
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (name, value) => {
        setSettings(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field on change
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return {
        settings,
        loading,
        saving,
        errors,
        fetchSettings,
        updateSettings,
        handleChange
    };
};

// Validation helper
const validateSettings = (settings) => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlRegex = /^https?:\/\/.+/;

    // Email validation
    if (settings.contactEmail && !emailRegex.test(settings.contactEmail)) {
        errors.contactEmail = 'Invalid email format';
    }
    if (settings.supportEmail && !emailRegex.test(settings.supportEmail)) {
        errors.supportEmail = 'Invalid email format';
    }

    // URL validation
    const urlFields = ['logoUrl', 'facebookUrl', 'twitterUrl', 'instagramUrl'];
    urlFields.forEach(field => {
        if (settings[field] && !urlRegex.test(settings[field])) {
            errors[field] = 'Must be a valid URL (http:// or https://)';
        }
    });

    return errors;
};
