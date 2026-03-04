import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/jwt'

function toSnakeUsuario(u: any) {
  return {
    id: u.id,
    nombre: u.nombre,
    email: u.email,
    rol: u.rol,
    activo: u.activo,
    created_at: u.createdAt,
    ci: u.ci ?? null,
    telefono: u.telefono ?? null,
    numero_referido: u.numeroReferido ?? null,
    apellido: u.apellido ?? null,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  try {
    if (id) {
      const usuario = await prisma.usuario.findUnique({ where: { id } })
      if (!usuario) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      return NextResponse.json(toSnakeUsuario(usuario))
    }
    const usuarios = await prisma.usuario.findMany()
    return NextResponse.json(usuarios.map(toSnakeUsuario))
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password, nombre, apellido , rol, activo, ci, telefono, numero_referido, action } = body
  if (action === 'register') {
    // Validar que no exista usuario
    const existingUser = await prisma.usuario.findUnique({where: {email}})

    if (existingUser) {
      return NextResponse.json({ error: 'Usuario ya existe' }, { status: 400 })
    }

    // Hashear contraseña
    const hashed = bcrypt.hashSync(password, 10)

    // Insertar usuario
    const usuario = await prisma.usuario.create({
      data: {
        email,
        password: hashed,
        nombre,
        apellido,
        rol,
        activo,
        ci,
        telefono,
        numeroReferido: numero_referido,
      }
    })

    if (!usuario) {
      return NextResponse.json({ error: 'Error al registrar usuario' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Usuario registrado', usuario: toSnakeUsuario(usuario) })
  }

  if (action === 'login') {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        rol: true,
        email: true,
      }
    })
      if (!usuario) {
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

export async function PATCH (req: Request) {
  const body = await req.json()
  const { id, ...rest } = body
  if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
  try {
    const updated = await prisma.usuario.update({
      where: { id },
      data: {
        nombre: rest.nombre,
        email: rest.email,
        rol: rest.rol,
        activo: rest.activo ,
        ci: rest.ci ?? undefined,
        telefono: rest.telefono ?? undefined,
        numeroReferido: rest.numero_referido ?? undefined,
        apellido: rest.apellido ?? undefined,
        password: rest.password ? bcrypt.hashSync(rest.password, 10) : undefined,
      },
    })
    return NextResponse.json({ success: true, data_single: toSnakeUsuario(updated) })
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error al actualizar usuario' }, { status: 400 })
  }
}
