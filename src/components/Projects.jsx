import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FolderOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

export const Projects = () => {
  const { lang, str } = useLanguage();
  const [projects, setProjects] = useState([]);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    publicApi.getProjects()
      .then(res => setProjects(res.data.data || []))
      .catch(() => setProjects([]));
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <>
      <section id="projects" className="section-padding relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        <div className="container-custom relative z-10">
          <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={containerVariants}>
            <motion.div variants={itemVariants} className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
                {str('مشاريعنا وبرامجنا', 'Our Projects & Programs')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {str('نفذت جمعية المياه الكويتية العديد من المشاريع والبرامج المبتكرة لتحقيق الكفاءة المائية والاستدامة', 'Kuwait Water Association has implemented numerous innovative projects and programs to achieve water efficiency and sustainability')}
              </p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div key={project._id || index} variants={itemVariants} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 border-4 border-transparent hover:border-primary bg-white hover:scale-105">
                    <div className="relative h-48 overflow-hidden">
                      {project.image ? (
                        <img src={project.image} alt={lang === 'ar' ? project.titleAr : project.titleEn} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 group-hover:rotate-2" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                          <FolderOpen className="w-16 h-16 text-cyan-300" />
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <CardTitle className={`text-xl ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {lang === 'ar' ? project.titleAr : project.titleEn}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col h-full">
                      <p className={`text-muted-foreground mb-4 leading-relaxed ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {lang === 'ar' ? project.descriptionAr : project.descriptionEn}
                      </p>
                      <div className={`flex flex-wrap gap-2 mt-auto ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        {(lang === 'ar' ? project.tagsAr : project.tagsEn)?.map((tag, ti) => (
                          <Badge key={ti} variant="secondary" className="bg-gradient-primary text-white hover:opacity-90 shadow-sm">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Youth Forum CTA */}
      <section className="section-padding relative overflow-hidden bg-blue-50">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h3 className="text-4xl font-bold mb-4">{str('هل أنت مستعد لتكون جزءاً من التغيير؟', 'Ready to Be Part of the Change?')}</h3>
            <p className="text-xl mb-6 opacity-90">
              {str('ندعو جميع الشباب المبدعين للانضمام إلينا في الملتقى الشبابي الكويتي العربي الخامس.', 'We invite all creative youth to join us at the 5th Kuwaiti-Arab Youth Forum.')}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/youthForum.html'}
              className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors duration-300 shadow-lg"
            >
              {str('سجل الآن وانضم إلينا', 'Register Now & Join Us')}
            </motion.button>
          </div>
        </div>
      </section>
    </>
  );
};
