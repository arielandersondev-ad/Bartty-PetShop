"use client";
import { useState } from 'react';
import NavBar from './components/AdminNav';
import { customStyles } from '@/styles/colors';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handlerCurrentContent = () => {
    // Lógica si es necesaria
  };

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      <NavBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleCurrentContent={handlerCurrentContent}
      />
      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 p-6 bg-[#FFF8E1]">
          {children}
        </main>
      </div>
    </div>
  );
}