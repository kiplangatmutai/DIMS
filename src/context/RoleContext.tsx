import React, { useState, createContext, useContext } from 'react';
import { Role, ROLES } from '../data/roles';

export interface AuthUser {
  id: string;
  name?: string;
  username?: string;
  email: string;
  role?: {
    id: string;
    name?: string;
    tier?: string;
  };
  facility?: {
    id: string;
    name: string;
  } | null;
}

interface RoleContextType {
  currentRole: Role;
  currentUser: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setSession: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const getRoleForUser = (user: AuthUser | null) =>
  ROLES.find((role) => role.id === user?.role?.id) ||
  ROLES.find((role) => role.id === 'super-admin') ||
  ROLES[0];

export function RoleProvider({ children }: {children: React.ReactNode;}) {
  const [token, setToken] = useState<string | null>(() =>
  localStorage.getItem('dims_token')
  );
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('dims_user');

    if (!saved) {
      return null;
    }

    try {
      return JSON.parse(saved) as AuthUser;
    } catch {
      localStorage.removeItem('dims_user');
      return null;
    }
  });

  const currentRole = getRoleForUser(currentUser);

  const setSession = (nextToken: string, user: AuthUser) => {
    setToken(nextToken);
    setCurrentUser(user);
    localStorage.setItem('dims_token', nextToken);
    localStorage.setItem('dims_user', JSON.stringify(user));
    localStorage.removeItem('dims_role');
  };

  const logout = () => {
    setToken(null);
    setCurrentUser(null);
    localStorage.removeItem('dims_token');
    localStorage.removeItem('dims_user');
    localStorage.removeItem('dims_role');
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        currentUser,
        token,
        isAuthenticated: Boolean(token && currentUser),
        setSession,
        logout
      }}>
      
      {children}
    </RoleContext.Provider>);

}
export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
