import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, FileText, Download, Eye, X, ZoomIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

export const Certificates = () => {
  const { lang, str } = useLanguage();
  const [certificates, setCertificates] = useState([]);
  const [preview, setPreview] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  useEffect(() => {
    publicApi.getCertificates()
      .then(res => setCertificates(res.data.data || []))
      .catch(() => setCertificates([]));
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setPreview(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (certificates.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <section id="certificates" className="section-padding bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="container-custom">
          <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={containerVariants}>
            {/* Heading */}
            <motion.div variants={itemVariants} className="text-center mb-14">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-50 mb-4">
                <Award className="w-7 h-7 text-cyan-500" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
                {str('الشهادات والاعتمادات', 'Certificates & Accreditations')}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {str('شهادات واعتمادات جمعية المياه الكويتية', 'Kuwait Water Association certificates and accreditations')}
              </p>
            </motion.div>

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {certificates.map((cert) => {
                const title = lang === 'ar' ? cert.titleAr || cert.titleEn : cert.titleEn || cert.titleAr;
                return (
                  <motion.div key={cert._id} variants={itemVariants} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                    <div className="group bg-white border-2 border-gray-100 hover:border-cyan-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
                      {/* Thumbnail */}
                      <div
                        className="relative h-48 bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center overflow-hidden cursor-pointer"
                        onClick={() => setPreview(cert)}
                      >
                        {cert.fileType === 'image' ? (
                          <>
                            <img src={cert.fileUrl} alt={title}
                              className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-col items-center gap-3">
                              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                <FileText className="w-9 h-9 text-red-500" />
                              </div>
                              <span className="text-xs font-bold tracking-widest text-red-400 uppercase">PDF</span>
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all flex items-center justify-center">
                              <Eye className="w-8 h-8 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                          </>
                        )}
                      </div>

                      {/* Footer */}
                      {(title || cert.fileType === 'pdf') && (
                        <div className="px-4 py-3 flex items-center justify-between gap-2 border-t border-gray-100">
                          {title && (
                            <p className={`text-sm font-medium text-gray-700 leading-tight flex-1 truncate ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                              {title}
                            </p>
                          )}
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button onClick={() => setPreview(cert)}
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-cyan-100 text-gray-500 hover:text-cyan-600 transition-colors" title="Preview">
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer" download
                              className="p-1.5 rounded-lg bg-gray-100 hover:bg-cyan-100 text-gray-500 hover:text-cyan-600 transition-colors" title="Download">
                              <Download className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden"
              style={{ maxWidth: preview.fileType === 'pdf' ? '900px' : '700px', maxHeight: '90vh' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0">
                <p className="font-semibold text-gray-800 truncate flex-1 mr-4">
                  {lang === 'ar' ? preview.titleAr || preview.titleEn : preview.titleEn || preview.titleAr}
                </p>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={preview.fileUrl} target="_blank" rel="noopener noreferrer" download
                    className="inline-flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    <Download className="w-4 h-4" />
                    {str('تحميل', 'Download')}
                  </a>
                  <button onClick={() => setPreview(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden bg-gray-50 flex items-center justify-center">
                {preview.fileType === 'image' ? (
                  <img src={preview.fileUrl}
                    alt={lang === 'ar' ? preview.titleAr : preview.titleEn}
                    className="max-w-full max-h-full object-contain p-4" />
                ) : (
                  <iframe
                    src={`${preview.fileUrl}#toolbar=1&navpanes=0`}
                    className="w-full border-0"
                    style={{ height: 'calc(90vh - 73px)' }}
                    title={preview.titleEn}
                  />
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Certificates;
