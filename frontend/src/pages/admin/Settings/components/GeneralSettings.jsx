import SettingsSection from './SettingsSection';

/**
 * General website settings (site name, logo, tagline)
 */
const GeneralSettings = ({ settings, onChange, errors = {} }) => {
    return (
        <SettingsSection
            title="General Settings"
            description="Configure your website's basic information"
        >
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Site Name *
                </label>
                <input
                    type="text"
                    value={settings.siteName || ''}
                    onChange={(e) => onChange('siteName', e.target.value)}
                    className="input w-full"
                    placeholder="Fruitify"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Logo URL
                </label>
                <input
                    type="url"
                    value={settings.logoUrl || ''}
                    onChange={(e) => onChange('logoUrl', e.target.value)}
                    className={`input w-full ${errors.logoUrl ? 'border-red-500' : ''}`}
                    placeholder="https://..."
                />
                {errors.logoUrl && (
                    <p className="text-red-500 text-xs mt-1">{errors.logoUrl}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tagline
                </label>
                <input
                    type="text"
                    value={settings.tagline || ''}
                    onChange={(e) => onChange('tagline', e.target.value)}
                    className="input w-full"
                    placeholder="Fresh Fruits Delivered to Your Door"
                />
            </div>
        </SettingsSection>
    );
};

export default GeneralSettings;
