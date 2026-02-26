import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
