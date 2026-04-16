import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { publicApi } from '../utils/api';

const EventsPage = () => {
  const { lang, t, str } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi.getEvents()
      .then(res => setEvents(res.data.data || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    if (lang === 'ar') {
      return date.toLocaleDateString('ar-KW', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    return date.toLocaleDateString('en-KW', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const BackArrow = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="min-h-screen" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <Navbar />
      <main className="pt-24 pb-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 text-white py-16 mb-12">
          <div className="container-custom text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{str('الفعاليات والأحداث', 'Events & Activities')}</h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              {str('تعرف على جميع فعاليات وأنشطة جمعية المياه الكويتية', 'Explore all events and activities of the Kuwait Water Association')}
            </p>
          </div>
        </div>

        <div className="container-custom">
          {/* Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium mb-8 transition-colors"
          >
            <BackArrow size={18} />
            {str('العودة للرئيسية', 'Back to Home')}
          </Link>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-xl">{str('لا توجد فعاليات حالياً', 'No events available at the moment')}</p>
            </div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {events.map((event, index) => (
                <motion.div
                  key={event._id || index}
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ y: -6 }}
                >
                  <Card className="h-full overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-300">
                    {event.image && (
                      <div className="h-48 overflow-hidden">
                        <img src={event.image} alt={t(event, 'title')} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      </div>
                    )}
                    {!event.image && (
                      <div className="h-32 bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        <Calendar className="w-16 h-16 text-white/50" />
                      </div>
                    )}
                    <CardContent className={`p-6 ${lang === 'ar' ? 'text-right' : 'text-left'}`}>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{t(event, 'title')}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{t(event, 'description')}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-cyan-600">
                          <Calendar size={14} />
                          <span>{formatDate(event.date)}</span>
                        </div>
                        {(event.locationAr || event.locationEn) && (
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <MapPin size={14} />
                            <span>{t(event, 'location')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EventsPage;
