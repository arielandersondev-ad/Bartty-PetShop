"use client";

import { useRouter }   from "next/navigation"; 

interface NavBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  handleLogin: () => void;
  handleReturning: () => void;
  handleCurrentContent: () => void;
}

export default function NavBar({ isSidebarOpen, setIsSidebarOpen, handleLogin, handleReturning, handleCurrentContent }: NavBarProps) {
  const router = useRouter();

  return (
    <>
      <nav className='w-full bg-[#8B4513] shadow-md p-5 flex justify-between fixed top-0 z-10 border-b-2 border-[#D2691E]'>
        <div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <h1 className='text-xl'>🟰</h1>
          </button>
        </div>
        <div>
          <button onClick={() => handleCurrentContent()}>
            <h1 className='font-bold text-white text-xl'>BARTTY</h1>
          </button>
        </div>
        <div>
          <button onClick={handleLogin} >
            <h1>👤SESION</h1>
          </button>
        </div>
      </nav>
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-20 w-64 md:w-80 bg-[#8B4513] transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out `}>
        <div className="p-5 flex">
          <div className="text-center max-w-md">
            <button
              onClick={() => setIsSidebarOpen(false)}
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                BARTTY
              </h1>
            </button>
            <div className="space-y-4 bg-amber-600 p-6 rounded-2xl ">
              <button
                onClick={() => router.push('/test')}
                className="w-full bg-gray-400 hover:bg-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 shadow-md"
              >
                Test
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </>
  );
}