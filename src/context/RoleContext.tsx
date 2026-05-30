import React, { useEffect, useState, createContext, useContext } from 'react';
import { Role, ROLES } from '../data/roles';
interface RoleContextType {
  currentRole: Role;
  setCurrentRole: (role: Role) => void;
}
const RoleContext = createContext<RoleContextType | undefined>(undefined);
export function RoleProvider({ children }: {children: React.ReactNode;}) {
  const [currentRole, setCurrentRoleState] = useState<Role>(() => {
    const saved = localStorage.getItem('dims_role');
    if (saved) {
      const found = ROLES.find((r) => r.id === saved);
      if (found) return found;
    }
    return ROLES[0];
  });
  const setCurrentRole = (role: Role) => {
    setCurrentRoleState(role);
    localStorage.setItem('dims_role', role.id);
  };
  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole
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