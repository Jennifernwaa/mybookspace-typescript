import React from 'react'
import "../globals.css";
import LandingBar from '@/components/LandingBar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LandingBar />
      <main className="flex relative signin-bg flex-col items-center justify-between p-4">
      {children}
    </main>
    </>
  );
}