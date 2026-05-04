import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { publicFormApi } from '../utils/api';
import { CheckCircle, AlertCircle, Paperclip, X } from 'lucide-react';
import axios from 'axios';

const CustomFormPage = () => {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [values, setValues] = useState({});
  const [fileValues, setFileValues] = useState({});   // id → File object
  const [uploadProgress, setUploadProgress] = useState({});  // id → 0-100
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setSubmitted(false);
    setValues({});
    setFileValues({});
    setUploadProgress({});
    publicFormApi.getForm(slug)
      .then(res => { setForm(res.data.data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const missing = form.fields.filter(f => {
      if (!f.required) return false;
      if (f.type === 'file') return !fileValues[f.id] && !values[f.id];
      return !values[f.id];
    });
    if (missing.length > 0) {
      setError(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      const finalValues = { ...values };

      // Upload any pending file fields first
      const fileFields = form.fields.filter(f => f.type === 'file' && fileValues[f.id]);
      for (const field of fileFields) {
        const file = fileValues[field.id];
        setUploadProgress(p => ({ ...p, [field.id]: 0 }));
        const res = await publicFormApi.getUploadUrl(file.name, file.type);
        const { signedUrl, publicUrl } = res.data;
        await axios.put(signedUrl, file, {
          headers: { 'Content-Type': file.type, 'x-amz-acl': 'public-read' },
          onUploadProgress: (ev) =>
            setUploadProgress(p => ({ ...p, [field.id]: Math.round((ev.loaded / ev.total) * 100) })),
        });
        finalValues[field.id] = publicUrl;
      }

      await publicFormApi.submit(slug, finalValues);
      setSubmitted(true);
    } catch {
      setError(isAr ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
      setUploadProgress({});
    }
  };

  const set = (id, v) => setValues(s => ({ ...s, [id]: v }));
  const setFile = (id, file) => setFileValues(s => ({ ...s, [id]: file }));

  const renderField = (field) => {
    const ph = isAr ? field.placeholderAr : field.placeholderEn;
    const val = values[field.id] || '';
    const base = 'w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors';

    switch (field.type) {
      case 'file':
        return <FileField field={field} fileValues={fileValues} uploadProgress={uploadProgress} setFile={setFile} isAr={isAr} />;
      case 'textarea':
        return (
          <textarea value={val} onChange={e => set(field.id, e.target.value)}
            placeholder={ph} rows={4} dir={isAr ? 'rtl' : 'ltr'}
            className={`${base} resize-none`} />
        );
      case 'select':
        return (
          <select value={val} onChange={e => set(field.id, e.target.value)}
            dir={isAr ? 'rtl' : 'ltr'} className={base}>
            <option value="">{isAr ? 'اختر...' : 'Select...'}</option>
            {(field.options || []).map((opt, i) => (
              <option key={i} value={opt.value}>{isAr ? opt.labelAr : opt.labelEn}</option>
            ))}
          </select>
        );
      case 'radio':
        return (
          <div className={`space-y-2 ${isAr ? 'text-right' : ''}`}>
            {(field.options || []).map((opt, i) => (
              <label key={i} className={`flex items-center gap-2 cursor-pointer ${isAr ? 'flex-row-reverse justify-end' : ''}`}>
                <input type="radio" name={field.id} value={opt.value}
                  checked={val === opt.value} onChange={e => set(field.id, e.target.value)}
                  className="w-4 h-4 accent-cyan-500" />
                <span className="text-sm text-gray-700">{isAr ? opt.labelAr : opt.labelEn}</span>
              </label>
            ))}
          </div>
        );
      case 'date':
        return <input type="date" value={val} onChange={e => set(field.id, e.target.value)} className={base} />;
      case 'number':
        return <input type="number" value={val} onChange={e => set(field.id, e.target.value)} placeholder={ph} className={base} />;
      case 'email':
        return <input type="email" value={val} onChange={e => set(field.id, e.target.value)} placeholder={ph} dir="ltr" className={base} />;
      default:
        return (
          <input type={field.type === 'phone' ? 'tel' : 'text'} value={val}
            onChange={e => set(field.id, e.target.value)} placeholder={ph}
            dir={isAr ? 'rtl' : 'ltr'} className={base} />
        );
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex-1 flex items-center justify-center" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="text-center">
          <p className="text-6xl font-bold text-gray-200 mb-4">404</p>
          <p className="text-gray-500 text-lg">{isAr ? 'النموذج غير موجود' : 'Form not found'}</p>
        </div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1 py-16 px-4" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Header gradient */}
            <div className="bg-gradient-to-r from-cyan-600 to-blue-700 p-8 text-white">
              <h1 className="text-2xl font-bold leading-tight mb-2">
                {isAr ? form.titleAr || form.titleEn : form.titleEn}
              </h1>
              {(isAr ? form.descriptionAr : form.descriptionEn) && (
                <div
                  className="text-white/80 text-sm leading-relaxed rich-content"
                  dangerouslySetInnerHTML={{ __html: isAr ? form.descriptionAr : form.descriptionEn }}
                />
              )}
            </div>

            <div className="p-8">
              {submitted ? (
                <div className="text-center py-10">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-lg font-semibold text-gray-800">
                    {isAr ? form.successMessageAr : form.successMessageEn}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {form.fields.map(field => (
                    <div key={field.id}>
                      <label className={`block text-sm font-medium text-gray-700 mb-1.5 ${isAr ? 'text-right' : ''}`}>
                        {isAr ? field.labelAr || field.labelEn : field.labelEn}
                        {field.required && <span className="text-red-500 ms-1">*</span>}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}

                  {(isAr ? form.descriptionBotAr : form.descriptionBotEn) && (
                    <div
                      className={`text-gray-600 text-sm leading-relaxed rich-content ${isAr ? 'text-right' : 'text-left'}`}
                      dangerouslySetInnerHTML={{ __html: isAr ? form.descriptionBotAr : form.descriptionBotEn }}
                    />
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 px-4 py-3 rounded-xl">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  )}

                  <button type="submit" disabled={submitting}
                    className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold disabled:opacity-60 transition-colors text-sm">
                    {submitting
                      ? (isAr ? 'جاري الإرسال...' : 'Submitting...')
                      : (isAr ? 'إرسال' : 'Submit')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const FileField = ({ field, fileValues, uploadProgress, setFile, isAr }) => {
  const fileRef = useRef();
  const file = fileValues[field.id];
  const progress = uploadProgress[field.id];

  return (
    <div>
      {file ? (
        <div className="flex items-center gap-3 px-4 py-3 border-2 border-cyan-300 bg-cyan-50 rounded-xl">
          <Paperclip className="w-4 h-4 text-cyan-500 flex-shrink-0" />
          <span className="flex-1 text-sm text-gray-700 truncate">{file.name}</span>
          <span className="text-xs text-gray-400 flex-shrink-0">
            {(file.size / 1024 / 1024).toFixed(1)} MB
          </span>
          {progress !== undefined ? (
            <span className="text-xs text-cyan-600 font-medium flex-shrink-0">{progress}%</span>
          ) : (
            <button type="button" onClick={() => setFile(field.id, null)}
              className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-200 hover:bg-red-100 flex-shrink-0 transition-colors">
              <X className="w-3.5 h-3.5 text-gray-500 hover:text-red-500" />
            </button>
          )}
        </div>
      ) : (
        <div
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition-all"
        >
          <Paperclip className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-500">
            {isAr ? 'انقر لاختيار ملف' : 'Click to choose a file'}
          </span>
          {field.accept && (
            <span className="ms-auto text-xs text-gray-400">{field.accept}</span>
          )}
        </div>
      )}
      <input
        ref={fileRef}
        type="file"
        accept={field.accept || undefined}
        className="hidden"
        onChange={e => setFile(field.id, e.target.files[0] || null)}
      />
      {progress !== undefined && (
        <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-cyan-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
};

export default CustomFormPage;
