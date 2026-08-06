import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

export const YouthForumCTA = () => {
  const { lang, str } = useLanguage();
  const [config, setConfig] = useState(null);

  useEffect(() => {
    publicApi.getSiteConfig()
      .then(res => setConfig(res.data.data?.youthForum))
      .catch(() => {});
  }, []);

  if (!config || config.isVisible === false) return null;

  const title = lang === 'ar' ? config.titleAr : config.titleEn;
  const descriptionTop = lang === 'ar' ? config.descriptionTopAr : config.descriptionTopEn;
  const buttonText = lang === 'ar' ? config.buttonTextAr : config.buttonTextEn;
  const buttonLink = config.buttonLink || 'https://form.jotform.com/';

  // Use default texts if the DB is empty
  const displayTitle = title || str('هل أنت مستعد لتكون جزءاً من التغيير؟', 'Ready to Be Part of the Change?');
  const displayDesc = descriptionTop || str('<p>ندعو جميع الشباب المبدعين للانضمام إلينا في الملتقى الشبابي الكويتي العربي الخامس.</p>', '<p>We invite all creative youth to join us at the 5th Kuwaiti-Arab Youth Forum.</p>');
  const displayBtnText = buttonText || str('سجل الآن وانضم إلينا', 'Register Now & Join Us');

  return (
    <section className="relative py-24 overflow-hidden bg-gradient-to-r from-cyan-400 to-cyan-500" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="container-custom relative z-10 flex flex-col items-center justify-center text-center">
        
        {/* Logo/Icon placeholder to match the screenshot */}
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          {/* SVG matching the screenshot's icon (person with a water drop) */}
          <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 15C54.1421 15 57.5 11.6421 57.5 7.5C57.5 3.35786 54.1421 0 50 0C45.8579 0 42.5 3.35786 42.5 7.5C42.5 11.6421 45.8579 15 50 15Z" fill="#7ed957"/>
            <path d="M30.5 25.5C36 30 43 32 50 32C57 32 64 30 69.5 25.5" stroke="#7ed957" strokeWidth="6" strokeLinecap="round"/>
            <path d="M40 30V45C40 60 50 75 50 75C50 75 60 60 60 45V30" fill="#38bdf8"/>
            <path d="M30 40C35 60 45 80 50 85C40 85 25 65 25 45L30 40Z" fill="#7ed957"/>
          </svg>
        </motion.div>

        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-white mb-6"
        >
          {displayTitle}
        </motion.h2>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl"
          dangerouslySetInnerHTML={{ __html: displayDesc }}
        />

        <motion.a
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          href={buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-cyan-500 bg-white rounded-full hover:bg-gray-50 transition-colors shadow-lg hover:shadow-xl"
        >
          {displayBtnText}
        </motion.a>
      </div>
    </section>
  );
};
