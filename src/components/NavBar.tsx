"use client";
interface NavBarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  handleLogin: () => void;
  handleReturning: () => void;
  handleCurrentContent: () => void;
}
export default function NavBar({ isSidebarOpen, setIsSidebarOpen, handleLogin, handleCurrentContent }: NavBarProps) {

  return (
    <>
      <nav className='w-full bg-[#8B4513] shadow-md p-5 flex justify-between fixed top-0 z-10 border-b-2 border-[#D2691E]'>
        <div>
          <button>
            <h1 className='text-xl'> </h1>
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

      {/* Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-10" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} onClick={() => setIsSidebarOpen(false)}></div>
      )}
    </>
  );
}