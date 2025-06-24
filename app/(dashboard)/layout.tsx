import React from 'react'
import "../globals.css";
import NavBar from '@/components/NavBar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <main className="container mx-auto px-6 py-8 max-w-7xl">
      {children}
    </main>
    </>
  );
}