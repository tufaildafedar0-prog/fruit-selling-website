import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [settings, setSettings] = useState({
        siteName: 'Fruitify',
        footerText: `© ${currentYear} Fruitify. All rights reserved. Made with ❤️ for fresh fruit lovers.`,
        contactEmail: 'hello@fruitify.com',
        contactPhone: '+1 (555) 123-4567',
        address: '123 Fruit Street, Fresh City, FC 12345',
        facebookUrl: 'https://facebook.com',
        twitterUrl: 'https://twitter.com',
        instagramUrl: 'https://instagram.com',
    });

    useEffect(() => {
        // Fetch public settings (non-admin endpoint)
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
                // Silently fail - use defaults if API fails
                console.error('Failed to load footer settings:', error);
            }
        };

        fetchSettings();
    }, []);

    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <div className="container-custom py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-4xl">🍎</span>
                            <span className="text-2xl font-display font-bold">
                                {settings.siteName || 'Fruitify'}
                            </span>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            {settings.tagline || 'Premium fresh fruits delivered to your doorstep. Quality you can taste, freshness you can trust.'}
                        </p>
                        <div className="flex space-x-4">
                            {settings.facebookUrl && (
                                <a
                                    href={settings.facebookUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/10 hover:bg-primary-500 rounded-lg transition-colors"
                                >
                                    <Facebook className="w-5 h-5" />
                                </a>
                            )}
                            {settings.twitterUrl && (
                                <a
                                    href={settings.twitterUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/10 hover:bg-primary-500 rounded-lg transition-colors"
                                >
                                    <Twitter className="w-5 h-5" />
                                </a>
                            )}
                            {settings.instagramUrl && (
                                <a
                                    href={settings.instagramUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-white/10 hover:bg-primary-500 rounded-lg transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/retail" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    Retail Shop
                                </Link>
                            </li>
                            <li>
                                <Link to="/wholesale" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    Wholesale
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Customer Service</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li>
                                <a href="#" className="hover:text-primary-400 transition-colors">
                                    Shipping Information
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-400 transition-colors">
                                    Return Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-400 transition-colors">
                                    Terms & Conditions
                                </a>
                            </li>
                            <li>
                                <a href="#" className="hover:text-primary-400 transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            {settings.address && (
                                <li className="flex items-start space-x-3 text-gray-400">
                                    <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                                    <span>{settings.address}{settings.city ? `, ${settings.city}` : ''}{settings.zip ? ` ${settings.zip}` : ''}</span>
                                </li>
                            )}
                            {settings.contactPhone && (
                                <li className="flex items-center space-x-3 text-gray-400">
                                    <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                    <span>{settings.contactPhone}</span>
                                </li>
                            )}
                            {settings.contactEmail && (
                                <li className="flex items-center space-x-3 text-gray-400">
                                    <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                                    <span>{settings.contactEmail}</span>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <div className="max-w-2xl mx-auto text-center">
                        <h3 className="text-xl font-bold mb-2">Subscribe to Our Newsletter</h3>
                        <p className="text-gray-400 mb-4">
                            Get updates on new arrivals, special offers, and more!
                        </p>
                        <div className="flex gap-2 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/20 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/50 outline-none text-white placeholder-gray-400"
                            />
                            <button className="btn btn-primary whitespace-nowrap">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>{settings.footerText || `© ${currentYear} Fruitify. All rights reserved. Made with ❤️ for fresh fruit lovers.`}</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
