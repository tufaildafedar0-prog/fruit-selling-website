import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate form submission
        setTimeout(() => {
            toast.success('Message sent successfully! We\'ll get back to you soon.');
            setFormData({ name: '', email: '', message: '' });
            setLoading(false);
        }, 1000);
    };

    const handleWhatsApp = () => {
        const phoneNumber = '15551234567'; // Replace with actual number
        const message = encodeURIComponent('Hello! I\'d like to inquire about your fruits.');
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-br from-primary-500 to-secondary-600 text-white py-16">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
                            Get In Touch
                        </h1>
                        <p className="text-xl text-primary-50 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you!
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card p-8"
                    >
                        <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="input"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="input"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows="5"
                                    className="input resize-none"
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary w-full flex items-center justify-center space-x-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        <span>Sending...</span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        <span>Send Message</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        {/* WhatsApp Button */}
                        <div className="card p-8 bg-gradient-to-br from-green-500 to-green-600 text-white">
                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <MessageCircle className="w-8 h-8" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-2xl font-bold mb-2">Chat on WhatsApp</h3>
                                    <p className="mb-4 text-green-50">
                                        Get instant responses to your queries
                                    </p>
                                    <button
                                        onClick={handleWhatsApp}
                                        className="btn bg-white text-green-600 hover:bg-green-50"
                                    >
                                        Open WhatsApp
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="card p-8 space-y-6">
                            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-primary-100 rounded-xl">
                                    <MapPin className="w-6 h-6 text-primary-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Address</h4>
                                    <p className="text-gray-600">
                                        123 Fruit Street<br />
                                        Fresh City, FC 12345<br />
                                        United States
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-secondary-100 rounded-xl">
                                    <Phone className="w-6 h-6 text-secondary-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Phone</h4>
                                    <p className="text-gray-600">+1 (555) 123-4567</p>
                                    <p className="text-sm text-gray-500 mt-1">Mon-Fri: 9AM - 6PM</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="p-3 bg-accent-100 rounded-xl">
                                    <Mail className="w-6 h-6 text-accent-600" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 mb-1">Email</h4>
                                    <p className="text-gray-600">hello@fruitify.com</p>
                                    <p className="text-gray-600">support@fruitify.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Business Hours */}
                        <div className="card p-8">
                            <h3 className="text-2xl font-bold mb-4">Business Hours</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Monday - Friday</span>
                                    <span className="font-semibold text-gray-900">9:00 AM - 6:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Saturday</span>
                                    <span className="font-semibold text-gray-900">10:00 AM - 4:00 PM</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Sunday</span>
                                    <span className="font-semibold text-gray-900">Closed</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
