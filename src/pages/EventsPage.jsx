import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, ArrowLeft, UserPlus, X, Send } from 'lucide-react';
import PhoneInput from '../components/ui/PhoneInput';
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

const EventsPage = () => {
  const { lang, t, str } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const emptyForm = { firstName: '', middleName: '', lastName: '', designation: '', company: '', email: '', phone: '', message: '' };
  const [volunteer, setVolunteer] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const fv = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  useEffect(() => {
    publicApi.getEvents()
      .then(res => setEvents(res.data.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(lang === 'ar' ? 'ar-KW' : 'en-KW', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const openVolunteer = (event) => {
    setVolunteer(event);
    setForm(emptyForm);
    setMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email) { setMsg(str('الاسم الأول والبريد مطلوبان', 'First name and email are required')); return; }
    setSending(true);
    try {
      await publicApi.submitVolunteer({ ...form, eventName: t(volunteer, 'title') });
      setMsg(str('تم إرسال طلبك بنجاح!', 'Request submitted successfully!'));
      setTimeout(() => setVolunteer(null), 1800);
    } catch {
      setMsg(str('حدث خطأ، حاول مرة أخرى', 'Something went wrong, try again'));
    } finally {
      setSending(false);
    }
  };

  const BackArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white py-16 mb-12">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{str('الفعاليات والأحداث', 'Events & Activities')}</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              {str('تعرف على جميع فعاليات وأنشطة جمعية المياه الكويتية', 'Explore all events and activities of the Kuwait Water Association')}
            </p>
          </div>
        </div>

        <div className="container-custom">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-8 transition-colors">
            <BackArrow size={18} />
            {str('العودة للرئيسية', 'Back to Home')}
          </Link>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl">{str('لا توجد فعاليات حالياً', 'No events available at the moment')}</p>
            </div>
          ) : (
            <motion.div
              initial="hidden" animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event, index) => (
                <motion.div key={event._id || index} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} whileHover={{ y: -6 }}>
                  <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-300 flex flex-col">
                    {event.image ? (
                      <div className="h-48 overflow-hidden">
                        <img src={event.image} alt={t(event, 'title')} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      </div>
                    ) : (
                      <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    <CardContent className={`p-6 flex flex-col flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{t(event, 'title')}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{t(event, 'description')}</p>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-cyan-600">
                          <Calendar size={14} />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {(event.locationAr || event.locationEn) && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={14} />
                            <span>{t(event, 'location')}</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-auto">
                        <button
                          onClick={() => openVolunteer(event)}
                          className="w-full flex items-center justify-center gap-2 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-xl transition-colors text-sm"
                        >
                          <UserPlus size={16} />
                          {str('انضم كمتطوع', 'Join as Volunteer')}
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />

      {/* Volunteer Modal */}
      <AnimatePresence>
        {volunteer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={() => setVolunteer(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl w-full max-w-lg shadow-2xl"
              onClick={e => e.stopPropagation()}
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{str('انضم كمتطوع', 'Join as Volunteer')}</h2>
                  <p className="text-sm text-cyan-600 mt-0.5">{t(volunteer, 'title')}</p>
                </div>
                <button onClick={() => setVolunteer(null)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-3">
                {/* Name */}
                <div className="grid grid-cols-3 gap-2">
                  <VF label={str('الاسم الأول', 'First Name') + ' *'} value={form.firstName} onChange={fv('firstName')} lang={lang} />
                  <VF label={str('الاسم الأوسط', 'Middle Name')} value={form.middleName} onChange={fv('middleName')} lang={lang} />
                  <VF label={str('اسم العائلة', 'Last Name')} value={form.lastName} onChange={fv('lastName')} lang={lang} />
                </div>
                {/* Professional */}
                <div className="grid grid-cols-2 gap-2">
                  <VF label={str('المسمى الوظيفي', 'Designation')} value={form.designation} onChange={fv('designation')} lang={lang} />
                  <VF label={str('الشركة / الجهة', 'Company')} value={form.company} onChange={fv('company')} lang={lang} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{str('البريد الإلكتروني', 'Email')} *</label>
                  <input type="email" value={form.email} onChange={e => fv('email')(e.target.value)}
                    placeholder="example@domain.com" dir="ltr"
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors text-sm" />
                </div>
                <PhoneInput label={str('رقم الهاتف', 'Phone')} value={form.phone} onChange={fv('phone')} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{str('لماذا تريد التطوع؟', 'Why do you want to volunteer?')}</label>
                  <textarea rows={2} value={form.message} onChange={e => fv('message')(e.target.value)}
                    placeholder={str('اكتب رسالتك هنا...', 'Write your message here...')}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors text-sm resize-none" />
                </div>
                {msg && (
                  <p className={`text-sm text-center font-medium ${msg.includes('نجاح') || msg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>
                )}
                <button type="submit" disabled={sending}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors">
                  <Send size={16} />
                  {sending ? str('جاري الإرسال...', 'Sending...') : str('إرسال الطلب', 'Submit Request')}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const VF = ({ label, value, onChange, lang }) => (
  <div>
    <label className={`block text-xs font-medium text-gray-600 mb-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{label}</label>
    <input value={value} onChange={e => onChange(e.target.value)} dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors text-sm" />
  </div>
);

export default EventsPage;
