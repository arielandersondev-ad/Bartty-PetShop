import { NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import path from 'path'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const cortes = await prisma.corte.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(cortes)
  } catch (error: any) {
    console.error('Error al obtener cortes:', error)
    return NextResponse.json({ error: 'Error al obtener los cortes' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    const descripcion = formData.get('descripcion') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No se ha subido ningún archivo' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cortes')
    await mkdir(uploadDir, { recursive: true })

    const fileName = `corte_${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const filePath = path.join(uploadDir, fileName)

    await writeFile(filePath, buffer)
    const relativeUrl = `/uploads/cortes/${fileName}`

    const nuevoCorte = await prisma.corte.create({
      data: {
        ruta: relativeUrl,
        descripcion: descripcion || ''
      }
    })

    return NextResponse.json({ success: true, data: nuevoCorte })
  } catch (error: any) {
    console.error('Error al subir corte:', error)
    return NextResponse.json({ error: 'Error al guardar el corte' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID requerido' }, { status: 400 })
    }

    const corte = await prisma.corte.findUnique({
      where: { id: parseInt(id) }
    })

    if (!corte) {
      return NextResponse.json({ error: 'Corte no encontrado' }, { status: 404 })
    }

    // Eliminar archivo físico
    try {
      const filePath = path.join(process.cwd(), 'public', corte.ruta)
      await unlink(filePath)
    } catch (e) {
      console.warn('No se pudo eliminar el archivo físico:', e)
    }

    // Eliminar de la base de datos
    await prisma.corte.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true, message: 'Corte eliminado correctamente' })
  } catch (error: any) {
    console.error('Error al eliminar corte:', error)
    return NextResponse.json({ error: 'Error al eliminar el corte' }, { status: 500 })
  }
}
