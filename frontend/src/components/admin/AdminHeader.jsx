import { Menu, Bell, ChevronRight } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const AdminHeader = ({ title, onMenuClick }) => {
    const location = useLocation();

    // Generate breadcrumbs from path
    const getBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(Boolean);
        const breadcrumbs = [];

        breadcrumbs.push({ name: 'Admin', path: '/admin' });

        if (paths.length > 1) {
            const pageName = paths[paths.length - 1];
            const formattedName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
            breadcrumbs.push({ name: formattedName, path: location.pathname });
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="sticky top-0 z-20 bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                {/* Left: Menu + Breadcrumbs */}
                <div className="flex items-center space-x-4">
                    <button
                        onClick={onMenuClick}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-600" />
                    </button>

                    {/* Breadcrumbs */}
                    <nav className="hidden md:flex items-center space-x-2 text-sm">
                        {breadcrumbs.map((crumb, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
                                <span
                                    className={
                                        index === breadcrumbs.length - 1
                                            ? 'text-gray-900 font-semibold'
                                            : 'text-gray-500'
                                    }
                                >
                                    {crumb.name}
                                </span>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Right: Title */}
                <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-800 hidden md:block">{title}</h1>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;
