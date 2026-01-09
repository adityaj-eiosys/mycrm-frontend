'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Briefcase, UserCircle, LogOut, Shield, Settings } from 'lucide-react';
import { logout, isAuthenticated } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { api } from '@/lib/api';
import { User } from '@/types/user';
import { isAdmin } from '@/lib/user-helpers';

const baseMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/leads', label: 'Leads', icon: Briefcase },
  { href: '/dashboard/clients', label: 'Clients', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];


const adminMenuItems = [
  { href: '/dashboard/users', label: 'Users', icon: Shield },
];

export function Sidebar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const fetchUser = async () => {
      try {
        const userData = await api.get<User>('/users/me');
        setCurrentUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    if (isAuthenticated()) {
      fetchUser();
    }
  }, []);

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated()) {
    return null;
  }

  const menuItems = isAdmin(currentUser)
    ? [...baseMenuItems, ...adminMenuItems]
    : baseMenuItems;

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white dark:bg-gray-900">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">MyCRM</h1>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive
                ? 'bg-primary text-primary-foreground'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                }`}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => logout()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );
}
