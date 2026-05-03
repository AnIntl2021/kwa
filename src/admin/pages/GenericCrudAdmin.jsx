/**
 * Reusable CRUD admin page component.
 * Used for Training, Awards, Memberships, Partners - any simple list.
 */
import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import RichEditor from '../components/RichEditor';

const GenericCrudAdmin = ({
  title,
  fetchFn,
  createFn,
  updateFn,
  deleteFn,
  fields,       // Array of field definitions
  imageField,   // optional: field name for image upload
  imageFolder,
  emptyState,
  noActive,     // if true, skip isActive toggle
}) => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => fetchFn().then(r => setItems(r.data.data || []));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const buildEmpty = () => {
    const obj = { isActive: true };
    fields.forEach(f => { obj[f.key] = f.default !== undefined ? f.default : ''; });
    if (imageField) obj[imageField] = '';
    return obj;
  };

  const save = async () => {
    setSaving(true);
    try {
      if (form._id) await updateFn(form._id, form);
      else await createFn(form);
      await load();
      setForm(null);
      showMsg('Saved!');
    } catch (e) {
      showMsg(e.response?.data?.message || 'Error saving.');
    } finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    await deleteFn(id);
    await load();
    showMsg('Deleted.');
  };

  const toggle = async (item) => {
    await updateFn(item._id, { ...item, isActive: !item.isActive });
    await load();
  };

  const primaryField = fields.find(f => f.primary) || fields[0];
  const secondaryField = fields.find(f => f.secondary) || fields[1];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">{title} ({items.length})</h1>
        <button onClick={() => setForm(buildEmpty())} className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add {title.replace(/s$/, '')}
        </button>
      </div>
      {msg && <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}

      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-4 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{form._id ? 'Edit' : 'Add'} {title.replace(/s$/, '')}</h2>
              <button onClick={() => setForm(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fields.map(field => (
                  <div key={field.key} className={field.fullWidth || field.rich ? 'md:col-span-2' : ''}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                    {field.rich ? (
                      <RichEditor key={`${form._id || 'new'}-${field.key}`} value={form[field.key] || ''} onChange={v => setForm(p => ({ ...p, [field.key]: v }))} dir={field.dir} />
                    ) : field.type === 'select' ? (
                      <select value={form[field.key] || ''} onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
                        {field.options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                      </select>
                    ) : field.textarea ? (
                      <textarea rows={3} value={form[field.key] || ''} onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                        dir={field.dir} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none" />
                    ) : (
                      <input type={field.type || 'text'} value={form[field.key] || ''} onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                        dir={field.dir} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
                    )}
                  </div>
                ))}
              </div>
              {imageField && (
                <ImageUpload label="Image" value={form[imageField]} onChange={v => setForm(p => ({ ...p, [imageField]: v }))} folder={imageFolder || 'kwa'} />
              )}
              {!noActive && (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isActive !== false} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="w-4 h-4 accent-cyan-500" />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
              )}
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
          <div key={item._id} className={`bg-white rounded-2xl p-4 shadow-sm border ${item.isActive !== false ? 'border-gray-100' : 'border-gray-200 opacity-60'} flex items-center gap-4`}>
            {imageField && item[imageField] && <img src={item[imageField]} alt="" className="w-16 h-12 rounded-lg object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{item[primaryField?.key]}</p>
              {secondaryField && <p className="text-sm text-gray-500 truncate">{item[secondaryField?.key]}</p>}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!noActive && (
                <button onClick={() => toggle(item)} title={item.isActive ? 'Deactivate' : 'Activate'}>
                  {item.isActive ? <ToggleRight className="w-5 h-5 text-cyan-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                </button>
              )}
              <button onClick={() => setForm({ ...item })} className="p-1.5 hover:bg-cyan-50 rounded-lg transition-colors"><Pencil className="w-4 h-4 text-cyan-600" /></button>
              <button onClick={() => del(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4 text-red-500" /></button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p>No {title.toLowerCase()} yet. Click "+ Add" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericCrudAdmin;
