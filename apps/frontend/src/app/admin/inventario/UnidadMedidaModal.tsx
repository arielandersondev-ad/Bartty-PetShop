import { useEffect, useState } from "react"
import { UnidadMedida } from "./type";

export default function UnidadMedidaModal({ onClose }: {onClose?: () => void}) {

    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [ unidadMedidas, setUnidadMedidas] = useState<UnidadMedida[]>([])

    
      const [form, setForm] = useState<{ nombre: string; estado: boolean; unidad: string; valor: number }>({ nombre: "", estado: true, unidad: "", valor: 0 })
      const [loading, setLoading] = useState(false)
      const [mensaje, setMensaje] = useState("")
    
      async function refreshList() {
        const res = await fetch("/api/inventario/unidad_medida?action=getUnidadMedidas")
        const data = await res.json()
        if (res.ok) setUnidadMedidas(data.data) 
        else setMensaje(data.error || "Error al refrescar unidad de medidas")
      }
      const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: name === "estado" ? value === "true" : value }))
      }
    
      const onSelect = (c: UnidadMedida) => {
        setSelectedId(c.id)
        setForm({ nombre: c.nombre, estado: c.estado, unidad: c.unidad, valor: c.valor })
        setMensaje("")
      }
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setMensaje("")
        try {
          if (!selectedId) {
            const res = await fetch("/api/inventario/unidad_medida", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "createUnidadMedida", nombre: form.nombre, estado: form.estado, unidad: form.unidad, valor: form.valor })
            })
            const data = await res.json()
            if (!res.ok) setMensaje(data.error || "Error al crear unidad de medida")
            else {
              setMensaje("Unidad de medida creada")
              setForm({ nombre: "", estado: true, unidad: "", valor: 0 })
              refreshList()
            }
          } else {
            const res = await fetch("/api/inventario/unidad_medida", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: selectedId, nombre: form.nombre, estado: form.estado, unidad: form.unidad, valor: form.valor, action: "updateUnidadMedida" })
            })
            const data = await res.json()
            if (!res.ok) setMensaje(data.error || "Error al actualizar unidad de medida")
            else {
              setMensaje("Unidad de medida actualizada")
              refreshList()
            }
          }
        } catch {
          setMensaje("Error de conexión")
        }
        setLoading(false)
      }
    
      const handleDelete = async () => {
        if (!selectedId) return
        setLoading(true)
        setMensaje("")
        try {
          const res = await fetch(`/api/inventario/unidad_medida?id=${selectedId}`, { method: "DELETE" })
          const data = await res.json()
          if (!res.ok) setMensaje(data.error || "Error al eliminar unidad de medida")
          else {
            setMensaje("Unidad de medida eliminada")
            setSelectedId(null)
            setForm({ nombre: "", estado: true, unidad: "", valor: 0 })
            refreshList()
          }
        } catch {
          setMensaje("Error de conexión")
        }
        setLoading(false)
      }
      useEffect(() => {
        refreshList()
      }, [])
    
    return(
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center overflow-auto pt-40 pt-30">
        <div className="bg-white p-6 rounded-lg w-90 md:w-full max-w-3xl">
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-bold mb-4">Unidades de Medida</h2>
                <button 
                    onClick={() => onClose?.()}
                    className="text-2xl font-bold mb-4"
                >X</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg max-h-80 overflow-auto">
                <ul>
                {unidadMedidas.map(c => (
                    <li
                    key={c.id}
                    onClick={() => onSelect(c)}
                    className={`px-4 py-2 cursor-pointer flex justify-between ${selectedId === c.id ? "bg-amber-50 border-l-4 border-amber-500" : "hover:bg-gray-50"}`}
                    >
                    <span>{c.nombre}</span>
                    <span>
                        <span>{c.valor}</span>
                        <span>{c.unidad}</span>
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${c.estado ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}>
                        {c.estado ? "Activo" : "Inactivo"}
                    </span>
                    </li>
                ))}
                {unidadMedidas.length === 0 && <li className="px-4 py-2 text-gray-500">Sin unidad de medidas</li>}
                </ul>
            </div>
            <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Unidad</label>
                    <input
                    type="text"
                    id="unidad"
                    name="unidad"
                    value={form.unidad}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Valor</label>
                    <input
                    type="text"
                    id="valor"
                    name="valor"
                    value={form.valor}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                    id="estado"
                    name="estado"
                    value={form.estado ? "true" : "false"}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                    </select>
                </div>
                <div className="flex justify-between">
                    <button
                    type="button"
                    onClick={() => {
                        setSelectedId(null)
                        setForm({ nombre: "", estado: true, unidad: "", valor: 0 })
                        setMensaje("")
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                    >
                    Nuevo
                    </button>
                    <div className="flex gap-2">
                    {selectedId && (
                        <button
                        type="button"
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        disabled={loading}
                        >
                        Eliminar
                        </button>
                    )}
                    <button
                        className="px-4 py-2 bg-[#d2691e] text-white rounded-md hover:bg-[#a0522d]"
                        disabled={loading}
                    >
                        {selectedId ? "Actualizar" : "Agregar"}
                    </button>
                    </div>
                </div>
                {mensaje && <p className="text-sm text-green-600">{mensaje}</p>}
                </form>
            </div>
            </div>
        </div>
        </div>
    )
}
