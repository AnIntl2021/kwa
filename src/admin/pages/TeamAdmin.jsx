import { useState, useEffect } from 'react';
import { adminApi } from '../../utils/api';
import ImageUpload from '../components/ImageUpload';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, Crown } from 'lucide-react';

const empty = { nameAr: '', nameEn: '', designationAr: '', designationEn: '', photo: '', isChairman: false, chairmanMessageAr: '', chairmanMessageEn: '', order: 0, isActive: true };

const TeamAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => adminApi.getTeam().then(r => setItems(r.data.data || []));
  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const save = async () => {
    setSaving(true);
    try {
      if (form._id) await adminApi.updateTeamMember(form._id, form);
      else await adminApi.createTeamMember(form);
      await load();
      setForm(null);
      showMsg('Saved!');
    } catch (e) { showMsg('Error saving.'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this team member?')) return;
    await adminApi.deleteTeamMember(id);
    await load();
    showMsg('Deleted.');
  };

  const toggle = async (item) => {
    await adminApi.updateTeamMember(item._id, { ...item, isActive: !item.isActive });
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Team Members ({items.length})</h1>
        <button onClick={() => setForm({ ...empty })} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>
      {msg && <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}

      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{form._id ? 'Edit' : 'Add'} Team Member</h2>
              <button onClick={() => setForm(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <F label="Name (Arabic)" value={form.nameAr} onChange={v => setForm(p => ({ ...p, nameAr: v }))} dir="rtl" />
                <F label="Name (English)" value={form.nameEn} onChange={v => setForm(p => ({ ...p, nameEn: v }))} />
                <F label="Designation (Arabic)" value={form.designationAr} onChange={v => setForm(p => ({ ...p, designationAr: v }))} dir="rtl" />
                <F label="Designation (English)" value={form.designationEn} onChange={v => setForm(p => ({ ...p, designationEn: v }))} />
                <F label="Order" type="number" value={form.order} onChange={v => setForm(p => ({ ...p, order: Number(v) }))} />
              </div>
              <ImageUpload label="Photo" value={form.photo} onChange={v => setForm(p => ({ ...p, photo: v }))} folder="kwa/team" />
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isChairman} onChange={e => setForm(p => ({ ...p, isChairman: e.target.checked }))} className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm font-medium text-gray-700">Is Chairman</span>
              </label>
              {form.isChairman && (
                <div className="space-y-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm font-semibold text-amber-700">Chairman's Message</p>
                  <F label="Message (Arabic)" value={form.chairmanMessageAr} onChange={v => setForm(p => ({ ...p, chairmanMessageAr: v }))} dir="rtl" textarea />
                  <F label="Message (English)" value={form.chairmanMessageEn} onChange={v => setForm(p => ({ ...p, chairmanMessageEn: v }))} textarea />
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm font-medium text-gray-700">Active</span>
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

      <div className="space-y-3">
        {items.map(item => (
          <div key={item._id} className={`bg-white rounded-2xl p-4 shadow-sm border ${item.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'} flex items-center gap-4`}>
            {item.photo
              ? <img src={item.photo} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-cyan-100" />
              : <div className="w-12 h-12 rounded-full bg-cyan-100 flex-shrink-0 flex items-center justify-center"><span className="text-cyan-600 font-bold">{item.nameEn?.[0]}</span></div>
            }
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-gray-800 truncate">{item.nameAr}</p>
                {item.isChairman && <Crown className="w-4 h-4 text-amber-500 flex-shrink-0" />}
              </div>
              <p className="text-sm text-gray-500 truncate">{item.designationEn}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggle(item)}>
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

export default TeamAdmin;
