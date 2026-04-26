import { useState, useRef } from 'react';
import { FileText, X, Upload } from 'lucide-react';
import { adminApi } from '../../utils/api';
import axios from 'axios';

const PdfUpload = ({ value, onChange, folder = 'publications', label = 'Upload PDF' }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileRef = useRef();

  const handleFile = async (file) => {
    if (!file) return;
    if (file.type !== 'application/pdf') { setError('Only PDF files are allowed'); return; }
    if (file.size > 100 * 1024 * 1024) { setError('File must be under 100MB'); return; }

    setError('');
    setUploading(true);
    setProgress(0);

    try {
      // Step 1: get presigned URL from our backend (tiny request, no 413 issue)
      const res = await adminApi.getPresignedUrl(folder, file.name, file.type);
      const { signedUrl, publicUrl } = res.data;

      // Step 2: upload directly from browser to Spaces (bypasses server/Nginx)
      await axios.put(signedUrl, file, {
        headers: { 'Content-Type': file.type, 'x-amz-acl': 'public-read' },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded / e.total) * 100));
        }
      });

      onChange(publicUrl);
    } catch (err) {
      setError('Upload failed. Please try again.');
      console.error(err);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const filename = value ? value.split('/').pop() : '';

  return (
    <div className="space-y-2">
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}

      {value ? (
        <div className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-xl bg-gray-50">
          <FileText className="w-6 h-6 text-red-500 flex-shrink-0" />
          <a href={value} target="_blank" rel="noopener noreferrer"
            className="flex-1 text-sm text-cyan-600 hover:underline truncate">{filename}</a>
          <button type="button" onClick={() => onChange('')}
            className="w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors flex-shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && fileRef.current?.click()}
          onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
          onDragOver={e => e.preventDefault()}
          className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition-all"
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-sm text-gray-600 font-medium">Uploading... {progress}%</p>
              <p className="text-xs text-gray-400">Large files may take a moment</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <p className="text-sm text-gray-600 font-medium">Click or drag PDF here</p>
              <p className="text-xs text-gray-400">PDF up to 100MB — uploads directly to storage</p>
            </div>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept="application/pdf" className="hidden"
        onChange={e => handleFile(e.target.files[0])} />

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default PdfUpload;
