import { NextResponse } from "next/server"
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
    const { picklat, picklng,centerlat,centerlng, distanciaMax, action } = await req.json()
    if (!picklat || !picklng || !centerlat || !centerlng) {
      return NextResponse.json({ error: 'es requerido picklat, picklng, centerlat, centerlng' }, { status: 400 })
    }
    if(action === 'validacion'){
      const distancia = getDistanceKm(Number(picklat), Number(picklng), Number(centerlat), Number(centerlng))
      if(distancia > Number(distanciaMax)){
        return NextResponse.json({ 
          message:`distancia maxima de ${distanciaMax} km excedida`,
          currentDistance:distancia,
          habilitado:false
        }, { status: 200 })
      }
      return NextResponse.json({
        message:`distancia dentro de los limites ${distanciaMax} km`,
        currentDistance:distancia,
        habilitado:true
      })
      
    }
    
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}
