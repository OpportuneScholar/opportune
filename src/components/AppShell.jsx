import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Sparkles, Compass, FolderCheck, ScanSearch, CalendarClock, ClipboardList,
  Bell, Building2, UserCircle, Users, FileCheck2, Megaphone, ShieldCheck, BarChart3,
  Menu, X, LogOut, CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useData } from '../context/DataContext.jsx';
import { initials } from '../utils/format.js';
import NotificationItem from './NotificationItem.jsx';

const STUDENT_NAV = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/student/opportunities?tab=recommended', label: 'Recommended', icon: Sparkles },
  { to: '/student/opportunities?tab=explore', label: 'Explore', icon: Compass },
  { to: '/student/documents', label: 'Documents', icon: FolderCheck },
  { to: '/student/assistant', label: 'Smart Assistant', icon: ScanSearch },
  { to: '/student/deadlines', label: 'Deadlines', icon: CalendarClock },
  { to: '/student/applications', label: 'Applications', icon: ClipboardList },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
  { to: '/student/institution', label: 'My Institution', icon: Building2 },
  { to: '/student/profile', label: 'Profile', icon: UserCircle },
];

const INSTITUTION_NAV = [
  { to: '/institution/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/institution/students', label: 'Students', icon: Users },
  { to: '/institution/documents', label: 'Documents', icon: FileCheck2 },
  { to: '/institution/opportunities', label: 'Opportunities', icon: Sparkles },
  { to: '/institution/notices', label: 'Notices', icon: Megaphone },
  { to: '/institution/profile', label: 'Profile', icon: UserCircle },
];

const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/institutions', label: 'Institutions', icon: ShieldCheck },
  { to: '/admin/documents', label: 'Documents', icon: FileCheck2 },
  { to: '/admin/opportunities', label: 'Opportunities', icon: Sparkles },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
];

function useOutsideClick(ref, onOutside) {
  useEffect(() => {
    function handler(e) {
      if (ref.current && !ref.current.contains(e.target)) onOutside();
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref, onOutside]);
}

export default function AppShell() {
  const { session, logout } = useAuth();
  const data = useData();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  useOutsideClick(notifRef, () => setNotifOpen(false));

  const nav = session.role === 'student' ? STUDENT_NAV : session.role === 'institution' ? INSTITUTION_NAV : ADMIN_NAV;
  const mobileNav = nav.slice(0, 5);

  const student = session.role === 'student' ? data.students.find((s) => s.id === session.id) : null;
  const displayName = student?.fullName || (session.role === 'institution' ? 'Institution Admin' : 'Super Admin');

  const myNotifications = session.role === 'student' ? data.notifications.filter((n) => n.studentId === session.id) : [];
  const unreadCount = myNotifications.filter((n) => !n.read).length;

  const brandLabel = { student: 'Student', institution: 'Institution', admin: 'Super Admin' }[session.role];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 border-r border-slate-200 bg-white flex-shrink-0">
        <div className="h-16 flex items-center gap-2 px-6 border-b border-slate-100">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-lg text-slate-900">Opportune</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">{brandLabel}</p>
          {nav.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px]" strokeWidth={2} />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 w-full transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" /> Log out
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl flex flex-col animate-fadeUp">
            <div className="h-16 flex items-center justify-between px-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                  <CheckCircle2 className="w-[18px] h-[18px] text-white" strokeWidth={2.5} />
                </div>
                <span className="font-display font-bold text-lg">Opportune</span>
              </div>
              <button onClick={() => setMobileOpen(false)} className="p-1.5 text-slate-400"><X className="w-5 h-5" /></button>
            </div>
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              {nav.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                      isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600'
                    }`
                  }
                >
                  <item.icon className="w-[18px] h-[18px]" />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 w-full"
              >
                <LogOut className="w-[18px] h-[18px]" /> Log out
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 -ml-2 text-slate-500" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="lg:hidden flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-slate-900">Opportune</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {session.role === 'student' && (
              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setNotifOpen((v) => !v)}
                  className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-semibold">
                      {unreadCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto card p-2 shadow-pop animate-popIn">
                    <div className="flex items-center justify-between px-2 py-1.5">
                      <p className="text-sm font-semibold text-slate-900">Notifications</p>
                      <button
                        onClick={() => data.markAllNotificationsRead(session.id)}
                        className="text-xs text-brand-600 font-medium hover:underline"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="space-y-1">
                      {myNotifications.slice(0, 6).map((n) => (
                        <NotificationItem key={n.id} notification={n} onClick={() => data.markNotificationRead(n.id)} />
                      ))}
                      {myNotifications.length === 0 && (
                        <p className="text-sm text-slate-400 text-center py-6">No notifications yet.</p>
                      )}
                    </div>
                    <NavLink
                      to="/student/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="block text-center text-xs font-medium text-brand-600 py-2 hover:underline"
                    >
                      View all
                    </NavLink>
                  </div>
                )}
              </div>
            )}
            <button
              onClick={() => {
                if (session.role === 'admin') return;
                navigate(`/${session.role}/profile`);
              }}
              className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-semibold">
                {initials(displayName) || 'U'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-slate-700">{displayName.split(' ')[0]}</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex items-center justify-around px-2 py-2 z-30">
        {mobileNav.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-[10px] font-medium ${
                isActive ? 'text-brand-700' : 'text-slate-400'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label.split(' ')[0]}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
