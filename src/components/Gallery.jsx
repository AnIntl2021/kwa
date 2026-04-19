import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ChevronDown, ChevronUp, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

const Gallery = () => {
  const { lang, str } = useLanguage();
  const [images, setImages] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [lightbox, setLightbox] = useState(null); // index of open image

  useEffect(() => {
    publicApi.getGallery()
      .then(res => {
        const data = res.data.data || [];
        if (data.length > 0) {
          setImages(data);
        } else {
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

  const openLightbox = (index) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox(i => (i - 1 + validImages.length) % validImages.length);
  const next = () => setLightbox(i => (i + 1) % validImages.length);

  // Keyboard nav
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightbox]); // eslint-disable-line react-hooks/exhaustive-deps

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
            {visible.map((img, idx) => {
              const id = img._id;
              const url = img.url;
              // find the real index in validImages for lightbox
              const realIdx = validImages.findIndex(v => v._id === id);
              return (
                <motion.div key={id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}
                  className="relative aspect-square overflow-hidden rounded-2xl group shadow-sm bg-slate-50 cursor-pointer"
                  onClick={() => openLightbox(realIdx)}>
                  <img src={url} alt={img.captionAr || img.captionEn || ''} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" onError={() => handleImageError(id)} />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-white font-semibold text-sm bg-black/50 px-3 py-1 rounded-full">
                      {str('عرض', 'View')}
                    </span>
                  </div>
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && validImages[lightbox] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            {/* Close */}
            <button onClick={closeLightbox} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Prev */}
            {validImages.length > 1 && (
              <button onClick={e => { e.stopPropagation(); prev(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>
            )}

            {/* Image */}
            <motion.div
              key={lightbox}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-4xl max-h-[85vh] flex flex-col items-center gap-3"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={validImages[lightbox].url}
                alt={validImages[lightbox].captionAr || validImages[lightbox].captionEn || ''}
                className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
              />
              {(validImages[lightbox].captionAr || validImages[lightbox].captionEn) && (
                <p className="text-white/80 text-sm text-center">
                  {lang === 'ar' ? validImages[lightbox].captionAr : validImages[lightbox].captionEn}
                </p>
              )}
              <p className="text-white/40 text-xs">{lightbox + 1} / {validImages.length}</p>
            </motion.div>

            {/* Next */}
            {validImages.length > 1 && (
              <button onClick={e => { e.stopPropagation(); next(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors">
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Gallery;
