import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No se ha subido ningún archivo' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Definimos la ruta dentro de public para acceso directo
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'comprobantes');
    
    // Aseguramos que la carpeta existe
    await mkdir(uploadDir, { recursive: true });

    // Nombre único para el archivo
    const fileName = `comprobante_${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Devolvemos la ruta relativa para guardarla en la BD
    const relativeUrl = `/uploads/comprobantes/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      url: relativeUrl 
    });
  } catch (error: any) {
    console.error('Error en API de subida:', error);
    return NextResponse.json({ error: 'Error interno al subir el archivo' }, { status: 500 });
  }
}
export async function GET () {
    try {
        const res = await fetch('/api/citas/?action=allbyCID&id=12345678901234567890123456789012')
        const data = await res.json()
        console.log('datos detail: ',data)
        return NextResponse.json(data)
    } catch (error: any) {
        console.error('Error al obtener las citas:', error)
        return NextResponse.json({ error: 'Error interno al obtener las citas' }, { status: 500 })
    }
}