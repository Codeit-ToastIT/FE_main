import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext({
  token: '',
  setToken: (token: string) => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string>(localStorage.getItem('authToken') || '');

  useEffect(() => {
    localStorage.setItem('authToken', token);
  }, [token]);

  const logout = () => {
    setToken('');
    localStorage.removeItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ token, setToken, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
