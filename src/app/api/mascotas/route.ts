import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
  const action = searchParams.get('action')
  const id = searchParams.get('id')
  const cliente_id = searchParams.get('cliente_id')
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  try {
    if (action === 'clientPets' && id) {
      const mascotas = await prisma.mascota.findMany({
        where: { clienteId: id },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(mascotas.map(toSnakeMascota))
    }

    const whereClauses: any = {}
    if (cliente_id) whereClauses.clienteId = cliente_id
    if (search.trim()) {
      whereClauses.OR = [{ nombre: { contains: search, mode: 'insensitive' } }, { raza: { contains: search, mode: 'insensitive' } }]
    }

    const [mascotas, count] = await Promise.all([
      prisma.mascota.findMany({
        where: Object.keys(whereClauses).length ? whereClauses : undefined,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.mascota.count({ where: Object.keys(whereClauses).length ? whereClauses : undefined }),
    ])

    return NextResponse.json({ success: true, data: mascotas.map(toSnakeMascota), count })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
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
    return NextResponse.json({ success: true, data_single: toSnakeMascota(created) }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al crear mascota' }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
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
    return NextResponse.json({ success: true, data_single: toSnakeMascota(updated) })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al actualizar mascota' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Id de la mascota Requerido' }, { status: 400 })
  try {
    await prisma.mascota.delete({ where: { id } })
    return NextResponse.json({ message: 'Mascota eliminada' }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al eliminar mascota' }, { status: 500 })
  }
}
