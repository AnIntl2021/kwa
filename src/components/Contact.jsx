import { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';

export const Contact = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.', {
      duration: 4000,
      position: 'top-center'
    });
    setFormData({ name: '', email: '', phone: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "البريد الإلكتروني",
      value: "info@kwa.org.kw",
      link: "mailto:kuwaitwater2012@gmail.com"
    },
    {
      icon: Phone,
      title: "الهاتف",
      value: "9988 1724",
      link: "tel:+96522450902"
    },
    {
      icon: MapPin,
      title: "العنوان",
      value: "شارع السور، مبنى مرزوق، الطابق الثالث، مكتب 18، مدينة الكويت، الكويت",
      link: null
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-secondary/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
              تواصل <span className="text-cyan-500">معنا</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              نسعد بتواصلكم معنا للاستفسارات أو الشراكات أو الدعم
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-1 gap-12">
         

            <motion.div variants={itemVariants} className="space-y-6">
              <Card className="bg-white border-4 border-blue-300 hover:border-blue-500 hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-2xl"></div>
                <CardContent className="p-8 relative z-10">
                  <h3 className="text-2xl font-bold mb-6 text-right">
                    <span className="bg-gradient-to-r from-secondary via-primary to-secondary bg-clip-text text-transparent">معلومات الاتصال</span>
                  </h3>
                  <div className="space-y-6">
                    {contactInfo.map((info, index) => {
                      const Icon = info.icon;
                      const content = (
                        <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-gradient-to-r hover:from-cyan-100 hover:to-blue-100 transition-all duration-300 border-2 border-transparent hover:border-cyan-300 hover:scale-105 hover:shadow-lg">
                          <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary via-secondary to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                            <Icon className="h-7 w-7 text-white" />
                          </div>
                          <div className="text-right flex-1">
                            <p className="text-sm font-medium text-muted-foreground mb-1">
                              {info.title}
                            </p>
                            <p className="text-foreground font-medium">
                              {info.value}
                            </p>
                          </div>
                        </div>
                      );

                      return info.link ? (
                        <a key={index} href={info.link} className="block">
                          {content}
                        </a>
                      ) : (
                        <div key={index}>{content}</div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
