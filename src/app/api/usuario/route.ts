import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, nombre, rol, action } = body
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
        { email, password: hashed, nombre, rol: rol || 'empleado' }
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
