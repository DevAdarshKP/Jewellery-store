import { getCurrentSession } from '@/lib/auth/session';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getCurrentSession();

  // If no session (e.g. login page), render bare children
  if (!session) {
    return <div className="min-h-screen bg-onyx-950 text-ivory-50">{children}</div>;
  }

  return (
    <div className="flex min-h-screen bg-ivory-100/60 font-sans">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader userName={session.name} userEmail={session.email} />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

