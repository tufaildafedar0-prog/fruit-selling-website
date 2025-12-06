import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, color = 'green' }) => {
    const colorClasses = {
        green: 'from-green-500 to-green-600',
        blue: 'from-blue-500 to-blue-600',
        purple: 'from-purple-500 to-purple-600',
        orange: 'from-orange-500 to-orange-600',
    };

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 mb-1">{label}</p>
                    <p className="text-3xl font-bold text-gray-900">{value}</p>
                    {trend && (
                        <p className="text-sm text-gray-500 mt-2">{trend}</p>
                    )}
                </div>
                <div
                    className={`w-14 h-14 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}
                >
                    <Icon className="w-7 h-7 text-white" />
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
