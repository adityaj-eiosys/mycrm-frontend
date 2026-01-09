export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  linkedLead?: {
    id: string;
    name: string;
    email: string;
  };
  assignedManager: {
    id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientDto {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  linkedLeadId?: string;
  assignedManagerId: string;
}

export interface UpdateClientDto {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  linkedLeadId?: string;
  assignedManagerId?: string;
}
