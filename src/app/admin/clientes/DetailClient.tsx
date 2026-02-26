import { useEffect, useState } from "react";
import { ClienteType, MascotaType, NuevaMascotaType, NuevoClienteType } from "./type";

export default function DetailClient({id_cliente,onSuccess}: {id_cliente:string,onSuccess:()=>void}) {

  const [ clienteNuevo, setClienteNuevo ] = useState<NuevoClienteType | null>(null);
  const [isNewCliente, setIsNewCliente] = useState(false);
  
  const [ mascotaNueva, setMascotaNueva] = useState<NuevaMascotaType | null>(null);
  const [isNewMascota, setIsNewMascota] = useState(false);

  const [ cliente, setCliente ] = useState<ClienteType | null>(null);
  const [ mascotas, setMascotas ] = useState<MascotaType[]>([])
  const [ mascotaSeleccionada, setMascotaSeleccionada] = useState<MascotaType | null>(null);
  

  const [editCliente, setEditCliente] = useState(false);
  const [editMascota, setEditMascota] = useState(false);
  const [viewMascota, setViewMascota] = useState(false);
  const [message, setMessage] = useState('')

  const clienteActual = isNewCliente ? clienteNuevo : cliente;
  const mascotaActual = isNewMascota ? mascotaNueva : mascotaSeleccionada;

  type MascotaEditableBase = Omit<MascotaType, "id" | "created_at">;
  type EditableMascotaKeys = {[K in keyof MascotaEditableBase]:MascotaEditableBase[K] extends string | number ? K : never}[keyof MascotaEditableBase];

  const fieldMascota : {label: string; name: EditableMascotaKeys}[] = [
    { label: "Nombre", name: "nombre" },
    { label: "Raza", name: "raza" },
    { label: "Color", name: "color" },
    { label: "Edad", name: "edad" },
    { label: "pequeño / mediano / grande", name: "tamano" },
    { label: "Sexo: M / H", name: "sexo" },
    { label: "Vacuna Antirrabica si / no", name: "vacuna_antirrabica" },
  ]
  const field: { label: string; name: keyof NuevoClienteType }[] = [
    { label: "CI", name: "ci" },
    { label: "Nombre", name: "nombre" },
    { label: "Apellido Paterno", name: "apellido_paterno" },
    { label: "Apellido Materno", name: "apellido_materno" },
    { label: "Email", name: "email" },
    { label: "Teléfono", name: "telefono" },
    { label: "Referido", name: "numero_referido" },
  ]

  async function fetchMascotas(id:string) {
    try {
      const res = await fetch(`/api/clientes/mascotas?cliente_id=${id}`)
      const data = await res.json()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { mascotas: _mascotas, created_at: _createdAt, ...clienteLimpio } = data.data
      setCliente(clienteLimpio)
      setMascotas(data.data.mascotas)
    } catch (error) {
      console.error('error en el fetchMascotas: ',error)
    }
  }
  const handleClienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (isNewCliente && clienteNuevo) {
      setClienteNuevo({
        ...clienteNuevo,
        [name]: value,
      });
    } else if (cliente) {
      setCliente({
        ...cliente,
        [name]: value,
      });
    }
  };

  const handleMascotaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (isNewMascota && mascotaNueva) {
      setMascotaNueva(prev => {
        if (!prev) return prev;

        if (name === "edad") {
          return { ...prev, edad: value === "" ? 0 : Number(value) };
        }

        return { ...prev, [name]: value };
      });

    } else if (mascotaSeleccionada) {
      setMascotaSeleccionada(prev => {
        if (!prev) return prev;

        if (name === "edad") {
          return { ...prev, edad: value === "" ? 0 : Number(value) };
        }

        return { ...prev, [name]: value };
      });
    }
  };

  function iniciarNuevoCliente() {
    setIsNewCliente(true);
    setEditCliente(true);
    setViewMascota(false)
    setClienteNuevo({
      ci: "",
      nombre: "",
      apellido_paterno: "",
      apellido_materno: "",
      email: "",
      telefono: "",
      numero_referido: "",
    });
  }
  function iniciarNuevaMascota() {
    if (!id_cliente) return;

    setIsNewMascota(true);
    setEditMascota(true);
    setViewMascota(true)

    setMascotaNueva({
      cliente_id: id_cliente,
      nombre: "",
      raza: "",
      fecha_nacimiento: "",
      edad: 0,
      color: "",
      tamano: "",
      vacuna_antirrabica: '',
      sexo: "",
      observaciones: "",
    });

    setMascotaSeleccionada(null);
  }

  const handleEditClient = async () => {
    if (!cliente) return;

    try {
      const res = await fetch("/api/clientes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      if (!res.ok) return setMessage("Error al editar");

      setMessage("Edición completada");
      setEditCliente(false);
      onSuccess();
    } catch (error) {
      console.error("Error editando cliente:", error);
    }
  };
  const handleNuevoClient = async () => {
    if (!clienteNuevo) return;

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clienteNuevo),
      });

      if (!res.ok) return setMessage("Error al crear cliente");

      setMessage("Cliente creado correctamente");
      setIsNewCliente(false);
      setEditCliente(false);
      onSuccess();
    } catch (error) {
      console.error("Error creando cliente:", error);
    }
  };

  const handleEditMascota = async ()=> {
    if(!mascotaSeleccionada) return 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { created_at, cliente_id, ...rest} = mascotaSeleccionada
    try {
      const res = await fetch('/api/clientes/mascotas', {
        method:'PATCH',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(rest)
      })
      if(res.ok){
        setMessage('Edicion de la Mascota Completa')
        fetchMascotas(id_cliente)
      }
    } catch (error) {
      console.error('Error en el handleEditMascota: ',error)
    } finally {
      setEditMascota(false)
    }
  }
  const handleNuevaMascota = async () => {
    if (!mascotaNueva) return;

    try {
      const res = await fetch("/api/clientes/mascotas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mascotaNueva),
      });

      if (!res.ok) {
        setMessage("Error al crear mascota");
        return;
      }

      setMessage("Mascota creada correctamente");
      setIsNewMascota(false);
      setEditMascota(false);

      fetchMascotas(id_cliente);
    } catch (error) {
      console.error("Error creando mascota:", error);
    }
  };
  const seleccionarMascota = (m: MascotaType) => {
    setIsNewMascota(false)
    setMascotaNueva(null)
    setMascotaSeleccionada(m);
    setEditMascota(false);
    setViewMascota(true)
  };
  useEffect(() => {
    if(!id_cliente) return
    fetchMascotas(id_cliente);
    setViewMascota(false);
    setEditMascota(false);
    setEditCliente(false);
    setIsNewCliente(false);
    setMascotaNueva(null)
  }, [id_cliente])
  
  return (
    <div className="grid grid-cols-1 gap-4 ">
      <div className="grid grid-cols-2 gap-4">
        <div className=" grid grid-cols-1 gap-2">
          <button 
            onClick={()=>{setViewMascota(false)}}
            className="text-lg px-3 bg-amber-500 text-white rounded-lg"
          >Cliente</button>
          <button 
            onClick={iniciarNuevoCliente}
            className="text-lg px-3 bg-amber-600 text-white rounded-lg"
          >Nuevo Cliente</button>
        </div>
        <div className=" grid grid-cols-1 gap-2">
          <button 
            onClick={()=>{setViewMascota(true)}}
            className="text-lg px-3 bg-amber-800 text-white rounded-lg"
          >Mascota</button>
          <button 
            onClick={iniciarNuevaMascota}
            className="text-lg px-3 bg-amber-900 text-white rounded-lg"
          >Nueva Mascota</button>
        </div>
      </div>
      {/* FORM CLIENTE */}
      {!viewMascota && (
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">
              {isNewCliente ? "Nuevo Cliente" : "Datos del Cliente"}
            </h2>

            <div className="flex gap-2">
              {!isNewCliente && (
                <button
                  onClick={() => setEditCliente(!editCliente)}
                  className="px-3 py-1 bg-amber-500 text-white rounded-lg"
                >
                  {editCliente ? "Cancelar" : "Editar"}
                </button>
              )}
            </div>
          </div>

          {clienteActual && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {field.map((f) => (
                <div key={f.name}>
                  <label className="text-sm text-gray-600">
                    {f.label}
                  </label>
                  <input
                    name={f.name}
                    value={clienteActual[f.name] ?? ""}
                    onChange={handleClienteChange}
                    disabled={!editCliente}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border ${
                      editCliente
                        ? "bg-white"
                        : "bg-gray-100"
                    }`}
                  />
                </div>
              ))}
            </div>
          )}

          {editCliente && (
            <div className="flex justify-end mt-4">
              <button
                onClick={
                  isNewCliente
                    ? handleNuevoClient
                    : handleEditClient
                }
                className="px-4 py-2 bg-green-600 text-white rounded-lg"
              >
                Guardar
              </button>
            </div>
          )}

          <p className="text-sm text-yellow-500 mt-2">
            {message}
          </p>
        </div>
      )}    
      {/* FORM MASCOTA */}
      {viewMascota && (
        <div className="bg-white p-6 rounded-2xl border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Detalle Mascota</h2>
            {mascotaSeleccionada && (
              <button
                onClick={() => setEditMascota(!editMascota)}
                className="text-sm px-3 py-1 bg-amber-500 text-white rounded-lg"
              >
                {editMascota ? "Cancelar" : "Editar"}
              </button>
            )}
          </div>

          {mascotaActual ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">

              {fieldMascota.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm text-gray-600">
                    {field.label}
                  </label>
                  <input
                    type={field.name === "edad" ? "number" : "text"}
                    name={field.name}
                    value={mascotaActual?.[field.name] ?? ""}
                    onChange={handleMascotaChange}
                    disabled={!editMascota}
                    className={`w-full mt-1 px-3 py-2 rounded-lg border 
                    ${editMascota ? "bg-white" : "bg-gray-100"}`}
                  />
                </div>
              ))}

              <div className="col-span-1">
                <label className="block text-sm text-gray-600">
                  Observaciones
                </label>
                <textarea
                  name="observaciones"
                  value={mascotaActual.observaciones}
                  rows={1}
                  onChange={handleMascotaChange}
                  disabled={!editMascota}
                  className={`w-full mt-1 px-3 py-2 rounded-lg border 
                  ${editMascota ? "bg-white" : "bg-gray-100"}
                  `}
                />
              </div>

            </div>
          ) : (
            <p className="text-gray-500">
              Selecciona una mascota para ver sus detalles
            </p>
          )}
          {editMascota && (
            <div className="flex justify-end p-2">
              <button
                className="text-lg px-3 bg-green-600 text-white rounded-lg"
                onClick={isNewMascota ? handleNuevaMascota : handleEditMascota}
              >
                Guardar
              </button>
            </div>
          )}
        </div>
      )}
      {/* LISTA MASCOTAS */}
      <div className="bg-white p-6 rounded-2xl border">
        <h2 className="text-xl font-bold mb-4">Mascotas</h2>
        {mascotas && (
          <div className="space-y-3">
            {mascotas.map((m) => (
              <div
                key={m.id}
                onClick={() => seleccionarMascota(m)}
                className={`p-3 rounded-lg cursor-pointer border transition
                ${mascotaSeleccionada?.id === m.id
                    ? "border-amber-500 bg-amber-50"
                    : "border-gray-200 hover:border-amber-300"}
                `}
              >
                <p className="font-semibold capitalize">{m.nombre}</p>
                <p className="text-sm text-gray-500">
                  {m.raza} • {m.edad} años
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
