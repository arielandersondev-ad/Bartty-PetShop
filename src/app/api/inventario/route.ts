import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
  const body = await req.json()
  const { 
    id,
    action,
    cantidad
  } = body
  if (action === 'updateInventario') {
    if (!id) return NextResponse.json({ error: "ID" }, { status: 400 })
    if (!cantidad ){
      return NextResponse.json({ error: 'Cantidad es obligatoria' },{ status: 400 })}
    const inventario = await prisma.inventario.update({
    where: { id },
    data: {
      cantidad: Number(cantidad)
    }
    })
    return NextResponse.json({ success: true, data: inventario })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const id = searchParams.get('id')
  if (action === 'getInventarioId'){
    const inventario = await prisma.inventario.findUnique({
      where: { id: id || undefined }
    })    
    if (!inventario) {
      return NextResponse.json({ error: 'Inventario no encontrado' },{ status: 404 })
    }
    return NextResponse.json({ success: true, data: inventario })
  }
  if (action === 'getAllDataInventario') {
    const inventario = await prisma.inventario.findMany({
      include: { 
        producto: {
          include: {
            categoria: true, 
            unidadMedida: true 
          }
        }
      }
    })
    return NextResponse.json({ success: true, data: inventario })  
  }

  if (action === 'getinventario') {
    const productos = await prisma.inventario.findMany()
    return NextResponse.json({ success: true, data: productos })
  }
}

export async function POST (req: Request) {
  const body = await req.json()
  const { 
    action,
    productoId,
    cantidad
  } = body
  if (action === 'createInventario') {
    if (!cantidad) {return NextResponse.json({ error: 'Cantidad es obligatoria' },{ status: 400 })}
    if (!productoId) {return NextResponse.json({ error: 'ProductoId es obligatorio' },{ status: 400 })}
    
    const inventario = await prisma.inventario.create({
      data: { cantidad: Number(cantidad), producto: { connect: { id: productoId } } }
    })
    return NextResponse.json({ success: true, data: inventario })
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: "ID" }, { status: 400 })
  const inventario = await prisma.inventario.delete({
    where: { id }
  })
  return NextResponse.json({ success: true, data: inventario })
}