import React, { useEffect, useState } from "react";
import { Inventario, Producto } from "./type";

export default function InventarioModal({ onClose, onRefresh, inventario }: {onClose?: () => void, onRefresh?: () => void, inventario?: string}) {
  
  const [selectedId, setSelectedId] = useState<string | null>(inventario || null)
  const [ inventarios, setInventarios] = useState<Inventario[]>([])
  const [form, setForm] = useState<Inventario>({ cantidad: 0, productoId: "", updatedAt: "" })
  const [loading, setLoading] = useState(false)
  const [mensaje, setMensaje] = useState("")
  const [productos, setProductos] = useState<Producto[]>([])
 
  async function inventarioId(id : string) {
    const res = await fetch(`/api/inventario?action=getInventarioId&id=${id}`)
    const data = await res.json()
    if (res.ok) setForm(data.data)
  }
  async function refreshList() {
    const res = await fetch("/api/inventario?action=getinventario")
    const data = await res.json()
    if (res.ok) setInventarios(data.data)
    else setMensaje(data.error || "Error al refrescar inventarios")
  }
  async function refreshProductos() {
    const res = await fetch("/api/inventario/producto?action=getProductos")
    const data = await res.json()
    if (res.ok) setProductos(data.data)
    else setMensaje(data.error || "Error al refrescar productos")
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === "cantidad" ? Number(value) : value }))
  }

  const onSelect = (i: Inventario) => {
    setSelectedId(i.id || i.productoId)
    setForm({ cantidad: i.cantidad, productoId: i.productoId, updatedAt: i.updatedAt })
    setMensaje("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje("")
    try {
      if (!selectedId || selectedId === "") {
        const res = await fetch("/api/inventario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "createInventario", cantidad: form.cantidad, productoId: form.productoId })
        })
        const data = await res.json()
        if (!res.ok) setMensaje(data.error || "Error al crear inventario")
        else {
          setMensaje("Inventario creado")
          setForm({ cantidad: 0, productoId: "", updatedAt: "" })
          onRefresh?.()
        }
      } else {
        const res = await fetch("/api/inventario", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: selectedId, cantidad: form.cantidad, action: "updateInventario" })
        })
        const data = await res.json()
        if (!res.ok) setMensaje(data.error || "Error al actualizar inventario")
        else {
          setMensaje("Inventario actualizado")
          refreshList()
          onRefresh?.()
          setTimeout(() => {
            onClose?.()
          }, 1000)
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
      const res = await fetch(`/api/inventario?id=${selectedId}`, { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) setMensaje(data.error || "Error al eliminar inventario")
      else {
        setMensaje("Inventario eliminado")
        setSelectedId(null)
        setForm({ cantidad: 0, productoId: "", updatedAt: "" })
        refreshList()
      }
    } catch {
      setMensaje("Error de conexión")
    }
    setLoading(false)
  }
  useEffect(() => {
    refreshList()
    refreshProductos()
    if (inventario)inventarioId(inventario||'')
  }, [inventario])

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
        <div className="flex flex-row justify-between">
            <h2 className="text-2xl font-bold mb-4">Inventario</h2>
            <button 
                onClick={() => onClose?.()}
                className="text-2xl font-bold mb-4"
            >X</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg max-h-80 overflow-auto">
            <ul>
              {inventarios?.map(i => (
                <li
                  key={i.id || i.productoId}
                  onClick={() => onSelect(i)}
                  className={`px-4 py-2 cursor-pointer flex justify-between ${selectedId === (i.id || i.productoId) ? "bg-amber-50 border-l-4 border-amber-500" : "hover:bg-gray-50"}`}
                >
                  <span>{i.cantidad}</span>
                </li>
              ))}
              {inventarios?.length === 0 && <li className="px-4 py-2 text-gray-500">Sin inventarios</li>}
            </ul>
          </div>
          <div>
            <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Producto</label>
                <select
                  id="productoId"
                  name="productoId"
                  value={form.productoId}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                >
                  {productos.map(p => (
                    <option key={p.id} value={p.id}>{p.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cantidad</label>
                <input
                  type="number"
                  id="cantidad"
                  name="cantidad"
                  value={form.cantidad}
                  onChange={handleChange}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedId(null)
                    setForm({ cantidad: 0, productoId: "", updatedAt: "" })
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
