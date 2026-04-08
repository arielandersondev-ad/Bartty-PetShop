import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url)
  const action = searchParams.get('action')
  try {
    if (action === 'byId'){
      const id = searchParams.get('id')
      if (!id)return Response.json({ message: 'es necesario el id' }, { status: 400 })
      const sucursal = await prisma.sucursal.findUnique({
        where: { id }
      })
      return Response.json({ sucursal })
    }
    const res = await prisma.sucursal.findMany()
    return Response.json({ sucursales: res });
  }
  catch (error: any) {
    return Response.json({ error: 'Error interno al obtener las sucursales' }, { status: 500 })
  }
}