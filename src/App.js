import "@/index.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "./components/ui/sonner";

// Contexts
import { LanguageProvider } from "./context/LanguageContext";
import { AdminAuthProvider, useAdminAuth } from "./context/AdminAuthContext";

// Public components
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Team } from "./components/Team";
import { Projects } from "./components/Projects";
import { Training } from "./components/Training";
import { Awards } from "./components/Awards";
import { Partnerships } from "./components/Partnerships";
import Gallery from "./components/Gallery";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

// Pages
import EventsPage from "./pages/EventsPage";
import PublicationsPage from "./pages/PublicationsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsPage from "./pages/TermsPage";

// Admin
import AdminLogin from "./admin/AdminLogin";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import SiteConfigAdmin from "./admin/pages/SiteConfigAdmin";
import ProjectsAdmin from "./admin/pages/ProjectsAdmin";
import TrainingAdmin from "./admin/pages/TrainingAdmin";
import AwardsAdmin from "./admin/pages/AwardsAdmin";
import MembershipsAdmin from "./admin/pages/MembershipsAdmin";
import PartnersAdmin from "./admin/pages/PartnersAdmin";
import TeamAdmin from "./admin/pages/TeamAdmin";
import EventsAdmin from "./admin/pages/EventsAdmin";
import PublicationsAdmin from "./admin/pages/PublicationsAdmin";
import GalleryAdmin from "./admin/pages/GalleryAdmin";
import SubmissionsAdmin from "./admin/pages/SubmissionsAdmin";
import SettingsAdmin from "./admin/pages/SettingsAdmin";

// Home page
const Home = () => (
  <div className="min-h-screen">
    <Navbar />
    <main>
      <Hero />
      <About />
      <Team />
      <Projects />
      <Training />
      <Awards />
      <Partnerships />
      <Gallery />
      <Contact />
    </main>
    <Footer />
    <Toaster />
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <LanguageProvider>
      <AdminAuthProvider>
        <div className="App">
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms" element={<TermsPage />} />

              {/* Admin auth */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin protected routes */}
              <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="site-config" element={<SiteConfigAdmin />} />
                <Route path="projects" element={<ProjectsAdmin />} />
                <Route path="training" element={<TrainingAdmin />} />
                <Route path="awards" element={<AwardsAdmin />} />
                <Route path="memberships" element={<MembershipsAdmin />} />
                <Route path="partners" element={<PartnersAdmin />} />
                <Route path="team" element={<TeamAdmin />} />
                <Route path="events" element={<EventsAdmin />} />
                <Route path="publications" element={<PublicationsAdmin />} />
                <Route path="gallery" element={<GalleryAdmin />} />
                <Route path="submissions" element={<SubmissionsAdmin />} />
                <Route path="settings" element={<SettingsAdmin />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AdminAuthProvider>
    </LanguageProvider>
  );
}

export default App;
