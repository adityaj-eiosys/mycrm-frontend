'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@/types/user';
import { UsersRole } from '@/types/role';
import { api } from '@/lib/api';
import { Plus, Edit, Trash2, Shield, AlertCircle } from 'lucide-react';
import { isAdmin } from '@/lib/user-helpers';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<UsersRole[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingRoles, setUpdatingRoles] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if current user is admin
        const currentUserData = await api.get<User>('/users/me');
        setCurrentUser(currentUserData);

        if (!isAdmin(currentUserData)) {
          router.push('/dashboard');
          return;
        }

        // Fetch users and roles
        const [usersData, rolesData] = await Promise.all([
          api.get<User[]>('/users'),
          api.get<UsersRole[]>('/roles'),
        ]);

        setUsers(usersData);
        setRoles(rolesData);
      } catch (error: any) {
        console.error('Failed to fetch data:', error);
        setError(error.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleRoleChange = async (userId: string, newRoleId: string) => {
    setUpdatingRoles((prev) => new Set(prev).add(userId));
    setError('');

    try {
      await api.patch(`/users/${userId}/role`, { roleId: newRoleId });

      // Update local state
      const updatedUsers = users.map((user) => {
        if (user.id === userId) {
          const newRole = roles.find((r) => r.id === newRoleId);
          return {
            ...user,
            role: newRole || user.role,
          };
        }
        return user;
      });

      setUsers(updatedUsers);

      // Show success message
      alert('Role updated successfully! The user must re-login to apply changes.');
    } catch (error: any) {
      setError(error.message || 'Failed to update role');
      console.error('Failed to update role:', error);
    } finally {
      setUpdatingRoles((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (error: any) {
      setError(error.message || 'Failed to delete user');
      console.error('Failed to delete user:', error);
    }
  };

  const getRoleBadgeColor = (roleName: string) => {
    switch (roleName) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200';
      case 'SALES':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200';
      case 'USER':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-200';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin(currentUser)) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p>Access denied. Admin privileges required.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage users and their roles</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Admin Panel</span>
        </div>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => {
                const isUpdating = updatingRoles.has(user.id);
                const isCurrentUser = currentUser?.id === user.id;

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-medium">{user.fullName}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground">{user.mobileNumber}</p>
                        </div>
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(
                            user.role.name,
                          )}`}
                        >
                          {user.role.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-xs text-muted-foreground">(You)</span>
                        )}
                        {!user.enabled && (
                          <span className="text-xs text-red-600">(Disabled)</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Select
                        value={user.role.id}
                        onValueChange={(newRoleId) => handleRoleChange(user.id, newRoleId)}
                        disabled={isUpdating || isCurrentUser}
                      >
                        <SelectTrigger className="w-40" disabled={isUpdating || isCurrentUser}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {roles.map((role) => (
                            <SelectItem key={role.id} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {isUpdating && (
                        <span className="text-xs text-muted-foreground">Updating...</span>
                      )}

                      {isCurrentUser && (
                        <span className="text-xs text-muted-foreground">
                          Cannot change own role
                        </span>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                        disabled={isCurrentUser}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {users.length === 0 && (
              <div className="py-10 text-center text-muted-foreground">
                No users found.
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="text-sm">Important Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-blue-800 dark:text-blue-200">
            <ul className="list-disc list-inside space-y-1">
              <li>Users must re-login after role changes to apply new permissions</li>
              <li>You cannot change your own role (ask another admin)</li>
              <li>Deleting a user is permanent and cannot be undone</li>
              <li>Only ADMIN users can access this page</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
