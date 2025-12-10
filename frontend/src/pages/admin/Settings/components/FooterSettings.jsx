import SettingsSection from './SettingsSection';

/**
 * Footer settings
 */
const FooterSettings = ({ settings, onChange }) => {
    return (
        <SettingsSection
            title="Footer Settings"
            description="Customize your website footer"
        >
            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Footer Text
                </label>
                <textarea
                    value={settings.footerText || ''}
                    onChange={(e) => onChange('footerText', e.target.value)}
                    rows="3"
                    className="input resize-none w-full"
                    placeholder="© 2025 Fruitify. All rights reserved."
                />
                <p className="text-xs text-gray-500 mt-1">
                    This text will appear at the bottom of every page
                </p>
            </div>
        </SettingsSection>
    );
};

export default FooterSettings;
