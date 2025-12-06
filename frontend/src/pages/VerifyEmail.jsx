import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const VerifyEmail = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link. No token provided.');
                return;
            }

            try {
                const response = await api.post('/auth/verify-email', { token });
                setStatus('success');
                setMessage(response.data.message);

                // Update local storage with verified user
                if (response.data.data.user) {
                    const storedUser = localStorage.getItem('user');
                    if (storedUser) {
                        const user = JSON.parse(storedUser);
                        user.emailVerified = true;
                        localStorage.setItem('user', JSON.stringify(user));
                    }
                }

                toast.success('Email verified successfully!');

                // Redirect to home after 2 seconds
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Verification failed. Please try again.');
                toast.error(error.response?.data?.error || 'Verification failed');
            }
        };

        verifyEmail();
    }, [token, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center py-12 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card p-8 md:p-12 max-w-md w-full text-center"
            >
                {/* Logo */}
                <div className="mb-8">
                    <Link to="/" className="inline-flex items-center space-x-2">
                        <span className="text-5xl">🍎</span>
                        <span className="text-3xl font-display font-bold gradient-text">
                            Fruitify
                        </span>
                    </Link>
                </div>

                {/* Status Icon */}
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="mb-6"
                >
                    {status === 'verifying' && (
                        <Loader2 className="w-16 h-16 mx-auto text-primary-500 animate-spin" />
                    )}
                    {status === 'success' && (
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                    )}
                    {status === 'error' && (
                        <XCircle className="w-16 h-16 mx-auto text-red-500" />
                    )}
                </motion.div>

                {/* Message */}
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                    {status === 'verifying' && 'Verifying Email'}
                    {status === 'success' && 'Email Verified!'}
                    {status === 'error' && 'Verification Failed'}
                </h1>

                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                {/* Actions */}
                {status === 'success' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <p className="text-sm text-gray-500 mb-4">
                            Redirecting to homepage...
                        </p>
                        <Link
                            to="/"
                            className="btn btn-primary inline-flex items-center"
                        >
                            Go to Homepage
                        </Link>
                    </motion.div>
                )}

                {status === 'error' && (
                    <div className="space-y-3">
                        <Link
                            to="/login"
                            className="btn btn-primary w-full"
                        >
                            Back to Login
                        </Link>
                        <Link
                            to="/login"
                            className="btn bg-gray-100 hover:bg-gray-200 text-gray-700 w-full"
                        >
                            Request New Link
                        </Link>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
