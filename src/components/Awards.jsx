import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from './ui/card';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

export const Awards = () => {
  const { lang, str } = useLanguage();
  const [awards, setAwards] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    Promise.all([publicApi.getAwards(), publicApi.getMemberships()])
      .then(([aRes, mRes]) => {
        setAwards(aRes.data.data || []);
        setMemberships(mRes.data.data || []);
      })
      .catch(() => {});
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <section id="awards" className="section-padding relative overflow-hidden bg-gradient-to-br from-cyan-50 to-cyan-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-accent/15 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="container-custom relative z-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={containerVariants}>
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
              {str('الجوائز والإنجازات', 'Awards & Achievements')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {str('حصلت جمعية المياه الكويتية على العديد من الجوائز والتقديرات المحلية والدولية', 'Kuwait Water Association has received numerous local and international awards and recognitions')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {awards.map((award, index) => (
              <motion.div key={award._id || index} variants={itemVariants}>
                <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 group cursor-pointer border-l-8 border-transparent hover:border-cyan-500 hover:scale-105 relative overflow-hidden">
                  <CardContent className="p-8 relative z-10">
                    <div className="flex items-start gap-6">
                      {award.image && (
                        <div className="flex-shrink-0">
                          <img src={award.image} alt={lang === 'ar' ? award.titleAr : award.titleEn} className="h-20 w-24 object-contain" />
                        </div>
                      )}
                      <div className={`flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {award.year && (
                          <div className="inline-block px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-sm font-semibold mb-3 shadow-lg">
                            {award.year}
                          </div>
                        )}
                        <h3 className="text-xl font-bold mb-3 text-gray-800">{lang === 'ar' ? award.titleAr : award.titleEn}</h3>
                        <p className="text-gray-600 leading-relaxed">{lang === 'ar' ? award.descriptionAr : award.descriptionEn}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {memberships.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-4 border-blue-300 relative overflow-hidden">
                <CardContent className="p-8 relative z-10">
                  <h3 className="text-2xl font-bold mb-6 text-center">
                    {str('العضويات', 'Memberships')} <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">{str('الدولية', 'International')}</span>
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {memberships.map((m, index) => (
                      <motion.div key={m._id || index} initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 border border-transparent hover:border-primary/20">
                        <div className="flex-shrink-0 w-2 h-2 bg-gradient-primary rounded-full mt-2" />
                        <p className={`text-muted-foreground leading-relaxed ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          {lang === 'ar' ? m.titleAr : m.titleEn}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
