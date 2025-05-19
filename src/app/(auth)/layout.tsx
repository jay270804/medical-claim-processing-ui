import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-4 md:p-8">
      <div className="w-full max-w-md">
        {children}
      </div>
    </main>
  );
}