"use client";
import { useState } from 'react';
import Cookies from 'js-cookie';
import AgendaContent from '../components/AgendaContent';
import Login, { LoginClinte } from '../app/login/page';
import Agenda from '../app/agenda/page';
import NavBar from '../components/NavBar';
import ConfirmacionCita from '@/components/ConfirmacionCita';
import Image from 'next/image';

export default function Home() {
  const [currentViewMain, setCurrentViewMain] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [Modal, setModal] = useState('home');

  const handleReturning = () => {
    Cookies.set('sessionType', 'returning', { expires: 1 });
    setCurrentViewMain('agenda');
  };
  const handlerCurrentContent = () => {
    setCurrentViewMain('home');
  }

  return (
    <>
      <NavBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        handleLogin={() => setModal('Usuario')}
        handleReturning={handleReturning}
        handleCurrentContent={handlerCurrentContent}
      />
      {/* Modales */}
      {Modal === 'Usuario' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
          <div className= "p-6 rounded-lg  mx-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
            <button onClick={() => setModal('home')} className="mb-4 text-black hover:bg-[#ffb282] font-extrabold text-xl bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl p-2 pl-3 pr-3 ">✕</button>
            <Login />
          </div>
        </div>
      )}
      {Modal === 'ClienteNuevo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
          <div className= "p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
            <button onClick={() => setModal('home')} className="mb-4 text-black hover:bg-[#ffb282] font-extrabold text-xl bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl p-2 pl-3 pr-3 ">✕</button>
            <AgendaContent 
            />
          </div>
        </div>
      )}
      {Modal === 'ClienteAntiguo' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
          <div className= "p-6 rounded-lg mx-4 overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
            <button onClick={() => setModal('home')} className="mb-4 text-black hover:bg-[#ffb282] font-extrabold text-xl bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl p-2 pl-3 pr-3 ">✕</button>
            <LoginClinte
              onCurrentView={(currentViewMain) => {setCurrentViewMain(currentViewMain);setModal('')}}
            />
          </div>
        </div>
      )}
      {Modal === 'Confirmacion' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-20" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
          <div className= "p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
            <button onClick={() => setModal('home')} className="mb-4 text-black hover:bg-[#ffb282] font-extrabold text-xl bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl p-2 pl-3 pr-3 ">✕</button>
             <ConfirmacionCita />
          </div>
        </div>
      )}
      <main className="min-h-screen bg-white flex flex-col md:flex-row ">
        {currentViewMain === 'agenda' &&(
          <div className='w-full text-center bg-[#FFF8E1]'>
            <Agenda />
          </div>
        )}
        {currentViewMain === 'home' &&(
          <>
            <div className="
              md:w-3/4 max-w-6xl mx-0
              h-[300px] md:h-[100vh]
              bg-[url('/image/bartty-logo.jpg')]
              bg-no-repeat
              bg-center
              bg-contain
            "></div>
            <div className='flex flex-col justify-center w-[100vw] md:w-1/4 text-black gap-10 md:gap-20'>
              <h1 className='font font-extrabold md:text-5xl text-[#8B4513] text-2xl text-center'>CAMINEMOS JUNTOS</h1>
              <div className="flex flex-col md:flex-row items-center gap-5 border-b-5 border-[#D2691E] hover:border-b-8 transition-all pb-5">
                <button onClick={() => setModal('ClienteNuevo')} className='hover:scale-115'>
                  <img src="/image/paws.png" alt="patita" className='w-50 h-40'/>
                </button>
                <h1 className='font-extrabold text-amber-600 text-3xl md:text-4xl text-center'>Reserva por Primera Vez</h1>
              </div>
              <h1 className='font-extrabold text-2xl md:text-3xl text-center'>Si no es la primera vez</h1>
              <div className="flex flex-col md:flex-row items-center gap-5 border-b-5 border-[#D2691E] hover:border-b-8 transition-all pb-5">
                <button onClick={() => setModal('ClienteAntiguo')} className='hover:scale-115'>
                  <img src="/image/two-paws.png" alt="dos-patitas" className='w-50 h-50'/>
                </button>
                <h1 className='font-extrabold text-amber-600 text-2xl md:text-3xl'>Sigue el Camino</h1>
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
