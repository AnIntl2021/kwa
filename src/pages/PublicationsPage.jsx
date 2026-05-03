import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Download, ArrowRight, ArrowLeft, BookOpen, Eye, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

const PublicationsPage = () => {
  const { lang, t, str } = useLanguage();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    publicApi.getPublications()
      .then(res => setPublications(res.data.data || []))
      .catch(() => setPublications([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (lang === 'ar') {
      return date.toLocaleDateString('ar-KW', { year: 'numeric', month: 'long' });
    }
    return date.toLocaleDateString('en-KW', { year: 'numeric', month: 'long' });
  };

  const BackArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white py-16 mb-12">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{str('المطبوعات والإصدارات', 'Publications & Reports')}</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              {str('تصفح جميع مطبوعات وإصدارات جمعية المياه الكويتية', 'Browse all publications and reports of the Kuwait Water Association')}
            </p>
          </div>
        </div>

        <div className="container-custom">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-8 transition-colors"
          >
            <BackArrow size={18} />
            {str('العودة للرئيسية', 'Back to Home')}
          </Link>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : publications.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl">{str('لا توجد مطبوعات حالياً', 'No publications available at the moment')}</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {publications.map((pub, index) => (
                <motion.div
                  key={pub._id || index}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -6 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-300 flex flex-col">
                    {/* Cover */}
                    <div className="h-48 overflow-hidden flex-shrink-0">
                      {pub.coverImage ? (
                        <img src={pub.coverImage} alt={t(pub, 'title')} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-cyan-100 to-blue-100 flex items-center justify-center">
                          <FileText className="w-20 h-20 text-cyan-300" />
                        </div>
                      )}
                    </div>
                    <CardContent className={`p-6 flex flex-col flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                      <h3 className="text-lg font-bold text-gray-800 mb-2 leading-snug">{t(pub, 'title')}</h3>
                      {(pub.descriptionAr || pub.descriptionEn) && (
                        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2 flex-1">{t(pub, 'description')}</p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 gap-2 flex-wrap">
                        <span className="text-xs text-gray-400">{formatDate(pub.publishDate)}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPreview(pub)}
                            className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            <Eye size={14} />
                            {str('معاينة', 'Preview')}
                          </button>
                          <a
                            href={pub.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
                          >
                            <Download size={14} />
                            {str('تحميل', 'Download')}
                          </a>
                        </div>
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

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setPreview(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col"
              style={{ height: '90vh' }}
              onClick={e => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0">
                <h3 className="font-semibold text-gray-800 truncate flex-1 mr-4">
                  {lang === 'ar' ? preview.titleAr || preview.titleEn : preview.titleEn}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={preview.pdfUrl} target="_blank" rel="noopener noreferrer" download
                    className="inline-flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors">
                    <Download size={14} />
                    {str('تحميل', 'Download')}
                  </a>
                  <button onClick={() => setPreview(null)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                    <X size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
              {/* PDF iframe */}
              <div className="flex-1 overflow-hidden rounded-b-2xl">
                <iframe
                  src={`${preview.pdfUrl}#toolbar=1&navpanes=0`}
                  className="w-full h-full border-0"
                  title={preview.titleEn}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicationsPage;
