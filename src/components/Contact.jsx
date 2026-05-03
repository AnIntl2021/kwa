import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from './ui/card';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import PhoneInput from './ui/PhoneInput';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

export const Contact = () => {
  const { lang, str } = useLanguage();
  const [config, setConfig] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const emptyForm = { firstName: '', middleName: '', lastName: '', designation: '', company: '', email: '', phone: '', landline: '', message: '' };
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [msg, setMsg] = useState('');
  const f = (k) => (v) => setForm(p => ({ ...p, [k]: v }));

  const handleSend = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email) { setMsg(str('الاسم الأول والبريد مطلوبان', 'First name and email are required')); return; }
    setSending(true);
    try {
      await publicApi.submitContact(form);
      setMsg(str('تم إرسال رسالتك بنجاح!', 'Message sent successfully!'));
      setForm(emptyForm);
    } catch {
      setMsg(str('حدث خطأ، حاول مرة أخرى', 'Something went wrong, try again'));
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    publicApi.getSiteConfig()
      .then(res => setConfig(res.data.data))
      .catch(() => {});
  }, []);

  const contact = config?.contact;
  const email = contact?.email || 'info@kwa.org.kw';
  const phone = contact?.phone || '+965 99881724';
  const address = lang === 'ar' ? (contact?.addressAr || '') : (contact?.addressEn || '');

  const contactInfo = [
    { icon: Mail, title: str('البريد الإلكتروني', 'Email'), value: email, link: `mailto:${email}` },
    { icon: Phone, title: str('الهاتف', 'Phone'), value: phone, link: `tel:${phone.replace(/\s/g, '')}` },
    { icon: MapPin, title: str('العنوان', 'Address'), value: address, link: null }
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="container-custom relative z-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={containerVariants}>
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
              {str('تواصل معنا', 'Contact Us')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {str('نسعد بتواصلكم معنا للاستفسارات أو الشراكات أو الدعم', 'We are happy to hear from you for inquiries, partnerships, or support')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Contact Info */}
            <motion.div variants={itemVariants}>
              <Card className="h-full bg-white border-4 border-blue-300 hover:border-blue-500 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className={`text-2xl font-bold mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                      {str('معلومات الاتصال', 'Contact Information')}
                    </span>
                  </h3>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      const content = (
                        <div className={`flex items-start gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 transition-all duration-300 border-2 border-transparent hover:border-cyan-300 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary via-secondary to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                          <div className={`flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                            <p className="text-sm font-medium text-muted-foreground mb-1">{info.title}</p>
                            <p className="text-foreground font-medium">{info.value}</p>
                          </div>
                        </div>
                      );
                      return info.link ? (
                        <a key={index} href={info.link} className="block">{content}</a>
                      ) : (
                        <div key={index}>{content}</div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants}>
              <Card className="h-full bg-white border-4 border-cyan-300 hover:border-cyan-500 hover:shadow-2xl transition-all duration-300">
                <CardContent className="p-8">
                  <h3 className={`text-2xl font-bold mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                    <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      {str('أرسل رسالة', 'Send a Message')}
                    </span>
                  </h3>
                  <form onSubmit={handleSend} className="space-y-4">
                    {/* Name row */}
                    <div className="grid grid-cols-3 gap-2">
                      <TF label={str('الاسم الأول', 'First Name') + ' *'} value={form.firstName} onChange={f('firstName')} lang={lang} />
                      <TF label={str('الاسم الأوسط', 'Middle Name')} value={form.middleName} onChange={f('middleName')} lang={lang} />
                      <TF label={str('اسم العائلة', 'Last Name')} value={form.lastName} onChange={f('lastName')} lang={lang} />
                    </div>
                    {/* Professional */}
                    <div className="grid grid-cols-2 gap-2">
                      <TF label={str('المسمى الوظيفي', 'Designation')} value={form.designation} onChange={f('designation')} lang={lang} />
                      <TF label={str('الشركة / الجهة', 'Company')} value={form.company} onChange={f('company')} lang={lang} />
                    </div>
                    {/* Email */}
                    <div>
                      <label className={`block text-sm font-medium text-gray-700 mb-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{str('البريد الإلكتروني', 'Email')} *</label>
                      <input type="email" value={form.email} onChange={e => f('email')(e.target.value)}
                        placeholder="example@domain.com" dir="ltr"
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors text-sm" />
                    </div>
                    <PhoneInput label={str('رقم الجوال', 'Mobile Phone')} value={form.phone} onChange={f('phone')} />
                    <div>
                      <label className={`block text-sm font-medium text-gray-700 mb-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {str('رقم الهاتف الأرضي', 'Landline Number')}
                      </label>
                      <div className="flex" dir="ltr">
                        <span className="flex items-center px-3 h-[42px] border-2 border-r-0 border-gray-200 rounded-l-xl bg-gray-50 text-gray-500 text-sm">📞</span>
                        <input type="tel" value={form.landline}
                          onChange={e => f('landline')(e.target.value.replace(/[^0-9\s\-+]/g, ''))}
                          placeholder="e.g. +965 2200 0000"
                          className="flex-1 px-3 h-[42px] border-2 border-gray-200 rounded-r-xl focus:border-cyan-400 focus:outline-none transition-colors text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className={`block text-sm font-medium text-gray-700 mb-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{str('الرسالة', 'Message')}</label>
                      <textarea rows={3} value={form.message} onChange={e => f('message')(e.target.value)}
                        placeholder={str('اكتب رسالتك هنا...', 'Write your message here...')} dir={lang === 'ar' ? 'rtl' : 'ltr'}
                        className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors text-sm resize-none" />
                    </div>
                    {msg && <p className={`text-sm text-center font-medium ${msg.includes('نجاح') || msg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
                    <button type="submit" disabled={sending}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-60 text-white font-bold rounded-xl transition-colors">
                      <Send className="w-4 h-4" />
                      {sending ? str('جاري الإرسال...', 'Sending...') : str('إرسال الرسالة', 'Send Message')}
                    </button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const TF = ({ label, value, onChange, lang }) => (
  <div>
    <label className={`block text-xs font-medium text-gray-600 mb-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{label}</label>
    <input value={value} onChange={e => onChange(e.target.value)} dir={lang === 'ar' ? 'rtl' : 'ltr'}
      className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:border-cyan-400 focus:outline-none transition-colors text-sm" />
  </div>
);
