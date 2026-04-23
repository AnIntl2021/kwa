import { useState, useEffect } from 'react';
import { Eye, EyeOff, KeyRound } from 'lucide-react';
import { adminApi } from '../../utils/api';
import api from '../../utils/api';

const SettingsAdmin = () => {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  // Password change state
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwMsg, setPwMsg] = useState({ text: '', ok: false });
  const [pwSaving, setPwSaving] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  const changePassword = async (e) => {
    e.preventDefault();
    setPwMsg({ text: '', ok: false });
    if (pwForm.newPassword.length < 8) {
      setPwMsg({ text: 'New password must be at least 8 characters', ok: false }); return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ text: 'New passwords do not match', ok: false }); return;
    }
    setPwSaving(true);
    try {
      const res = await api.put('/auth/change-password', {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwMsg({ text: res.data.message || 'Password changed successfully!', ok: true });
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwMsg({ text: err.response?.data?.message || 'Error changing password', ok: false });
    } finally {
      setPwSaving(false);
    }
  };

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
            <F label="Instagram URL" value={config.social?.instagram} onChange={v => update('social.instagram', v)} />
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

        {/* Privacy Policy */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-1">Privacy Policy</h2>
          <p className="text-xs text-gray-400 mb-4">Shown at <span className="font-mono">/privacy-policy</span></p>
          <div className="space-y-4">
            <F label="Privacy Policy (Arabic)" value={config.privacyPolicyAr} onChange={v => update('privacyPolicyAr', v)} dir="rtl" textarea rows={10} />
            <F label="Privacy Policy (English)" value={config.privacyPolicyEn} onChange={v => update('privacyPolicyEn', v)} textarea rows={10} />
          </div>
        </section>

        {/* Terms of Use */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-700 mb-1">Terms of Use</h2>
          <p className="text-xs text-gray-400 mb-4">Shown at <span className="font-mono">/terms</span></p>
          <div className="space-y-4">
            <F label="Terms of Use (Arabic)" value={config.termsAr} onChange={v => update('termsAr', v)} dir="rtl" textarea rows={10} />
            <F label="Terms of Use (English)" value={config.termsEn} onChange={v => update('termsEn', v)} textarea rows={10} />
          </div>
        </section>
      </div>

      {/* ── Change Password ── */}
      <div className="mt-8 max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-cyan-600" />
          <h1 className="text-xl font-bold text-gray-800">Change Admin Password</h1>
        </div>
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
          <form onSubmit={changePassword} className="space-y-4">
            {[
              { key: 'currentPassword', label: 'Current Password', show: showPw.current, toggle: () => setShowPw(p => ({ ...p, current: !p.current })) },
              { key: 'newPassword',     label: 'New Password',     show: showPw.new,     toggle: () => setShowPw(p => ({ ...p, new: !p.new })) },
              { key: 'confirmPassword', label: 'Confirm New Password', show: showPw.confirm, toggle: () => setShowPw(p => ({ ...p, confirm: !p.confirm })) },
            ].map(({ key, label, show, toggle }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={pwForm[key]}
                    onChange={e => setPwForm(p => ({ ...p, [key]: e.target.value }))}
                    required
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
                  />
                  <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            {pwMsg.text && (
              <p className={`text-sm font-medium ${pwMsg.ok ? 'text-green-600' : 'text-red-600'}`}>{pwMsg.text}</p>
            )}
            <button type="submit" disabled={pwSaving}
              className="w-full py-2.5 bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm">
              {pwSaving ? 'Changing...' : 'Change Password'}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

const F = ({ label, value, onChange, dir, textarea, rows = 3 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {textarea
      ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} dir={dir} rows={rows} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm resize-y" />
      : <input type="text" value={value || ''} onChange={e => onChange(e.target.value)} dir={dir} className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm" />
    }
  </div>
);

export default SettingsAdmin;
