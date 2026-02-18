import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from './ui/card';
import { Trophy, Award, Medal, Star } from 'lucide-react';

export const Awards = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const awards = [
    {
      icon: '/c1.png',
      title: "جائزة مجلس التعاون الخليجي",
      description: "أفضل جمعية تعمل في مجال المياه على مستوى دول الخليج العربية",
      year: "2021",
      color: "text-accent"
    },
    {
      icon: '/c2.png',
      title: "جائزة فورد العالمية",
      description: "للمحافظة على البيئة - تقدير عالمي للجهود المتميزة في حماية الموارد المائية",
      year: "2016",
      color: "text-primary"
    },
    {
      icon:  '/knpc.png',
      title: "شركة البترول الوطنية الكويتية",
      description: "أفضل مشروع مستدام - تقدير للابتكار في مشاريع الاستدامة المائية",
      year: "2018",
      color: "text-secondary"
    },
    {
      icon:  '/c4.png',
      title: "جائزة المملكة العربية السعودية",
      description: "للإدارة البيئية في العالم الإسلامي - المركز الثاني في فئة أفضل ممارسات المنظمات غير الحكومية",
      year: "2016-2017",
      color: "text-success"
    }
  ];

  const memberships = [
    "ممثل حصري للكويت لدى مؤسسة التعليم البيئي FEE في الدنمارك (2021)",
    "عضو مجلس إدارة الهيئة العامة للبيئة في الكويت (2019)",
    "معتمد من برنامج الأمم المتحدة للبيئة UN-Environment (2018)",
    "عضو الاتحاد الدولي لحفظ الطبيعة IUCN واللجنة الوطنية الكويتية (2019)",
    "عضو الشبكة الدولية للقضاء على الملوثات العضوية الثابتة IPEN (2020)",
    "عضو في منظمة التعاون والتطوير الدولي في مجال الطاقة GEIDCO في الصين",
    "عضو في الشبكة العالمية للتنظيف من النفايات في بريطانيا (2021)"
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
    <section id="awards" className="section-padding relative overflow-hidden bg-gradient-to-br from-cyan-50 cyan-50 to-cyan-50">
      <div className="absolute top-10 left-10 w-80 h-80 bg-gradient-to-br from-accent/15 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
              الجوائز <span className="text-cyan-500">والإنجازات</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              حصلت جمعية المياه الكويتية على العديد من الجوائز والتقديرات المحلية والدولية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {awards.map((award, index) => {
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 group cursor-pointer border-l-8 border-transparent hover:border-cyan-500 hover:border-cyan hover:scale-105 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-xl"></div>
                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                         
                            <img src={award.icon} className="h-20 w-24 text-white" />
                          
                        </div>
                        <div className="text-right flex-1">
                          <div className="inline-block px-4 py-1 bg-gradient-to-r from-primary to-secondary rounded-full text-white text-sm font-semibold mb-3 shadow-lg">
                            {award.year}
                          </div>
                          <h3 className="text-xl font-bold mb-3 text-gray-800">
                            {award.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {award.description}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-4 border-blue-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl"></div>
              <CardContent className="p-8 relative z-10">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  العضويات <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">الدولية</span>
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {memberships.map((membership, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-secondary/5 transition-all duration-300 border border-transparent hover:border-primary/20"
                    >
                      <div className="flex-shrink-0 w-2 h-2 bg-gradient-primary rounded-full mt-2" />
                      <p className="text-muted-foreground text-right leading-relaxed">
                        {membership}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
