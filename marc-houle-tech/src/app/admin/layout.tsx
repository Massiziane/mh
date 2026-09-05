import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-shell min-h-screen bg-[#f4f7fb]">
      <div className="flex min-h-screen">
        <div className="sticky top-0 hidden h-screen lg:block">
          <AdminSidebar />
        </div>

        <div className="min-w-0 flex-1">
          <AdminHeader />

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}