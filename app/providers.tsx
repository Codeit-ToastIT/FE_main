'use client';

import { AuthProvider } from './context/AuthContext';
import { EmailProvider } from './context/EmailContext';
import { MemoProvider } from './context/MemoContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <EmailProvider>
        <MemoProvider>{children}</MemoProvider>
      </EmailProvider>
    </AuthProvider>
  );
}
