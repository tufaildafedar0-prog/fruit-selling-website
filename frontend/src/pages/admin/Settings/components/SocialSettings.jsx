import SettingsSection from './SettingsSection';

/**
 * Social media links settings
 */
const SocialSettings = ({ settings, onChange, errors = {} }) => {
    return (
        <SettingsSection
            title="Social Media Links"
            description="Connect your social media profiles"
        >
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Facebook URL
                </label>
                <input
                    type="url"
                    value={settings.facebookUrl || ''}
                    onChange={(e) => onChange('facebookUrl', e.target.value)}
                    className={`input w-full ${errors.facebookUrl ? 'border-red-500' : ''}`}
                    placeholder="https://facebook.com/yourpage"
                />
                {errors.facebookUrl && (
                    <p className="text-red-500 text-xs mt-1">{errors.facebookUrl}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Twitter URL
                </label>
                <input
                    type="url"
                    value={settings.twitterUrl || ''}
                    onChange={(e) => onChange('twitterUrl', e.target.value)}
                    className={`input w-full ${errors.twitterUrl ? 'border-red-500' : ''}`}
                    placeholder="https://twitter.com/yourhandle"
                />
                {errors.twitterUrl && (
                    <p className="text-red-500 text-xs mt-1">{errors.twitterUrl}</p>
                )}
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instagram URL
                </label>
                <input
                    type="url"
                    value={settings.instagramUrl || ''}
                    onChange={(e) => onChange('instagramUrl', e.target.value)}
                    className={`input w-full ${errors.instagramUrl ? 'border-red-500' : ''}`}
                    placeholder="https://instagram.com/yourprofile"
                />
                {errors.instagramUrl && (
                    <p className="text-red-500 text-xs mt-1">{errors.instagramUrl}</p>
                )}
            </div>
        </SettingsSection>
    );
};

export default SocialSettings;
