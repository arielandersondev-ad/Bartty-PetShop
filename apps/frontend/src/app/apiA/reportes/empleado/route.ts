import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const fecha_inicio = searchParams.get('fecha_inicio')
  const fecha_fin = searchParams.get('fecha_fin')
  const id_empleado = searchParams.get('empleado_id')
  
  if(!id_empleado || !fecha_inicio || !fecha_fin && id_empleado) return NextResponse.json({error: 'es necesario fecha inicio y fin ',fecha_fin , fecha_inicio, id_empleado },{status: 400},)
  
  const { data, error } = await supabase
    .rpc('reporte_ingresos_empleado', {
      empleado_param:id_empleado, 
      fecha_fin, 
      fecha_inicio
    })
  if (error) NextResponse.json({error: error.message},{status: 400})
  return NextResponse.json(data)

}