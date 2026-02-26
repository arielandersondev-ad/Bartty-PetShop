import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toSnakeCliente(c: any) {
  return {
    id: c.id,
    ci: c.ci,
    nombre: c.nombre,
    apellido_paterno: c.apellidoPaterno ?? null,
    apellido_materno: c.apellidoMaterno ?? null,
    email: c.email ?? null,
    telefono: c.telefono,
    numero_referido: c.numeroReferido ?? null,
    created_at: c.createdAt,
  }
}
function toSnakeMascota(m: any) {
  return {
    id: m.id,
    cliente_id: m.clienteId,
    nombre: m.nombre,
    raza: m.raza ?? null,
    fecha_nacimiento: m.fechaNacimiento ?? null,
    edad: m.edad ?? null,
    color: m.color ?? null,
    tamano: m.tamano ?? null,
    vacuna_antirrabica: m.vacunaAntirrabica ?? null,
    sexo: m.sexo ?? null,
    observaciones: m.observaciones ?? null,
    created_at: m.createdAt,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id_cliente = searchParams.get('cliente_id')
  if (!id_cliente) return NextResponse.json({ error: 'se requiere el id_cliente' }, { status: 400 })
  try {
    const cliente = await prisma.cliente.findUnique({
      where: { id: id_cliente },
      include: { mascotas: true },
    })
    if (!cliente) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
    const payload = {
      ...toSnakeCliente(cliente),
      mascotas: cliente.mascotas.map(toSnakeMascota),
    }
    return NextResponse.json({ data: payload }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body.fecha_nacimiento) {
      body.fecha_nacimiento = null
    }
    const created = await prisma.mascota.create({
      data: {
        clienteId: body.cliente_id,
        nombre: body.nombre,
        raza: body.raza ?? null,
        fechaNacimiento: body.fecha_nacimiento ? new Date(body.fecha_nacimiento) : null,
        edad: body.edad ?? null,
        color: body.color ?? null,
        tamano: body.tamano ?? null,
        vacunaAntirrabica: body.vacuna_antirrabica ?? null,
        sexo: body.sexo ?? null,
        observaciones: body.observaciones ?? null,
      },
    })
    return NextResponse.json({ data: toSnakeMascota(created) }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al crear mascota' }, { status: 400 })
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { id, cliente_id, ...rest } = body
    if (cliente_id) return NextResponse.json({ error: 'no se puede cambiar el Cliente_id' })
    if (!id) return NextResponse.json({ error: 'se requiere la id de la mascota' })
    const updated = await prisma.mascota.update({
      where: { id },
      data: {
        nombre: rest.nombre,
        raza: rest.raza,
        fechaNacimiento: rest.fecha_nacimiento ? new Date(rest.fecha_nacimiento) : undefined,
        edad: rest.edad,
        color: rest.color,
        tamano: rest.tamano,
        vacunaAntirrabica: rest.vacuna_antirrabica,
        sexo: rest.sexo,
        observaciones: rest.observaciones,
      },
    })
    return NextResponse.json({ data: toSnakeMascota(updated) }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al actualizar mascota' }, { status: 400 })
  }
}
