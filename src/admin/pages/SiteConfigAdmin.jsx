import { useState, useEffect } from 'react';
import { adminApi } from '../../utils/api';
import ImageUpload from '../components/ImageUpload';
import RichEditor from '../components/RichEditor';
import { Plus, Trash2 } from 'lucide-react';

const SiteConfigAdmin = () => {
  const [config, setConfig] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    adminApi.getSiteConfig().then(res => setConfig(res.data.data));
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const res = await adminApi.updateSiteConfig(config);
      setConfig(res.data.data);
      setMsg('Saved successfully!');
    } catch {
      setMsg('Error saving. Please try again.');
    } finally {
      setSaving(false);
      setTimeout(() => setMsg(''), 3000);
    }
  };

  const update = (path, value) => {
    setConfig(prev => {
      const parts = path.split('.');
      const newConfig = JSON.parse(JSON.stringify(prev));
      let obj = newConfig;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return newConfig;
    });
  };

  const updateObjectivesAr = (index, value) => {
    const arr = [...(config.about?.objectivesAr || [])];
    arr[index] = value;
    update('about.objectivesAr', arr);
  };
  const updateObjectivesEn = (index, value) => {
    const arr = [...(config.about?.objectivesEn || [])];
    arr[index] = value;
    update('about.objectivesEn', arr);
  };

  const addObjective = () => {
    update('about.objectivesAr', [...(config.about?.objectivesAr || []), '']);
    update('about.objectivesEn', [...(config.about?.objectivesEn || []), '']);
  };
  const removeObjective = (index) => {
    const ar = [...(config.about?.objectivesAr || [])];
    const en = [...(config.about?.objectivesEn || [])];
    ar.splice(index, 1);
    en.splice(index, 1);
    setConfig(prev => {
      const next = JSON.parse(JSON.stringify(prev));
      next.about.objectivesAr = ar;
      next.about.objectivesEn = en;
      return next;
    });
  };

  const addStat = () => {
    const stats = [...(config.hero?.stats || []), { icon: '', value: '', labelAr: '', labelEn: '' }];
    update('hero.stats', stats);
  };
  const removeStat = (index) => {
    const stats = [...(config.hero?.stats || [])];
    stats.splice(index, 1);
    update('hero.stats', stats);
  };

  if (!config) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>;

  const tabs = [
    { id: 'hero',        label: 'Hero Section' },
    { id: 'about',       label: 'About Section' },
    { id: 'youthForum',  label: 'Youth Forum' },
  ];

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Hero & About Content</h1>
        <button onClick={save} disabled={saving} className="px-5 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors disabled:opacity-60 text-sm">
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      {msg && <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-cyan-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        {activeTab === 'hero' && (
          <>
            <Field label="Hero Title (Arabic)" value={config.hero?.titleAr} onChange={v => update('hero.titleAr', v)} dir="rtl" />
            <Field label="Hero Title (English)" value={config.hero?.titleEn} onChange={v => update('hero.titleEn', v)} />
            <Field label="Hero Subtitle (Arabic)" value={config.hero?.subtitleAr} onChange={v => update('hero.subtitleAr', v)} dir="rtl" textarea />
            <Field label="Hero Subtitle (English)" value={config.hero?.subtitleEn} onChange={v => update('hero.subtitleEn', v)} textarea />
            <ImageUpload
              label="Main Hero Image"
              value={config.hero?.mainImage}
              onChange={v => update('hero.mainImage', v)}
              folder="kwa/hero"
            />
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Hero Statistics</label>
                <button type="button" onClick={addStat} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-lg text-xs font-medium transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Stat
                </button>
              </div>
              {(config.hero?.stats || []).map((stat, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 mb-3 p-4 bg-gray-50 rounded-xl relative">
                  <button type="button" onClick={() => removeStat(i)} className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-lg transition-colors" title="Remove">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                  <Field label="Value" value={stat.value} onChange={v => { const s = [...config.hero.stats]; s[i].value = v; update('hero.stats', s); }} />
                  <Field label="Icon" value={stat.icon} onChange={v => { const s = [...config.hero.stats]; s[i].icon = v; update('hero.stats', s); }} />
                  <Field label="Label (Arabic)" value={stat.labelAr} onChange={v => { const s = [...config.hero.stats]; s[i].labelAr = v; update('hero.stats', s); }} dir="rtl" />
                  <Field label="Label (English)" value={stat.labelEn} onChange={v => { const s = [...config.hero.stats]; s[i].labelEn = v; update('hero.stats', s); }} />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'about' && (
          <>
            <Field label="Vision (Arabic)" value={config.about?.visionAr} onChange={v => update('about.visionAr', v)} dir="rtl" rich />
            <Field label="Vision (English)" value={config.about?.visionEn} onChange={v => update('about.visionEn', v)} rich />
            <Field label="Mission (Arabic)" value={config.about?.missionAr} onChange={v => update('about.missionAr', v)} dir="rtl" rich />
            <Field label="Mission (English)" value={config.about?.missionEn} onChange={v => update('about.missionEn', v)} rich />
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium text-gray-700">Objectives</label>
                <button type="button" onClick={addObjective} className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-lg text-xs font-medium transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Add Objective
                </button>
              </div>
              {(config.about?.objectivesAr || []).map((obj, i) => (
                <div key={i} className="grid grid-cols-2 gap-3 mb-3 p-3 bg-gray-50 rounded-xl relative">
                  <button type="button" onClick={() => removeObjective(i)} className="absolute top-2 right-2 p-1 hover:bg-red-100 rounded-lg transition-colors" title="Remove">
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                  <Field label={`Objective ${i + 1} (AR)`} value={obj} onChange={v => updateObjectivesAr(i, v)} dir="rtl" />
                  <Field label={`Objective ${i + 1} (EN)`} value={config.about?.objectivesEn?.[i] || ''} onChange={v => updateObjectivesEn(i, v)} />
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'youthForum' && (
          <>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Show Youth Forum Section</p>
                <p className="text-xs text-gray-400 mt-0.5">Toggle visibility on the homepage</p>
              </div>
              <button
                type="button"
                onClick={() => update('youthForum.isVisible', !config.youthForum?.isVisible)}
                className={`relative w-11 h-6 rounded-full transition-colors ${config.youthForum?.isVisible ? 'bg-cyan-500' : 'bg-gray-300'}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${config.youthForum?.isVisible ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <Field label="Title (Arabic)" value={config.youthForum?.titleAr} onChange={v => update('youthForum.titleAr', v)} dir="rtl" />
            <Field label="Title (English)" value={config.youthForum?.titleEn} onChange={v => update('youthForum.titleEn', v)} />

            <Field label="Top Description (Arabic)" value={config.youthForum?.descriptionTopAr} onChange={v => update('youthForum.descriptionTopAr', v)} dir="rtl" rich />
            <Field label="Top Description (English)" value={config.youthForum?.descriptionTopEn} onChange={v => update('youthForum.descriptionTopEn', v)} rich />

            <div className="grid grid-cols-2 gap-4">
              <Field label="Button Text (Arabic)" value={config.youthForum?.buttonTextAr} onChange={v => update('youthForum.buttonTextAr', v)} dir="rtl" />
              <Field label="Button Text (English)" value={config.youthForum?.buttonTextEn} onChange={v => update('youthForum.buttonTextEn', v)} />
            </div>

            <Field label="Button Link" value={config.youthForum?.buttonLink} onChange={v => update('youthForum.buttonLink', v)} />

            <Field label="Bottom Description (Arabic)" value={config.youthForum?.descriptionBotAr} onChange={v => update('youthForum.descriptionBotAr', v)} dir="rtl" rich />
            <Field label="Bottom Description (English)" value={config.youthForum?.descriptionBotEn} onChange={v => update('youthForum.descriptionBotEn', v)} rich />
          </>
        )}
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, textarea, dir, rich }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {rich ? (
      <RichEditor value={value || ''} onChange={onChange} dir={dir} />
    ) : textarea ? (
      <textarea
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        dir={dir}
        rows={3}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm resize-none"
      />
    ) : (
      <input
        type="text"
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        dir={dir}
        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm"
      />
    )}
  </div>
);

export default SiteConfigAdmin;
