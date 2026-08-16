import React from 'react';
import { Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useData } from '../../context/DataContext.jsx';
import NotificationItem from '../../components/NotificationItem.jsx';
import EmptyState from '../../components/EmptyState.jsx';

export default function Notifications() {
  const { session } = useAuth();
  const data = useData();
  const myNotifications = [...data.notifications.filter((n) => n.studentId === session.id)].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between animate-fadeUp">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-500 mt-1 text-sm">Stay updated on documents, deadlines and matches.</p>
        </div>
        {myNotifications.some((n) => !n.read) && (
          <button onClick={() => data.markAllNotificationsRead(session.id)} className="btn-secondary text-sm">Mark all read</button>
        )}
      </div>

      {myNotifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You'll see updates about documents, deadlines and matches here." />
      ) : (
        <div className="card p-2 space-y-1">
          {myNotifications.map((n) => (
            <NotificationItem key={n.id} notification={n} onClick={() => data.markNotificationRead(n.id)} />
          ))}
        </div>
      )}
    </div>
  );
}
