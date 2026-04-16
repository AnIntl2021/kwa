import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

export const Navbar = () => {
  const { lang, toggleLang, str } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { nameAr: 'الرئيسية', nameEn: 'Home', href: '#hero' },
    { nameAr: 'من نحن', nameEn: 'About', href: '#about' },
    { nameAr: 'فريقنا', nameEn: 'Our Team', href: '#team' },
    { nameAr: 'المشاريع', nameEn: 'Projects', href: '#projects' },
    { nameAr: 'التدريب', nameEn: 'Training', href: '#training' },
    { nameAr: 'الجوائز', nameEn: 'Awards', href: '#awards' },
    { nameAr: 'الشراكات', nameEn: 'Partnerships', href: '#partnerships' },
    { nameAr: 'المعرض', nameEn: 'Gallery', href: '#gallery' },
    { nameAr: 'اتصل بنا', nameEn: 'Contact', href: '#contact' },
  ];

  const scrollToSection = (href) => {
    if (!isHome) {
      navigate('/');
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 right-0 left-0 z-50 bg-white/95 backdrop-blur-xl shadow-md border-b border-border transition-all duration-300"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="https://customer-assets.emergentagent.com/job_b4947f91-cc89-422e-b6c2-759af70d53ff/artifacts/bo5n5bu5_kwa%20logo.png"
              alt="KWA"
              className="h-14 w-14 object-contain"
            />
            <div className={lang === 'ar' ? 'text-right' : 'text-left'}>
              <h1 className="text-lg font-bold text-foreground">
                {str('جمعية المياه الكويتية', 'Kuwait Water Association')}
              </h1>
              <p className="text-xs text-muted-foreground">
                {str('Kuwait Water Association', 'جمعية المياه الكويتية')}
              </p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                onClick={() => scrollToSection(link.href)}
                className="text-foreground hover:text-primary hover:bg-primary/10 font-medium transition-all duration-300 text-sm px-3"
              >
                {lang === 'ar' ? link.nameAr : link.nameEn}
              </Button>
            ))}
            {/* Events & Publications links */}
            <Link to="/events">
              <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10 font-medium text-sm px-3">
                {str('الفعاليات', 'Events')}
              </Button>
            </Link>
            <Link to="/publications">
              <Button variant="ghost" className="text-foreground hover:text-primary hover:bg-primary/10 font-medium text-sm px-3">
                {str('المطبوعات', 'Publications')}
              </Button>
            </Link>
          </div>

          {/* Language Toggle + Mobile Menu */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-cyan-400 text-cyan-600 hover:bg-cyan-50 font-semibold text-sm transition-all"
              title={lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe className="w-4 h-4" />
              <span>{lang === 'ar' ? 'EN' : 'عر'}</span>
            </button>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t"
          >
            <div className="container-custom py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  onClick={() => scrollToSection(link.href)}
                  className={`w-full ${lang === 'ar' ? 'justify-end text-right' : 'justify-start text-left'} text-foreground hover:text-primary hover:bg-primary/10`}
                >
                  {lang === 'ar' ? link.nameAr : link.nameEn}
                </Button>
              ))}
              <Link to="/events" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className={`w-full ${lang === 'ar' ? 'justify-end' : 'justify-start'} hover:text-primary hover:bg-primary/10`}>
                  {str('الفعاليات', 'Events')}
                </Button>
              </Link>
              <Link to="/publications" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="ghost" className={`w-full ${lang === 'ar' ? 'justify-end' : 'justify-start'} hover:text-primary hover:bg-primary/10`}>
                  {str('المطبوعات', 'Publications')}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
