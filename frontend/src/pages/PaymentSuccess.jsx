import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
        });

        setTimeout(() => {
            confetti({
                particleCount: 50,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
            });
            confetti({
                particleCount: 50,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
            });
        }, 250);
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary-50 flex items-center justify-center py-12">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="card p-12 max-w-2xl text-center"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-flex"
                >
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-16 h-16 text-green-600" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-900">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Thank you for your purchase. Your fresh fruits are on their way!
                    </p>

                    {orderId && (
                        <div className="bg-gray-50 rounded-xl p-6 mb-8">
                            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
                                <Package className="w-5 h-5" />
                                <span className="font-semibold">Order Number</span>
                            </div>
                            <div className="text-2xl font-bold text-primary-600">#{orderId}</div>
                        </div>
                    )}

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start space-x-3 text-left">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-primary-600 font-bold">1</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Order Confirmation</h3>
                                <p className="text-sm text-gray-600">
                                    You'll receive an email confirmation shortly
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 text-left">
                            <div className="w-8 h-8 bg-secondary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-secondary-600 font-bold">2</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Preparation</h3>
                                <p className="text-sm text-gray-600">
                                    We're preparing your fresh fruits with care
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3 text-left">
                            <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <span className="text-accent-600 font-bold">3</span>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Delivery</h3>
                                <p className="text-sm text-gray-600">
                                    Fresh fruits delivered to your doorstep
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/" className="btn btn-primary group">
                            <span>Back to Home</span>
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link to="/retail" className="btn btn-outline">
                            Continue Shopping
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
