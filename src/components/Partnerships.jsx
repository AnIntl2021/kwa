import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent } from './ui/card';
import { Building, Globe2, Briefcase, Heart } from 'lucide-react';

export const Partnerships = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const partnerCategories = [
    {
      icon:'/c5.png',
      title: "الجهات الحكومية",
      color: "primary",
      partners: [
        "وزارة الكهرباء والماء والطاقة المتجددة",
        "وزارة الأوقاف والشؤون الإسلامية",
        "وزارة التربية",
        "الهيئة العامة للبيئة",
        "بلدية الكويت",
        "الهيئة العامة للزراعة والثروة السمكية"
      ]
    },
    {
      icon:'/c6.png',
      title: "المنظمات الدولية",
      color: "secondary",
      partners: [
        "Foundation for Environmental Education (FEE) - الدنمارك",
        "برنامج الأمم المتحدة للبيئة UN-Environment",
        "الاتحاد الدولي لحفظ الطبيعة IUCN",
        "الشبكة الدولية للملوثات العضوية الثابتة IPEN",
        "منظمة التعاون الدولي في مجال الطاقة GEIDCO",
        "الشبكة العالمية للتنظيف من النفايات"
      ]
    },
    {
      icon:'/c7.png',
      title: "المؤسسات البحثية والتنموية",
      color: "success",
      partners: [
        "معهد الكويت للأبحاث العلمية",
        "المعهد العربي للتخطيط",
        "مؤسسة الكويت للتقدم العلمي KFAS",
        "الصندوق العربي للإنماء الاقتصادي والاجتماعي",
        "الهيئة العامة للتعليم التطبيقي والتدريب",
        "الهيئة العربية للطاقة الذرية"
      ]
    },
    {
      icon:'/c8.png',
      title: "المجتمع المدني والقطاع الخاص",
      color: "accent",
      partners: [
        "الجمعية الكويتية لحماية البيئة",
        "الجمعية الكويتية للأسر المتعففة",
        "شركة نفط الكويت الوطنية KNPC",
        "شركة سفيرة للمسؤولية الاجتماعية",
        "مؤسسة جرين ويف للبيئة والاستدامة",
        "اتحاد العقاريين"
      ]
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section id="partnerships" className="section-padding relative overflow-hidden bg-blue-50">
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-br from-accent/10 to-transparent rounded-full blur-3xl"></div>
      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
              شراكاتنا <span className="text-cyan-500">الاستراتيجية</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              نفخر بشراكاتنا مع مختلف الجهات المحلية والدولية لتحقيق أهدافنا في الاستدامة المائية
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {partnerCategories.map((category, index) => {
              return (
                <motion.div key={index} variants={itemVariants}>
                  <Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 border-t-8 border-transparent hover:border-gradient-to-r group hover:scale-105 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl"></div>
                    <CardContent className="p-8 relative z-10">
                      <div className="flex items-center gap-4 mb-6">
                        {/* <div className="w-24 h-16 bg-blue-200 round-lg">
                          <img src={category.icon} className="h-16 w-24 bg-cover text-white round-lg" />
                        </div> */}
                        <h3 className="text-2xl font-bold text-foreground">
                          {category.title}
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {category.partners.map((partner, pIndex) => (
                          <motion.div
                            key={pIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={inView ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: (index * 0.2) + (pIndex * 0.05) }}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 transition-all duration-300 border border-transparent hover:border-primary/30"
                          >
                            <div className="w-2 h-2 bg-gradient-accent rounded-full flex-shrink-0" />
                            <p className="text-muted-foreground text-right">
                              {partner}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            variants={itemVariants}
            className="mt-16 relative rounded-3xl overflow-hidden"
          >
            <img
              src="https://images.unsplash.com/photo-1548337138-e87d889cc369"
              alt="شراكات"
              className="w-full h-[350px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h3 className="text-4xl font-bold mb-4">هل ترغب في الشراكة معنا؟</h3>
                <p className="text-xl mb-6 opacity-90">
                  نرحب بالتعاون مع جميع الجهات المهتمة بالاستدامة المائية والبيئية
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors duration-300 shadow-lg"
                >
                  تواصل معنا الآن
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
