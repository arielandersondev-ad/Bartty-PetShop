import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET (req: Request){
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const id = searchParams.get('id')

  if (action === 'bypetid') {
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .eq('mascota_id',id)

    if (error) {return NextResponse.json({error: error.message}, {status:500})}
    return NextResponse.json(data)
  }

  if (action === 'byclientid') {
    const { data, error } = await supabase
      .from('citas')
      .select('*')
      .eq('cliente_id',id)

    if (error) {return NextResponse.json({error: error.message}, {status:500})}
    return NextResponse.json(data)
  }

  if (action === 'allbyCID') {
    const { data, error} = await supabase
      .from('citas')
      .select(`
        fecha,
        hora_inicio,
        hora_fin,
        estado,
        observaciones,
        id,
        mascota:mascota_id (
          nombre
        ),
        cliente:cliente_id(
          nombre,
          apellido_paterno
        )
      `)
      .eq('cliente_id',id)

    if (error) {return NextResponse.json({error: error.message}, {status: 500})}
    return NextResponse.json(data)
  }
  if (action === 'byid') {
    const { data, error } = await supabase
      .from('citas')
      .select(`
        *,
        mascota:mascota_id (
          nombre
        ),
        cliente:cliente_id(
          ci,
          telefono,
          nombre,
          apellido_paterno
        )
      `)
      .eq('id', id)

    if (error) {return NextResponse.json({error: error.message}, {status: 500})}
    return NextResponse.json(data)
  }
  const { data, error } = await supabase
    .from('citas')
    .select(`
      *,
      mascota:mascota_id (
        nombre
      ),
      cliente:cliente_id(
        nombre,
        apellido_paterno
      )
    `)

  if (error) {return NextResponse.json({error: error.message}, {status: 500})}
  return NextResponse.json(data)

}

export async function PATCH (req: Request){
  const body = await req.json()
  const { id, hora_inicio, hora_fin, estado, observaciones, estilo_corte } = body
  const { data, error } = await supabase
    .from('citas')
    .update({ hora_inicio, hora_fin, estado, observaciones, estilo_corte })
    .eq('id', id)
    .select()

  if (error) {return NextResponse.json({error: error.message}, {status: 500})}
  return NextResponse.json(data)
}

export async function POST (req: Request){
  const body = await req.json()
  const { data, error } = await supabase
    .from('citas')
    .insert(body)
    .select()

  if (error) {return NextResponse.json({error: error.message}, {status: 500})}
  return NextResponse.json(data)
}