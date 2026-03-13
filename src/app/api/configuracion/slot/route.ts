import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()

  const slot = await prisma.slotTrabajo.create({
    data: {
      hora: body.hora,
      configuracionId: body.configuracionId
    }
  })

  return NextResponse.json(slot)
}