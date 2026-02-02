
"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import PetCard from '@/components/PetCard';
import PetList from './PetList';
import NuevaCita from '@/components/citas/NuevaCita';
import CitasList from './CitasList';
import {Cita} from '@/types/citas'

export default function Agenda() {
  const [mascotaCreada, setMascotaCreada] = useState(false)
  const [Modal, setModal] = useState('')
  const [citas, setCitas] = useState<Cita[]>([])
  const router = useRouter()
  const [cliente, setCliente] = useState({  
    nombre: "",
    apellido_materno: "",
    apellido_paterno: "",
    ci: "",
    created_at: "",
    email: "",
    id: "",
    numero_referido: "",
    telefono: "",
  });
  const [mascotas, setMascotas] = useState([])

  
  useEffect(() => {
    /*const sessionCookie = Cookies.get('session');
    if (!sessionCookie) return;
    const session = JSON.parse(sessionCookie);
    if (session.type !== 'cliente') {
      router.push('/');
      return;
    }*/

    const sessionCookie = Cookies.get('session');
    if (!sessionCookie) return;
    let session;
    try {
      session = JSON.parse(sessionCookie);
    } catch (error) {
      console.error('Cookie de sesión corrupta:', error);
      Cookies.remove('session');
      router.push('/');
      return;
    }
    if (!session || session.type !== 'cliente') {
      router.push('/');
      return;
    }
    
    async function getClienteId(ci: string) {
      const res = await fetch(`/api/clientes?action=byId&ci=${ci}`)
      if (!res.ok){console.log('no se pudo obtener los datos del cliente');return}
      const data = await res.json()
      setCliente(data)
    }
    getClienteId(session.ci);
  }, [router]);
  useEffect(() => {
    if (!cliente.id) return
    const fetchCitasIdCliente = async (id: string) => {
      try {
        const res = await fetch(`/api/citas?action=allbyCID&id=${id}`)
        if (!res.ok) {console.log('error de fetch de citas por cliente')}
        const data = await res.json()
        setCitas(data)
      } catch (error) {
        console.error("error en el fetch try", error)
      }
    }
    fetchCitasIdCliente(cliente.id)

  }, [cliente.id])
  
  useEffect(() => {
    if (!cliente.id) return
    const getClientePet = async (id: string) => {
      const res = await fetch(`/api/mascotas?action=clientPets&id=${id}`)
      if (!res.ok){console.log('no se obtubieron los datos de la mascota'); return}
      const data = await res.json()
      console.log('data de front: ',data)
      setMascotas(data)
      setModal('')
    }
    getClientePet(cliente.id)
  }, [cliente?.id])


  return (
    <div className="flex flex-col md:flex-row gap-10 h-full md:h-auto bg-[#FFF8E1] m-5 pt-20 md:p-0 md:m-30">
      {/**MODALES */}
      {Modal === 'nuevaMascota' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pt-20 bg-black/50">
          <button onClick={() => setModal('')} className="mb-4 text-black hover:bg-[#ffb282] font-extrabold text-xl bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl p-2 pl-3 pr-3 ">✕</button>
          <PetCard
          cliente_id={cliente.id}
          onMascotaCreada={setMascotaCreada}
          ></PetCard>
        </div>
      )}
      {Modal === 'nuevaCita' && (
        <div className='fixed inset-0 z-50 flex items-center justify-center pt-20 bg-black/50'>
          <button onClick={() => setModal('')} className="mb-4 text-black hover:bg-[#ffb282] font-extrabold text-xl bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl p-2 pl-3 pr-3 ">✕</button>
          <NuevaCita
            clienteId={cliente.id}
            mascotas={mascotas}
          />

        </div>
      )}
      <div className='flex flex-col gap-5 text-black bg-[#FFF8E1] '>
        {/* Datos del cliente */}
        <div className="flex  flex-col bg-[#FFFfff] border border-[#d2691e] p-5 rounded-lg shadow-md items-center">
          <div className='font-extrabold w-full'>Bienvenido {cliente?.nombre}</div>
          <div className='flex flex-row w-full'>
            <div className='w-1/2'>Email:</div>
            <div className='w-auto'>{cliente?.email}</div>
          </div>
          <div className='flex flex-row w-full'>
            <div className='w-1/2'>Telefono</div>
            <div className='w-auto'>{cliente?.telefono}</div>
          </div>
          <div className='flex flex-col md:flex-row gap-3 justify-between w-full'>
            <button className='bg-green-500 rounded-lg shadow-md hover:bg-green-600 cursor-pointer p-4'
              onClick={()=> {setModal('nuevaMascota')}}
            >➕Mascota</button>
            <button className='bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 cursor-pointer p-4 text-white'
              onClick={()=> {setModal('nuevaCita');console.log('datos del mascotas antes de enviarse: ',mascotas)}}
            >➕CITA</button>
          </div>
        </div>
        {/* Lista de mascotas */}
          <PetList
            mascotas={mascotas}
            onMascotaCreaada={setMascotaCreada}
          />

      </div>

      {/* Lista de citas anteriores */}
      <CitasList
      citas={citas}
      />
    </div>
  );
}
