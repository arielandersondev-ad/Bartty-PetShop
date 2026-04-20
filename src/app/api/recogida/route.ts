import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function getDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // radio de la tierra en km

  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}
export async function POST(req: Request) {
  try {
    const { picklat, picklng, sucursalId, action } = await req.json()
    
    if (!picklat || !picklng || !sucursalId) {
      return NextResponse.json({ error: 'es requerido picklat, picklng, sucursalId' }, { status: 400 })
    }

    if(action === 'validacion'){
      // Obtener datos de la sucursal de la DB
      const sucursal = await prisma.sucursal.findUnique({
        where: { id: sucursalId }
      })

      if (!sucursal || !sucursal.lat || !sucursal.lng) {
        return NextResponse.json({ error: 'Sucursal no encontrada o sin coordenadas' }, { status: 404 })
      }

      const centerlat = sucursal.lat
      const centerlng = sucursal.lng
      const distMax = sucursal.distanciaMax || 5.0 // Valor por defecto si no existe

      const distancia = getDistanceKm(Number(picklat), Number(picklng), Number(centerlat), Number(centerlng))
      
      if(distancia > Number(distMax)){
        return NextResponse.json({ 
          message:`distancia maxima de ${distMax} km excedida. Tu ubicación está a ${distancia.toFixed(2)} km.`,
          currentDistance:distancia,
          habilitado:false
        }, { status: 200 })
      }

      return NextResponse.json({
        message:`Ubicación válida. Distancia: ${distancia.toFixed(2)} km.`,
        currentDistance:distancia,
        habilitado:true
      })
    }
    
  } catch (error: any) {
    console.error('Error en API recogida:', error)
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}
