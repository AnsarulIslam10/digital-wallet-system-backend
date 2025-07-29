export enum Role {
  ADMIN = 'admin',
  USER = 'user',
  AGENT = 'agent',
}

export interface IUser {
  name: string;
  phone: string;
  email?: string; 
  password: string;
  role: Role;
  isBlocked?: boolean;
}