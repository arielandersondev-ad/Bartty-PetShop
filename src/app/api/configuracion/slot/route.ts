import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()

  const slot = await prisma.slotTrabajo.create({
    data: {
      hora: body.hora,
      configuracionId: body.configuracionId,
      sucursalId: body.sucursalId || null
    }
  })

  return NextResponse.json(slot)
}
export async function GET(req: Request) {
  const {searchParams} = new URL(req.url)
  const sucursalId = searchParams.get('sucursalId')
  try {
    if(sucursalId){
      const slots = await prisma.slotTrabajo.findMany({
        where: {
          sucursalId
        }
      })
      return NextResponse.json(slots)
    }
    const slots = await prisma.slotTrabajo.findMany()
    return NextResponse.json(slots)
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener slots' }, { status: 500 })
  }
}
