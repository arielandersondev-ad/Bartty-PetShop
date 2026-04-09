import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const movimientoSchema = z.object({
  inventario_id: z.string().min(1, 'ID de inventario es requerido'),
  tipo: z.enum(['entrada', 'salida']),
  cantidad: z.number().positive('La cantidad debe ser positiva'),
  motivo: z.string().optional(),
})

function toSnakeMovimiento(m: any, p?: any) {
  return {
    id: m.id,
    inventario_id: m.productoId,
    tipo: m.tipo === 'ENTRADA' ? 'entrada' : 'salida',
    cantidad: m.cantidad,
    motivo: m.referencia ?? null,
    created_at: m.createdAt,
    inventario: p
      ? {
          id: p.id,
          nombre_producto: p.nombre,
          categoria: p.categoria?.nombre ?? null,
          stock_actual: p.inventario?.cantidad ?? 0,
          stock_minimo: p.stockMinimo ?? 0,
          precio_venta: Number(p.precioVenta ?? 0),
        }
      : undefined,
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const inventario_id = searchParams.get('inventario_id') || ''
    const tipo = searchParams.get('tipo') || ''
    const fecha_inicio = searchParams.get('fecha_inicio') || ''
    const fecha_fin = searchParams.get('fecha_fin') || ''
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    if (inventario_id) where.productoId = inventario_id
    if (tipo) where.tipo = tipo === 'entrada' ? 'ENTRADA' : 'SALIDA'
    if (fecha_inicio) where.createdAt = { gte: new Date(fecha_inicio) }
    if (fecha_fin) where.createdAt = { ...(where.createdAt || {}), lte: new Date(fecha_fin) }

    const movimientos = await prisma.movimientoInventario.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    })
    const count = await prisma.movimientoInventario.count({ where })

    // optional search over producto.nombre via filtering after join
    const productosMap: Record<string, any> = {}
    await Promise.all(
      movimientos.map(async (m:any) => {
        if (!productosMap[m.productoId]) {
          productosMap[m.productoId] = await prisma.producto.findUnique({
            where: { id: m.productoId },
            include: { categoria: true, inventario: true },
          })
        }
      }),
    )

    const data = movimientos
      .map((m:any) => toSnakeMovimiento(m, productosMap[m.productoId]))
      .filter((item: any) => {
        if (!search.trim()) return true
        const name = item.inventario?.nombre_producto || ''
        const motivo = item.motivo || ''
        return name.toLowerCase().includes(search.toLowerCase()) || motivo.toLowerCase().includes(search.toLowerCase())
      })

    return NextResponse.json({ success: true, data, count })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Error al obtener movimientos' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = movimientoSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.message }, { status: 400 })
    }
    const { inventario_id, tipo, cantidad, motivo } = parsed.data
    const movimiento = await prisma.movimientoInventario.create({
      data: {
        productoId: inventario_id,
        tipo: tipo === 'entrada' ? 'ENTRADA' : 'SALIDA',
        cantidad,
        referencia: motivo ?? null,
      },
    })
    // actualizar stock
    const delta = tipo === 'entrada' ? cantidad : -cantidad
    await prisma.inventario.upsert({
      where: { productoId: inventario_id },
      update: { cantidad: { increment: delta } },
      create: { productoId: inventario_id, cantidad: Math.max(delta, 0) },
    })
    const producto = await prisma.producto.findUnique({
      where: { id: inventario_id },
      include: { categoria: true, inventario: true },
    })
    return NextResponse.json({ success: true, data_single: toSnakeMovimiento(movimiento, producto) }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al registrar movimiento' }, { status: 400 })
  }
}
