import { useState, useEffect } from 'react';
import { adminApi } from '../../utils/api';
import RichEditor from '../components/RichEditor';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, ChevronDown, ChevronUp, Copy, Link2 } from 'lucide-react';

const FIELD_TYPES = [
  { value: 'text',     label: 'Short Text' },
  { value: 'textarea', label: 'Long Text' },
  { value: 'email',    label: 'Email' },
  { value: 'phone',    label: 'Phone' },
  { value: 'number',   label: 'Number' },
  { value: 'date',     label: 'Date' },
  { value: 'file',     label: 'File Upload' },
  { value: 'select',   label: 'Dropdown' },
  { value: 'radio',    label: 'Radio Buttons' },
];

const HAS_OPTIONS = ['select', 'radio'];
const HAS_PLACEHOLDER = ['text', 'textarea', 'email', 'phone', 'number'];

const toSlug = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const emptyForm = {
  titleEn: '', titleAr: '',
  descriptionEn: '', descriptionAr: '',
  descriptionBotEn: '', descriptionBotAr: '',
  slug: '',
  fields: [],
  successMessageEn: 'Thank you! Your response has been recorded.',
  successMessageAr: 'شكراً! تم تسجيل إجابتك بنجاح.',
  isActive: true,
  order: 0,
};

// ── Field editor row ──────────────────────────────────────────────────────────
const FieldEditor = ({ field, idx, onUpdate, onRemove, onAddOption, onUpdateOption, onRemoveOption }) => {
  const [open, setOpen] = useState(false);
  const hasOpts = HAS_OPTIONS.includes(field.type);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <div className="flex items-center gap-3 px-3 py-2.5 bg-gray-50 cursor-pointer select-none" onClick={() => setOpen(o => !o)}>
        <span className="text-xs font-mono bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-500">{field.type}</span>
        <span className="flex-1 text-sm font-medium text-gray-700 truncate">
          {field.labelEn || <span className="text-gray-400 italic">Untitled field</span>}
        </span>
        {field.required && <span className="text-xs text-red-400 flex-shrink-0">required</span>}
        <button type="button" onClick={e => { e.stopPropagation(); onRemove(idx); }}
          className="p-1 hover:bg-red-50 rounded flex-shrink-0">
          <X className="w-3.5 h-3.5 text-red-400" />
        </button>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </div>

      {open && (
        <div className="p-4 space-y-3 bg-white">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Field Type</label>
              <select value={field.type} onChange={e => onUpdate(idx, 'type', e.target.value)}
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
                {FIELD_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex items-end pb-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={field.required} onChange={e => onUpdate(idx, 'required', e.target.checked)}
                  className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm text-gray-700">Required</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SF label="Label (English)" value={field.labelEn} onChange={v => onUpdate(idx, 'labelEn', v)} />
            <SF label="Label (Arabic)" value={field.labelAr} onChange={v => onUpdate(idx, 'labelAr', v)} dir="rtl" />
          </div>

          {HAS_PLACEHOLDER.includes(field.type) && (
            <div className="grid grid-cols-2 gap-3">
              <SF label="Placeholder (EN)" value={field.placeholderEn} onChange={v => onUpdate(idx, 'placeholderEn', v)} />
              <SF label="Placeholder (AR)" value={field.placeholderAr} onChange={v => onUpdate(idx, 'placeholderAr', v)} dir="rtl" />
            </div>
          )}

          {field.type === 'file' && (
            <div>
              <SF label='Accepted file types (e.g. image/*, application/pdf, .docx — leave blank for any)'
                value={field.accept || ''} onChange={v => onUpdate(idx, 'accept', v)} />
            </div>
          )}

          {hasOpts && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-500">Options</label>
                <button type="button" onClick={() => onAddOption(idx)}
                  className="text-xs text-cyan-600 hover:text-cyan-700 font-medium">+ Add option</button>
              </div>
              <div className="space-y-2">
                {(field.options || []).map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input value={opt.labelEn} onChange={e => onUpdateOption(idx, oi, 'labelEn', e.target.value)}
                      placeholder="Label EN"
                      className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400" />
                    <input value={opt.labelAr} onChange={e => onUpdateOption(idx, oi, 'labelAr', e.target.value)}
                      placeholder="Label AR" dir="rtl"
                      className="flex-1 px-2 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-cyan-400" />
                    <button type="button" onClick={() => onRemoveOption(idx, oi)} className="p-1 hover:bg-red-50 rounded flex-shrink-0">
                      <X className="w-3.5 h-3.5 text-red-400" />
                    </button>
                  </div>
                ))}
                {(field.options || []).length === 0 && (
                  <p className="text-xs text-gray-400 italic">No options yet</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main component ────────────────────────────────────────────────────────────
const CustomFormsAdmin = () => {
  const [forms, setForms] = useState([]);
  const [view, setView] = useState('list');       // 'list' | 'builder' | 'submissions'
  const [editing, setEditing] = useState(null);
  const [selectedForm, setSelectedForm] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => adminApi.getCustomForms().then(r => setForms(r.data.data || []));
  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const openBuilder = (form = null) => {
    setEditing(form
      ? { ...form, fields: form.fields.map(f => ({ ...f, options: [...(f.options || [])] })) }
      : { ...emptyForm }
    );
    setView('builder');
  };

  const openSubmissions = async (form) => {
    setSelectedForm(form);
    const res = await adminApi.getCustomFormSubmissions(form._id);
    setSubmissions(res.data.data || []);
    setExpanded(null);
    setView('submissions');
  };

  const saveForm = async () => {
    if (!editing.titleEn || !editing.slug) { flash('Title and slug are required'); return; }
    setSaving(true);
    try {
      if (editing._id) await adminApi.updateCustomForm(editing._id, editing);
      else await adminApi.createCustomForm(editing);
      await load();
      setView('list');
      flash('Saved!');
    } catch (e) {
      flash(e.response?.data?.message || 'Error saving.');
    } finally { setSaving(false); }
  };

  const deleteForm = async (id) => {
    if (!window.confirm('Delete this form and ALL its submissions?')) return;
    await adminApi.deleteCustomForm(id);
    await load();
    flash('Deleted.');
  };

  const toggle = async (form) => {
    await adminApi.updateCustomForm(form._id, { isActive: !form.isActive });
    await load();
  };

  // Field helpers
  const addField = () => {
    const id = `f_${Date.now()}`;
    setEditing(e => ({ ...e, fields: [...e.fields, { id, type: 'text', labelEn: '', labelAr: '', placeholderEn: '', placeholderAr: '', required: false, accept: '', options: [] }] }));
  };
  const updField = (idx, key, val) => setEditing(e => {
    const fields = [...e.fields]; fields[idx] = { ...fields[idx], [key]: val }; return { ...e, fields };
  });
  const delField = (idx) => setEditing(e => ({ ...e, fields: e.fields.filter((_, i) => i !== idx) }));
  const addOpt = (fi) => setEditing(e => {
    const fields = [...e.fields];
    fields[fi] = { ...fields[fi], options: [...(fields[fi].options || []), { labelEn: '', labelAr: '', value: '' }] };
    return { ...e, fields };
  });
  const updOpt = (fi, oi, key, val) => setEditing(e => {
    const fields = [...e.fields];
    const options = [...fields[fi].options];
    options[oi] = { ...options[oi], [key]: val };
    if (key === 'labelEn') options[oi].value = toSlug(val) || `opt_${oi}`;
    fields[fi] = { ...fields[fi], options };
    return { ...e, fields };
  });
  const delOpt = (fi, oi) => setEditing(e => {
    const fields = [...e.fields];
    fields[fi] = { ...fields[fi], options: fields[fi].options.filter((_, i) => i !== oi) };
    return { ...e, fields };
  });

  const publicUrl = (slug) => `${window.location.origin}/${slug}`;

  const Msg = () => msg ? (
    <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${msg.includes('Error') || msg.includes('required') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>
  ) : null;

  // ── LIST ──────────────────────────────────────────────────────────────────
  if (view === 'list') return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Custom Forms ({forms.length})</h1>
        <button onClick={() => openBuilder()}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors">
          <Plus className="w-4 h-4" /> New Form
        </button>
      </div>
      <Msg />

      <div className="space-y-3">
        {forms.map(form => (
          <div key={form._id} className={`bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-4 ${form.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800">{form.titleEn}</p>
              <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                <span className="text-xs text-gray-400 font-mono">/{form.slug}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(publicUrl(form.slug)); flash('URL copied!'); }}
                  className="flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-600">
                  <Copy className="w-3 h-3" /> copy link
                </button>
                <a href={publicUrl(form.slug)} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-cyan-500">
                  <Link2 className="w-3 h-3" /> preview
                </a>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{form.fields?.length || 0} fields</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => openSubmissions(form)}
                className="px-3 py-1.5 text-xs bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 font-medium">
                Submissions
              </button>
              <button onClick={() => toggle(form)}>
                {form.isActive
                  ? <ToggleRight className="w-5 h-5 text-cyan-500" />
                  : <ToggleLeft className="w-5 h-5 text-gray-400" />}
              </button>
              <button onClick={() => openBuilder(form)} className="p-1.5 hover:bg-cyan-50 rounded-lg">
                <Pencil className="w-4 h-4 text-cyan-600" />
              </button>
            </div>
          </div>
        ))}
        {forms.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium mb-1">No forms yet</p>
            <p className="text-sm">Create a custom form — it gets its own public URL</p>
          </div>
        )}
      </div>
    </div>
  );

  // ── SUBMISSIONS ───────────────────────────────────────────────────────────
  if (view === 'submissions') return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setView('list')} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">← Back</button>
        <h1 className="text-xl font-bold text-gray-800">Submissions — {selectedForm?.titleEn}</h1>
        <span className="text-sm text-gray-400">({submissions.length})</span>
      </div>

      {submissions.length === 0 && (
        <div className="text-center py-20 text-gray-400">No submissions yet</div>
      )}

      <div className="space-y-3">
        {submissions.map(sub => (
          <div key={sub._id} className={`bg-white rounded-2xl shadow-sm border ${sub.isRead ? 'border-gray-100' : 'border-cyan-200'}`}>
            <div className="flex items-center gap-3 p-4 cursor-pointer"
              onClick={async () => {
                if (!sub.isRead) {
                  await adminApi.markCustomFormSubmissionRead(sub._id);
                  setSubmissions(ss => ss.map(s => s._id === sub._id ? { ...s, isRead: true } : s));
                }
                setExpanded(expanded === sub._id ? null : sub._id);
              }}>
              {!sub.isRead && <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">{new Date(sub.createdAt).toLocaleString()}</p>
                <p className="text-xs text-gray-400">{Object.keys(sub.data || {}).length} answers</p>
              </div>
              <button
                onClick={async e => {
                  e.stopPropagation();
                  if (!window.confirm('Delete this submission?')) return;
                  await adminApi.deleteCustomFormSubmission(sub._id);
                  setSubmissions(ss => ss.filter(s => s._id !== sub._id));
                }}
                className="p-1.5 hover:bg-red-50 rounded-lg flex-shrink-0">
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
              {expanded === sub._id
                ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
            </div>

            {expanded === sub._id && (
              <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
                {selectedForm?.fields.map(field => (
                  <div key={field.id} className="flex gap-3 text-sm">
                    <span className="font-medium text-gray-500 min-w-[140px] flex-shrink-0">{field.labelEn}:</span>
                    <span className="text-gray-800">{String(sub.data?.[field.id] ?? '—')}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // ── BUILDER ───────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setView('list')} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">← Back</button>
        <h1 className="text-xl font-bold text-gray-800">{editing?._id ? 'Edit Form' : 'New Form'}</h1>
      </div>
      <Msg />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: meta */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-4">
          <h3 className="font-semibold text-gray-700">Form Details</h3>
          <F label="Title (English) *" value={editing?.titleEn}
            onChange={v => setEditing(e => ({ ...e, titleEn: v, slug: e.slug || toSlug(v) }))} />
          <F label="Title (Arabic)" value={editing?.titleAr}
            onChange={v => setEditing(e => ({ ...e, titleAr: v }))} dir="rtl" />
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              URL Slug * <span className="text-gray-400 font-normal">— public URL: <code className="text-cyan-600">domain.com/<strong>{editing?.slug || 'slug'}</strong></code></span>
            </label>
            <input value={editing?.slug || ''}
              onChange={e => setEditing(f => ({ ...f, slug: toSlug(e.target.value) }))}
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="my-form" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Top Description (English)</label>
            <RichEditor key={`${editing?._id || 'new'}-topEn`} value={editing?.descriptionEn || ''} onChange={v => setEditing(e => ({ ...e, descriptionEn: v }))} minHeight={100} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Top Description (Arabic)</label>
            <RichEditor key={`${editing?._id || 'new'}-topAr`} value={editing?.descriptionAr || ''} onChange={v => setEditing(e => ({ ...e, descriptionAr: v }))} dir="rtl" minHeight={100} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Bottom Description (English)</label>
            <RichEditor key={`${editing?._id || 'new'}-botEn`} value={editing?.descriptionBotEn || ''} onChange={v => setEditing(e => ({ ...e, descriptionBotEn: v }))} minHeight={100} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Bottom Description (Arabic)</label>
            <RichEditor key={`${editing?._id || 'new'}-botAr`} value={editing?.descriptionBotAr || ''} onChange={v => setEditing(e => ({ ...e, descriptionBotAr: v }))} dir="rtl" minHeight={100} />
          </div>
          <F label="Success Message (English)" value={editing?.successMessageEn}
            onChange={v => setEditing(e => ({ ...e, successMessageEn: v }))} />
          <F label="Success Message (Arabic)" value={editing?.successMessageAr}
            onChange={v => setEditing(e => ({ ...e, successMessageAr: v }))} dir="rtl" />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={editing?.isActive ?? true}
              onChange={ev => setEditing(e => ({ ...e, isActive: ev.target.checked }))}
              className="w-4 h-4 accent-cyan-500" />
            <span className="text-sm font-medium text-gray-700">Active (publicly accessible)</span>
          </label>
        </div>

        {/* Right: fields */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-700">Form Fields</h3>
            <button onClick={addField}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-lg text-sm font-medium hover:bg-cyan-100 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Add Field
            </button>
          </div>

          {(editing?.fields.length === 0) && (
            <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-xl">
              No fields yet. Click "Add Field" to start building your form.
            </div>
          )}

          <div className="space-y-2">
            {editing?.fields.map((field, idx) => (
              <FieldEditor key={field.id} field={field} idx={idx}
                onUpdate={updField} onRemove={delField}
                onAddOption={addOpt} onUpdateOption={updOpt} onRemoveOption={delOpt} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={saveForm} disabled={saving}
          className="px-8 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium disabled:opacity-60 transition-colors">
          {saving ? 'Saving...' : 'Save Form'}
        </button>
        <button onClick={() => setView('list')}
          className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
          Cancel
        </button>
      </div>
    </div>
  );
};

const F = ({ label, value, onChange, dir, textarea }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    {textarea
      ? <textarea value={value || ''} onChange={e => onChange(e.target.value)} dir={dir} rows={2}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 resize-none" />
      : <input value={value || ''} onChange={e => onChange(e.target.value)} dir={dir}
          className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
    }
  </div>
);

const SF = ({ label, value, onChange, dir }) => (
  <div>
    <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
    <input value={value || ''} onChange={e => onChange(e.target.value)} dir={dir}
      className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
  </div>
);

export default CustomFormsAdmin;
