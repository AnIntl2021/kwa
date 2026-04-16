import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { GraduationCap, Users, Laptop, Globe, Send, Upload, FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

const iconPool = [Users, GraduationCap, Laptop, Globe];

export const Training = () => {
  const { lang, str } = useLanguage();
  const [trainings, setTrainings] = useState([]);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.05 });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    publicApi.getTraining()
      .then(res => setTrainings(res.data.data || []))
      .catch(() => setTrainings([]));
  }, []);

  const regular = trainings.filter(t => !t.isVirtual);
  const virtual = trainings.filter(t => t.isVirtual);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } };

  const handleInterestedClick = (title) => {
    setSelectedTraining(title);
    setIsOpen(true);
  };

  return (
    <section id="training" className="section-padding relative overflow-hidden bg-gradient-to-br from-violet-50 via-cyan-50 to-cyan-50" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="container-custom relative z-10">
        <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={containerVariants}>
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-600">
              {str('برامج التدريب', 'Training Programs')}
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {str('نقدم برامج تدريبية متخصصة لبناء القدرات الوطنية في مجال إدارة المياه والاستدامة', 'We offer specialized training programs to build national capacity in water management and sustainability')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {regular.map((training, index) => {
              const Icon = iconPool[index % iconPool.length];
              return (
                <motion.div key={training._id || index} variants={itemVariants} whileHover={{ y: -8 }} transition={{ duration: 0.3 }}>
                  <Card className="h-full flex flex-col bg-white hover:shadow-2xl transition-all duration-300 border-r-8 border-transparent hover:border-cyan-500 relative overflow-hidden">
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div className={`flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          <CardTitle className="text-xl mb-3">{lang === 'ar' ? training.titleAr : training.titleEn}</CardTitle>
                          <div className={`flex gap-2 mb-3 ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                            {training.year && <Badge className="bg-gradient-to-r from-cyan-500 to-cyan-500 text-white">{training.year}</Badge>}
                            {training.attendeesCount && <Badge variant="outline" className="border-cyan-300 text-cyan-700">{training.attendeesCount}</Badge>}
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10 flex-grow">
                      <p className={`text-muted-foreground leading-relaxed mb-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                        {lang === 'ar' ? training.descriptionAr : training.descriptionEn}
                      </p>
                      <div className={`flex mt-auto ${lang === 'ar' ? 'justify-end' : 'justify-start'}`}>
                        <Button onClick={() => handleInterestedClick(lang === 'ar' ? training.titleAr : training.titleEn)} className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold rounded-full px-8">
                          {str('مهتم بالبرنامج', 'I\'m Interested')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {virtual.length > 0 && (
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-cyan-100 to-cyan-100 border-4 border-cyan-300 relative overflow-hidden">
                <CardContent className="p-8 relative z-10">
                  <div className={`flex items-center gap-4 mb-6 ${lang === 'ar' ? 'flex-row-reverse' : ''}`}>
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <Laptop className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold">
                      <span className="bg-gradient-to-r from-cyan-600 to-cyan-600 bg-clip-text text-transparent">
                        {str('الدورات الافتراضية 2021-2023', 'Virtual Courses 2021-2023')}
                      </span>
                    </h3>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {virtual.map((training, index) => (
                      <motion.div key={training._id || index} initial={{ opacity: 0, x: 20 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 rounded-xl bg-white/70 hover:bg-white transition-all duration-300 border-2 border-transparent hover:border-cyan-300 hover:scale-105">
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-cyan-500 rounded-full mt-2 flex-shrink-0" />
                        <p className={`text-gray-700 leading-relaxed font-medium flex-1 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                          {lang === 'ar' ? training.titleAr : training.titleEn}
                        </p>
                        <button onClick={() => handleInterestedClick(lang === 'ar' ? training.titleAr : training.titleEn)} className="text-xs text-cyan-600 font-bold hover:underline flex-shrink-0">
                          {str('تسجيل', 'Register')}
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] text-right" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
          <DialogHeader>
            <DialogTitle className="text-2xl text-cyan-600">{str('طلب اهتمام بالتدريب', 'Training Interest Request')}</DialogTitle>
            <DialogDescription className="text-gray-500">
              {str('أنت مهتم ببرنامج:', 'You are interested in:')} <span className="font-bold text-gray-700">{selectedTraining}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>{str('الاسم الكامل', 'Full Name')}</Label>
              <Input placeholder={str('أدخل اسمك الكامل', 'Enter your full name')} />
            </div>
            <div className="space-y-2">
              <Label>{str('البريد الإلكتروني', 'Email')}</Label>
              <Input type="email" placeholder="example@domain.com" />
            </div>
            <div className="space-y-2">
              <Label>{str('رقم التواصل', 'Phone')}</Label>
              <Input placeholder="+965 XXXX XXXX" />
            </div>
            <div className="space-y-2">
              <Label>{str('رسالة إضافية', 'Additional Message')}</Label>
              <Textarea placeholder={str('اكتب استفسارك هنا...', 'Write your inquiry here...')} className="min-h-[80px]" />
            </div>
          </div>
          <DialogFooter>
            <Button className="w-full bg-cyan-600 hover:bg-cyan-700" onClick={() => setIsOpen(false)}>
              <Send className="w-4 h-4 ml-2" /> {str('إرسال الطلب', 'Submit Request')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
