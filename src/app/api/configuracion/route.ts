import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"
import { success } from "zod"

export async function GET(req : Request) {
  const {searchParams} = new URL(req.url)
  const action = searchParams.get('action')
  const sucursalId = searchParams.get('sucursalId')
  
  if(action === 'all'){
    try {
      const res = await prisma.configuracion.findMany({
        include: { sucursal: true}
      })
      //console.log('all configuration: ',res)
      return NextResponse.json(res)
    } catch (error) {
      return NextResponse.json({status: 500})
    }
  }
  
  // Filtrar por sucursalId si se proporciona
  const whereConfig = sucursalId ? { sucursalId } : {}
  const whereSlot = sucursalId ? { sucursalId } : {}
  
  const slotTrabajo = await prisma.slotTrabajo.findMany({
    where: whereSlot
  })
  const config = await prisma.configuracion.findFirst({
    where: whereConfig
  })
  return NextResponse.json({config, slotTrabajo})
}
export async function POST(req: Request) {
  const body = await req.json()
  const {action, clientesPorHora, recojoHabilitado, sucursalId} = body
  if(action === 'configuracion'){
    try {
      const res = await prisma.configuracion.create({
        data: {
          clientesPorHora:Number(clientesPorHora),
          recojoHabilitado,
          sucursalId
        }
      })
      return NextResponse.json({data: res}, {status: 201})
    } catch (error) {
      NextResponse.json({success:false},{status:500})
    }
  }

  try {
    const body = await req.json()

    const config = await prisma.configuracion.create({
      data: {
        clientesPorHora: body.clientesPorHora,
        sucursalId: body.sucursalId,
        slots: {
          create: body.slots.map((hora: string) => ({
            hora,
            sucursalId: body.sucursalId
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
  const body = await req.json()
  const {action, recojoHabilitado, clientesPorHora, sucursalId} = body
    if(action === 'editconfiguracion' && body.id){
    const id = body.id
    try {
      const res = await prisma.configuracion.update({
        where: {id},
        data: {
          clientesPorHora:Number(clientesPorHora),
          recojoHabilitado,
          sucursalId
        }
      })
      return NextResponse.json({data: res}, {status: 201})
    } catch (error) {
      NextResponse.json({success:false},{status:500})
    }
    
  }
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
    const {id,action} = body
    if (action === 'eliminarConfiguracion') {
      await prisma.configuracion.delete({
        where: {id}
      })
    }
    await prisma.slotTrabajo.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}