import prisma from '../config/database.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * Get all website settings
 */
export const getSettings = async (req, res, next) => {
    try {
        // Get the first (and should be only) settings record
        let settings = await prisma.websiteSettings.findFirst();

        // If no settings exist, create default settings
        if (!settings) {
            settings = await prisma.websiteSettings.create({
                data: {
                    siteName: 'Fruitify',
                    tagline: 'Fresh Fruits Delivered to Your Door',
                    contactEmail: 'contact@fruitify.com',
                    footerText: '© 2025 Fruitify. All rights reserved.',
                },
            });
        }

        res.json({
            success: true,
            data: settings,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update website settings
 */
export const updateSettings = async (req, res, next) => {
    try {
        const updateData = req.body;

        // Get existing settings or create if none exist
        let settings = await prisma.websiteSettings.findFirst();

        if (!settings) {
            // Create new settings
            settings = await prisma.websiteSettings.create({
                data: updateData,
            });
        } else {
            // Update existing settings
            settings = await prisma.websiteSettings.update({
                where: { id: settings.id },
                data: updateData,
            });
        }

        res.json({
            success: true,
            message: 'Settings updated successfully',
            data: settings,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get public settings (for frontend use)
 */
export const getPublicSettings = async (req, res, next) => {
    try {
        const settings = await prisma.websiteSettings.findFirst({
            select: {
                siteName: true,
                logoUrl: true,
                tagline: true,
                contactEmail: true,
                contactPhone: true,
                address: true,
                city: true,
                zip: true,
                footerText: true,
                facebookUrl: true,
                twitterUrl: true,
                instagramUrl: true,
                maintenanceMode: true,
            },
        });

        res.json({
            success: true,
            data: settings || {
                siteName: 'Fruitify',
                tagline: 'Fresh Fruits Delivered to Your Door',
                contactEmail: 'contact@fruitify.com',
                footerText: '© 2025 Fruitify. All rights reserved.',
                maintenanceMode: false,
            },
        });
    } catch (error) {
        next(error);
    }
};
