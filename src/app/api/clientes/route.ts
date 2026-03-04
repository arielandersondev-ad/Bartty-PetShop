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

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const ci = searchParams.get('ci')
  const search = searchParams.get('search') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const skip = (page - 1) * limit

  try {
    if (action === 'byId' && ci) {
      const cliente = await prisma.cliente.findUnique({ where: { ci } })
      if (!cliente) return NextResponse.json({ error: 'Cliente no encontrado' }, { status: 404 })
      return NextResponse.json(toSnakeCliente(cliente))
    }

    const where =
      search.trim().length > 0
        ? {
            OR: [
              { nombre: { contains: search, mode: 'insensitive' } },
              { apellidoPaterno: { contains: search, mode: 'insensitive' } },
              { apellidoMaterno: { contains: search, mode: 'insensitive' } },
              { ci: { contains: search, mode: 'insensitive' } },
              { telefono: { contains: search, mode: 'insensitive' } },
            ],
          }
        : undefined

    const [clientes, count] = await Promise.all([
      prisma.cliente.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.cliente.count({ where }),
    ])

    return NextResponse.json({
      success: true,
      data: clientes.map(toSnakeCliente),
      count,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const action = body.action
  const ci = body.ci
  const nombre = body.nombre
  if (action === 'loginCliente') {
    if (!ci || !nombre) {
      return NextResponse.json(
        { error: 'CI y nombre son obligatorios' },
        { status: 400 }
      )
    }
    
    const cliente = await prisma.cliente.findUnique({where: {ci}})

    if (!cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 401 }
      )
    }

    if (cliente.nombre !== nombre) {
      return NextResponse.json(
        { error: 'El nombre no coincide' },
        { status: 401 }
      )
    }

    return NextResponse.json({ message: 'Login exitoso', cliente })
  }
  try {
    
    const created = await prisma.cliente.create({
      data: {
        ci: body.ci,
        nombre: body.nombre,
        apellidoPaterno: body.apellido_paterno ?? null,
        apellidoMaterno: body.apellido_materno ?? null,
        email: body.email ?? null,
        telefono: body.telefono,
        numeroReferido: body.numero_referido ?? null,
      },
    })
    return NextResponse.json({ success: true, data_single: toSnakeCliente(created) }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al crear cliente' }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    const updated = await prisma.cliente.update({
      where: { id },
      data: {
        ci: rest.ci,
        nombre: rest.nombre,
        apellidoPaterno: rest.apellido_paterno,
        apellidoMaterno: rest.apellido_materno,
        email: rest.email,
        telefono: rest.telefono,
        numeroReferido: rest.numero_referido,
      },
    })
    return NextResponse.json({ success: true, data_single: toSnakeCliente(updated) })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al actualizar cliente' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  try {
    await prisma.cliente.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al eliminar cliente' }, { status: 400 })
  }
}

export async function PATCH (req: Request) {
  try {
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    const updated = await prisma.cliente.update({
      where: { id },
      data: {
        ci: rest.ci,
        nombre: rest.nombre,
        apellidoPaterno: rest.apellido_paterno,
        apellidoMaterno: rest.apellido_materno,
        email: rest.email,
        telefono: rest.telefono,
        numeroReferido: rest.numero_referido,
      },
    })
    return NextResponse.json({ success: true, data_single: toSnakeCliente(updated) })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al actualizar cliente' }, { status: 400 })
  }
}