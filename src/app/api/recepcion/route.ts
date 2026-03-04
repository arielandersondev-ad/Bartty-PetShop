import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'es requerido un ID' }, { status: 400 })
  }
  try {
    const totalServicios = await prisma.servicioCita.aggregate({
      where: { citaId: id },
      _sum: { valor: true },
    })
    const total_cita = Number(totalServicios._sum.valor ?? 0)
    return NextResponse.json([{ cita_id: id, total_cita }])
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}
