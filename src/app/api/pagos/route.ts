import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toSnakePago(p: any) {
  return {
    id: p.id,
    cita_id: p.citaId,
    monto: Number(p.monto),
    tipo_pago: p.tipoPago,
    tipo_pago_cita: p.tipoPagoCita,
    created_at: p.createdAt,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cita_id = searchParams.get('cita_id')
  const id_cita_pago = searchParams.get('id_cita_pago')

  try {
    if (cita_id) {
      const pagos = await prisma.pago.findMany({
        where: { citaId: cita_id },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(pagos.map(toSnakePago))
    }
    if (id_cita_pago) {
      const total = await prisma.pago.aggregate({
        where: { citaId: id_cita_pago },
        _sum: { monto: true },
      })
      return NextResponse.json({ total_pagado: Number(total._sum.monto ?? 0) })
    }
    return NextResponse.json({ error: 'Debe enviar cita_id o id_cita_pago' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const created = await prisma.pago.create({
      data: {
        citaId: body.cita_id,
        monto: body.monto,
        tipoPago: body.tipo_pago,
        tipoPagoCita: body.tipo_pago_cita,
      },
    })
    return NextResponse.json({ success: true, data_single: toSnakePago(created) }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al crear pago' }, { status: 400 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, ...rest } = body
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    const updated = await prisma.pago.update({
      where: { id },
      data: {
        monto: rest.monto,
        tipoPago: rest.tipo_pago,
        tipoPagoCita: rest.tipo_pago_cita,
      },
    })
    return NextResponse.json({ success: true, data_single: toSnakePago(updated) })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al actualizar pago' }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id_pago = searchParams.get('id_pago') || searchParams.get('id')
  if (!id_pago) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  try {
    await prisma.pago.delete({ where: { id: id_pago } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al eliminar pago' }, { status: 400 })
  }
}
