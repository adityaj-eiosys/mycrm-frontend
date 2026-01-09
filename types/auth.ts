export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  roleId?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    mobileNumber: string;
    role: string;
  };
}
