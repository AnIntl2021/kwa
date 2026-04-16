import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Eye, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

export const About = () => {
  const { lang, str } = useLanguage();
  const [config, setConfig] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    publicApi.getSiteConfig()
      .then(res => setConfig(res.data.data))
      .catch(() => {});
  }, []);

  const about = config?.about;
  const vision = lang === 'ar' ? (about?.visionAr || '') : (about?.visionEn || '');
  const mission = lang === 'ar' ? (about?.missionAr || '') : (about?.missionEn || '');
  const objectives = lang === 'ar' ? (about?.objectivesAr || []) : (about?.objectivesEn || []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <section id="about" className="section-padding relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-cyan-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl" />
      <div className="container-custom relative z-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={containerVariants}>
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
              {str('من نحن', 'About Us')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {str('جمعية المياه الكويتية - جمعية نفع عام تأسست بموجب القرار الوزاري رقم 87 لسنة 2012', 'Kuwait Water Association - A public benefit association founded under Ministerial Decree No. 87 of 2012')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-2xl transition-all duration-300 border-4 border-cyan-300 hover:border-cyan-500 hover:scale-105 relative overflow-hidden">
                <CardContent className="p-8 text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl mb-6 shadow-2xl">
                    <Eye className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{str('الرؤية', 'Vision')}</h3>
                  <p className="text-muted-foreground leading-relaxed">{vision}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-2xl transition-all duration-300 border-4 border-emerald-300 hover:border-emerald-500 hover:scale-105 relative overflow-hidden">
                <CardContent className="p-8 text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success via-emerald-500 to-teal-500 rounded-3xl mb-6 shadow-2xl">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-success to-emerald-600 bg-clip-text text-transparent">{str('الرسالة', 'Mission')}</h3>
                  <p className="text-muted-foreground leading-relaxed">{mission}</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-2xl transition-all duration-300 border-4 border-cyan-300 hover:border-cyan-500 hover:scale-105 relative overflow-hidden">
                <CardContent className="p-8 text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl mb-6 shadow-2xl">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{str('الأهداف', 'Objectives')}</h3>
                  <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
                    <ul className="space-y-3">
                      {objectives.map((obj, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
