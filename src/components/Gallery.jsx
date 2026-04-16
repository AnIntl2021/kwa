import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

const Gallery = () => {
  const { lang, str } = useLanguage();
  const [images, setImages] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    publicApi.getGallery()
      .then(res => {
        const data = res.data.data || [];
        if (data.length > 0) {
          setImages(data);
        } else {
          // fallback to static images
          setImages(Array.from({ length: 45 }, (_, i) => ({ _id: i, url: `/g/g${i + 1}.png` })));
        }
      })
      .catch(() => {
        setImages(Array.from({ length: 45 }, (_, i) => ({ _id: i, url: `/g/g${i + 1}.png` })));
      });
  }, []);

  const [validImages, setValidImages] = useState([]);
  useEffect(() => { setValidImages(images); }, [images]);

  const handleImageError = (id) => setValidImages(prev => prev.filter(img => (img._id || img) !== id));
  const visible = showAll ? validImages : validImages.slice(0, 8);

  return (
    <section className="section-padding bg-white" id="gallery" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container-custom">
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="text-cyan-500" size={28} />
            <h2 className="text-4xl font-bold text-slate-800">{str('أخبار ووسائل إعلام', 'News & Media')}</h2>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full" />
        </div>

        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {visible.map((img) => {
              const id = img._id;
              const url = img.url;
              return (
                <motion.div key={id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
                  className="relative aspect-square overflow-hidden rounded-2xl group shadow-sm bg-slate-50">
                  <img src={url} alt={img.captionAr || img.captionEn || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={() => handleImageError(id)} />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {validImages.length > 8 && (
          <div className="mt-12 flex justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-8 py-3 bg-slate-100 hover:bg-cyan-500 hover:text-white text-slate-700 font-bold rounded-full transition-all shadow-md">
              {showAll
                ? <><span>{str('عرض أقل', 'Show Less')}</span><ChevronUp size={20} /></>
                : <><span>{str('عرض الكل', 'Show All')} ({validImages.length})</span><ChevronDown size={20} /></>
              }
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
