import { useState, useEffect } from 'react';
import { adminApi } from '../../utils/api';
import ImageUpload from '../components/ImageUpload';
import { Plus, Pencil, Trash2, X, Check, ToggleLeft, ToggleRight } from 'lucide-react';

const empty = { titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', image: '', tagsAr: [], tagsEn: [], year: '', order: 0, isActive: true };

const ProjectsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => adminApi.getProjects().then(r => setItems(r.data.data || []));
  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const save = async () => {
    setSaving(true);
    try {
      if (form._id) {
        await adminApi.updateProject(form._id, form);
      } else {
        await adminApi.createProject(form);
      }
      await load();
      setForm(null);
      showMsg('Saved!');
    } catch { showMsg('Error saving.'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await adminApi.deleteProject(id);
    await load();
    showMsg('Deleted.');
  };

  const toggle = async (item) => {
    await adminApi.updateProject(item._id, { ...item, isActive: !item.isActive });
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Projects ({items.length})</h1>
        <button onClick={() => setForm({ ...empty })} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>
      {msg && <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}

      {/* Form Modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{form._id ? 'Edit' : 'Add'} Project</h2>
              <button onClick={() => setForm(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <F label="Title (Arabic)" value={form.titleAr} onChange={v => setForm(p => ({ ...p, titleAr: v }))} dir="rtl" />
                <F label="Title (English)" value={form.titleEn} onChange={v => setForm(p => ({ ...p, titleEn: v }))} />
                <F label="Description (AR)" value={form.descriptionAr} onChange={v => setForm(p => ({ ...p, descriptionAr: v }))} dir="rtl" textarea />
                <F label="Description (EN)" value={form.descriptionEn} onChange={v => setForm(p => ({ ...p, descriptionEn: v }))} textarea />
                <F label="Tags (AR, comma-separated)" value={(form.tagsAr || []).join(', ')} onChange={v => setForm(p => ({ ...p, tagsAr: v.split(',').map(t => t.trim()).filter(Boolean) }))} />
                <F label="Tags (EN, comma-separated)" value={(form.tagsEn || []).join(', ')} onChange={v => setForm(p => ({ ...p, tagsEn: v.split(',').map(t => t.trim()).filter(Boolean) }))} />
                <F label="Year" value={form.year} onChange={v => setForm(p => ({ ...p, year: v }))} />
                <F label="Order" type="number" value={form.order} onChange={v => setForm(p => ({ ...p, order: Number(v) }))} />
              </div>
              <ImageUpload label="Project Image" value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} folder="kwa/projects" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm font-medium text-gray-700">Active (visible on website)</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors disabled:opacity-60">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setForm(null)} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item._id} className={`bg-white rounded-2xl p-4 shadow-sm border ${item.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'} flex items-center gap-4`}>
            {item.image && <img src={item.image} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{item.titleAr}</p>
              <p className="text-sm text-gray-500 truncate">{item.titleEn}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggle(item)} title={item.isActive ? 'Deactivate' : 'Activate'}>
                {item.isActive ? <ToggleRight className="w-5 h-5 text-cyan-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
              </button>
              <button onClick={() => setForm({ ...item })} className="p-1.5 hover:bg-cyan-50 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-cyan-600" /></button>
              <button onClick={() => del(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const F = ({ label, value, onChange, dir, textarea, type = 'text' }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    {textarea
      ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} dir={dir} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none" />
      : <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} dir={dir} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
    }
  </div>
);

export default ProjectsAdmin;
