"use client";
import { useState } from 'react';
import NavBar from './components/AdminNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFF8E1]">
      <div className='w-full'>
        <NavBar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>
      <div className="flex">
        {/* Main Content */}
        <main className="min-h-screen bg-[#FFF8E1] overflow-x-hidden min-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}