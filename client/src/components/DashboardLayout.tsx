import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import { 
  LayoutDashboard, User, Briefcase, Award, Brain, MessageSquare, 
  Star, Users, Bell, LogOut, CheckSquare, Shield, ShieldAlert,
  Calendar, FileText, BarChart3, Search, Menu, X
} from 'lucide-react';
import { api } from '../services/api';

interface SidebarItem {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
}

interface SidebarCategory {
  title: string;
  emoji: string;
  items: SidebarItem[];
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [notifications, setNotifications] = useState<{ id: string; title: string; message: string; read: boolean }[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Scroll state
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(true);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Initialize socket connection and fetch initial notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const data = await api.get('/notifications');
        // Transform _id to id to match existing socket state format
        const formattedNotifs = data.notifications.map((n: any) => ({
          id: n._id,
          title: n.title,
          message: n.message,
          read: n.read
        }));
        setNotifications(formattedNotifs);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();

    const apiOrigin = import.meta.env.VITE_API_URL 
      ? new URL(import.meta.env.VITE_API_URL as string).origin 
      : 'http://localhost:5000';
      
    // Vercel Serverless Functions do not support WebSockets/Long Polling natively
    // Skip Socket.io initialization if hitting Vercel to prevent console 404 network errors
    if (apiOrigin.includes('vercel.app')) {
      return;
    }

    const newSocket = io(apiOrigin, {
      reconnectionAttempts: 2, // Stop trying to reconnect if server doesn't support WebSockets
      reconnectionDelay: 5000
    });

    newSocket.on('connect', () => {
      newSocket.emit('join_room', user.id);
    });

    newSocket.on('notification', (notif: any) => {
      setNotifications(prev => [
        { id: `notif_${Date.now()}`, title: notif.title, message: notif.message, read: false },
        ...prev
      ]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  if (!user) return null;

  const isAllowed = (flagId: string) => {
    // If the database has never been configured for this role, default to allowing everything
    if (!user.permissions || Object.keys(user.permissions).length === 0) return true;
    return user.permissions[flagId] !== false;
  };

  // Sidebar link builder with categories
  const sidebarItems: Record<string, SidebarCategory[]> = {
    Student: [
      {
        title: 'MAIN',
        emoji: '🏠',
        items: [
          { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        ]
      },
      {
        title: 'PROFILE',
        emoji: '👤',
        items: [
          ...(isAllowed('canViewProfile') ? [{ name: 'Profile & Resume', path: '/profile', icon: User }] : []),
          { name: 'Resume Builder', path: '/resume-builder', icon: FileText },
          { name: 'Resume Analyzer', path: '/resume-analyzer', icon: FileText },
        ]
      },
      {
        title: 'PLACEMENTS',
        emoji: '💼',
        items: [
          { name: 'Job Board', path: '/jobs', icon: Briefcase },
          { name: 'AI Job Match', path: '/job-matcher', icon: Briefcase },
          { name: 'Eligibility Checker', path: '/eligibility-checker', icon: ShieldAlert },
          { name: 'My Applications', path: '/applications', icon: FileText },
        ]
      },
      {
        title: 'AI TOOLS',
        emoji: '🧠',
        items: [
          { name: 'AI Career Coach', path: '/career-roadmap', icon: Brain },
          { name: 'AI Mock Interview', path: '/mock-interview', icon: Award },
        ]
      },
      {
        title: 'PRACTICE',
        emoji: '💻',
        items: [
          { name: 'Skill Assessments', path: '/coding-lab', icon: CheckSquare },
          { name: 'Community', path: '/forum', icon: MessageSquare },
        ]
      },
      {
        title: 'DISCOVER',
        emoji: '🔍',
        items: [
          { name: 'Global Search', path: '/search-system', icon: Search },
          { name: 'Company Insights', path: '/reviews', icon: Star },
        ]
      },
    ],
    Recruiter: [
      { title: 'MAIN', emoji: '🏠', items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]},
      { title: 'JOBS', emoji: '💼', items: [
        { name: 'Company Profile', path: '/company-profile', icon: Briefcase },
        { name: 'Create Jobs', path: '/jobs/manage', icon: Briefcase },
        { name: 'View Analytics', path: '/analytics', icon: BarChart3 },
      ]},
      { title: 'CANDIDATES', emoji: '👥', items: [
        { name: 'Shortlist Candidates', path: '/candidates', icon: Users },
        { name: 'AI Resume Ranking', path: '/resume-ranking', icon: Award },
        { name: 'Schedule Interviews', path: '/scheduler', icon: Calendar },
        { name: 'Hire/Reject', path: '/hire-reject', icon: CheckSquare },
        { name: 'Exam Creator', path: '/officer/exams', icon: CheckSquare },
      ]},
      { title: 'COMMUNICATION', emoji: '📧', items: [
        { name: 'Send Emails', path: '/send-emails', icon: FileText },
      ]},
      { title: 'DISCOVER', emoji: '🔍', items: [
        { name: 'Discussion Forum', path: '/forum', icon: MessageSquare },
        { name: 'Company Reviews', path: '/reviews', icon: Star },
      ]},
    ],
    PlacementOfficer: [
      { title: 'MAIN', emoji: '🏠', items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]},
      { title: 'MANAGEMENT', emoji: '⚙️', items: [
        { name: 'Manage Companies', path: '/officer/companies', icon: Briefcase },
        { name: 'Manage Students', path: '/officer/students', icon: Users },
        { name: 'Verify Documents', path: '/officer/verify', icon: Shield },
        { name: 'Send Notices', path: '/officer/notices', icon: Bell },
        { name: 'Exam Creator', path: '/officer/exams', icon: CheckSquare },
      ]},
      { title: 'ANALYTICS', emoji: '📊', items: [
        { name: 'Generate Reports', path: '/officer/reports', icon: FileText },
        { name: 'Eligibility Rules', path: '/officer/rules', icon: ShieldAlert },
        { name: 'Placement Analytics', path: '/officer/analytics', icon: BarChart3 },
      ]},
      { title: 'DISCOVER', emoji: '🔍', items: [
        { name: 'Discussion Forum', path: '/forum', icon: MessageSquare },
      ]},
    ],
    Admin: [
      { title: 'MAIN', emoji: '🏠', items: [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ]},
      { title: 'ADMINISTRATION', emoji: '⚙️', items: [
        { name: 'User Management', path: '/admin/users', icon: Users },
        { name: 'Permissions', path: '/admin/permissions', icon: Shield },
        { name: 'Activity Logs', path: '/admin/logs', icon: FileText },
        { name: 'Backup Database', path: '/admin/backup', icon: ShieldAlert },
      ]},
      { title: 'ANALYTICS', emoji: '📊', items: [
        { name: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
      ]},
      { title: 'DISCOVER', emoji: '🔍', items: [
        { name: 'Discussion Forum', path: '/forum', icon: MessageSquare },
      ]},
    ]
  };

  const navCategories = sidebarItems[user.role] || [];
  const navItems = navCategories.flatMap(cat => cat.items);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    try {
      await api.put('/notifications/read', {});
    } catch (err) {
      console.error('Failed to mark notifications read', err);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const scrollTop = target.scrollTop;
    const scrollHeight = target.scrollHeight;
    const clientHeight = target.clientHeight;
    
    setShowScrollTop(scrollTop > 50);
    setShowScrollBottom(scrollTop < scrollHeight - clientHeight - 50);
  };

  const scrollToTop = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const scrollToBottom = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({ 
        top: sidebarRef.current.scrollHeight, 
        behavior: 'smooth' 
      });
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-800">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Mobile: slide-in, Desktop: fixed */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 print:hidden
        w-64 bg-white border-r border-slate-200 
        flex flex-col p-5
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Header */}
        <div className="flex items-center justify-between mb-8 px-2">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center font-bold text-white shadow-soft">
              S
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-widest text-slate-900 uppercase">Smart Portal</h1>
              <span className="text-xs text-emerald-600 font-semibold">{user.role} Hub</span>
            </div>
          </div>
          {/* Close button for mobile */}
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-slate-100 "
          >
            <X className="h-5 w-5 text-slate-600" />
          </button>
        </div>

        {/* Navigation Links - Scrollable */}
        <nav 
          ref={sidebarRef}
          className="sidebar-nav flex-1 space-y-4 overflow-y-auto scroll-smooth pr-1"
          onScroll={handleScroll}
        >
          {navCategories.map((category) => (
            <div key={category.title}>
              {/* Category Header */}
              <div className="flex items-center space-x-2 px-3 mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {category.emoji} {category.title}
                </span>
              </div>
              
              {/* Category Items */}
              <div className="space-y-1">
                {category.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive 
                          ? 'bg-slate-900 text-white shadow-soft' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Info & Signout - Fixed at bottom */}
        <div className="border-t border-slate-200 pt-5 px-2 space-y-4 mt-4">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-semibold text-slate-700">
              {user.name.charAt(0)}
            </div>
            <div className="truncate">
              <p className="text-sm font-semibold text-slate-900 leading-tight truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="relative h-16 bg-white border-b border-slate-200 px-4 lg:px-8 flex items-center justify-between z-50 print:hidden">
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu className="h-5 w-5 text-slate-600" />
            </button>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {navItems.find(item => item.path === location.pathname)?.name || 'Smart Portal'}
            </h2>
          </div>

          <div className="flex items-center space-x-3 lg:space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 relative transition-colors"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-72 lg:w-80 bg-white border border-slate-200 rounded-xl shadow-elevated p-4 space-y-3 z-50">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="font-bold text-sm text-slate-900">Notifications ({unreadCount})</h3>
                    <button onClick={markAllRead} className="text-xs text-slate-500 hover:text-slate-900 transition-colors">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 py-4 text-center">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`p-3 rounded-lg text-xs ${n.read ? 'bg-white border border-slate-100' : 'bg-slate-50 border border-slate-200'}`}>
                          <h4 className="font-semibold text-slate-900">{n.title}</h4>
                          <p className="text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile pill - hidden on small mobile */}
            <div className="hidden sm:flex items-center space-x-2 border border-slate-200 px-3 py-1.5 rounded-full bg-white shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-slate-700 tracking-wide">{user.role} mode</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 relative bg-slate-50">
          <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
