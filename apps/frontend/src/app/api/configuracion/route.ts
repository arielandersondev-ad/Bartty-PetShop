import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
    const  slotTrabajo = await prisma.slotTrabajo.findMany()
    const config = await prisma.configuracion.findFirst()
    return NextResponse.json({config, slotTrabajo})
}
export async function POST(req: Request) {
  try {
    const body = await req.json()

    const config = await prisma.configuracion.create({
      data: {
        clientesPorHora: body.clientesPorHora,
        slots: {
          create: body.slots.map((hora: string) => ({
            hora
          }))
        }
      },
      include: {
        slots: true
      }
    })

    return NextResponse.json({ success: true, data: config })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

//////////////////////////////////////////////////
// PATCH - actualizar configuración
//////////////////////////////////////////////////

export async function PATCH(req: Request) {
  try {
    const body = await req.json()

    const config = await prisma.configuracion.update({
      where: { id: body.id },
      data: {
        clientesPorHora: body.clientesPorHora
      }
    })

    return NextResponse.json({ success: true, data: config })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

//////////////////////////////////////////////////
// DELETE - eliminar slot
//////////////////////////////////////////////////

export async function DELETE(req: Request) {
  try {
    const body = await req.json()

    await prisma.slotTrabajo.delete({
      where: { id: body.id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}