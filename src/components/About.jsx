import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Target, Eye, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from './ui/card';

export const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
    <section id="about" className="section-padding relative overflow-hidden bg-gradient-to-br from-white via-blue-50 to-cyan-50">
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"></div>
      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
              من <span className="text-cyan-500">نحن</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              جمعية المياه الكويتية - جمعية نفع عام تأسست بموجب القرار الوزاري رقم 87 لسنة 2012
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-2xl transition-all duration-300 border-4 border-cyan-300 hover:border-cyan-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-2xl"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl mb-6 shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                    <Eye className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">الرؤية</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    أن تكون الجمعية رائدة في مجال الأمن المائي وقضايا كفاءة المياه والطاقة في الكويت، بما يتماشى مع رؤية الكويت 2035
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-2xl transition-all duration-300 border-4 border-emerald-300 hover:border-emerald-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-success via-emerald-500 to-teal-500 rounded-3xl mb-6 shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-success to-emerald-600 bg-clip-text text-transparent">الرسالة</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    السعي لتحقيق دعم جهود الدولة في مشاريع الأمن المائي وكفاءة المياه، والحد من هدر المياه من خلال المشاريع والمبادرات التي تديرها خبرات وطنية ودولية بشراكة مجتمعية متميزة
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full bg-gradient-to-br from-cyan-50 to-blue-50 hover:shadow-2xl transition-all duration-300 border-4 border-cyan-300 hover:border-cyan-500 hover:scale-105 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-success/20 to-transparent rounded-full blur-2xl"></div>
                <CardContent className="p-8 text-center relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary via-secondary to-primary rounded-3xl mb-6 shadow-2xl transform hover:rotate-12 transition-transform duration-300">
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">الأهداف</h3>
                  <div className="text-right">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          رفع الوعي بالممارسات المستدامة في استخدام المياه والطاقة
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          السعي للتميز على المستوى الدولي
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">
                          تعزيز مبدأ التنمية المستدامة في قطاعي المياه والطاقة
                        </span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* <motion.div variants={itemVariants} className="relative rounded-3xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1577734034780-08484e6be3b5"
              alt="قطرة ماء"
              className="w-full h-[400px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end">
              <div className="p-8 text-right text-white">
                <h3 className="text-3xl font-bold mb-2">التزامنا بالاستدامة</h3>
                <p className="text-lg opacity-90">
                  نعمل على تحقيق التنمية المستدامة من خلال المشاريع والبرامج المبتكرة التي تساهم في الحفاظ على الموارد المائية للأجيال القادمة
                </p>
              </div>
            </div>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  );
};
