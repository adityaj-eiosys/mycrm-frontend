export enum LeadStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  WON = 'WON',
  LOST = 'LOST',
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  assignedTo: {
    id: string;
    fullName: string;
    email: string;
  };
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateLeadDto {
  name: string;
  email: string;
  phone: string;
  status?: LeadStatus;
  assignedToId: string;
}

export interface UpdateLeadDto {
  name?: string;
  email?: string;
  phone?: string;
  status?: LeadStatus;
  assignedToId?: string;
}
