'use client';

import { UserCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { User } from '@/types/user';

export function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await api.get<User>('/users/me');
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-gray-900">
      <div className="flex items-center gap-2">
        <UserCircle className="h-5 w-5" />
        <span className="text-sm font-medium">
          {user?.fullName || 'Loading...'}
        </span>
        {user?.role && (
          <span className="rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
            {user.role.name}
          </span>
        )}
      </div>
    </div>
  );
}
