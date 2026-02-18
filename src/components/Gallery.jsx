import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, ChevronDown, ChevronUp } from 'lucide-react';

const Gallery = () => {
  const [showAll, setShowAll] = useState(false);
  
  // 1. Initial state contains all potential paths
  const [images, setImages] = useState(
    Array.from({ length: 45 }, (_, i) => `/g/g${i + 1}.png`)
  );

  // 2. Function to remove an image if it's not found (404)
  const handleImageError = (src) => {
    setImages((prev) => prev.filter((img) => img !== src));
  };

  // Logic for toggling view
  const visibleImages = showAll ? images : images.slice(0, 8);

  return (
    <section className="section-padding bg-white" id="gallery">
      <div className="container-custom">
        {/* Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid className="text-cyan-500" size={28} />
            <h2 className="text-4xl font-bold text-slate-800">أخبار ووسائل إعلام</h2>
          </div>
          <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full"></div>
        </div>

        {/* Gallery Grid */}
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <AnimatePresence mode='popLayout'>
            {visibleImages.map((src, index) => (
              <motion.div
                key={src}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-square overflow-hidden rounded-2xl group shadow-sm bg-slate-50"
              >
                <img
                  src={src}
                  alt="Gallery"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  // 3. Trigger skip logic if image is not found
                  onError={() => handleImageError(src)}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Toggle Button */}
        {images.length > 8 && (
          <div className="mt-12 flex justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAll(!showAll)}
              className="flex items-center gap-2 px-8 py-3 bg-slate-100 hover:bg-cyan-500 hover:text-white text-slate-700 font-bold rounded-full transition-all shadow-md"
            >
              {showAll ? (
                <><span>عرض أقل</span><ChevronUp size={20} /></>
              ) : (
                <><span>عرض الكل ({images.length})</span><ChevronDown size={20} /></>
              )}
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;