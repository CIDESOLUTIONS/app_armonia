import React from 'react';

export default function ReceptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1>Portal de Recepción</h1>
      {children}
    </div>
  );
}