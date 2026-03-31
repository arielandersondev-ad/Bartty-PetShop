import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const res = await prisma.sucursal.findMany()
    return Response.json({ sucursales: res });
  }
  catch (error: any) {
    return Response.json({ error: 'Error interno al obtener las sucursales' }, { status: 500 })
  }
}