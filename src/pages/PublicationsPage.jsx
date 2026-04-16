import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FileText, Download, ArrowRight, ArrowLeft, BookOpen } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

const PublicationsPage = () => {
  const { lang, t, str } = useLanguage();
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);

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
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-400">{formatDate(pub.publishDate)}</span>
                        <a
                          href={pub.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md"
                        >
                          <Download size={14} />
                          {str('تحميل PDF', 'Download PDF')}
                        </a>
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
    </div>
  );
};

export default PublicationsPage;
