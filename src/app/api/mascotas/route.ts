import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET (req: Request){
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const id = searchParams.get('id')

  if (action === 'clientPets' && id ) {
    const {data, error} = await supabase
      .from('mascotas')
      .select('*')
      .eq('cliente_id',id)

    if (error) {return NextResponse.json({error: error.message}, {status: 500})}
    return NextResponse.json(data)
  }
  
  const {data, error} = await supabase
  .from('mascotas')
  .select('*')
  .order('created_at', {ascending: false})

  if (error) {return NextResponse.json({error: error.message}, {status: 500})}
  return NextResponse.json(data)
}

export async function POST (req: Request) {
  const body = await req.json()
  const { data, error } = await supabase
    .from('mascotas')
    .insert(body)
    .select()

  if (error) {return NextResponse.json({error: error.message}, {status: 500})}
  return NextResponse.json(data)
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if(!id) return NextResponse.json(
    {error: 'Id de la mascota Requerido'},
    {status: 400}
  )

  const { error } = await supabase
    .from('mascotas')
    .delete()
    .eq('id',id)
    .select()

  if(error) return NextResponse.json({error: error.message},{status: 500})
  
  return NextResponse.json(
    {message: 'Mascota elimiada'},
    {status: 200}
  )
}