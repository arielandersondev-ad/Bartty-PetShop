import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'
import { UsuarioForm } from '@/types'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, nombre, apellido , rol, activo, ci, telefono, numero_referido, action } = body
  if (action === 'register') {
    // Validar que no exista usuario
    const { data: existingUser } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: 'Usuario ya existe' }, { status: 400 })
    }

    // Hashear contraseña
    const hashed = bcrypt.hashSync(password, 10)

    // Insertar usuario
    const { data, error } = await supabase
      .from('usuarios')
      .insert([
        { email, password: hashed, nombre, apellido, rol, activo, ci, telefono, numero_referido }
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: 'Usuario registrado', usuario: data })
  }

  if (action === 'login') {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()
      if (error || !usuario) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 })
      }
      const valid = bcrypt.compareSync(password, usuario.password)
      if (!valid) {
        return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
      }
      const token = signToken({ id: usuario.id, rol: usuario.rol, email: usuario.email })
    return NextResponse.json({ message: 'Login exitoso', token, usuario })
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (id) {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(usuario)
  }
  const { data: usuarios, error } = await supabase
    .from('usuarios')
    .select('*')
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(usuarios)
}

export async function PATCH(req: Request) {
  const body = await req.json()
  const { id, email, nombre, apellido , rol, activo, ci, telefono, numero_referido, password } = body

  if (!id) {
    return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
  }
  const updateData: UsuarioForm = {email, nombre, apellido, rol, activo, ci, telefono, numero_referido }
  if (password) {
    updateData.password = bcrypt.hashSync(password, 10)
  }
  const { data, error } = await supabase
    .from('usuarios')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ message: 'Usuario actualizado', usuario: data })
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) {
    return NextResponse.json({ error: 'ID no proporcionado' }, { status: 400 })
  }
  const { data, error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id)
    .select()
    .single()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({ message: 'Usuario eliminado', usuario: data })
}