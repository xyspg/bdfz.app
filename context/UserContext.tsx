// contexts/UserContext.tsx

import React, { createContext, useState, ReactNode } from 'react';

interface UserContextProps {
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;
}

export const UserContext = createContext<UserContextProps>({
  user: null,
  setUser: () => null,
});

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContextProvider: React.FC<UserContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
