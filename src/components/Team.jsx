import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from './ui/card';
import { Users, Quote } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

export const Team = () => {
  const { lang, t, str } = useLanguage();
  const [team, setTeam] = useState([]);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    publicApi.getTeam()
      .then(res => setTeam(res.data.data || []))
      .catch(() => setTeam([]));
  }, []);

  const chairman = team.find(m => m.isChairman);
  const members = team.filter(m => !m.isChairman);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  if (team.length === 0) return null;

  return (
    <section id="team" className="section-padding relative overflow-hidden bg-gradient-to-br from-white via-cyan-50 to-blue-50">
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl" />

      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="text-cyan-500" size={32} />
              <h2 className="text-4xl sm:text-5xl font-bold text-cyan-500">
                {str('فريقنا', 'Our Team')}
              </h2>
            </div>
            <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full mx-auto" />
          </motion.div>

          {/* Chairman Section */}
          {chairman && (
            <motion.div variants={itemVariants} className="mb-16">
              <Card className="bg-gradient-to-br from-cyan-700 to-blue-800 text-white overflow-hidden relative border-0 shadow-2xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
                <CardContent className="p-8 md:p-12 relative z-10">
                  <div className={`flex flex-col md:flex-row items-center gap-8 ${lang === 'ar' ? 'md:flex-row-reverse' : ''}`}>
                    {/* Photo */}
                    <div className="flex-shrink-0">
                      <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-2xl bg-white/10 flex items-center justify-center">
                        {chairman.photo ? (
                          <img src={chairman.photo} alt={t(chairman, 'name')} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-20 h-20 text-white/50" />
                        )}
                      </div>
                    </div>
                    {/* Content */}
                    <div className={`flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                      <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-semibold mb-4">
                        {str('كلمة الرئيس', "Chairman's Message")}
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-1">{t(chairman, 'name')}</h3>
                      <p className="text-white/80 mb-6 font-medium">{t(chairman, 'designation')}</p>
                      {(chairman.chairmanMessageAr || chairman.chairmanMessageEn) && (
                        <div className="relative">
                          <Quote className="absolute -top-2 opacity-30 w-8 h-8" style={lang === 'ar' ? { right: '-8px' } : { left: '-8px' }} />
                          <p className="text-white/90 leading-relaxed text-lg px-6 italic">
                            {lang === 'ar' ? chairman.chairmanMessageAr : chairman.chairmanMessageEn}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Team Members Grid */}
          {members.length > 0 && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member, index) => (
                <motion.div key={member._id || index} variants={itemVariants} whileHover={{ y: -6 }}>
                  <Card className="h-full text-center hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-300 bg-white group">
                    <CardContent className="p-6">
                      <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-cyan-100 group-hover:border-cyan-300 transition-colors bg-cyan-50 flex items-center justify-center shadow-lg">
                        {member.photo ? (
                          <img src={member.photo} alt={t(member, 'name')} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-12 h-12 text-cyan-300" />
                        )}
                      </div>
                      <h4 className="text-lg font-bold text-gray-800 mb-1">{t(member, 'name')}</h4>
                      <p className="text-sm text-cyan-600 font-medium">{t(member, 'designation')}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};
