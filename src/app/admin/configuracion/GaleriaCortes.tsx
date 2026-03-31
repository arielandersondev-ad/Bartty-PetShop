import { useEffect, useState } from "react";

export default function GaleriaCortes () {
  //ESTADOS
  const [descripcion, setDescripcion] = useState("")
  const [uploading, setUploading] = useState(false)
  const [cortes, setCortes] = useState<any[]>([])
  const [selectedCorte, setSelectedCorte] = useState<number | null>(null)
  //LOADERS
  const loadCortes = async () => {
    const res = await fetch("/api/configuracion/cortes")
    const data = await res.json()
    setCortes(data)
  }
  //HANDLERS
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
  //EFFECTS
  useEffect(()=>{
    loadCortes()
  },[])
  return(
    <div className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg mt-4">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-2">
        <h2 className="text-xl font-semibold">Galería de Cortes</h2>
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Descripción del corte..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white/20 border border-amber-600/80 text-black focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>
        <label className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-lg font-semibold transition cursor-pointer text-white">
          <div>
              {uploading ? "Subiendo..." : "+ Añadir Corte"}
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
        </label>
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
  )
}