export interface User {
  id: string;
  fullName: string;
  email: string;
  mobileNumber: string;
  role: {
    id: string;
    name: string;
    description?: string;
  };
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  roleId: string;
  enabled?: boolean;
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  password?: string;
  roleId?: string;
  enabled?: boolean;
}
