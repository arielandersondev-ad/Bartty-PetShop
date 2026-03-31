import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { id, nombre, lat, lng } = await req.json()
  try {
    const res = await prisma.sucursal.create({
      data: {
        id,
        nombre,
        lat,
        lng,
      }
    })
    return Response.json({ sucursal: res })
  } catch (error) {
    return Response.json({ error: 'Error interno al agregar la sucursal' }, { status: 500 })
  }
}
export async function PATCH(req: Request) {
  const { id, activo } = await req.json()
  if (!id) {
    return Response.json({ error: 'Error interno al obtener el id de la sucursal' }, { status: 500 })
  }
  try {
    await prisma.sucursal.update({
      where: { id },
      data: {
        activo: activo,
      }
    })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Error interno al inactivar la sucursal' }, { status: 500 })
  }
}