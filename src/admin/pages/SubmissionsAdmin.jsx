import { useState, useEffect } from 'react';
import { Trash2, Mail, MailOpen, CheckCheck, Inbox } from 'lucide-react';
import { adminApi } from '../../utils/api';

const TYPES = [
  { value: '', label: 'All' },
  { value: 'contact', label: 'Contact' },
  { value: 'training_interest', label: 'Training Interest' },
  { value: 'newsletter', label: 'Newsletter' },
];

const typeBadge = {
  contact: 'bg-blue-100 text-blue-700',
  training_interest: 'bg-violet-100 text-violet-700',
  newsletter: 'bg-green-100 text-green-700',
};

const typeLabel = {
  contact: 'Contact',
  training_interest: 'Training',
  newsletter: 'Newsletter',
};

const SubmissionsAdmin = () => {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSubmissions(filter);
      setItems(res.data.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  const showMsg = (m) => { setMsg(m); setTimeout(() => setMsg(''), 2500); };

  const handleExpand = async (item) => {
    if (expanded === item._id) { setExpanded(null); return; }
    setExpanded(item._id);
    if (!item.isRead) {
      await adminApi.markSubmissionRead(item._id, true);
      setItems(prev => prev.map(i => i._id === item._id ? { ...i, isRead: true } : i));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    await adminApi.deleteSubmission(id);
    setItems(prev => prev.filter(i => i._id !== id));
    if (expanded === id) setExpanded(null);
    showMsg('Deleted.');
  };

  const handleMarkAllRead = async () => {
    await adminApi.markAllRead();
    setItems(prev => prev.map(i => ({ ...i, isRead: true })));
    showMsg('All marked as read.');
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(`Delete all ${filter || ''} submissions?`)) return;
    await adminApi.deleteSubmissions(filter);
    setItems([]);
    showMsg('Deleted.');
  };

  const unread = items.filter(i => !i.isRead).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-gray-800">Submissions</h1>
          {unread > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">{unread} unread</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors">
            <CheckCheck className="w-4 h-4" /> Mark all read
          </button>
          <button onClick={handleDeleteAll} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-red-200 rounded-lg hover:bg-red-50 text-red-600 transition-colors">
            <Trash2 className="w-4 h-4" /> Delete all
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TYPES.map(t => (
          <button key={t.value} onClick={() => setFilter(t.value)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition-colors ${filter === t.value ? 'bg-cyan-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {msg && <div className="mb-4 px-4 py-2 rounded-xl text-sm bg-green-50 text-green-700">{msg}</div>}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Inbox className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>No submissions yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map(item => (
            <div key={item._id} className={`bg-white rounded-2xl border shadow-sm transition-all ${!item.isRead ? 'border-cyan-300 bg-cyan-50/30' : 'border-gray-100'}`}>
              {/* Row */}
              <div className="flex items-center gap-4 p-4 cursor-pointer" onClick={() => handleExpand(item)}>
                <div className="flex-shrink-0">
                  {item.isRead
                    ? <MailOpen className="w-5 h-5 text-gray-400" />
                    : <Mail className="w-5 h-5 text-cyan-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${typeBadge[item.type]}`}>{typeLabel[item.type]}</span>
                    {!item.isRead && <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />}
                    <span className="font-medium text-gray-800 truncate">{item.name || item.email}</span>
                    {item.name && <span className="text-sm text-gray-500 truncate">{item.email}</span>}
                  </div>
                  {item.type === 'training_interest' && item.trainingName && (
                    <p className="text-xs text-violet-600 mt-0.5 truncate">Program: {item.trainingName}</p>
                  )}
                  {item.message && <p className="text-sm text-gray-500 truncate mt-0.5">{item.message}</p>}
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleDateString()}</span>
                  <button onClick={e => { e.stopPropagation(); handleDelete(item._id); }}
                    className="p-1.5 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Expanded detail */}
              {expanded === item._id && (
                <div className="px-4 pb-4 border-t border-gray-100 mt-0 pt-4 grid sm:grid-cols-2 gap-3 text-sm">
                  {item.name && <div><span className="text-gray-500 font-medium">Name: </span>{item.name}</div>}
                  {item.email && <div><span className="text-gray-500 font-medium">Email: </span><a href={`mailto:${item.email}`} className="text-cyan-600 hover:underline">{item.email}</a></div>}
                  {item.phone && <div><span className="text-gray-500 font-medium">Phone: </span>{item.phone}</div>}
                  {item.trainingName && <div><span className="text-gray-500 font-medium">Training: </span>{item.trainingName}</div>}
                  {item.message && <div className="sm:col-span-2"><span className="text-gray-500 font-medium">Message: </span>{item.message}</div>}
                  <div className="sm:col-span-2 text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubmissionsAdmin;
