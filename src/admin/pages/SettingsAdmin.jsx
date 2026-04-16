import { useState, useEffect } from 'react';
import { adminApi } from '../../utils/api';

const SettingsAdmin = () => {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    adminApi.getSiteConfig().then(res => setConfig(res.data.data));
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      await adminApi.updateSiteConfig(config);
      setMsg('Settings saved!');
    } catch { setMsg('Error saving.'); }
    finally { setSaving(false); setTimeout(() => setMsg(''), 3000); }
  };

  const update = (path, value) => {
    setConfig(prev => {
      const parts = path.split('.');
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  };

  if (!config) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Site Settings</h1>
        <button onClick={save} disabled={saving} className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors disabled:opacity-60 text-sm">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
      {msg && <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}

      <div className="space-y-6">
        {/* Contact */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">Contact Information</h2>
          <div className="space-y-4">
            <F label="Email" value={config.contact?.email} onChange={v => update('contact.email', v)} />
            <F label="Phone" value={config.contact?.phone} onChange={v => update('contact.phone', v)} />
            <F label="Address (Arabic)" value={config.contact?.addressAr} onChange={v => update('contact.addressAr', v)} dir="rtl" textarea />
            <F label="Address (English)" value={config.contact?.addressEn} onChange={v => update('contact.addressEn', v)} textarea />
          </div>
        </section>

        {/* Social */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">Social Media Links</h2>
          <div className="space-y-4">
            <F label="Twitter URL" value={config.social?.twitter} onChange={v => update('social.twitter', v)} />
            <F label="Instagram URL" value={config.social?.instagram} onChange={v => update('social.instagram', v)} />
            <F label="YouTube URL" value={config.social?.youtube} onChange={v => update('social.youtube', v)} />
            <F label="WhatsApp Number (with country code)" value={config.social?.whatsapp} onChange={v => update('social.whatsapp', v)} />
          </div>
        </section>

        {/* Footer */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-4">Footer Description</h2>
          <div className="space-y-4">
            <F label="Footer Description (Arabic)" value={config.footerDescriptionAr} onChange={v => update('footerDescriptionAr', v)} dir="rtl" textarea />
            <F label="Footer Description (English)" value={config.footerDescriptionEn} onChange={v => update('footerDescriptionEn', v)} textarea />
          </div>
        </section>
      </div>
    </div>
  );
};

const F = ({ label, value, onChange, dir, textarea }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {textarea
      ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} dir={dir} rows={3} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm resize-none" />
      : <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} dir={dir} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm" />
    }
  </div>
);

export default SettingsAdmin;
