import React from 'react'
import "../globals.css";
import NavBar from '@/components/NavBar';
import AuthGuard from '@/components/AuthGuard';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
        <NavBar />
        <main className="container mx-auto px-6 py-8 max-w-7xl flex-1">
          <AuthGuard>
            {children}
          </AuthGuard>
        </main>
    </>
  );
}
