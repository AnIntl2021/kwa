import axios from 'axios';

const API_URL =  'https://api.kuwaitwaterassociation.org';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000
});

// Attach admin token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Public data helpers (no auth required)
export const publicApi = {
  getSiteConfig: () => api.get('/public/site-config'),
  getProjects: () => api.get('/public/projects'),
  getTraining: () => api.get('/public/training'),
  getAwards: () => api.get('/public/awards'),
  getMemberships: () => api.get('/public/memberships'),
  getPartners: () => api.get('/public/partners'),
  getTeam: () => api.get('/public/team'),
  getLatestEvents: () => api.get('/public/events/latest'),
  getEvents: () => api.get('/public/events'),
  getPublications: () => api.get('/public/publications'),
  getGallery: () => api.get('/public/gallery'),
  // Form submissions
  submitTraining: (data) => api.post('/public/submit/training', data),
  submitContact: (data) => api.post('/public/submit/contact', data),
  submitNewsletter: (email) => api.post('/public/submit/newsletter', { email }),
  submitVolunteer: (data) => api.post('/public/submit/volunteer', data),
};

// Admin data helpers (require auth)
export const adminApi = {
  // Auth
  changePassword: (data) => api.put('/auth/change-password', data),

  // Upload
  uploadFile: (formData) => api.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }, timeout: 300000 }),
  getPresignedUrl: (folder, filename, contentType) => api.get(`/admin/presigned-url?folder=${folder}&filename=${encodeURIComponent(filename)}&contentType=${encodeURIComponent(contentType)}`),

  // Site config
  getSiteConfig: () => api.get('/admin/site-config'),
  updateSiteConfig: (data) => api.put('/admin/site-config', data),

  // Projects
  getProjects: () => api.get('/admin/projects'),
  createProject: (data) => api.post('/admin/projects', data),
  updateProject: (id, data) => api.put(`/admin/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/admin/projects/${id}`),

  // Training
  getTraining: () => api.get('/admin/training'),
  createTraining: (data) => api.post('/admin/training', data),
  updateTraining: (id, data) => api.put(`/admin/training/${id}`, data),
  deleteTraining: (id) => api.delete(`/admin/training/${id}`),

  // Awards
  getAwards: () => api.get('/admin/awards'),
  createAward: (data) => api.post('/admin/awards', data),
  updateAward: (id, data) => api.put(`/admin/awards/${id}`, data),
  deleteAward: (id) => api.delete(`/admin/awards/${id}`),

  // Memberships
  getMemberships: () => api.get('/admin/memberships'),
  createMembership: (data) => api.post('/admin/memberships', data),
  updateMembership: (id, data) => api.put(`/admin/memberships/${id}`, data),
  deleteMembership: (id) => api.delete(`/admin/memberships/${id}`),

  // Partners
  getPartners: () => api.get('/admin/partners'),
  createPartner: (data) => api.post('/admin/partners', data),
  updatePartner: (id, data) => api.put(`/admin/partners/${id}`, data),
  deletePartner: (id) => api.delete(`/admin/partners/${id}`),

  // Team
  getTeam: () => api.get('/admin/team'),
  createTeamMember: (data) => api.post('/admin/team', data),
  updateTeamMember: (id, data) => api.put(`/admin/team/${id}`, data),
  deleteTeamMember: (id) => api.delete(`/admin/team/${id}`),

  // Events
  getEvents: () => api.get('/admin/events'),
  createEvent: (data) => api.post('/admin/events', data),
  updateEvent: (id, data) => api.put(`/admin/events/${id}`, data),
  deleteEvent: (id) => api.delete(`/admin/events/${id}`),

  // Publications
  getPublications: () => api.get('/admin/publications'),
  createPublication: (data) => api.post('/admin/publications', data),
  updatePublication: (id, data) => api.put(`/admin/publications/${id}`, data),
  deletePublication: (id) => api.delete(`/admin/publications/${id}`),

  // Gallery
  getGallery: () => api.get('/admin/gallery'),
  createGalleryImage: (data) => api.post('/admin/gallery', data),
  updateGalleryImage: (id, data) => api.put(`/admin/gallery/${id}`, data),
  deleteGalleryImage: (id) => api.delete(`/admin/gallery/${id}`),

  // Submissions
  getSubmissions: (type) => api.get(`/admin/submissions${type ? `?type=${type}` : ''}`),
  getUnreadCount: () => api.get('/admin/submissions/unread-count'),
  markSubmissionRead: (id, isRead = true) => api.patch(`/admin/submissions/${id}/read`, { isRead }),
  markAllRead: () => api.patch('/admin/submissions/mark-all-read'),
  deleteSubmission: (id) => api.delete(`/admin/submissions/${id}`),
  deleteSubmissions: (type) => api.delete(`/admin/submissions${type ? `?type=${type}` : ''}`),
};

export default api;
