import { useState, useEffect } from 'react';
import { adminApi } from '../../utils/api';
import ImageUpload from '../components/ImageUpload';
import PdfUpload from '../components/PdfUpload';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, FileText } from 'lucide-react';

const empty = { titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', pdfUrl: '', coverImage: '', publishDate: new Date().toISOString().split('T')[0], order: 0, isActive: true };

const PublicationsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => adminApi.getPublications().then(r => setItems(r.data.data || []));
  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const save = async () => {
    setSaving(true);
    try {
      if (form._id) await adminApi.updatePublication(form._id, form);
      else await adminApi.createPublication(form);
      await load(); setForm(null); showMsg('Saved!');
    } catch { showMsg('Error saving.'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this publication?')) return;
    await adminApi.deletePublication(id);
    await load(); showMsg('Deleted.');
  };

  const toggle = async (item) => {
    await adminApi.updatePublication(item._id, { ...item, isActive: !item.isActive });
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Publications ({items.length})</h1>
        <button onClick={() => setForm({ ...empty })} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Publication
        </button>
      </div>
      {msg && <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${msg.includes('Error') || msg.includes('failed') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}

      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{form._id ? 'Edit' : 'Add'} Publication</h2>
              <button onClick={() => setForm(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <F label="Title (Arabic)" value={form.titleAr} onChange={v => setForm(p => ({ ...p, titleAr: v }))} dir="rtl" />
                <F label="Title (English)" value={form.titleEn} onChange={v => setForm(p => ({ ...p, titleEn: v }))} />
                <F label="Description (Arabic)" value={form.descriptionAr} onChange={v => setForm(p => ({ ...p, descriptionAr: v }))} dir="rtl" textarea />
                <F label="Description (English)" value={form.descriptionEn} onChange={v => setForm(p => ({ ...p, descriptionEn: v }))} textarea />
                <F label="Publish Date" type="date" value={form.publishDate?.split('T')[0] || ''} onChange={v => setForm(p => ({ ...p, publishDate: v }))} />
                <F label="Order" type="number" value={form.order} onChange={v => setForm(p => ({ ...p, order: Number(v) }))} />
              </div>

              <PdfUpload label="PDF File *" value={form.pdfUrl} onChange={v => setForm(p => ({ ...p, pdfUrl: v }))} folder="publications" />

              <ImageUpload label="Cover Image (optional)" value={form.coverImage} onChange={v => setForm(p => ({ ...p, coverImage: v }))} folder="kwa/publications" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={save} disabled={saving || !form.pdfUrl} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium disabled:opacity-60">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setForm(null)} className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map(item => (
          <div key={item._id} className={`bg-white rounded-2xl p-4 shadow-sm border ${item.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'} flex items-center gap-4`}>
            {item.coverImage
              ? <img src={item.coverImage} alt="" className="w-12 h-16 rounded-lg object-cover flex-shrink-0" />
              : <div className="w-12 h-16 rounded-lg bg-red-50 flex-shrink-0 flex items-center justify-center"><FileText className="w-6 h-6 text-red-300" /></div>
            }
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{item.titleAr}</p>
              <p className="text-sm text-gray-500 truncate">{item.titleEn}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggle(item)}>
                {item.isActive ? <ToggleRight className="w-5 h-5 text-cyan-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
              </button>
              <button onClick={() => setForm({ ...item })} className="p-1.5 hover:bg-cyan-50 rounded-lg"><Pencil className="w-4 h-4 text-cyan-600" /></button>
              <button onClick={() => del(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
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

export default PublicationsAdmin;
