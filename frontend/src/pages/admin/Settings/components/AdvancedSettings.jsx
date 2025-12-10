import SettingsSection from './SettingsSection';

/**
 * Advanced settings (maintenance mode, etc.)
 */
const AdvancedSettings = ({ settings, onChange }) => {
    return (
        <SettingsSection
            title="Advanced Settings"
            description="Configure advanced website options"
        >
            <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={settings.maintenanceMode || false}
                        onChange={(e) => onChange('maintenanceMode', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                        Enable Maintenance Mode
                    </span>
                </label>
                <p className="text-xs text-gray-500 mt-2 ml-7">
                    When enabled, the website will show a maintenance page to customers.
                    Admin access will remain available.
                </p>
            </div>
        </SettingsSection>
    );
};

export default AdvancedSettings;
