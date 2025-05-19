'use client';

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileUp,
  UserCircle,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { logout, user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const navItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Upload Claim',
      href: '/upload',
      icon: FileUp,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-white hover:bg-slate-800"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-300 ease-in-out',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="h-16 flex items-center justify-center border-b border-slate-800">
            <h1 className="text-xl font-bold text-[#2f7ff2]">Medical Claims</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start gap-2 text-white hover:bg-slate-800 hover:text-white"
                onClick={() => router.push(item.href)}
              >
                <item.icon size={20} />
                {item.title}
              </Button>
            ))}
          </nav>

          {/* Logout Button */}
          {user?.email && (
            <div className="px-4 pb-2 text-slate-400 text-xs truncate flex items-center gap-2" title={user?.email}>
              <UserCircle size={16} className="text-slate-500" />
              {user?.email}
            </div>
          )}
          <div className="p-4 border-t border-slate-800">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-red-500 hover:bg-red-500/10 hover:text-red-500"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'flex-1 transition-all duration-300 ease-in-out',
          isSidebarOpen ? 'lg:ml-64' : 'ml-0'
        )}
      >
        <div className="container mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
      <footer className="w-full bg-slate-900 border-t border-slate-800 py-4 flex flex-col items-center text-center mt-auto">
        <span className="text-slate-400 text-sm">&copy; {new Date().getFullYear()} Medical Claims Processing UI. All rights reserved.</span>
        <span className="text-slate-600 text-xs mt-1">Built with <span className="text-[#2f7ff2] font-semibold">Next.js</span> &amp; <span className="text-[#2f7ff2] font-semibold">shadcn/ui</span></span>
      </footer>
    </div>
  );
}