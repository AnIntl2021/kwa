import { motion } from 'framer-motion';
import { Droplets, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';
import { Button } from './ui/button';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { name: 'الرئيسية', href: '#hero' },
      { name: 'من نحن', href: '#about' },
      { name: 'المشاريع', href: '#projects' },
           { name: 'أخبار ووسائل إعلام', href: '#gallery' },
      { name: 'اتصل بنا', href: '#contact' }
    ],
    resources: [
      { name: 'الجوائز والإنجازات', href: '#awards' },
      { name: 'الشراكات', href: '#partnerships' },
      { name: 'الأخبار والفعاليات', href: '#' },
      { name: 'المطبوعات', href: '#' }
    ]
  };

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Youtube, href: '#', label: 'Youtube' }
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-primary via-secondary to-primary-dark text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success rounded-full blur-3xl"></div>
      </div>
      <div className="container-custom relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://customer-assets.emergentagent.com/job_b4947f91-cc89-422e-b6c2-759af70d53ff/artifacts/bo5n5bu5_kwa%20logo.png"
                alt="جمعية المياه الكويتية"
                className="h-16 w-16 object-contain bg-white rounded-full p-2"
              />
              <div className="text-right">
                <h3 className="text-xl font-bold">جمعية المياه الكويتية</h3>
                <p className="text-sm text-white/80">Kuwait Water Association</p>
              </div>
            </div>
            <p className="text-white/80 text-right leading-relaxed mb-6">
              جمعية نفع عام تأسست بموجب القرار الوزاري رقم 87 لسنة 2012، نعمل على تحقيق الأمن المائي والاستدامة في الكويت
            </p>
            <div className="flex gap-3 justify-end">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors duration-300 backdrop-blur-sm"
                  >
                    <Icon className="h-5 w-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-right"
          >
            <h4 className="text-lg font-bold mb-6">روابط سريعة</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-right"
          >
            <h4 className="text-lg font-bold mb-6">المصادر</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-white/80 hover:text-white transition-colors duration-300 hover:translate-x-1 inline-block"
                  >
                    {link.name}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-right"
          >
            <h4 className="text-lg font-bold mb-6">النشرة الإخبارية</h4>
            <p className="text-white/80 mb-4 text-sm leading-relaxed">
              اشترك في نشرتنا الإخبارية للحصول على آخر الأخبار والتحديثات
            </p>
            <div className="flex gap-2">
              <Button
                size="icon"
                className="bg-white text-primary hover:bg-white/90 flex-shrink-0"
              >
                <Mail className="h-5 w-5" />
              </Button>
              <input
                type="email"
                placeholder="بريدك الإلكتروني"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/60 text-right focus:outline-none focus:border-white/40 transition-colors duration-300 backdrop-blur-sm"
              />
            </div>
          </motion.div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/70">
            <p className="text-center md:text-left">
              © {currentYear} جمعية المياه الكويتية. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6">
              <button className="hover:text-white transition-colors duration-300">
                سياسة الخصوصية
              </button>
              <button className="hover:text-white transition-colors duration-300">
                شروط الاستخدام
              </button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="fixed bottom-8 left-8 z-40"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
      >
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          size="icon"
          className="w-12 h-12 rounded-full bg-gradient-vibrant text-white shadow-colorful hover:scale-110 transition-transform duration-300"
          aria-label="العودة للأعلى"
        >
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <Droplets className="h-6 w-6" />
          </motion.div>
        </Button>
      </motion.div>
    </footer>
  );
};
