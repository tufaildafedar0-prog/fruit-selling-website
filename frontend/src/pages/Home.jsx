import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Star, Truck, Shield, Award, ArrowRight } from 'lucide-react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Scroll to top on page load
        window.scrollTo(0, 0);

        const fetchFeaturedProducts = async () => {
            try {
                const response = await api.get('/products?featured=true&limit=6');
                setFeaturedProducts(response.data.data.products);
            } catch (error) {
                console.error('Error fetching featured products:', error);
                // Even if error, show the page
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedProducts();
    }, []);

    const features = [
        {
            icon: <Truck className="w-8 h-8" />,
            title: 'Fast Delivery',
            description: 'Same-day delivery available in select areas',
            color: 'from-primary-500 to-primary-600',
        },
        {
            icon: <Shield className="w-8 h-8" />,
            title: '100% Fresh Guarantee',
            description: 'Money-back guarantee if not satisfied',
            color: 'from-secondary-500 to-secondary-600',
        },
        {
            icon: <Award className="w-8 h-8" />,
            title: 'Premium Quality',
            description: 'Handpicked fruits from trusted farms',
            color: 'from-accent-500 to-accent-600',
        },
    ];

    const testimonials = [
        {
            name: 'Sarah Johnson',
            role: 'Regular Customer',
            content: 'The quality of fruits is exceptional! Fresh and delivered on time every single time.',
            avatar: '👩',
            rating: 5,
        },
        {
            name: 'Michael Chen',
            role: 'Restaurant Owner',
            content: 'Their wholesale program is perfect for my business. Great prices and reliable service.',
            avatar: '👨',
            rating: 5,
        },
        {
            name: 'Emma Davis',
            role: 'Health Enthusiast',
            content: 'Love the variety and freshness. Fruitify has become my go-to for all my fruit needs!',
            avatar: '👩‍🦰',
            rating: 5,
        },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section - Always shows */}
            <Hero />

            {/* Featured Products */}
            <section className="section bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Featured <span className="gradient-text">Products</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Handpicked selection of our finest fruits
                        </p>
                    </motion.div>

                    {loading ? (
                        <div className="text-center py-12">
                            <LoadingSpinner />
                            <p className="text-gray-600 mt-4">Loading products... Backend is waking up (takes ~30 seconds first time)</p>
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredProducts.map((product, index) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-lg mb-4">
                                Products are loading... This may take 30-60 seconds on first visit.
                            </p>
                            <Link to="/retail" className="btn btn-primary">
                                View All Products
                            </Link>
                        </div>
                    )}

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link
                            to="/retail"
                            className="btn btn-primary text-lg inline-flex items-center justify-center group"
                        >
                            <span>View All Products</span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section bg-gradient-to-br from-gray-50 to-primary-50/30">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            Why Choose <span className="gradient-text">Fruitify</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            We're committed to delivering the best fruit experience
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.2 }}
                                className="card p-8 text-center hover:shadow-premium-lg group"
                            >
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-4 shadow-lg`}
                                >
                                    {feature.icon}
                                </motion.div>
                                <h3 className="text-xl font-bold mb-2 group-hover:text-primary-600 transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            What Our <span className="gradient-text">Customers Say</span>
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Join thousands of happy customers
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="card p-8 space-y-4"
                            >
                                <div className="flex items-center space-x-1 text-accent-400">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-current" />
                                    ))}
                                </div>
                                <p className="text-gray-700 italic leading-relaxed">
                                    "{testimonial.content}"
                                </p>
                                <div className="flex items-center space-x-3 pt-4 border-t">
                                    <span className="text-4xl">{testimonial.avatar}</span>
                                    <div>
                                        <div className="font-bold text-gray-900">{testimonial.name}</div>
                                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-3xl mx-auto space-y-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-display font-bold">
                            Ready to Experience Fresh?
                        </h2>
                        <p className="text-xl text-primary-50">
                            Start shopping today and taste the difference. Whether retail or wholesale, we've got you covered.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/retail" className="btn bg-white text-primary-600 hover:bg-gray-100">
                                Shop Retail
                            </Link>
                            <Link to="/wholesale" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                                Shop Wholesale
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Home;
