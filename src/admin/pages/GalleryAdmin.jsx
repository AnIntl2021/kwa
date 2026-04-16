import { useState, useEffect, useRef } from 'react';
import { adminApi } from '../../utils/api';
import { Plus, Trash2, ToggleLeft, ToggleRight, Image, Upload } from 'lucide-react';

const GalleryAdmin = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef();

  const load = () => adminApi.getGallery().then(r => setImages(r.data.data || []));
  useEffect(() => { load(); }, []);

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 3000); };

  const handleFiles = async (files) => {
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('folder', 'kwa/gallery');
        const res = await adminApi.uploadFile(fd);
        await adminApi.createGalleryImage({ url: res.data.url, captionAr: '', captionEn: '', order: 0, isActive: true });
      }
      await load();
      showMsg(`${files.length} image(s) uploaded!`);
    } catch { showMsg('Upload error.'); }
    finally { setUploading(false); }
  };

  const del = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    await adminApi.deleteGalleryImage(id);
    await load();
    showMsg('Deleted.');
  };

  const toggle = async (item) => {
    await adminApi.updateGalleryImage(item._id, { ...item, isActive: !item.isActive });
    await load();
  };

  const updateCaption = async (item, field, val) => {
    await adminApi.updateGalleryImage(item._id, { ...item, [field]: val });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-800">Gallery ({images.length} images)</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-60"
        >
          {uploading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={e => handleFiles(e.target.files)} />

      {msg && <div className={`mb-4 px-4 py-2 rounded-xl text-sm ${msg.includes('error') || msg.includes('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{msg}</div>}

      {/* Drop zone */}
      <div
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
        onDragOver={e => e.preventDefault()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center mb-6 hover:border-cyan-400 hover:bg-cyan-50/50 transition-all cursor-pointer"
        onClick={() => fileRef.current?.click()}
      >
        <Image className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-500">Drag & drop images here, or click to select multiple files</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {images.map(img => (
          <div key={img._id} className={`relative group rounded-xl overflow-hidden border-2 ${img.isActive ? 'border-transparent' : 'border-gray-200 opacity-50'}`}>
            <img src={img.url} alt="" className="w-full aspect-square object-cover" onError={e => { e.target.src = ''; e.target.parentElement.classList.add('bg-gray-100'); }} />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
              <button onClick={() => toggle(img)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors" title={img.isActive ? 'Hide' : 'Show'}>
                {img.isActive ? <ToggleRight className="w-4 h-4 text-white" /> : <ToggleLeft className="w-4 h-4 text-white" />}
              </button>
              <button onClick={() => del(img._id)} className="w-8 h-8 bg-red-500/80 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <Trash2 className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Image className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No gallery images yet. Upload some images above.</p>
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;
