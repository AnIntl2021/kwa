import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { publicFormApi } from '../utils/api';
import { CheckCircle, AlertCircle } from 'lucide-react';

const CustomFormPage = () => {
  const { slug } = useParams();
  const { lang } = useLanguage();
  const isAr = lang === 'ar';

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [values, setValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    setSubmitted(false);
    setValues({});
    publicFormApi.getForm(slug)
      .then(res => { setForm(res.data.data); setLoading(false); })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const missing = form.fields.filter(f => f.required && !values[f.id]);
    if (missing.length > 0) {
      setError(isAr ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    try {
      await publicFormApi.submit(slug, values);
      setSubmitted(true);
    } catch {
      setError(isAr ? 'حدث خطأ، يرجى المحاولة مرة أخرى' : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const set = (id, v) => setValues(s => ({ ...s, [id]: v }));

  const renderField = (field) => {
    const ph = isAr ? field.placeholderAr : field.placeholderEn;
    const val = values[field.id] || '';
    const base = 'w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-colors';

    switch (field.type) {
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

export default CustomFormPage;
