import SettingsSection from './SettingsSection';

/**
 * Contact information settings
 */
const ContactSettings = ({ settings, onChange, errors = {} }) => {
    return (
        <SettingsSection
            title="Contact Information"
            description="Manage your business contact details"
        >
            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contact Email *
                    </label>
                    <input
                        type="email"
                        value={settings.contactEmail || ''}
                        onChange={(e) => onChange('contactEmail', e.target.value)}
                        className={`input w-full ${errors.contactEmail ? 'border-red-500' : ''}`}
                        placeholder="contact@fruitify.com"
                        required
                    />
                    {errors.contactEmail && (
                        <p className="text-red-500 text-xs mt-1">{errors.contactEmail}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Support Email
                    </label>
                    <input
                        type="email"
                        value={settings.supportEmail || ''}
                        onChange={(e) => onChange('supportEmail', e.target.value)}
                        className={`input w-full ${errors.supportEmail ? 'border-red-500' : ''}`}
                        placeholder="support@fruitify.com"
                    />
                    {errors.supportEmail && (
                        <p className="text-red-500 text-xs mt-1">{errors.supportEmail}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        value={settings.contactPhone || ''}
                        onChange={(e) => onChange('contactPhone', e.target.value)}
                        className="input w-full"
                        placeholder="+1 (555) 123-4567"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ZIP Code
                    </label>
                    <input
                        type="text"
                        value={settings.zip || ''}
                        onChange={(e) => onChange('zip', e.target.value)}
                        className="input w-full"
                        placeholder="12345"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Address
                    </label>
                    <input
                        type="text"
                        value={settings.address || ''}
                        onChange={(e) => onChange('address', e.target.value)}
                        className="input w-full"
                        placeholder="123 Main St"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City
                    </label>
                    <input
                        type="text"
                        value={settings.city || ''}
                        onChange={(e) => onChange('city', e.target.value)}
                        className="input w-full"
                        placeholder="New York"
                    />
                </div>
            </div>
        </SettingsSection>
    );
};

export default ContactSettings;
