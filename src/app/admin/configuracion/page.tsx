"use client"

import { useEffect, useState } from "react"

export default function Configuracion() {

  const [clientesPorHora, setClientesPorHora] = useState(1)
  const [hora, setHora] = useState("")
  const [slots, setSlots] = useState<any[]>([])
  const [ clientesHora, setClientesHora] = useState()
  const [cortes, setCortes] = useState<any[]>([])
  const [selectedCorte, setSelectedCorte] = useState<number | null>(null)
  const [descripcion, setDescripcion] = useState("")
  const [uploading, setUploading] = useState(false)
  const configuracionId = 1

  //////////////////////////////////////////////////

  const loadSlots = async () => {
    const res = await fetch("/api/configuracion")
    const data = await res.json()
    setSlots(data.slotTrabajo)
    setClientesHora(data.config.clientesPorHora)
  }

  const loadCortes = async () => {
    const res = await fetch("/api/configuracion/cortes")
    const data = await res.json()
    setCortes(data)
  }

  useEffect(() => {
    loadSlots()
    loadCortes()
  }, [])

  //////////////////////////////////////////////////

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append('file', file)
    formData.append('descripcion', descripcion)

    try {
      const res = await fetch('/api/configuracion/cortes', {
        method: 'POST',
        body: formData,
      })
      if (res.ok) {
        setDescripcion("")
        loadCortes()
      }
    } catch (error) {
      console.error('Error al subir corte:', error)
    } finally {
      setUploading(false)
    }
  }

  const eliminarCorte = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este corte?")) return

    await fetch(`/api/configuracion/cortes?id=${id}`, {
      method: "DELETE"
    })
    setSelectedCorte(null)
    loadCortes()
  }

  //////////////////////////////////////////////////

  const crearSlot = async () => {
    await fetch("/api/configuracion/slot", {
      method: "POST",
      body: JSON.stringify({
        hora,
        configuracionId
      })
    })

    setHora("")
    loadSlots()
  }

  //////////////////////////////////////////////////

  const eliminarSlot = async (id: number) => {

    await fetch("/api/configuracion", {
      method: "DELETE",
      body: JSON.stringify({ id })
    })

    loadSlots()
  }

  //////////////////////////////////////////////////

  const actualizarConfig = async () => {

    await fetch("/api/configuracion", {
      method: "PATCH",
      body: JSON.stringify({
        id: configuracionId,
        clientesPorHora
      })
    }).then(() => {
      loadSlots()
    })

    alert("Configuración actualizada")
  }

  //////////////////////////////////////////////////

  return (

    <div className="p-8 max-w-4xl mx-auto text-black">

      <h1 className="text-3xl font-bold mb-8">
        ⚙️ Configuración de Agenda
      </h1>
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

      {/* GALERÍA DE CORTES */}
      <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Galería de Cortes</h2>
          <div className="flex gap-4 items-center">
            <input
              type="text"
              placeholder="Descripción del corte..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/20 border border-amber-600/80 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <label className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold transition cursor-pointer text-white">
              {uploading ? "Subiendo..." : "+ Añadir Corte"}
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cortes.map((corte) => (
            <div 
              key={corte.id} 
              className={`relative group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${selectedCorte === corte.id ? 'border-orange-500 scale-95 shadow-inner' : 'border-transparent hover:border-orange-300'}`}
              onClick={() => setSelectedCorte(selectedCorte === corte.id ? null : corte.id)}
            >
              <img src={corte.ruta} alt={corte.descripcion} className="w-full h-40 object-cover" />
              {corte.descripcion && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 backdrop-blur-sm">
                  {corte.descripcion}
                </div>
              )}
              {selectedCorte === corte.id && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    eliminarCorte(corte.id);
                  }}
                  className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>
        {cortes.length === 0 && (
          <p className="text-center text-gray-500 italic py-8">No hay imágenes de cortes disponibles</p>
        )}
      </div>

    </div>
  )
}