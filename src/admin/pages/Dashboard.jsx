import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../utils/api';
import { FolderOpen, GraduationCap, Trophy, Users, Calendar, FileText, Image, Handshake } from 'lucide-react';

const StatCard = ({ icon: Icon, label, count, path, color }) => (
  <Link to={path} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100 hover:border-cyan-200 group">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800 group-hover:text-cyan-600 transition-colors">{count}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  </Link>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    projects: 0, training: 0, awards: 0, team: 0,
    events: 0, publications: 0, gallery: 0, partners: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projects, training, awards, team, events, publications, gallery, partners] = await Promise.allSettled([
          adminApi.getProjects(),
          adminApi.getTraining(),
          adminApi.getAwards(),
          adminApi.getTeam(),
          adminApi.getEvents(),
          adminApi.getPublications(),
          adminApi.getGallery(),
          adminApi.getPartners()
        ]);
        setStats({
          projects: projects.value?.data?.data?.length || 0,
          training: training.value?.data?.data?.length || 0,
          awards: awards.value?.data?.data?.length || 0,
          team: team.value?.data?.data?.length || 0,
          events: events.value?.data?.data?.length || 0,
          publications: publications.value?.data?.data?.length || 0,
          gallery: gallery.value?.data?.data?.length || 0,
          partners: partners.value?.data?.data?.length || 0
        });
      } catch (e) {}
    };
    fetchStats();
  }, []);

  const statCards = [
    { icon: FolderOpen, label: 'Projects', count: stats.projects, path: '/admin/projects', color: 'bg-cyan-500' },
    { icon: GraduationCap, label: 'Training Programs', count: stats.training, path: '/admin/training', color: 'bg-blue-500' },
    { icon: Trophy, label: 'Awards', count: stats.awards, path: '/admin/awards', color: 'bg-amber-500' },
    { icon: Users, label: 'Team Members', count: stats.team, path: '/admin/team', color: 'bg-green-500' },
    { icon: Calendar, label: 'Events', count: stats.events, path: '/admin/events', color: 'bg-purple-500' },
    { icon: FileText, label: 'Publications', count: stats.publications, path: '/admin/publications', color: 'bg-rose-500' },
    { icon: Image, label: 'Gallery Images', count: stats.gallery, path: '/admin/gallery', color: 'bg-teal-500' },
    { icon: Handshake, label: 'Partners', count: stats.partners, path: '/admin/partners', color: 'bg-indigo-500' }
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome to KWA CMS</h1>
        <p className="text-gray-500 mt-1">Manage all website content from here</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map(card => (
          <StatCard key={card.label} {...card} />
        ))}
      </div>

      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: '+ Add New Event', path: '/admin/events' },
              { label: '+ Add New Publication', path: '/admin/publications' },
              { label: '+ Upload Gallery Image', path: '/admin/gallery' },
              { label: '+ Add Team Member', path: '/admin/team' }
            ].map(action => (
              <Link
                key={action.path}
                to={action.path}
                className="block px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-cyan-50 hover:text-cyan-700 text-sm font-medium text-gray-700 transition-colors"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-800 mb-4">Site Configuration</h3>
          <div className="space-y-2">
            {[
              { label: 'Edit Hero Section', path: '/admin/site-config' },
              { label: 'Edit About Section', path: '/admin/site-config' },
              { label: 'Update Contact Info', path: '/admin/settings' },
              { label: 'Manage Social Links', path: '/admin/settings' }
            ].map(action => (
              <Link
                key={action.label}
                to={action.path}
                className="block px-4 py-2.5 rounded-lg bg-gray-50 hover:bg-cyan-50 hover:text-cyan-700 text-sm font-medium text-gray-700 transition-colors"
              >
                {action.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
