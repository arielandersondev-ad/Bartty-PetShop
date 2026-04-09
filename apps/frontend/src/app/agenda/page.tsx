
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

  async function fetchCitasIdCliente(id: string){
    try {
      const res = await fetch(`/api/citas?action=allbyCID&id=${id}`)
      if (!res.ok) {console.log('error de fetch de citas por cliente')}
      const data = await res.json()
      if (res.ok){setCitas(data)}
    } catch (error) {
      console.error("error en el fetch try", error)
    }
  }
  async function getClientePet(id: string){
    const res = await fetch(`/api/mascotas?action=clientPets&id=${id}`)
    if (!res.ok){console.log('no se obtubieron los datos de la mascota'); return}
    const data = await res.json()
    console.log('data de front: ',data)
    setMascotas(data)
    setModal('')
  }

  useEffect(() => {
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
    if (!cliente.id)return
    const loadCitas = async ()=> await fetchCitasIdCliente(cliente.id)
    loadCitas()
  }, [cliente.id])
  
  useEffect(() => {
    if (!cliente.id) return
    const loadPets = async () => await getClientePet(cliente.id)
    loadPets()
  }, [cliente.id,mascotaCreada])


  return (
    <div className="min-h-screen bg-[#FFF8E1] p-6 md:p-10 mt-20">
      <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
        <div className='grid grid-cols-1 gap-8 text-black '>
          {/* Datos del cliente */}
          <div className="bg-white border border-[#d2691e]/40 p-6 rounded-2xl shadow-lg space-y-4">
            
            <h2 className="text-xl font-bold text-[#8B4513]">
              👋 Bienvenid@ {cliente.nombre}
            </h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Email</span>
                <span>{cliente.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium text-gray-500">Teléfono</span>
                <span>{cliente.telefono}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                className="flex-1 bg-green-600 hover:bg-green-900 transition text-white font-medium rounded-xl py-2 shadow-md"
                onClick={()=>setModal('nuevaMascota')} 
                >
                ➕ Mascota
              </button>
              <button 
                className="flex-1 bg-blue-500 hover:bg-blue-600 transition text-white font-medium rounded-xl py-2 shadow-md"
                onClick={()=>setModal('nuevaCita')} 
              >
                ➕ Cita
              </button>
            </div>

          </div>
          {/* Lista de mascotas */}
          <div>
            <PetList
              mascotas={mascotas}
              onMascotaCreaada={setMascotaCreada}
            />
            {mascotas.length === 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-md text-center text-gray-500">
                🐾 Aún no tienes mascotas registradas
              </div>
            )}
          </div>

        </div>
        <div className='md:col-span-2'>
          <CitasList
            citas={citas}
          />
          {citas.length=== 0 && (
            <div className='text-gray-500 text-center py-6'>
              No tienes citas Programadas
            </div>
          )}
        </div>
      </div>

      {Modal === 'nuevaMascota' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          
          <div className="
            bg-[#fff8e1] 
            w-[90vw] 
            md:w-[34vw] 
            max-h-[90vh] 
            overflow-y-auto 
            rounded-xl 
            shadow-2xl 
            border-2 
            border-[#D2691E] 
            p-6 
            relative
          ">
            <PetCard
            cliente_id={cliente.id}
            onMascotaCreada={() => setMascotaCreada(true)}
            ></PetCard>
            <button onClick={() => setModal('')} className="mb-4 text-black hover:bg-[#ffb282] font-bold bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl mt-1 p-2 pl-3 pr-3 w-full">Cancelar</button>
          </div>
        </div>
      )}
      {Modal === 'nuevaCita' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          
          <div className="
            bg-[#fff8e1] 
            w-[90vw] 
            md:w-[34vw] 
            max-h-[90vh] 
            overflow-y-auto 
            rounded-xl 
            shadow-2xl 
            border-2 
            border-[#D2691E] 
            p-6 
            relative
          ">
            <NuevaCita
              clienteId={cliente.id}
              mascotas={mascotas}
              onRefresh={async ()=> await fetchCitasIdCliente(cliente.id)}
            />
            <button onClick={() => setModal('')} className="mb-4 text-black hover:bg-[#ffb282] font-bold bg-[#fff8e1] border-2 border-[#d2691e] rounded-2xl mt-1 p-2 pl-3 pr-3 w-full">Cancelar</button>

          </div>
        </div>
      )}
    </div>
  );
}
