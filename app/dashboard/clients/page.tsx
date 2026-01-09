'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types/client';
import { ClientForm } from '@/components/ui/forms/client-form';
import { api } from '@/lib/api';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    try {
      const data = await api.get<Client[]>('/clients');
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      await api.delete(`/clients/${id}`);
      fetchClients();
    } catch (error) {
      console.error('Failed to delete client:', error);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingClient(null);
    fetchClients();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">Manage your clients and customers</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Client
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingClient ? 'Edit Client' : 'Create New Client'}</CardTitle>
            <CardDescription>
              {editingClient ? 'Update client information' : 'Add a new client to the system'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ClientForm
              initialData={editingClient}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingClient(null);
              }}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <CardTitle className="text-lg">{client.companyName}</CardTitle>
              <CardDescription>{client.contactPerson}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium">Email:</span> {client.email}
                </p>
                <p>
                  <span className="font-medium">Phone:</span> {client.phone}
                </p>
                <p>
                  <span className="font-medium">Manager:</span> {client.assignedManager.fullName}
                </p>
                {client.linkedLead && (
                  <p>
                    <span className="font-medium">Linked Lead:</span> {client.linkedLead.name}
                  </p>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingClient(client);
                    setShowForm(true);
                  }}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(client.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {clients.length === 0 && !loading && (
        <Card>
          <CardContent className="py-10 text-center">
            <p className="text-muted-foreground">No clients found. Create your first client to get started.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
