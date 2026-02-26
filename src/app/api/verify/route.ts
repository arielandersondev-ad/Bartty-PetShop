import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
/*
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
    password: u.password,

  }
}*/

export async function GET () {
    try {
        const usuarios = await prisma.usuario.findMany()
        return NextResponse.json(usuarios)
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
    }
}