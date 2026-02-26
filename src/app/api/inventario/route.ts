import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toSnakeInventario(p: any, inv?: any, catName?: string) {
  return {
    id: p.id,
    nombre_producto: p.nombre,
    categoria: catName ?? null,
    stock_actual: inv?.cantidad ?? 0,
    stock_minimo: p.stockMinimo ?? 0,
    precio_venta: Number(p.precioVenta ?? 0),
    created_at: p.createdAt,
  }
}

async function ensureCategoria(nombre?: string) {
  if (!nombre) return null
  const found = await prisma.categoria.findFirst({ where: { nombre } })
  if (found) return found.id
  const created = await prisma.categoria.create({ data: { nombre } })
  return created.id
}

async function ensureUnidadDefault() {
  const found = await prisma.unidadMedida.findFirst({ where: { nombre: 'Unidad' } })
  if (found) return found.id
  const created = await prisma.unidadMedida.create({
    data: { nombre: 'Unidad', unidad: 'u', valor: 1 },
  })
  return created.id
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const categoria = searchParams.get('categoria') || ''
    const stock_bajo = searchParams.get('stock_bajo') === 'true'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const where: any = {}
    if (search.trim()) {
      where.OR = [{ nombre: { contains: search, mode: 'insensitive' } }, { descripcion: { contains: search, mode: 'insensitive' } }]
    }
    if (categoria.trim()) {
      const cat = await prisma.categoria.findFirst({ where: { nombre: categoria } })
      if (cat) where.categoriaId = cat.id
      else where.categoriaId = '___none___' // fuerza cero resultados
    }

    const productos = await prisma.producto.findMany({
      where,
      include: { inventario: true, categoria: true },
      orderBy: { nombre: 'asc' },
      skip,
      take: limit,
    })

    const filtered = stock_bajo ? productos.filter((p : any) => (p.inventario?.cantidad ?? 0) < (p.stockMinimo ?? 0)) : productos
    const count = await prisma.producto.count({ where })

    const data = filtered.map((p: any) => toSnakeInventario(p, p.inventario, p.categoria?.nombre))
    return NextResponse.json({ success: true, data, count })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: 'Error al obtener inventario' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const categoriaId = await ensureCategoria(body.categoria)
    const unidadMedidaId = await ensureUnidadDefault()
    const producto = await prisma.producto.create({
      data: {
        nombre: body.nombre_producto,
        tipo: null,
        categoriaId: categoriaId ?? (await ensureCategoria('General'))!,
        unidadMedidaId,
        precioCompra: body.precio_venta ?? 0,
        precioVenta: body.precio_venta ?? 0,
        descripcion: null,
        stockMinimo: body.stock_minimo ?? 0,
        estado: true,
      },
      include: { categoria: true },
    })
    const inventario = await prisma.inventario.create({
      data: { productoId: producto.id, cantidad: body.stock_actual ?? 0 },
    })
    return NextResponse.json({ success: true, data_single: toSnakeInventario(producto, inventario, producto.categoria?.nombre) }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al crear producto' }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, nombre_producto, categoria, stock_actual, stock_minimo, precio_venta } = body
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    const categoriaId = await ensureCategoria(categoria)
    const updatedProducto = await prisma.producto.update({
      where: { id },
      data: {
        nombre: nombre_producto,
        categoriaId: categoriaId || undefined,
        stockMinimo: stock_minimo,
        precioVenta: precio_venta,
      },
      include: { categoria: true, inventario: true },
    })
    if (typeof stock_actual === 'number') {
      await prisma.inventario.upsert({
        where: { productoId: id },
        update: { cantidad: stock_actual },
        create: { productoId: id, cantidad: stock_actual },
      })
    }
    const refreshed = await prisma.producto.findUnique({
      where: { id },
      include: { inventario: true, categoria: true },
    })
    return NextResponse.json(
      { success: true, data_single: toSnakeInventario(refreshed, refreshed?.inventario, refreshed?.categoria?.nombre) },
      { status: 200 },
    )
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al actualizar producto' }, { status: 400 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    await prisma.producto.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al eliminar producto' }, { status: 400 })
  }
}
