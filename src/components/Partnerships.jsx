import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from './ui/card';
import { Send, MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

const categoryLabels = {
  government: { ar: 'الجهات الحكومية', en: 'Government Entities' },
  international: { ar: 'المنظمات الدولية', en: 'International Organizations' },
  research: { ar: 'المؤسسات البحثية والتنموية', en: 'Research & Development Institutions' },
  civil: { ar: 'المجتمع المدني والقطاع الخاص', en: 'Civil Society & Private Sector' }
};

export const Partnerships = () => {
  const { lang, str } = useLanguage();
  const [partners, setPartners] = useState([]);
  const [config, setConfig] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    Promise.all([publicApi.getPartners(), publicApi.getSiteConfig()])
      .then(([pRes, cRes]) => {
        setPartners(pRes.data.data || []);
        setConfig(cRes.data.data);
      })
      .catch(() => {});
  }, []);

  const grouped = partners.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } };

  const whatsapp = config?.social?.whatsapp;

  return (
    <>
      <section id="partnerships" className="section-padding relative overflow-hidden bg-blue-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl" />
        <div className="container-custom relative z-10">
          <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={containerVariants}>
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
                {str('شراكاتنا الاستراتيجية', 'Our Strategic Partnerships')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {str('نفخر بشراكاتنا مع مختلف الجهات المحلية والدولية لتحقيق أهدافنا في الاستدامة المائية', 'We are proud of our partnerships with various local and international entities to achieve our water sustainability goals')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(grouped).map(([category, categoryPartners]) => (
                <motion.div key={category} variants={itemVariants}>
                  <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 hover:scale-105 relative overflow-hidden">
                    <CardContent className="p-8 relative z-10">
                      <h3 className={`text-2xl font-bold text-foreground mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {lang === 'ar' ? categoryLabels[category]?.ar : categoryLabels[category]?.en}
                      </h3>
                      <div className="space-y-3">
                        {categoryPartners.map((partner, pIndex) => (
                          <motion.div key={partner._id || pIndex} initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: pIndex * 0.05 }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 border border-transparent hover:border-primary/30">
                            {partner.logo && <img src={partner.logo} alt="" className="w-8 h-8 object-contain rounded flex-shrink-0" />}
                            <div className="w-2 h-2 bg-gradient-accent rounded-full flex-shrink-0" />
                            <p className={`text-muted-foreground ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                              {lang === 'ar' ? partner.nameAr : partner.nameEn}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <motion.div variants={itemVariants} className="mt-16 relative rounded-3xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1548337138-e87d889cc369" alt="" className="w-full h-[350px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <h3 className="text-4xl font-bold mb-4">{str('هل ترغب في الشراكة معنا؟', 'Would You Like to Partner With Us?')}</h3>
                  <p className="text-xl mb-6 opacity-90">{str('نرحب بالتعاون مع جميع الجهات المهتمة بالاستدامة المائية والبيئية', 'We welcome cooperation with all entities interested in water and environmental sustainability')}</p>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors duration-300 shadow-lg">
                    {str('تواصل معنا الآن', 'Contact Us Now')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="w-full bg-white py-12 border-t border-b border-gray-100" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 p-6 md:p-10 rounded-3xl border border-blue-100/50">
            <div className={`flex-shrink-0 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">{str('النشرة الإخبارية', 'Newsletter')}</h3>
              <p className="text-slate-500 text-sm">{str('اشترك لتصلك آخر مستجدات الجمعية', 'Subscribe to receive the latest association updates')}</p>
            </div>
            <div className="flex-1 w-full">
              <form className="relative flex items-center group" onSubmit={e => e.preventDefault()}>
                <input type="email" placeholder={str('بريدك الإلكتروني', 'Your email address')}
                  className="w-full h-14 pr-6 pl-32 rounded-2xl border-2 border-slate-200 focus:border-cyan-500 focus:ring-0 transition-all text-right outline-none bg-white" />
                <button type="submit" className="absolute left-2 bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-colors">
                  <Send size={18} />
                </button>
              </form>
            </div>
            {whatsapp && (
              <div className="flex flex-col items-center gap-2 border-r border-slate-200 pr-8 hidden md:flex">
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 bg-[#25D366] text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm"
                  onClick={() => window.open(`https://wa.me/${whatsapp}`)}>
                  <MessageCircle size={18} />
                  {str('واتساب', 'WhatsApp')}
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
