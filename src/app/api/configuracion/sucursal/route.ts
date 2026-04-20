import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const { id, nombre, lat, lng, distanciaMax } = await req.json()
  try {
    const res = await prisma.sucursal.create({
      data: {
        id,
        nombre,
        lat,
        lng,
        distanciaMax: distanciaMax !== undefined ? parseFloat(distanciaMax) : undefined,
      }
    })
    return Response.json({ sucursal: res })
  } catch (error) {
    return Response.json({ error: 'Error interno al agregar la sucursal' }, { status: 500 })
  }
}
export async function PATCH(req: Request) {
  const { id, nombre, lat, lng, activo, distanciaMax } = await req.json()
  if (!id) {
    return Response.json({ error: 'Error interno al obtener el id de la sucursal' }, { status: 400 })
  }
  try {
    await prisma.sucursal.update({
      where: { id },
      data: {
        nombre: nombre !== undefined ? nombre : undefined,
        lat: lat !== undefined ? lat : undefined,
        lng: lng !== undefined ? lng : undefined,
        activo: activo !== undefined ? activo : undefined,
        distanciaMax: distanciaMax !== undefined ? parseFloat(distanciaMax) : undefined,
      }
    })
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Error interno al actualizar la sucursal' }, { status: 500 })
  }
}