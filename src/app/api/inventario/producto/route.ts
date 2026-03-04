import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const body = await req.json()
    const { 
        action,
        nombre, 
        estado, 
        unidadMedidaId, 
        categoriaId, 
        precioCompra, 
        precioVenta, 
        unidadMinimaVenta,
        stockMinimo, 
        descripcion, 
        tipo 
    } = body

    if (action === 'createProducto') {
        console.log("datos recividos create: ",body)
        if (!nombre || !estado || !unidadMedidaId || !precioCompra || !precioVenta || !stockMinimo || !unidadMinimaVenta) {
        return NextResponse.json(
            { error: 'Nombre, estado, unidadMedidaId, precioCompra, precioVenta, stockMinimo y unidadMinimaVenta son obligatorios' },  
            { status: 400 }
        )
        }
        const producto = await prisma.producto.create({
        data: {
            nombre,
            estado,
            unidadMedidaId,
            categoriaId,
            precioCompra: Number(precioCompra),
            precioVenta: Number(precioVenta),
            stockMinimo: Number(stockMinimo),
            unidadMinimaVenta: Number(unidadMinimaVenta),
            descripcion,
            tipo
        }
        })
        return NextResponse.json({ success: true, data: producto })
    }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  if (action === 'getProductos') {
    const productos = await prisma.producto.findMany()
    return NextResponse.json({ success: true, data: productos })
  }
}

export async function PATCH(req: Request) {
  const body = await req.json()
    const { 
        id,
        action,
        nombre, 
        estado, 
        unidadMedidaId, 
        categoriaId, 
        precioCompra, 
        precioVenta, 
        stockMinimo, 
        unidadMinimaVenta,
        descripcion, 
        tipo 
    } = body
    if (action === 'updateProducto') {
        console.log("datos recividos update: ",body)
        if (!id) return NextResponse.json({ error: "ID" }, { status: 400 })
        if (!action) return NextResponse.json({ error: "ACTION" }, { status: 400 })
        if (!nombre) return NextResponse.json({ error: "NOMBRE" }, { status: 400 })
        if (estado === undefined) return NextResponse.json({ error: "ESTADO" }, { status: 400 })
        if (!unidadMedidaId) return NextResponse.json({ error: "UNIDAD_MEDIDA_ID" }, { status: 400 })
        if (!categoriaId) return NextResponse.json({ error: "CATEGORIA_ID" }, { status: 400 })
        if (precioCompra == null) return NextResponse.json({ error: "PRECIO_COMPRA" }, { status: 400 })
        if (precioVenta == null) return NextResponse.json({ error: "PRECIO_VENTA" }, { status: 400 })
        if (stockMinimo == null) return NextResponse.json({ error: "STOCK_MINIMO" }, { status: 400 })
        if (unidadMinimaVenta == null) return NextResponse.json({ error: "UNIDAD_MINIMA_VENTA" }, { status: 400 })
        if (descripcion == null || descripcion === "") return NextResponse.json({ error: "DESCRIPCION" }, { status: 400 })
        if (!tipo) return NextResponse.json({ error: "TIPO" }, { status: 400 })
    }
            const producto = await prisma.producto.update({
                where: { id },
                data: {
                    nombre, 
                    estado, 
                    unidadMedidaId, 
                    unidadMinimaVenta: Number(unidadMinimaVenta),
                    categoriaId, 
                    precioCompra: Number(precioCompra), 
                    precioVenta: Number(precioVenta), 
                    stockMinimo: Number(stockMinimo), 
                    descripcion, 
                    tipo
                }
            })
            return NextResponse.json({ success: true, data: producto })
}

export async function DELETE(req: Request) {
    const {searchParams} = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
        return NextResponse.json(
        { error: 'ID es obligatorio' },
        { status: 400 }
        )
    }
    const producto = await prisma.producto.delete({
        where: { id },
    })
    return NextResponse.json({ success: true, data: producto })
}