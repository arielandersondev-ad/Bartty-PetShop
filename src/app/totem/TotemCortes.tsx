"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

interface Corte {
  id: number
  ruta: string
  descripcion: string
}

interface TotemCortesProps {
  onSelect: (ruta: string) => void
  onClose: () => void
}

export default function TotemCortes({ onSelect, onClose }: TotemCortesProps) {
  const [cortes, setCortes] = useState<Corte[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCortes = async () => {
      try {
        const res = await fetch("/api/configuracion/cortes")
        const data = await res.json()
        setCortes(data)
      } catch (error) {
        console.error("Error al cargar cortes:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCortes()
  }, [])

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col p-4 md:p-8 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 text-white">
        <div>
          <h1 className="text-3xl font-bold text-orange-400">Tótem de Cortes</h1>
          <p className="text-gray-400">Toca un estilo para seleccionarlo para la mascota</p>
        </div>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors text-2xl border border-white/20 shadow-lg"
          title="Cerrar Tótem"
        >
          ✕
        </button>
      </div>

      {/* Contenido */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full text-white">
            <p className="animate-pulse text-xl">Cargando galería de estilos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {cortes.map((corte) => (
              <div
                key={corte.id}
                className="group relative cursor-pointer bg-gray-900 rounded-2xl overflow-hidden border-2 border-transparent hover:border-orange-500 transition-all active:scale-95 shadow-xl"
                onClick={() => onSelect(corte.ruta)}
              >
                <div className="aspect-[4/5] relative w-full">
                  <Image
                    src={corte.ruta}
                    alt={corte.descripcion || "Estilo de corte"}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                {corte.descripcion && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <p className="text-white font-medium text-lg leading-tight truncate">
                      {corte.descripcion}
                    </p>
                  </div>
                )}
                <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-orange-500 text-white px-6 py-2 rounded-full font-bold shadow-lg transition-opacity uppercase tracking-wider">
                    Seleccionar
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && cortes.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4">
            <span className="text-6xl">🐕</span>
            <p className="text-xl">No hay estilos de corte disponibles en la configuración.</p>
          </div>
        )}
      </div>
    </div>
  )
}
