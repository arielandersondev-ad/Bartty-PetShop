import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toSnakeServicio(s: any) {
  return {
    id: s.id,
    created_at: s.createdAt,
    servicio: s.servicio ?? null,
    valor: s.valor ?? null,
    usuario_id: s.usuarioId ?? null,
    cita_id: s.citaId ?? null,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cita_id = searchParams.get('cita_id')
  if (!cita_id) return NextResponse.json({ error: 'cita_id requerido' }, { status: 400 })
  try {
    const servicios = await prisma.servicioCita.findMany({
      where: { citaId: cita_id },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(servicios.map(toSnakeServicio))
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { servicio, valor, usuario_id, cita_id } = body
    if (!servicio || valor == null || !usuario_id) {
      return NextResponse.json({ error: 'Campos incompletos' }, { status: 400 })
    }
    const created = await prisma.servicioCita.create({
      data: {
        servicio,
        valor,
        usuarioId: usuario_id,
        citaId: cita_id,
      },
    })
    return NextResponse.json(toSnakeServicio(created), { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al crear servicio' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  try {
    const deleted = await prisma.servicioCita.delete({ where: { id } })
    return NextResponse.json(toSnakeServicio(deleted))
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al eliminar servicio' }, { status: 500 })
  }
}
