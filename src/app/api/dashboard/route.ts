import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

function obtenerRangoMesActual() {
  const hoy = new Date();

  const inicio = new Date(hoy.getFullYear(), hoy.getMonth(), 1, 0, 0, 0, 0);
  const fin = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0, 23, 59, 59, 999);

  return { inicio, fin };
}
function sumarDias(fechaInicial: any, dias: any) {
  const fecha = new Date(fechaInicial);
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}
export async function GET(req: Request) {
  const {searchParams} = new URL(req.url)
  const action = searchParams.get('action')
  try {
    if (action === 'citasHoy'){
      const hoy = new Date().toISOString().substring(0, 10)
      const dateNow = `${hoy}T00:00:00.000Z`
      const res = await prisma.cita.findMany({
        where: {
          fecha: dateNow
        }
      })
      return Response.json({ cantidad: res.length }, { status: 200 })
    }
    if (action === 'clientesRegistrados') {
      const res = await prisma.cliente.findMany()
      return Response.json({ cantidad: res.length }, { status: 200 })
    }
    if (action === 'ingresosMes') {
      const { inicio, fin } = obtenerRangoMesActual()
      const res = await prisma.servicioCita.findMany({
        select: {
          valor: true
        },
        where: {
          createdAt: {
            gte: inicio,
            lte: fin
          }
        }
      })
      const total = res.reduce((acc, item) => acc.plus(item?.valor as Prisma.Decimal), new Prisma.Decimal(0));
      return Response.json({ total }, { status: 200 })
    }
    if (action === 'proxCitas') {
      const fechaInicial = new Date()
      const fechaFinal = sumarDias(fechaInicial, 5)
      const res = await prisma.cita.findMany({
        select: {
          id: true,
          fecha: true,
          horaInicio: true,
          horaFin: true,
          estado: true,
          cliente: {
            select: {
              nombre: true,
              apellidoPaterno: true,
              apellidoMaterno: true,
            }
          },
          mascota: {
            select: {
              nombre: true,
            }
          },
          servicios: {
            select: {
              valor: true,
            }
          },
          sucursal: {
            select: {
              nombre: true,
            }
          }
        },
        where: {
          fecha: {
            gte: fechaInicial,
            lte: fechaFinal
          }
        }
      })
      return Response.json({ res }, { status: 200 })
    }
  } catch (error) {
    return Response.json({ error: 'Error interno al obtener datos' }, { status: 500 })
  }
}