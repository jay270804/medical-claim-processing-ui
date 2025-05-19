import React from 'react';

export interface FormErrorProps {
  children: React.ReactNode;
}

export function FormError({ children }: FormErrorProps) {
  if (!children) {
    return null;
  }

  return (
    <p className="text-sm font-medium text-red-500">{children}</p>
  );
}