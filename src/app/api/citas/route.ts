import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toSnakeCita(c: any, includeRelations = false) {
  const base = {
    id: c.id,
    cliente_id: c.clienteId,
    mascota_id: c.mascotaId,
    fecha: c.fecha,
    hora_inicio: c.horaInicio ?? null,
    hora_fin: c.horaFin ?? null,
    estado: c.estado,
    observaciones: c.observaciones ?? null,
    estilo_corte: c.estiloCorte ?? null,
    created_at: c.createdAt,
  }
  if (!includeRelations) return base
  return {
    ...base,
    mascota: c.mascota ? { nombre: c.mascota.nombre } : undefined,
    cliente: c.cliente ? { nombre: c.cliente.nombre, apellido_paterno: c.cliente.apellidoPaterno ?? null, ci: c.cliente.ci, telefono: c.cliente.telefono } : undefined,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const id = searchParams.get('id')

  try {
    if (action === 'bypetid') {
      const citas = await prisma.cita.findMany({
        where: { mascotaId: id || undefined },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(citas.map((c: any) => toSnakeCita(c)))
    }

    if (action === 'byclientid') {
      const citas = await prisma.cita.findMany({
        where: { clienteId: id || undefined },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(citas.map((c: any) => toSnakeCita(c)))
    }

    if (action === 'allbyCID') {
      const citas = await prisma.cita.findMany({
        where: { clienteId: id || undefined },
        include: {
          mascota: { select: { nombre: true } },
          cliente: { select: { nombre: true, apellidoPaterno: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(
        citas.map((c: any) => ({
          fecha: c.fecha,
          hora_inicio: c.horaInicio,
          hora_fin: c.horaFin,
          estado: c.estado,
          observaciones: c.observaciones,
          id: c.id,
          mascota: { nombre: c.mascota?.nombre },
          cliente: { nombre: c.cliente?.nombre, apellido_paterno: c.cliente?.apellidoPaterno ?? null },
        })),
      )
    }

    if (action === 'byid' && id) {
      const c = await prisma.cita.findUnique({
        where: { id },
        include: {
          mascota: { select: { nombre: true } },
          cliente: { select: { ci: true, telefono: true, nombre: true, apellidoPaterno: true } },
        },
      })
      if (!c) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
      return NextResponse.json(toSnakeCita(c, true))
    }

    const citas = await prisma.cita.findMany({
      include: {
        mascota: { select: { nombre: true } },
        cliente: { select: { nombre: true, apellidoPaterno: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(
      citas.map((c: any) => ({
        ...toSnakeCita(c),
        mascota: { nombre: c.mascota?.nombre },
        cliente: { nombre: c.cliente?.nombre, apellido_paterno: c.cliente?.apellidoPaterno ?? null },
      })),
    )
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}

export async function PATCH (req: Request) {
  const body = await req.json()
  const { id, ...data } = body
  const dateOnly = data.fecha ? new Date(data.fecha) : undefined
  const isoDate = dateOnly ? dateOnly.toISOString().split('T')[0] : undefined
  const dataFormat = {
    clienteId: data.cliente_id,
    mascotaId: data.mascota_id,
    fecha: dateOnly,
    horaInicio: isoDate && typeof data.hora_inicio === 'string' ? new Date(`${isoDate}T${data.hora_inicio}:00.000Z`) : undefined,
    horaFin: isoDate && typeof data.hora_fin === 'string' ? new Date(`${isoDate}T${data.hora_fin}:00.000Z`) : undefined,
    estado: data.estado,
    observaciones: data.observaciones,
    estiloCorte: data.estilo_corte,
  }
  try {
    const cita = await prisma.cita.update({
      where: { id },
      data: dataFormat,
    })
    return NextResponse.json(toSnakeCita(cita))
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}
export async function POST(req: Request) {
  const body = await req.json()
  const { cliente_id, mascota_id, fecha, hora_inicio, hora_fin, estado, observaciones, estilo_corte } = body
  const fechaDate = new Date(fecha)
  try {
    const cita = await prisma.cita.create({
      data: {
        clienteId: cliente_id,
        mascotaId: mascota_id,
        fecha:fechaDate,
        horaInicio: hora_inicio,
        horaFin: hora_fin,
        estado,
        observaciones,
        estiloCorte: estilo_corte,
      },
    })
    return NextResponse.json(toSnakeCita(cita))
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}