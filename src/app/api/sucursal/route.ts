import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const res = await prisma.sucursal.findMany()
    console.log('datos sucursales:',res)
    return Response.json({ sucursales: res });
  }
  catch (error: any) {
    console.error('Error al obtener las sucursales:', error)
    return Response.json({ error: 'Error interno al obtener las sucursales' }, { status: 500 })
  }
}