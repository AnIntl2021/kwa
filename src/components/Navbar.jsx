import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'الرئيسية', href: '#hero' },
    { name: 'من نحن', href: '#about' },
    { name: 'المشاريع', href: '#projects' },
    { name: 'التدريب', href: '#training' },
    { name: 'الجوائز', href: '#awards' },
    { name: 'الشراكات', href: '#partnerships' },
     { name: 'أخبار ووسائل إعلام', href: '#gallery' },
    { name: 'اتصل بنا', href: '#contact' }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-border'
          : 'bg-white/95 backdrop-blur-xl shadow-md border-b border-border'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <img
              src="https://customer-assets.emergentagent.com/job_b4947f91-cc89-422e-b6c2-759af70d53ff/artifacts/bo5n5bu5_kwa%20logo.png"
              alt="جمعية المياه الكويتية"
              className="h-14 w-14 object-contain"
            />
            <div className="text-right">
              <h1 className="text-lg font-bold text-foreground">جمعية المياه الكويتية</h1>
              <p className="text-xs text-muted-foreground">Kuwait Water Association</p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            {navLinks.map((link) => (
              <Button
                key={link.name}
                variant="ghost"
                onClick={() => scrollToSection(link.href)}
                className="text-foreground hover:text-primary hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 font-medium transition-all duration-300"
              >
                {link.name}
              </Button>
            ))}
          </div>

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

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t"
          >
            <div className="container-custom py-4 flex flex-col gap-2">
              {navLinks.map((link) => (
                <Button
                  key={link.name}
                  variant="ghost"
                  onClick={() => scrollToSection(link.href)}
                  className="w-full justify-end text-right text-foreground hover:text-primary hover:bg-primary/10"
                >
                  {link.name}
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
