import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET () {
    try {
        const usuarios = await prisma.usuario.findMany()
        const existAdmin = usuarios.length > 0
        return NextResponse.json( existAdmin )
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
    }
}