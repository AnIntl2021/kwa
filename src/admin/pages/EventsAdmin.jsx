import { useState, useEffect } from 'react';
import { adminApi } from '../../utils/api';
import ImageUpload from '../components/ImageUpload';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, Calendar } from 'lucide-react';

const empty = { titleAr: '', titleEn: '', descriptionAr: '', descriptionEn: '', date: '', locationAr: '', locationEn: '', image: '', isActive: true };

const EventsAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => adminApi.getEvents().then(r => setItems(r.data.data || []));
  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const save = async () => {
    setSaving(true);
    try {
      if (form._id) await adminApi.updateEvent(form._id, form);
      else await adminApi.createEvent(form);
      await load(); setForm(null); showMsg('Saved!');
    } catch { showMsg('Error saving.'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    await adminApi.deleteEvent(id);
    await load(); showMsg('Deleted.');
  };

  const toggle = async (item) => {
    await adminApi.updateEvent(item._id, { ...item, isActive: !item.isActive });
    await load();
  };

  const toInput = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toISOString().split('T')[0];
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Events ({items.length})</h1>
        <button onClick={() => setForm({ ...empty })} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>
      {msg && <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}

      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{form._id ? 'Edit' : 'Add'} Event</h2>
              <button onClick={() => setForm(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <F label="Title (Arabic)" value={form.titleAr} onChange={v => setForm(p => ({ ...p, titleAr: v }))} dir="rtl" />
                <F label="Title (English)" value={form.titleEn} onChange={v => setForm(p => ({ ...p, titleEn: v }))} />
                <F label="Description (Arabic)" value={form.descriptionAr} onChange={v => setForm(p => ({ ...p, descriptionAr: v }))} dir="rtl" textarea />
                <F label="Description (English)" value={form.descriptionEn} onChange={v => setForm(p => ({ ...p, descriptionEn: v }))} textarea />
                <F label="Date" type="date" value={toInput(form.date)} onChange={v => setForm(p => ({ ...p, date: v }))} />
                <div />
                <F label="Location (Arabic)" value={form.locationAr} onChange={v => setForm(p => ({ ...p, locationAr: v }))} dir="rtl" />
                <F label="Location (English)" value={form.locationEn} onChange={v => setForm(p => ({ ...p, locationEn: v }))} />
              </div>
              <ImageUpload label="Event Image" value={form.image} onChange={v => setForm(p => ({ ...p, image: v }))} folder="kwa/events" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={save} disabled={saving} className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium disabled:opacity-60">
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
            {item.image
              ? <img src={item.image} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />
              : <div className="w-16 h-12 rounded-lg bg-cyan-50 flex-shrink-0 flex items-center justify-center"><Calendar className="w-6 h-6 text-cyan-300" /></div>
            }
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{item.titleAr}</p>
              <p className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString('en-KW', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
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

export default EventsAdmin;
