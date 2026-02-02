import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Droplets, Award, Users } from 'lucide-react';

export const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-accent/20 to-success/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-secondary/15 to-primary/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>
      
      <div className="absolute inset-0 opacity-5">
        <img
          src="https://customer-assets.emergentagent.com/job_b4947f91-cc89-422e-b6c2-759af70d53ff/artifacts/xapw5hpf_%D8%A7%D8%A8%D8%B1%D8%A7%D8%AC%20%D8%A7%D9%84%D9%83%D9%88%D9%8A%D8%AA.png"
          alt="أبراج الكويت"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="container-custom relative z-10 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-right"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight"
            >
              <span className="bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-500 bg-clip-text text-transparent">نحو أمن مائي</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-500 via-cyan-500 to-cyan-500 bg-clip-text text-transparent">مستدام</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl text-gray-700 mb-8 leading-relaxed font-medium"
            >
              جمعية المياه الكويتية - رائدة في دعم جهود الدولة لتحقيق الأمن المائي وكفاءة استخدام المياه والطاقة، بما يتماشى مع رؤية الكويت 2035
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap gap-4 mb-12"
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary via-secondary to-primary text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                onClick={() => scrollToSection('projects')}
              >
                اكتشف مشاريعنا
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-br from-green-500 to-green-400 text-white hover:shadow-2xl hover:scale-105 transition-all duration-300"
                onClick={() => scrollToSection('contact')}
              >
                تواصل معنا
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="grid grid-cols-3 gap-6"
            >
              <div className="text-center bg-gradient-to-br from-cyan-100 to-cyan-50 p-5 rounded-2xl border-2 border-cyan-300 hover:border-cyan-500 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-lg">
                  <Droplets className="h-8 w-8 text-white" />
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">15+</p>
                <p className="text-sm font-semibold text-gray-700">مشروع</p>
              </div>
              <div className="text-center bg-gradient-to-br from-emerald-100 to-emerald-50 p-5 p-5 rounded-2xl border-2 border-green-300 hover:border-green-500 hover:scale-105 hover:shadow-xl transition-all duration-300">
               
                <div className="bg-gradient-to-br from-green-500 to-green-400 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                
                <p className="text-3xl font-bold bg-gradient-to-r from-success to-emerald-600 bg-clip-text text-transparent">10+</p>
                <p className="text-sm font-semibold text-gray-700">جائزة</p>
              </div>


              <div className="text-center bg-gradient-to-br from-cyan-100 to-cyan-50 p-5 rounded-2xl border-2 border-cyan-300 hover:border-cyan-500 hover:scale-105 hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">20+</p>
                <p className="text-sm font-semibold text-gray-700">شريك</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 rounded-3xl blur-xl"></div>
            <div className="relative animate-float">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-secondary rounded-3xl blur opacity-75"></div>
              <img
                src="/mainImg.png"
                alt="حماية المياه"
                className="relative rounded-3xl shadow-2xl w-full h-[500px] object-cover border-4 border-white"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2"
        >
          <div className="w-1 h-3 bg-white rounded-full" />
        </motion.div>
      </div>
    </section>
  );
};
