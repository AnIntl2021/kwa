import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

const PrivacyPolicyPage = () => {
  const { lang, str } = useLanguage();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const BackArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  useEffect(() => {
    publicApi.getSiteConfig()
      .then(res => {
        const cfg = res.data.data;
        setContent(lang === 'ar' ? cfg.privacyPolicyAr : cfg.privacyPolicyEn);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [lang]);

  return (
    <div className="min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white py-16 mb-12">
          <div className="container-custom text-center">
            <ShieldCheck className="w-14 h-14 mx-auto mb-4 opacity-80" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{str('سياسة الخصوصية', 'Privacy Policy')}</h1>
            <p className="text-white/80 text-lg">{str('جمعية المياه الكويتية', 'Kuwait Water Association')}</p>
          </div>
        </div>

        <div className="container-custom max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-8 transition-colors">
            <BackArrow size={18} />
            {str('العودة للرئيسية', 'Back to Home')}
          </Link>

          {loading ? (
            <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
          ) : content ? (
            <div
              className={`bg-white rounded-2xl p-8 shadow-sm border border-gray-100 rich-content leading-relaxed text-gray-700 ${lang === 'ar' ? 'text-right' : 'text-left'}`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div className="text-center py-20 text-gray-400">
              <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>{str('لم يتم إضافة سياسة الخصوصية بعد', 'Privacy policy has not been added yet')}</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
