import { supabase } from '@/lib/supabase'
import { NextResponse } from 'next/server'

// GET: listar clientes
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const action = searchParams.get('action')
  const ci = searchParams.get('ci')

  //Obtener cliente por CI
  if (action === 'byId' && ci) {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('ci', ci)
      .single()

    if (error) {return NextResponse.json({ error: error.message }, { status: 500 })}
    return NextResponse.json(data)
  }

  //Obtener todos los clientes
  if (action === 'all') {
    const { data, error } = await supabase
      .from('clientes')
      .select('*')
      .order('created_at', { ascending: false })
  
    if (error) {return NextResponse.json({ error: error.message }, { status: 500 })}
    return NextResponse.json(data)
  }

  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) {return NextResponse.json({ error: error.message }, { status: 500 })}
  return NextResponse.json(data)
  //return NextResponse.json( {error: 'opcion GET no valida'},{status: 500})
}


// POST: crear cliente
export async function POST(req: Request) {
  const body = await req.json()
  const { action, nombre, ci, ...rest } = body
  
  if (action === 'loginCliente') {
    if (!ci || !nombre) {
      return NextResponse.json(
        { error: 'CI y nombre son obligatorios' },
        { status: 400 }
      )
    }
    
    const { data: cliente, error } = await supabase
      .from('clientes')
      .select('*')
      .eq('ci', ci)
      .single()

    if (error || !cliente) {
      return NextResponse.json(
        { error: 'Cliente no encontrado' },
        { status: 401 }
      )
    }

    if (cliente.nombre !== nombre) {
      return NextResponse.json(
        { error: 'El nombre no coincide' },
        { status: 401 }
      )
    }

    return NextResponse.json({ message: 'Login exitoso', cliente })
  }
  
  const { data, error } = await supabase
    .from('clientes')
    .insert({ nombre, ci, ...rest })
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data[0], { status: 201 })

}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, ...rest } = body
  const { data, error } = await supabase
    .from('clientes')
    .update(rest)
    .eq('id', id)
    .select()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data[0])
}

export async function DELETE (req: Request) {
  const body = await req.json()
  const { id } = body
  const { data, error } = await supabase
    .from('clientes')
    .delete()
    .eq('id', id)
    .select()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
  return NextResponse.json(data[0])
}