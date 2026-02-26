import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const {searchParams} = new URL(req.url)
  const id_cliente = searchParams.get('cliente_id')
  if(!id_cliente) return NextResponse.json({error:'se requiere el id_cliente'})
  const { data, error } = await supabase
    .from('clientes')
    .select(`
      *,
      mascotas (*)
      `)
    .eq('id',id_cliente)
    .single()
  if(error)return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({data},{status:200})
}
export async function POST(req: Request){
  const body = await req.json()
  if (!body.fecha_nacimiento){
    body.fecha_nacimiento=null
  }
  const { data, error } = await supabase
    .from('mascotas')
    .insert([body])
    .select()
  if(error) return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({data},{status:200})
}
export async function PATCH(req: Request){
  const body = await req.json()
  const { id, cliente_id, ...rest } = body
  if(cliente_id)return NextResponse.json({error:'no se puede cambiar el Cliente_id'})
  if(!id)return NextResponse.json({error:'se requiere la id de la mascota'})
  const { data, error } = await supabase
    .from("mascotas")
    .update(rest)
    .eq('id',id)
    .select()
  if(error)return NextResponse.json({error:error.message},{status:400})
  return NextResponse.json({data},{status:200})
}
