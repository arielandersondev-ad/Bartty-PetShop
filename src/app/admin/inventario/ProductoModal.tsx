import { useEffect, useState } from "react"
import { Categoria, Producto, UnidadMedida } from "./type";

export default function ProductoModal({ onClose }: {onClose?: () => void}) {
    const defaultData = {
        id: "",
        estado: true,
        stockMinimo: 0,
        descripcion: "",
        unidadMedidaId: "",
        categoriaId: "",
        tipo: "",
        nombre: "",
        updatedAt: "",
        createdAt: "",
        precioVenta: 0,
        unidadMinimaVenta: 0,
        precioCompra: 0
    }
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [ Productos, setProductos] = useState<Producto[]>([])
    
    const [Categorias, setCategorias] = useState<Categoria[]>([])
    const [unidadesMedida, setUnidadesMedida] = useState<UnidadMedida[]>([])
    
    const [form, setForm] = useState<Producto>(defaultData)
    const [loading, setLoading] = useState(false)
    const [mensaje, setMensaje] = useState("")
    //============================================= ASYNC
    async function refreshList() {
    const res = await fetch("/api/inventario/producto?action=getProductos")
    const data = await res.json()
    if (res.ok) setProductos(data.data) 
    else setMensaje(data.error || "Error al refrescar productos")
    }
    async function refreshCategorias() {
    const res = await fetch("/api/inventario/categoria?action=getCategorias")
    const data = await res.json()
    if (res.ok) setCategorias(data.data) 
    else setMensaje(data.error || "Error al refrescar categorias")
    }
    async function refreshUnidadesMedida() {
    const res = await fetch("/api/inventario/unidad_medida?action=getUnidadMedidas")
    const data = await res.json()
    if (res.ok) setUnidadesMedida(data.data) 
    else setMensaje(data.error || "Error al refrescar unidad de medidas")
    }
    //============================================== HANDLERS
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: name === "estado" ? value === "true" : value }))
    }

    const onSelect = (c: Producto) => {
    setSelectedId(c.id)
    setForm({
        id: c.id,
        estado: c.estado,
        stockMinimo: c.stockMinimo,
        descripcion: c.descripcion,
        unidadMedidaId: c.unidadMedidaId,
        categoriaId: c.categoriaId,
        tipo: c.tipo,
        nombre: c.nombre,
        updatedAt: c.updatedAt,
        createdAt: c.createdAt,
        precioVenta: c.precioVenta,
        unidadMinimaVenta: c.unidadMinimaVenta,
        precioCompra: c.precioCompra
    })
    setMensaje("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMensaje("")
    try {
        if (!selectedId) {
        const res = await fetch("/api/inventario/producto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "createProducto", ...form, precioCompra: Number(form.precioCompra), precioVenta: Number(form.precioVenta), stockMinimo: Number(form.stockMinimo), unidadMinimaVenta: Number(form.unidadMinimaVenta) })
        })
        const data = await res.json()
        if (!res.ok) setMensaje(data.error || "Error al crear producto")
        else {
            setMensaje("Producto creado")
            setForm(defaultData)
            refreshList()
        }
        } else {
        const res = await fetch("/api/inventario/producto", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...form, id: selectedId, action: "updateProducto" })
        })
        const data = await res.json()
        if (!res.ok) setMensaje(data.error || "Error al actualizar producto")
        else {
            setMensaje("Producto actualizado")
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
        const res = await fetch(`/api/inventario/producto?id=${selectedId}`, { method: "DELETE" })
        const data = await res.json()
        if (!res.ok) setMensaje(data.error || "Error al eliminar producto")
        else {
        setMensaje("Producto eliminado")
        setSelectedId(null)
        setForm(defaultData)
        refreshList()
        }
    } catch {
        setMensaje("Error de conexión")
    }
    setLoading(false)
    }
    useEffect(() => {
    refreshList()
    refreshCategorias()
    refreshUnidadesMedida()
    }, [])

    return(
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
            <div className="flex flex-row justify-between">
                <h2 className="text-2xl font-bold mb-4">Categorías</h2>
                <button 
                    onClick={() => onClose?.()}
                    className="text-2xl font-bold mb-4"
                >X</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg max-h-80 overflow-auto">
                <ul>
                {Productos.map(c => (
                    <li
                    key={c.id}
                    onClick={() => onSelect(c)}
                    className={`px-4 py-2 cursor-pointer flex justify-between ${selectedId === c.id ? "bg-amber-50 border-l-4 border-amber-500" : "hover:bg-gray-50"}`}
                    >
                    <span>{c.nombre}</span>
                    <span>{c.tipo}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${c.estado ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"}`}>
                        {c.estado ? "Activo" : "Inactivo"}
                    </span>
                    </li>
                ))}
                {Productos.length === 0 && <li className="px-4 py-2 text-gray-500">Sin unidad de medidas</li>}
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
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <input
                    type="text"
                    id="tipo"
                    name="tipo"
                    value={form.tipo}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio de Compra</label>
                    <input
                    type="number"
                    id="precioCompra"
                    name="precioCompra"
                    value={form.precioCompra}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Stock Mínimo</label>
                    <input
                    type="text"
                    id="stockMinimo"
                    name="stockMinimo"
                    value={form.stockMinimo}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Descripcion</label>
                    <input
                    type="text"
                    id="descripcion"
                    name="descripcion"
                    value={form.descripcion}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoria</label>
                    <select
                    id="categoriaId"
                    name="categoriaId"
                    value={form.categoriaId}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    >
                        <option value="">Categoria ?</option>
                    {Categorias.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Unidad de Medida</label>
                    <select
                    id="unidadId"
                    name="unidadMedidaId"
                    value={form.unidadMedidaId}
                    onChange={handleChange}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    >
                        <option value="">Unidad de Medida ?</option>
                    {unidadesMedida.map(um => (
                        <option key={um.id} value={um.id}>{um.nombre}</option>
                    ))}
                    </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Precio de Venta</label>
                        <input
                        type="number"
                        id="precioVenta"
                        name="precioVenta"
                        value={form.precioVenta}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Unidad Min de Venta</label>
                        <input
                        type="number"
                        id="unidadMinimaVenta"
                        name="unidadMinimaVenta"
                        value={form.unidadMinimaVenta}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        required
                        />
                    </div>
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
                        setForm(defaultData)
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
