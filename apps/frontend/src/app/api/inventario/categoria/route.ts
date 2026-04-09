import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json()
  const action = body.action
  const nombre = body.nombre
  if (action === 'createCategoria') {
    if (!nombre) {
      return NextResponse.json(
        { error: 'Nombre es obligatorio' },
        { status: 400 }
      )
    }
    const categoria = await prisma.categoria.create({
      data: {
        nombre,
      }
    })
    return NextResponse.json({ success: true, data: categoria })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  if (action === 'getCategorias') {
    const categorias = await prisma.categoria.findMany()
    return NextResponse.json({ success: true, data: categorias })
  }
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const action = body.action
  const id = body.id
  const nombre = body.nombre
  if (action === 'updateCategoria') {
    if (!id || !nombre) {
      return NextResponse.json(
        { error: 'ID y nombre son obligatorios' },
        { status: 400 }
      )
    }
  }
		const categoria = await prisma.categoria.update({
			where: { id },
			data: {
				nombre,
				estado: body.estado
			}
		})
		return NextResponse.json({ success: true, data: categoria })
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
	const categoria = await prisma.categoria.delete({
		where: { id },
	})
	return NextResponse.json({ success: true, data: categoria })
}