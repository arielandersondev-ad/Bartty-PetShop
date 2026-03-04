import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const fecha_inicio = searchParams.get('fecha_inicio')
  const fecha_fin = searchParams.get('fecha_fin')
  const id_empleado = searchParams.get('empleado_id')
  if (!id_empleado || !fecha_inicio || !fecha_fin) {
    return NextResponse.json({ error: 'es necesario fecha inicio y fin ', fecha_fin, fecha_inicio, id_empleado }, { status: 400 })
  }
  try {
    const start = new Date(fecha_inicio)
    const end = new Date(fecha_fin)
    const empleado = await prisma.usuario.findUnique({ where: { id: id_empleado } })
    if (!empleado) return NextResponse.json({ error: 'Empleado no encontrado' }, { status: 404 })

    const servicios = await prisma.servicioCita.findMany({
      where: { usuarioId: id_empleado, createdAt: { gte: start, lte: end } },
      orderBy: { createdAt: 'asc' },
    })

    const valores = servicios.map((s: any) => Number(s.valor ?? 0))
    const total = valores.reduce((sum: number, v: number) => sum + v, 0)
    const count = servicios.length
    const promedio = count > 0 ? total / count : 0
    const max = valores.length ? Math.max(...valores) : 0
    const min = valores.length ? Math.min(...valores) : 0

    const detalles = servicios.map((s: any) => ({
      fecha: s.createdAt.toISOString().split('T')[0],
      servicio: s.servicio || '',
      monto: Number(s.valor ?? 0),
    }))

    return NextResponse.json({
      empleado: empleado.nombre,
      rol: empleado.rol,
      resumen: {
        total_ingresos: Number(total.toFixed(2)),
        total_servicios: count,
        promedio: Number(promedio.toFixed(2)),
        servicio_mas_caro: Number(max.toFixed(2)),
        servicio_mas_barato: Number(min.toFixed(2)),
      },
      detalles,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al generar reporte' }, { status: 500 })
  }
}
