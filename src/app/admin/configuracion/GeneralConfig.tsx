'use client'

import { useEffect, useState } from "react"
import SucursalSelector from "../components/SucursalSelector"
interface configuracion {
  id: number
  recojoHabilitado: boolean
  sucursalId: string | null
  clientesPorHora: number
  sucursal?: any
}
export default function GeneralConfig(){
  //STATES
  const voidData = {
    recojoHabilitado: false,
    sucursalId:'',
    clientesPorHora:0
  }
  const [configuracionList, setConfiguracionList] = useState<configuracion[]>([])
  const [formConfiguracion, setFormConfiguracion] = useState({
    recojoHabilitado: false,
    sucursalId:'',
    clientesPorHora:0
  })
  const [select, setSelect] = useState(false)

  //LOADERS
  const loadConfiguracion = async () => {
    const res = await fetch('/api/configuracion?action=all')
    const data = await res.json()
    console.log('lista de configuracion: ',data)
    setConfiguracionList(data)
  }
  //FUNCTIONS
 
  // HANDLERS
  const handleChangeAgregarConfiguracion = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormConfiguracion({
      ...formConfiguracion,
      [e.target.name]: e.target.value
    })
  }
  const handleSubmitConfiguracion = async (e: React.FormEvent)=>{
    e.preventDefault()
    if(select){
      await fetch('/api/configuracion',{
        method: 'PATCH',
        body: JSON.stringify({
          ...formConfiguracion,action: 'editconfiguracion'
        })
      }).then(()=>{loadConfiguracion()})
    }else{
      await fetch('/api/configuracion',{
        method: 'POST',
        body: JSON.stringify({
          ...formConfiguracion,action: 'configuracion'
        })
      }).then(()=>{loadConfiguracion()})
    }
  }
  const handleEditConfiguracion = (data: any) => {
    setFormConfiguracion(data)
    setSelect(true)
  }
  const handleDelete = async () => {
    await fetch ('/api/configuracion',{
      method: 'DELETE',
      body: JSON.stringify({
        ...formConfiguracion,
        action: 'eliminarConfiguracion'
      })
    }).then(()=>{loadConfiguracion()})
  }
  //EFFECTS
  useEffect(() => {
    loadConfiguracion()
  }, [])
  return (
    <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg mt-4 space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">
          Configuración por sucursal
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Lista (placeholder) */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm text-sm text-gray-400 text-center">
            <div className="flex flex-row justify-between text-black font-bold">
              <p>Clitene/Hr</p>
              <p>Recojo</p>
              <p>Sucursal</p>
            </div>
            {configuracionList?.map((config) => (
              <div 
                key={config.id} 
                className="flex flex-row justify-between"
                onClick={() => handleEditConfiguracion(config)}
              >
                <p>{config.clientesPorHora || 'no configurado'}</p>
                <p>{config.recojoHabilitado ? 'Sí' : 'No'}</p>
                <p>{config.sucursal?.nombre || 'sin sucursal'}</p>
              </div>
            ))}
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmitConfiguracion} className="space-y-4">

          {/* Selector sucursal */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">
              Sucursal
            </label>
            <SucursalSelector
              onChange={(value) =>setFormConfiguracion({...formConfiguracion,sucursalId: value})}
            />
          </div>
          <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
            <span className="text-sm text-gray-600">Recogida de mascota</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formConfiguracion.recojoHabilitado}
                onChange={(e) => setFormConfiguracion({...formConfiguracion,recojoHabilitado: e.target.checked})}
                className="accent-orange-500"
              />
              <span className={`text-xs font-semibold ${formConfiguracion.recojoHabilitado ? 'text-green-600' : 'text-gray-400'}`}>
                {formConfiguracion.recojoHabilitado ? "Habilitado" : "Inhabilitado"}
              </span>
            </label>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500">
              Clientes por hora
            </label>
            <input
              type="number"
              name="clientesPorHora"
              value={formConfiguracion.clientesPorHora || ''}
              onChange={handleChangeAgregarConfiguracion}
              placeholder="Ej: 4"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          {select ? (
            <div className="flex flex-row gap-4">
              <button
                type="button"
                className="w-full py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-[#b85c1a] transition-all shadow-md hover:shadow-lg"
                onClick={()=>{setSelect(false);setFormConfiguracion(voidData)}}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSubmitConfiguracion}
                className="w-full py-2 rounded-lg text-sm font-medium bg-[#D2691E] text-white hover:bg-[#b85c1a] transition-all shadow-md hover:shadow-lg"
              >
                Guardar
              </button>
              <button
                type="button"
                className="w-full py-2 rounded-lg text-sm font-medium bg-gray-500 text-white hover:bg-[#b85c1a] transition-all shadow-md hover:shadow-lg"
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          ):(
            <button
              type="submit"
              className="w-full py-2 rounded-lg text-sm font-medium bg-[#D2691E] text-white hover:bg-[#b85c1a] transition-all shadow-md hover:shadow-lg"
            >
              Guardar configuración
            </button>
          )}
        </form>
      </div>
    </div>
  )
}