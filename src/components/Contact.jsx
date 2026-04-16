import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from './ui/card';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

export const Contact = () => {
  const { lang, str } = useLanguage();
  const [config, setConfig] = useState(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    publicApi.getSiteConfig()
      .then(res => setConfig(res.data.data))
      .catch(() => {});
  }, []);

  const contact = config?.contact;
  const email = contact?.email || 'info@kwa.org.kw';
  const phone = contact?.phone || '+965 99881724';
  const address = lang === 'ar' ? (contact?.addressAr || '') : (contact?.addressEn || '');

  const contactInfo = [
    { icon: Mail, title: str('البريد الإلكتروني', 'Email'), value: email, link: `mailto:${email}` },
    { icon: Phone, title: str('الهاتف', 'Phone'), value: phone, link: `tel:${phone.replace(/\s/g, '')}` },
    { icon: MapPin, title: str('العنوان', 'Address'), value: address, link: null }
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="container-custom relative z-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={containerVariants}>
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
              {str('تواصل معنا', 'Contact Us')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {str('نسعد بتواصلكم معنا للاستفسارات أو الشراكات أو الدعم', 'We are happy to hear from you for inquiries, partnerships, or support')}
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="bg-white border-4 border-blue-300 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 relative overflow-hidden max-w-2xl mx-auto">
              <CardContent className="p-8 relative z-10">
                <h3 className={`text-2xl font-bold mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                  <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">
                    {str('معلومات الاتصال', 'Contact Information')}
                  </span>
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    const content = (
                      <div className={`flex items-start gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 transition-all duration-300 border-2 border-transparent hover:border-cyan-300 hover:scale-105 hover:shadow-lg ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary via-secondary to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                        <div className={`flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          <p className="text-sm font-medium text-muted-foreground mb-1">{info.title}</p>
                          <p className="text-foreground font-medium">{info.value}</p>
                        </div>
                      </div>
                    );
                    return info.link ? (
                      <a key={index} href={info.link} className="block">{content}</a>
                    ) : (
                      <div key={index}>{content}</div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
