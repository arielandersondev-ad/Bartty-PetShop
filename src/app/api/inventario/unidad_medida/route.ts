import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const { action, nombre, unidad, valor, estado } = body
  if (action === 'createUnidadMedida') {
    if (!nombre) {
      return NextResponse.json(
        { error: 'Nombre es obligatorio' },
        { status: 400 }
      )
    }
    if (!unidad) {
      return NextResponse.json(
        { error: 'Unidad es obligatorio' },
        { status: 400 }
      )
    }
    if (!valor) {
      return NextResponse.json(
        { error: 'Valor es obligatorio' },
        { status: 400 }
      )
    }
    const unidadMedida = await prisma.unidadMedida.create({
      data: {
        nombre,
        unidad,
        valor,
      }
    })
    return NextResponse.json({ success: true, data: unidadMedida })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  if (action === 'getUnidadMedidas') {
    const unidadMedidas = await prisma.unidadMedida.findMany()
    return NextResponse.json({ success: true, data: unidadMedidas })
  }
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { action, id, nombre, unidad, valor, estado } = body
  if (action === 'updateUnidadMedida') {
    if (!id || !nombre || !unidad || !valor || !estado) {
      return NextResponse.json(
        { error: 'ID, nombre, unidad, valor y estado son obligatorios' },
        { status: 400 }
      )
    }
  }
        const unidadMedida = await prisma.unidadMedida.update({
            where: { id },
            data: {
                nombre,
                unidad,
                valor,
                estado
            }
        })
        return NextResponse.json({ success: true, data: unidadMedida })
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
    const unidadMedida = await prisma.unidadMedida.delete({
        where: { id },
    })
    return NextResponse.json({ success: true, data: unidadMedida })
}