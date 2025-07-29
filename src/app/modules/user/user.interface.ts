
export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  AGENT = 'agent',
}
export interface IAuthProvider {
    provider: "google" |"credentials";
    providerId: string;
}

export enum IsActive {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BLOCKED = 'blocked',
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  address?: string;
  isActive?: IsActive;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}