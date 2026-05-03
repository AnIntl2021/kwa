import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../utils/api';
import { Plus, Pencil, Trash2, X, ToggleLeft, ToggleRight, FileText, Image, Upload } from 'lucide-react';
import axios from 'axios';

const empty = { titleAr: '', titleEn: '', fileUrl: '', fileType: 'image', order: 0, isActive: true };

const CertificatesAdmin = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');

  const load = () => adminApi.getCertificates().then(r => setItems(r.data.data || []));
  useEffect(() => { load(); }, []);

  const flash = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const save = async () => {
    if (!form.fileUrl) { flash('Please upload a file first'); return; }
    setSaving(true);
    try {
      if (form._id) await adminApi.updateCertificate(form._id, form);
      else await adminApi.createCertificate(form);
      await load();
      setForm(null);
      flash('Saved!');
    } catch { flash('Error saving.'); }
    finally { setSaving(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this certificate?')) return;
    await adminApi.deleteCertificate(id);
    await load();
    flash('Deleted.');
  };

  const toggle = async (item) => {
    await adminApi.updateCertificate(item._id, { isActive: !item.isActive });
    await load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Certificates ({items.length})</h1>
        <button onClick={() => setForm({ ...empty })}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors">
          <Plus className="w-4 h-4" /> Add Certificate
        </button>
      </div>
      {msg && <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${msg.includes('Error') || msg.includes('Please') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}

      {/* Form modal */}
      {form && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-lg my-4 shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-bold">{form._id ? 'Edit' : 'Add'} Certificate</h2>
              <button onClick={() => setForm(null)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <F label="Title (Arabic)" value={form.titleAr} onChange={v => setForm(p => ({ ...p, titleAr: v }))} dir="rtl" />
                <F label="Title (English)" value={form.titleEn} onChange={v => setForm(p => ({ ...p, titleEn: v }))} />
              </div>

              {/* File type toggle */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">File Type</label>
                <div className="flex gap-2">
                  {['image', 'pdf'].map(type => (
                    <button key={type} type="button"
                      onClick={() => setForm(p => ({ ...p, fileType: type, fileUrl: '' }))}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${form.fileType === type ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-white text-gray-600 border-gray-200 hover:border-cyan-300'}`}>
                      {type === 'image' ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                      {type === 'image' ? 'Image' : 'PDF'}
                    </button>
                  ))}
                </div>
              </div>

              {/* File uploader */}
              <CertFileUpload
                value={form.fileUrl}
                fileType={form.fileType}
                onChange={v => setForm(p => ({ ...p, fileUrl: v }))}
              />

              <div className="grid grid-cols-2 gap-4">
                <F label="Order" type="number" value={form.order} onChange={v => setForm(p => ({ ...p, order: Number(v) }))} />
                <div className="flex items-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.isActive}
                      onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 accent-cyan-500" />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t">
              <button onClick={save} disabled={saving}
                className="flex-1 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium disabled:opacity-60 transition-colors">
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setForm(null)}
                className="px-6 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item._id} className={`bg-white rounded-2xl p-4 shadow-sm border flex items-center gap-4 ${item.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'}`}>
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 flex items-center justify-center">
              {item.fileType === 'image' && item.fileUrl
                ? <img src={item.fileUrl} alt="" className="w-full h-full object-cover" />
                : <FileText className="w-7 h-7 text-red-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{item.titleAr || item.titleEn || '—'}</p>
              <p className="text-sm text-gray-500 truncate">{item.titleEn}</p>
              <span className={`inline-flex items-center gap-1 text-xs mt-0.5 ${item.fileType === 'pdf' ? 'text-red-500' : 'text-blue-500'}`}>
                {item.fileType === 'pdf' ? <FileText className="w-3 h-3" /> : <Image className="w-3 h-3" />}
                {item.fileType.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button onClick={() => toggle(item)}>
                {item.isActive ? <ToggleRight className="w-5 h-5 text-cyan-500" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
              </button>
              <button onClick={() => setForm({ ...item })} className="p-1.5 hover:bg-cyan-50 rounded-lg">
                <Pencil className="w-4 h-4 text-cyan-600" />
              </button>
              <button onClick={() => del(item._id)} className="p-1.5 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p>No certificates yet. Click "+ Add Certificate" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Combined image + PDF uploader using presigned URLs
const CertFileUpload = ({ value, fileType, onChange }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const accept = fileType === 'pdf' ? 'application/pdf' : 'image/*';
  const maxMB = fileType === 'pdf' ? 100 : 20;

  const handleFile = async (file) => {
    if (!file) return;
    const isPdf = file.type === 'application/pdf';
    if (fileType === 'pdf' && !isPdf) { setError('Please select a PDF file'); return; }
    if (fileType === 'image' && isPdf) { setError('Please select an image file'); return; }
    if (file.size > maxMB * 1024 * 1024) { setError(`File must be under ${maxMB}MB`); return; }

    setError('');
    setUploading(true);
    setProgress(0);
    try {
      const res = await adminApi.getPresignedUrl('kwa/certificates', file.name, file.type);
      const { signedUrl, publicUrl } = res.data;
      await axios.put(signedUrl, file, {
        headers: { 'Content-Type': file.type, 'x-amz-acl': 'public-read' },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded / e.total) * 100)),
      });
      onChange(publicUrl);
    } catch {
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const filename = value ? value.split('/').pop() : '';

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium text-gray-600">
        {fileType === 'pdf' ? 'PDF File *' : 'Image File *'}
      </label>

      {value ? (
        <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl bg-gray-50">
          {fileType === 'image'
            ? <img src={value} alt="" className="w-12 h-10 object-cover rounded-lg flex-shrink-0" />
            : <FileText className="w-6 h-6 text-red-500 flex-shrink-0" />}
          <span className="flex-1 text-sm text-cyan-600 truncate">{filename}</span>
          <button type="button" onClick={() => onChange('')}
            className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={e => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition-all">
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-gray-600 font-medium">Uploading... {progress}%</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600 font-medium">
                Click or drag {fileType === 'pdf' ? 'PDF' : 'image'} here
              </p>
              <p className="text-xs text-gray-400">Up to {maxMB}MB</p>
            </div>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept={accept} className="hidden"
        onChange={e => handleFile(e.target.files[0])} />
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
};

const F = ({ label, value, onChange, dir, type = 'text' }) => (
  <div>
    <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
    <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} dir={dir}
      className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400" />
  </div>
);

export default CertificatesAdmin;
