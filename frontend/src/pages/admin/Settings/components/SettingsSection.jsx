/**
 * Reusable section wrapper for settings panels
 * Provides consistent styling and structure
 */
const SettingsSection = ({ title, description, children }) => {
    return (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                {description && (
                    <p className="text-sm text-gray-600 mt-1">{description}</p>
                )}
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </div>
    );
};

export default SettingsSection;
