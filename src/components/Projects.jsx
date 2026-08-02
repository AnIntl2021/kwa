import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { FolderOpen, X, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

const YOUTH_FORUM_FORM_URL = 'https://form.jotform.com/253071808603454';
const YOUTH_FORUM_LOGO_URL = 'https://www.jotform.com/uploads/snawara/form_files/%D8%B4%D8%B9%D8%A7%D8%B1_%D8%A7%D9%84%D9%85%D9%84%D8%AA%D9%82%D9%89_5-removebg-preview.690a30feb09ce8.57267463.png';

export const Projects = () => {
  const { lang, str } = useLanguage();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selected, setSelected] = useState(null);
  const [youthForum, setYouthForum] = useState(null);
  const [activeForm, setActiveForm] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    publicApi.getProjects()
      .then(res => setProjects(res.data.data || []))
      .catch(() => setProjects([]));
    publicApi.getSiteConfig()
      .then(res => setYouthForum(res.data.data?.youthForum || null))
      .catch(() => {});
    publicApi.getActiveForm()
      .then(res => setActiveForm(res.data.data || null))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  };

  const truncate = (html, max = 110) => {
    const text = stripHtml(html);
    return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
  };

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
              {projects.map((project, index) => {
                const title = lang === 'ar' ? project.titleAr : project.titleEn;
                const desc = lang === 'ar' ? project.descriptionAr : project.descriptionEn;
                const tags = lang === 'ar' ? project.tagsAr : project.tagsEn;
                return (
                  <motion.div key={project._id || index} variants={itemVariants} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                    <Card
                      onClick={() => setSelected(project)}
                      className="h-full overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 border-4 border-transparent hover:border-primary bg-white hover:scale-105"
                    >
                      <div className="relative h-48 overflow-hidden">
                        {project.image ? (
                          <img src={project.image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 group-hover:rotate-2" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                            <FolderOpen className="w-16 h-16 text-cyan-300" />
                          </div>
                        )}
                      </div>
                      <CardHeader>
                        <CardTitle className={`text-xl ${lang === 'ar' ? 'text-right' : 'text-left'}`}>{title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col h-full">
                        <p className={`text-muted-foreground mb-4 leading-relaxed ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          {truncate(desc)}
                        </p>
                        <div className={`flex flex-wrap gap-2 mt-auto ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                          {tags?.map((tag, ti) => (
                            <Badge key={ti} variant="secondary" className="bg-gradient-primary text-white hover:opacity-90 shadow-sm">{tag}</Badge>
                          ))}
                        </div>
                        <div className={`flex items-center gap-1 mt-4 text-sm font-medium text-cyan-600 group-hover:text-cyan-700 ${lang === 'ar' ? 'justify-end flex-row-reverse' : 'justify-start'}`}>
                          <span>{str('اقرأ المزيد', 'Read more')}</span>
                          <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${lang === 'ar' ? 'rotate-180 group-hover:-translate-x-1 group-hover:translate-x-0' : ''}`} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selected && (() => {
          const title = lang === 'ar' ? selected.titleAr : selected.titleEn;
          const desc = lang === 'ar' ? selected.descriptionAr : selected.descriptionEn;
          const tags = lang === 'ar' ? selected.tagsAr : selected.tagsEn;
          return (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              dir={lang === 'ar' ? 'rtl' : 'ltr'}
              onClick={() => setSelected(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                {selected.image && (
                  <div className="relative h-64 overflow-hidden rounded-t-2xl">
                    <img src={selected.image} alt={title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">{title}</h2>
                    <button
                      onClick={() => setSelected(null)}
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  {tags?.length > 0 && (
                    <div className={`flex flex-wrap gap-2 mb-4 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                      {tags.map((tag, ti) => (
                        <Badge key={ti} variant="secondary" className="bg-gradient-primary text-white shadow-sm">{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <div className={`text-gray-600 leading-relaxed rich-content ${lang === 'ar' ? 'text-right' : 'text-left'}`} dangerouslySetInnerHTML={{ __html: desc || '' }} />
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Youth Forum CTA */}
      {youthForum?.isVisible !== false && (
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-secondary/90 py-16 sm:py-20">
          <div className="container-custom relative z-10">
            <div className="text-center text-white max-w-3xl mx-auto px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <img
                src={YOUTH_FORUM_LOGO_URL}
                alt={str('شعار الملتقى الشبابي الكويتي العربي الخامس', '5th Kuwaiti-Arab Youth Forum logo')}
                className="w-24 h-24 md:w-28 md:h-28 object-contain mx-auto mb-5"
              />
              <h3 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                {lang === 'ar' ? (youthForum?.titleAr || str('هل أنت مستعد لتكون جزءاً من التغيير؟', 'Ready to Be Part of the Change?')) : (youthForum?.titleEn || str('هل أنت مستعد لتكون جزءاً من التغيير؟', 'Ready to Be Part of the Change?'))}
              </h3>
              {(lang === 'ar' ? youthForum?.descriptionTopAr : youthForum?.descriptionTopEn) && (
                <div
                  className="text-lg sm:text-xl mb-8 opacity-90 rich-content"
                  dangerouslySetInnerHTML={{ __html: lang === 'ar' ? youthForum.descriptionTopAr : youthForum.descriptionTopEn }}
                />
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.open(YOUTH_FORUM_FORM_URL, '_blank', 'noopener,noreferrer')}
                className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-colors duration-300 shadow-lg"
              >
                {lang === 'ar' ? (youthForum?.buttonTextAr || str('سجل الآن وانضم إلينا', 'Register Now & Join Us')) : (youthForum?.buttonTextEn || str('سجل الآن وانضم إلينا', 'Register Now & Join Us'))}
              </motion.button>
            </div>
          </div>
        </section>
      )}

      {/* Active Custom Form Banner */}
      {activeForm && (
        <section className="relative overflow-hidden bg-gradient-to-r from-primary/90 to-secondary/90 py-16 sm:py-20 mt-8">
          <style>{`
            .banner-description * {
              background-color: transparent !important;
              background: transparent !important;
              color: white !important;
            }
          `}</style>
          <div className="container-custom relative z-10">
            <div className="text-center text-white max-w-3xl mx-auto px-4" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
              <h3 className="text-3xl sm:text-4xl font-bold mb-4 leading-tight">
                {lang === 'ar' ? (activeForm.titleAr || activeForm.titleEn) : activeForm.titleEn}
              </h3>
              {(lang === 'ar' ? activeForm.descriptionAr : activeForm.descriptionEn) && (
                <div
                  className="text-lg sm:text-xl mb-8 opacity-90 rich-content text-white banner-description"
                  dangerouslySetInnerHTML={{ __html: lang === 'ar' ? activeForm.descriptionAr : activeForm.descriptionEn }}
                />
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(`/${activeForm.slug}`)}
                className="inline-flex items-center justify-center bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-colors duration-300 shadow-lg"
              >
                {lang === 'ar' ? 'سجل الآن وانضم إلينا' : 'Register Now & Join Us'}
              </motion.button>
            </div>
          </div>
        </section>
      )}
    </>
  );
};
