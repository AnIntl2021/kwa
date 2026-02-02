import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { GraduationCap, Users, Laptop, Globe } from 'lucide-react';

export const Training = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05
  });

  const trainings = [
    {
      icon: Users,
      title: "إدارة وترشيد استهلاك المياه",
      description: "دورات متخصصة لموظفي الدولة في مجال إدارة وترشيد استهلاك المياه، مع تدريب عملي وشهادات معتمدة",
      attendees: "200+ متدرب",
      year: "2019-2023"
    },
    {
      icon: GraduationCap,
      title: "خطة سلامة المياه",
      description: "دورة متخصصة في وضع وتنفيذ خطط سلامة المياه وفقاً للمعايير الدولية، بالتعاون مع خبراء دوليين",
      attendees: "150+ متدرب",
      year: "2020"
    },
    {
      icon: Laptop,
      title: "استخدام النظائر في كشف مصادر المياه",
      description: "دورة تقنية متقدمة حول استخدام التقنيات الحديثة والنظائر في كشف مصادر المياه وتحسين الاستهلاك",
      attendees: "80+ متدرب",
      year: "2020"
    },
    {
      icon: Globe,
      title: "إنتاج الديزل الحيوي",
      description: "دورة عملية في إنتاج الديزل الحيوي من زيت الطعام المستعمل - حماية للمياه ومصدر اقتصادي للطاقة المتجددة",
      attendees: "50+ متدرب",
      year: "2020"
    }
  ];

  const virtualTrainings = [
    "دورات افتراضية في مبادئ معالجة مياه الصرف الصحي",
    "تدريب افتراضي على إدارة الموارد المائية المستدامة",
    "ورش عمل عن كفاءة استخدام المياه في المنشآت",
    "برامج توعية افتراضية للمدارس والجامعات"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <section id="training" className="section-padding relative overflow-hidden bg-gradient-to-br from-violet-50 via-cyan-50 to-cyan-50">
      <div className="absolute top-10 right-10 w-96 h-96 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-600">
             <span className="bg-gradient-to-r from-cyan-600 to-cyan-600 bg-clip-text text-cyan-600">  برامج  التدريب </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              نقدم برامج تدريبية متخصصة لبناء القدرات الوطنية في مجال إدارة المياه والاستدامة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {trainings.map((training, index) => {
              const Icon = training.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 border-r-8 border-transparent hover:border-cyan-500 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-transparent rounded-full blur-xl"></div>
                    <CardHeader className="relative z-10">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 text-right">
                          <CardTitle className="text-xl mb-3">{training.title}</CardTitle>
                          <div className="flex gap-2 justify-end mb-3">
                            <Badge className="bg-gradient-to-r from-cyan-500 to-cyan-500 text-white">
                              {training.year}
                            </Badge>
                            <Badge variant="outline" className="border-cyan-300 text-cyan-700">
                              {training.attendees}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                          <Icon className="h-7 w-7 text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <p className="text-muted-foreground text-right leading-relaxed">
                        {training.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-cyan-100 to-cyan-100 border-4 border-cyan-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-cyan-300/20 to-transparent rounded-full blur-2xl"></div>
              <CardContent className="p-8 relative z-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-xl">
                    <Laptop className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold">
                    <span className="bg-gradient-to-r from-cyan-600 to-cyan-600 bg-clip-text text-transparent">
                      الدورات الافتراضية 2021-2023
                    </span>
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {virtualTrainings.map((training, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white/70 hover:bg-white transition-all duration-300 border-2 border-transparent hover:border-cyan-300 hover:scale-105"
                    >
                      <div className="w-2 h-2 bg-gradient-to-r from-cyan-500 to-cyan-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-gray-700 text-right leading-relaxed font-medium">
                        {training}
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
