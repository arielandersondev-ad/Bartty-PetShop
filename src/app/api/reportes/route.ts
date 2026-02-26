import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const fecha_inicio = searchParams.get('fecha_inicio')
  const fecha_fin = searchParams.get('fecha_fin')
  if (!fecha_inicio || !fecha_fin) {
    return NextResponse.json({ error: 'es necesario fecha inicio y fin ', fecha_fin, fecha_inicio }, { status: 400 })
  }
  try {
    const start = new Date(fecha_inicio)
    const end = new Date(fecha_fin)
    const pagos = await prisma.pago.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: {
        cita: {
          include: {
            cliente: true,
            mascota: true,
            servicios: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const total = pagos.reduce((sum: number, p: any) => sum + Number(p.monto), 0)
    const count = pagos.length
    const promedio = count > 0 ? total / count : 0
    const valores = pagos.map((p: any) => Number(p.monto))
    const pago_maximo = valores.length ? Math.max(...valores) : 0
    const pago_minimo = valores.length ? Math.min(...valores) : 0

    const detalles = pagos.map((p: any) => ({
      fecha: p.createdAt.toISOString().split('T')[0],
      cliente: `${p.cita?.cliente?.nombre || ''} ${p.cita?.cliente?.apellidoPaterno || ''}`.trim(),
      mascota: p.cita?.mascota?.nombre || '',
      servicio: p.cita?.servicios?.[0]?.servicio || 'Pago de cita',
      monto: Number(p.monto),
      tipo_pago: p.tipoPago,
    }))

    return NextResponse.json({
      resumen: {
        total_ingresos: Number(total.toFixed(2)),
        promedio: Number(promedio.toFixed(2)),
        cantidad_transacciones: count,
        pago_maximo: Number(pago_maximo.toFixed(2)),
        pago_minimo: Number(pago_minimo.toFixed(2)),
      },
      detalles,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al generar reporte' }, { status: 500 })
  }
}
