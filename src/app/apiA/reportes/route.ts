import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(req: Request){
  const { searchParams } = new URL(req.url)
  const fecha_inicio = searchParams.get('fecha_inicio')
  const fecha_fin = searchParams.get('fecha_fin')
  
  if(!fecha_inicio || !fecha_fin) return NextResponse.json({error: 'es necesario fecha inicio y fin ',fecha_fin , fecha_inicio},{status: 400})

  const { data, error } = await supabase
    .rpc('fn_reporte_financiero', {
      fecha_inicio,
      fecha_fin
    })
  if (error) return NextResponse.json({error: error.message},{status:500})
  return NextResponse.json(data)
}