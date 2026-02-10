import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {return NextResponse.json({error:'es requerido un ID'},{status: 400})}
  const {data, error} = await supabase
    .from('citas_totales')
    .select('*')
    .eq('cita_id',id)
  if (error) {return NextResponse.json({error: error.message},{status: 500})}
  return NextResponse.json(data)
}