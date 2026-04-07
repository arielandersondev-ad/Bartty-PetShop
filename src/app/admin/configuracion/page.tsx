"use client"

import { useEffect, useState } from "react"
import GeneralConfig from "./GeneralConfig"
import Sucursales from "./Sucursales"
import GaleriaCortes from "./GaleriaCortes"
import SucursalSelector from "../components/SucursalSelector"

export default function Configuracion() {

  const [clientesPorHora, setClientesPorHora] = useState(1)
  const [hora, setHora] = useState("")
  const [slots, setSlots] = useState<any[]>([])
  const [ clientesHora, setClientesHora] = useState()
  const [sucursalId, setSucursalId] = useState("")
  const configuracionId = 1

  //////////////////////////////////////////////////

  const loadSlots = async (sucId?: string) => {
    const id = sucId || sucursalId
    const res = await fetch(`/api/configuracion?sucursalId=${id}`)
    const data = await res.json()
    setSlots(data.slotTrabajo || [])
    setClientesHora(data.config?.clientesPorHora)
  }

  const loadConfiguracion = async () => {
    const res = await fetch('/api/configuracion?action=all')
    const data = await res.json()
    console.log('lista de configuracion: ',data)
  }

  useEffect(() => {
    if (sucursalId) {
      loadSlots()
    }
    loadConfiguracion()
  }, [sucursalId])

  //////////////////////////////////////////////////

  const crearSlot = async () => {
    if (!sucursalId) {
      alert("Selecciona una sucursal")
      return
    }
    await fetch("/api/configuracion/slot", {
      method: "POST",
      body: JSON.stringify({
        hora,
        configuracionId,
        sucursalId
      })
    })

    setHora("")
    loadSlots()
  }
  const eliminarSlot = async (id: number) => {

    await fetch("/api/configuracion", {
      method: "DELETE",
      body: JSON.stringify({ id })
    })

    loadSlots()
  }
  const actualizarConfig = async () => {
    if (!sucursalId) {
      alert("Selecciona una sucursal")
      return
    }

    await fetch("/api/configuracion", {
      method: "PATCH",
      body: JSON.stringify({
        id: configuracionId,
        clientesPorHora,
        sucursalId
      })
    }).then(() => {
      loadSlots()
    })

    alert("Configuración actualizada")
  }
  return (
    <div className="p-8 max-w-4xl mx-auto text-black">

      <h1 className="text-3xl font-bold mb-8">
        ⚙️ Configuración
      </h1>
      
      {/* Selector de Sucursal */}
      <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-xl p-4 mb-6 shadow-lg">
        <SucursalSelector onChange={(value) => setSucursalId(value)} />
      </div>

      {!sucursalId ? (
        <p className="text-center text-gray-500">Selecciona una sucursal para ver su configuración</p>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CLIENTES POR HORA */}
          <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            {clientesHora ? "Clientes por hora" : "Número de Clientes por Hora"}
            {clientesHora}
          </h2>
          <div className="flex gap-4 items-center">
            <input
              type="number"
              value={clientesPorHora}
              onChange={(e) => setClientesPorHora(Number(e.target.value))}
              className="
                w-32
                px-3 py-2
                rounded-lg
                bg-white/20
                border border-amber-600/80
                text-black
                focus:outline-none
                focus:ring-2
                focus:ring-orange-400
              "
            />
            <button
              onClick={actualizarConfig}
              className="
                bg-orange-500
                hover:bg-orange-600
                px-5 py-2
                rounded-lg
                font-semibold
                transition
              "
            >
              Guardar
            </button>
          </div>
        </div>
        {/* AGREGAR SLOT */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Agregar horario
          </h2>
          <div className="flex gap-4 items-center">
            <input
              type="time"
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="
                px-3 py-2
                rounded-lg
                bg-white/20
                border border-amber-600/80
                text-black
                focus:outline-none
                focus:ring-2
                focus:ring-orange-400
              "
            />
            <button
              onClick={crearSlot}
              className="
                bg-green-500
                hover:bg-green-600
                px-5 py-2
                rounded-lg
                font-semibold
                transition
              "
            >
              + Agregar
            </button>
          </div>
        </div>
        </div>

        {/* LISTA DE SLOTS */}
        <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-6">
            Horarios disponibles
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {slots.map((slot) => (
              <div
                key={slot.id}
                className="
                  flex justify-between items-center
                  bg-white/20
                  border border-amber-600/80
                  px-4 py-2
                  rounded-lg
                "
              >
                <span className="font-medium">
                  {slot.hora}
                </span>
                <button
                  onClick={() => eliminarSlot(slot.id)}
                  className="
                    text-red-400
                    hover:text-red-500
                    text-sm
                  "
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        </>
      )}
      <GaleriaCortes/>
      <Sucursales/>
      <GeneralConfig/>
    </div>
  )
}