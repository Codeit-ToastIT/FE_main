'use client';

import { AuthProvider } from './context/AuthContext';
import { EmailProvider } from './context/EmailContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EmailProvider>{children}</EmailProvider>
    </AuthProvider>
  );
}
