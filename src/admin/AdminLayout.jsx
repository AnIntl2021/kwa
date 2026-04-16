import { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Droplets, LayoutDashboard, Image, Users, Trophy, Calendar,
  FileText, Settings, LogOut, Menu, Globe2, Handshake, GraduationCap,
  FolderOpen, Star, ChevronRight, MessageSquare
} from 'lucide-react';

const navItems = [
  { path: '/admin/dashboard',    en: 'Dashboard',     ar: 'لوحة التحكم',    icon: LayoutDashboard },
  { path: '/admin/site-config',  en: 'Hero & About',  ar: 'الرئيسية و نبذة', icon: Settings },
  { path: '/admin/projects',     en: 'Projects',      ar: 'المشاريع',        icon: FolderOpen },
  { path: '/admin/training',     en: 'Training',      ar: 'التدريب',         icon: GraduationCap },
  { path: '/admin/awards',       en: 'Awards',        ar: 'الجوائز',         icon: Trophy },
  { path: '/admin/memberships',  en: 'Memberships',   ar: 'العضويات',        icon: Star },
  { path: '/admin/partners',     en: 'Partners',      ar: 'الشركاء',         icon: Handshake },
  { path: '/admin/team',         en: 'Team',          ar: 'الفريق',          icon: Users },
  { path: '/admin/events',       en: 'Events',        ar: 'الفعاليات',       icon: Calendar },
  { path: '/admin/publications', en: 'Publications',  ar: 'المنشورات',       icon: FileText },
  { path: '/admin/gallery',      en: 'Gallery',       ar: 'المعرض',          icon: Image },
  { path: '/admin/submissions',  en: 'Submissions',   ar: 'الرسائل',         icon: MessageSquare },
  { path: '/admin/settings',     en: 'Site Settings', ar: 'إعدادات الموقع',  icon: Globe2 },
];

const AdminLayout = () => {
  const { admin, logout } = useAdminAuth();
  const { lang, toggleLang } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAr = lang === 'ar';
  const label = (item) => isAr ? item.ar : item.en;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-none">KWA Admin</h1>
            <p className="text-white/60 text-xs mt-0.5">CMS Panel</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-white text-cyan-700 shadow-md'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label(item)}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">{admin?.name?.[0]?.toUpperCase()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">{admin?.name}</p>
            <p className="text-white/60 text-xs truncate">{admin?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
        </button>
      </div>
    </div>
  );

  return (
    // Always LTR layout — admin chrome is always left-sidebar regardless of language
    <div className="flex h-screen bg-gray-50 overflow-hidden" dir="ltr">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-gradient-to-b from-cyan-700 to-blue-800 flex-col overflow-hidden">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-cyan-700 to-blue-800 flex flex-col z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4 flex items-center gap-4 shadow-sm flex-shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="font-semibold text-gray-800">
            {label(navItems.find(n => n.path === location.pathname) || { en: 'Admin Panel', ar: 'لوحة الإدارة' })}
          </h2>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-600"
              title={isAr ? 'Switch to English' : 'التبديل إلى العربية'}
            >
              <Globe2 className="w-4 h-4 text-cyan-600" />
              {isAr ? 'EN' : 'عر'}
            </button>
            <Link
              to="/"
              target="_blank"
              className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
            >
              {isAr ? 'عرض الموقع ←' : 'View Website →'}
            </Link>
          </div>
        </header>

        {/* Content — text direction follows language for form fields */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6" dir={isAr ? 'rtl' : 'ltr'}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
