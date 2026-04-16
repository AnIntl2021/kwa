import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Droplets, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

export const Footer = () => {
  const { lang, str } = useLanguage();
  const [config, setConfig] = useState(null);
  const [nlEmail, setNlEmail] = useState('');
  const [nlMsg, setNlMsg] = useState('');
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    publicApi.getSiteConfig()
      .then(res => setConfig(res.data.data))
      .catch(() => {});
  }, []);

  const handleNewsletter = async () => {
    if (!nlEmail) return;
    try {
      const res = await publicApi.submitNewsletter(nlEmail);
      setNlMsg(res.data.message === 'Already subscribed'
        ? str('أنت مشترك بالفعل', 'Already subscribed')
        : str('تم الاشتراك!', 'Subscribed!'));
      setNlEmail('');
    } catch {
      setNlMsg(str('حدث خطأ', 'Error'));
    } finally {
      setTimeout(() => setNlMsg(''), 3000);
    }
  };

  const social = config?.social || {};
  const footerDesc = lang === 'ar'
    ? (config?.footerDescriptionAr || 'جمعية نفع عام تأسست بموجب القرار الوزاري رقم 87 لسنة 2012')
    : (config?.footerDescriptionEn || 'A public benefit association founded under Ministerial Decree No. 87 of 2012');

  const quickLinks = [
    { nameAr: 'الرئيسية', nameEn: 'Home', href: '#hero', isAnchor: true },
    { nameAr: 'من نحن', nameEn: 'About', href: '#about', isAnchor: true },
    { nameAr: 'المشاريع', nameEn: 'Projects', href: '#projects', isAnchor: true },
    { nameAr: 'أخبار ووسائل إعلام', nameEn: 'News & Media', href: '#gallery', isAnchor: true },
    { nameAr: 'اتصل بنا', nameEn: 'Contact', href: '#contact', isAnchor: true },
  ];

  const resources = [
    { nameAr: 'الجوائز والإنجازات', nameEn: 'Awards', href: '#awards', isAnchor: true },
    { nameAr: 'الشراكات', nameEn: 'Partnerships', href: '#partnerships', isAnchor: true },
    { nameAr: 'الفعاليات والأحداث', nameEn: 'Events', href: '/events', isAnchor: false },
    { nameAr: 'المطبوعات', nameEn: 'Publications', href: '/publications', isAnchor: false },
  ];

  const socialIcons = [
    { icon: Twitter, href: social.twitter || '#', label: 'Twitter' },
    { icon: Instagram, href: social.instagram || '#', label: 'Instagram' },
    { icon: Youtube, href: social.youtube || '#', label: 'Youtube' },
  ];

  const scrollToSection = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer className="bg-gradient-to-br from-primary via-secondary to-primary-dark text-white pt-16 pb-8 relative overflow-hidden" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success rounded-full blur-3xl" />
      </div>
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div className={`flex items-center gap-3 mb-6 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <img src="https://customer-assets.emergentagent.com/job_b4947f91-cc89-422e-b6c2-759af70d53ff/artifacts/bo5n5bu5_kwa%20logo.png" alt="KWA" className="h-16 w-16 object-contain bg-white rounded-full p-2" />
              <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                <h3 className="text-xl font-bold">{str('جمعية المياه الكويتية', 'Kuwait Water Association')}</h3>
                <p className="text-sm text-white/80">{str('Kuwait Water Association', 'جمعية المياه الكويتية')}</p>
              </div>
            </div>
            <p className={`text-white/80 leading-relaxed mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{footerDesc}</p>
            <div className={`flex gap-3 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
              {socialIcons.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.a key={i} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300">
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }} className={lang === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-bold mb-6">{str('روابط سريعة', 'Quick Links')}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button onClick={() => scrollToSection(link.href)} className="text-white/80 hover:text-white transition-colors duration-300">
                    {lang === 'ar' ? link.nameAr : link.nameEn}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }} className={lang === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-bold mb-6">{str('المصادر', 'Resources')}</h4>
            <ul className="space-y-3">
              {resources.map((link, index) => (
                <li key={index}>
                  {link.isAnchor ? (
                    <button onClick={() => scrollToSection(link.href)} className="text-white/80 hover:text-white transition-colors duration-300">
                      {lang === 'ar' ? link.nameAr : link.nameEn}
                    </button>
                  ) : (
                    <Link to={link.href} className="text-white/80 hover:text-white transition-colors duration-300">
                      {lang === 'ar' ? link.nameAr : link.nameEn}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className={lang === 'ar' ? 'text-right' : 'text-left'}>
            <h4 className="text-lg font-bold mb-6">{str('النشرة الإخبارية', 'Newsletter')}</h4>
            <p className="text-white/80 mb-4 text-sm leading-relaxed">
              {str('اشترك في نشرتنا الإخبارية للحصول على آخر الأخبار والتحديثات', 'Subscribe to our newsletter for the latest news and updates')}
            </p>
            <div className={`flex gap-2 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
              <Button size="icon" onClick={handleNewsletter} className="bg-white text-primary hover:bg-white/90 flex-shrink-0">
                <Mail className="h-5 w-5" />
              </Button>
              <input type="email" value={nlEmail} onChange={e => setNlEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleNewsletter()}
                placeholder={str('بريدك الإلكتروني', 'Your email')}
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 text-right focus:outline-none focus:border-white/40 transition-colors duration-300" />
            </div>
            {nlMsg && <p className="text-xs mt-2 text-white/80 text-center">{nlMsg}</p>}
          </motion.div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
            <p>{str(`© ${currentYear} جمعية المياه الكويتية. جميع الحقوق محفوظة.`, `© ${currentYear} Kuwait Water Association. All rights reserved.`)}</p>
            <div className="flex gap-6">
              <button className="hover:text-white transition-colors duration-300">{str('سياسة الخصوصية', 'Privacy Policy')}</button>
              <button className="hover:text-white transition-colors duration-300">{str('شروط الاستخدام', 'Terms of Use')}</button>
            </div>
          </div>
        </div>
      </div>

      <motion.div className="fixed bottom-8 left-8 z-40" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}>
        <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} size="icon"
          className="w-12 h-12 rounded-full bg-gradient-vibrant text-white shadow-colorful hover:scale-110 transition-transform duration-300" aria-label="Back to top">
          <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <Droplets className="h-6 w-6" />
          </motion.div>
        </Button>
      </motion.div>
    </footer>
  );
};
