import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ClipboardList,    // For Audit/Guide
  BarChart3,        // For Statistics
  MonitorPlay,      // For Interactive Content
  Smartphone,       // For App
  BadgeCheck,       // For Certification/Efficiency
  HeartHandshake,   // For Charity
  KeyRound,         // For "Green Key"
  Globe,            // For International/Eco Schools
  RefreshCw,        // For Recycling/Greywater
  Landmark          // For Waqf/Institution
} from 'lucide-react';
export const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.05
  });

 const projects = [
    {
      icon: ClipboardList,
      title: "مشروع المرشد المائي",
      description: "لرفع كفاءة استخدام المياه في الأبنية - وقف الهدر المائي وتقليل الفواتير وبناء قدرات الكوادر الفنية وإنشاء قاعدة بيانات مائية",
      image: "/images/projects/water_guide.jpg",
      tags: ["كفاءة مائية", "تدقيق"]
    },
    {
      icon: BarChart3,
      title: "إحصائية المرافق التربوية",
      description: "استهدفت 13 مدرسة بقياس الاستهلاك المائي على مدار الساعة، وتركيب قطع توفير المياه، وبرنامج توعية للطلبة والهيئة التدريسية",
      image: "/images/projects/school_stats.jpg",
      tags: ["13 مدرسة", "قياس دقيق"]
    },
    {
      icon: MonitorPlay,
      title: "برنامج رشود",
      description: "محتوى إلكتروني تفاعلي معتمد من وزارة التربية لرفع الوعي بترشيد المياه والكهرباء، يعمل على جميع الأجهزة باللغتين العربية والإنجليزية",
      image: "/images/projects/rushd.jpg",
      tags: ["تفاعلي", "معتمد"]
    },
    {
      icon: Smartphone,
      title: "تطبيق WEKUWAIT",
      description: "تطبيق ذكي لرصد السلوكيات الخاطئة والإبلاغ عن تسرب المياه والكهرباء باستخدام GPS، مع إمكانية تتبع الشكاوى على Android و iOS",
      image: "/images/projects/wekuwait.jpg",
      tags: ["تطبيق ذكي", "GPS"]
    },
    {
      icon: BadgeCheck,
      title: "برنامج كفاءة",
      description: "أول برنامج من نوعه في الكويت للتدقيق المائي في الأبنية، يخفض الفاتورة حتى 40% مع شهادة معتمدة ورمز كفاءة",
      image: "/images/projects/kafaa.jpg",
      tags: ["توفير 40%", "شهادة"]
    },
    {
      icon: HeartHandshake,
      title: "ثواب سقيا الماء",
      description: "مشروع خيري بموافقة وزارة الأوقاف - توزيع برادات ومياه روضتين في المساجد والأماكن العامة من منطلق أفضل الصدقة سقي الماء",
      image: "/images/projects/thawab.png",
      tags: ["خيري", "مساجد"]
    },
    {
      icon: KeyRound,
      title: "المفتاح الأخضر FEE",
      description: "شهادة بيئية دولية للفنادق والمطاعم، تطبق في أكثر من 65 دولة، تشجع على ترشيد الطاقة والمياه والمنتجات الصديقة للبيئة",
      image: "/images/projects/green_key.jpg",
      tags: ["اعتماد FEE", "65 دولة"]
    },
    {
      icon: Globe,
      title: "المدارس البيئية FEE",
      description: "برنامج دولي في أكثر من 81 دولة لتعزيز الوعي البيئي، يمنح الراية الخضراء للمدارس المتميزة كشهادة دولية معترف بها",
      image: "/images/projects/green_schools.jpg",
      tags: ["الراية الخضراء", "81 دولة"]
    },
    {
      icon: RefreshCw,
      title: "المياه الرمادية في المساجد",
      description: "30 مسجداً في جميع المحافظات - قياس الاستهلاك، تركيب أنظمة مياه رمادية، توعية المصلين، وخطبة جمعة متلفزة",
      image: "/images/projects/mosque.jpg",
      tags: ["30 مسجد", "إعادة استخدام"]
    }
    //,
    // {
    //   icon: Landmark,
    //   title: "وقف الكويت للمياه",
    //   description: "تأسيس نظام مياه شرب في المساجد، دعم الأبحاث، صيانة برادات السبيل، تدريب عمالة وطنية، ودعم المؤتمرات والندوات",
    //   image: "/images/projects/waqf.png",
    //   tags: ["وقف", "أبحاث"]
    // }
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

  return (<>
 
    <section id="projects" className="section-padding relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="absolute top-20 right-20 w-72 h-72 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      <div className="container-custom relative z-10">
        <motion.div
          ref={ref}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-cyan-500">
              مشاريعنا <span className="text-cyan-500">وبرامجنا</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              نفذت جمعية المياه الكويتية العديد من المشاريع والبرامج المبتكرة لتحقيق الكفاءة المائية والاستدامة
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => {
              const Icon = project.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full overflow-hidden group cursor-pointer hover:shadow-2xl transition-all duration-300 border-4 border-transparent hover:border-primary bg-white hover:scale-105">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-125 group-hover:rotate-2"
                      />
                      <div className="absolute inset-0 " />
                      <div className="absolute top-4 right-4 bg-white rounded-2xl p-3 shadow-2xl group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                    </div>
                    <CardHeader>
                      <CardTitle className="text-xl text-right">{project.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col h-full">
                      <p className="text-muted-foreground text-right mb-4 leading-relaxed">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 justify-end mt-auto">
                        {project.tags.map((tag, tagIndex) => (
                          <Badge
                            key={tagIndex}
                            variant="secondary"
                            className="bg-gradient-primary text-white hover:opacity-90 shadow-sm"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
    <section id="partnerships" className="section-padding relative overflow-hidden bg-blue-50">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90 flex items-center justify-center">
          <div className="text-center text-white p-8">
            <h3 className="text-4xl font-bold mb-4">هل أنت مستعد لتكون جزءاً من التغيير؟</h3>
            <p className="text-xl mb-6 opacity-90">
              ندعو جميع الشباب المبدعين للانضمام إلينا في الملتقى الشبابي الكويتي العربي الخامس. 
              ساهم برؤيتك في ابتكار حلول مستدامة للمياه.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/youthForum.html'}
              className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors duration-300 shadow-lg"
            >
              سجل الآن وانضم إلينا
            </motion.button>
          </div>
        </div>
</section>
     </>
  );
};
