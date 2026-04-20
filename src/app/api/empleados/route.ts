import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const rol = searchParams.get('rol')
    const action = searchParams.get('action')
    if (!rol) {
      return NextResponse.json({ message: 'es necesario el rol del empleado' }, { status: 400 })
    }
    if (action === 'empBySucursal') {
      const sucursalId = searchParams.get('sucursalId')
      if (!sucursalId)return NextResponse.json({ message: 'es necesario el sucursalId' }, { status: 400 })
      const empleados = await prisma.usuario.findMany({
        where: { 
          rol: rol as any, 
          activo: 'true',
          sucursalId 
        }
      })
      return NextResponse.json(empleados)
    }
    const empleados = await prisma.usuario.findMany({
      where: { rol: rol as any, activo: 'true' },
    })
    return NextResponse.json(empleados.map((u:any) => ({ id: u.id, nombre: u.nombre, email: u.email, rol: u.rol, activo: u.activo })))
  } catch (error: any) {
    return NextResponse.json({ message: 'error en el servidor', error: error?.message }, { status: 500 })
  }
}
