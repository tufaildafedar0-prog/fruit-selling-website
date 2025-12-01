import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                <div className="absolute top-40 right-10 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-20 left-1/2 w-72 h-72 bg-accent-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
            </div>

            <div className="container-custom section relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="space-y-8"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg"
                        >
                            <Sparkles className="w-4 h-4 text-accent-500" />
                            <span className="text-sm font-semibold text-gray-700">
                                Fresh & Premium Quality
                            </span>
                        </motion.div>

                        <div className="space-y-6">
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-tight">
                                Fresh Fruits,
                                <br />
                                <span className="gradient-text">Delivered Daily</span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                                Experience the taste of premium quality fruits. From farm to your doorstep, we deliver freshness you can trust.
                            </p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4"
                        >
                            <Link to="/retail" className="btn btn-primary text-lg group">
                                <span>Shop Retail</span>
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link to="/wholesale" className="btn btn-secondary text-lg group">
                                <span>Shop Wholesale</span>
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="grid grid-cols-3 gap-6 pt-8"
                        >
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary-600">500+</div>
                                <div className="text-sm text-gray-600">Happy Customers</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-secondary-600">100%</div>
                                <div className="text-sm text-gray-600">Fresh Guarantee</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-accent-600">24/7</div>
                                <div className="text-sm text-gray-600">Service</div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="relative z-10">
                            <motion.img
                                animate={{
                                    y: [0, -20, 0],
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                src="https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800"
                                alt="Fresh Fruits"
                                className="rounded-3xl shadow-premium-lg"
                            />
                        </div>

                        {/* Floating Cards */}
                        <motion.div
                            animate={{
                                y: [0, -15, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute top-10 -left-6 glass p-4 rounded-2xl shadow-xl"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl">🍎</span>
                                <div>
                                    <div className="font-bold text-gray-900">Premium Apples</div>
                                    <div className="text-sm text-primary-600">$3.49/lb</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{
                                y: [0, 15, 0],
                            }}
                            transition={{
                                duration: 3.5,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="absolute bottom-10 -right-6 glass p-4 rounded-2xl shadow-xl"
                        >
                            <div className="flex items-center space-x-3">
                                <span className="text-3xl">🥭</span>
                                <div>
                                    <div className="font-bold text-gray-900">Fresh Mangoes</div>
                                    <div className="text-sm text-secondary-600">$4.99/lb</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
