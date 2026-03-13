import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function toSnakeCita(c: any, includeRelations = false) {
  const base = {
    id: c.id,
    cliente_id: c.clienteId,
    mascota_id: c.mascotaId,
    fecha: c.fecha.toISOString().split('T')[0],
    hora_inicio: c.horaInicio?.toISOString().split('T')[1].split('.')[0] ?? null,
    hora_fin: c.horaFin?.toISOString().split('T')[1].split('.')[0] ?? null,
    estado: c.estado,
    observaciones: c.observaciones ?? null,
    estilo_corte: c.estiloCorte ?? null,
    created_at: c.createdAt,
  }
  if (!includeRelations) return base
  return {
    ...base,
    mascota: c.mascota ? { nombre: c.mascota.nombre } : undefined,
    cliente: c.cliente ? { nombre: c.cliente.nombre, apellido_paterno: c.cliente.apellidoPaterno ?? null, ci: c.cliente.ci, telefono: c.cliente.telefono } : undefined,
    servicio: c.servicio ? { nombre: c.servicio.nombre } : undefined,
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get('action')
  const id = searchParams.get('id')
  const date = searchParams.get('fecha')

  try {

    if (action === 'citasConfirmadas') {
      const citas = await prisma.cita.findMany({
        select:{
          fecha: true,
          horaInicio: true,
          horaFin: true,
          estado: true,
          estiloCorte: false,
        },
        where: { estado: 'confirmado' },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(citas.map((c: any) => toSnakeCita(c)))
    }
    if (action === 'fechasNoDisponibles') {
      const resCPH = await prisma.configuracion.findFirst()
      const clientesporhora = await resCPH?.clientesPorHora
      const horasTrabajp = await prisma.slotTrabajo.findMany().then((res:any) => res.length-2)
      const fechasAgrupadas = await prisma.cita.groupBy({
        by: ['fecha'],
        where: {
          estado: 'confirmado'
        },
        _count: {
          fecha: true
        }
      })
      console.log('deboug de fechas : ',fechasAgrupadas)
      const fechasNoDisponibles = fechasAgrupadas
        .filter((f:any) => f._count.fecha >= clientesporhora*horasTrabajp)
        .map((f:any) => f.fecha.toISOString().split('T')[0])

      return NextResponse.json({
        success: true,
        data: fechasNoDisponibles,
        message: 'Fechas no disponibles'
      })
    }
    if (action === 'HorasNoDisponiblesbyDate') {
      const fechasAgrupadas = await prisma.cita.groupBy({
        by: ['horaInicio'],
        where: {
          estado: 'confirmado'
        },
        _count: {
          horaInicio: true
        }
      })
      console.log('deboug de fechas : ',fechasAgrupadas)
      const horasNoDisponibles = fechasAgrupadas
        .filter((f:any) => f._count.horaInicio >= 4)
        .map((f:any) => f.horaInicio?.toISOString().split('T')[1].split('.')[0] || '')

      return NextResponse.json({
        success: true,
        data: horasNoDisponibles,
        message: 'Horas no disponibles'
      })
    }
    if (action === 'bypetid') {
      const citas = await prisma.cita.findMany({
        where: { mascotaId: id || undefined },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(citas.map((c: any) => toSnakeCita(c)))
    }
    if (action === 'citasConfirmadasporFecha') {
      const resCPH = await prisma.configuracion.findFirst()
      const clientesporhora = await resCPH?.clientesPorHora
      const citas = await prisma.cita.findMany({
        select: {
          horaInicio: true,
          horaFin: true,
        },
        where: {
          estado: 'confirmado',
          fecha: date ? new Date(date) : undefined,
        },
        orderBy: { createdAt: 'desc' },
      })

      const hInicio = citas.map((c : any) => c.horaInicio?.toISOString().substring(11,16)).filter(Boolean)
      const hFin = citas.map((c:any) => c.horaFin?.toISOString().substring(11,16)).filter(Boolean)
      //en horasOcupadas obtener la hora que se repita 5 veces
      const conteo = hInicio.reduce((acc:any, hora:any) => {
        acc[hora] = (acc[hora] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      //const horasOcupadas = Object.keys(conteo).filter(h => conteo[h] >= clientesporhora)

      const horasOcupadas = await prisma.cita.groupBy({
        by: ['horaInicio'],
        where: {
          estado: 'confirmado',
          fecha: date ? new Date(date) : undefined,
        },
        _count: {
          horaInicio: true,
        },
        having: {
          horaInicio: {
            _count: {
              gte: clientesporhora,
            },
          },
        },
      })
      return NextResponse.json({
        success: true,
        hora_inicio: hInicio,
        hora_fin: hFin,
        horas_ocupadas: horasOcupadas.map((h:any) => h.horaInicio?.toISOString().split('T')[1].split('.')[0] || ''),
      })
    }
    if (action === 'byclientid') {
      const citas = await prisma.cita.findMany({
        where: { clienteId: id || undefined },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(citas.map((c: any) => toSnakeCita(c)))
    }

    if (action === 'allbyCID') {
      const citas = await prisma.cita.findMany({
        where: { clienteId: id || undefined },
        include: {
          mascota: { select: { nombre: true } },
          cliente: { select: { nombre: true, apellidoPaterno: true } },
        },
        orderBy: { createdAt: 'desc' },
      })
      return NextResponse.json(
        citas.map((c: any) => ({
          fecha: c.fecha,
          hora_inicio: c.horaInicio,
          hora_fin: c.horaFin,
          estado: c.estado,
          observaciones: c.observaciones,
          id: c.id,
          mascota: { nombre: c.mascota?.nombre },
          cliente: { nombre: c.cliente?.nombre, apellido_paterno: c.cliente?.apellidoPaterno ?? null },
        })),
      )
    }

    if (action === 'byid' && id) {
      const c = await prisma.cita.findUnique({
        where: { id },
        include: {
          mascota: { select: { nombre: true } },
          cliente: { select: { ci: true, telefono: true, nombre: true, apellidoPaterno: true } },
        },
      })
      if (!c) return NextResponse.json({ error: 'Cita no encontrada' }, { status: 404 })
      return NextResponse.json(toSnakeCita(c, true))
    }

    const citas = await prisma.cita.findMany({
      include: {
        mascota: { select: { nombre: true } },
        cliente: { select: { nombre: true, apellidoPaterno: true } },
        servicios: { select: { servicio: true, valor: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(
      citas.map((c: any) => ({
        ...toSnakeCita(c),
        mascota: { nombre: c.mascota?.nombre },
        cliente: { nombre: c.cliente?.nombre, apellido_paterno: c.cliente?.apellidoPaterno ?? null },
        servicios: c.servicios?.map((s: any) => ({
          nombre: s.servicio, 
          precio: Number(s.valor),
        })),
      })),
    )
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}

export async function PATCH (req: Request) {
  const body = await req.json()
  console.log('body: ',body)
  const { id, ...data } = body
  const dateOnly = data.fecha ? new Date(data.fecha) : undefined
  const isoDate = dateOnly ? dateOnly.toISOString().split('T')[0] : undefined
  const dataFormat = {
    clienteId: data.cliente_id,
    mascotaId: data.mascota_id,
    fecha: dateOnly,
    horaInicio: new Date(`${data.fecha}T${data.hora_inicio}`),
    horaFin: new Date(`${data.fecha}T${data.hora_fin}`),  
    estado: data.estado,
    observaciones: data.observaciones,
    estiloCorte: data.estilo_corte,
  }
  try {
    const cita = await prisma.cita.update({
      where: { id },
      data: dataFormat,
    })
    return NextResponse.json(toSnakeCita(cita))
  } catch (error: any) {
    console.log('error: ',error)
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}
export async function POST(req: Request) {
  const body = await req.json()
  const { cliente_id, mascota_id, fecha, hora_inicio, hora_fin, estado, observaciones, estilo_corte } = body
  const dateOnly = new Date(fecha)
  const isoDate = dateOnly.toISOString().split('T')[0]
  
  const dataFormat = {
    clienteId: cliente_id,
    mascotaId: mascota_id,
    fecha: dateOnly,
    horaInicio: isoDate && typeof hora_inicio === 'string' ? new Date(`${isoDate}T${hora_inicio}:00.000Z`) : undefined,
    horaFin: isoDate && typeof hora_fin === 'string' ? new Date(`${isoDate}T${hora_fin}:00.000Z`) : undefined,
    estado,
    observaciones,
    estiloCorte: estilo_corte,
  }

  try {
    const cita = await prisma.cita.create({
      data: dataFormat,
    })
    return NextResponse.json(toSnakeCita(cita))
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || 'Error en el servidor' }, { status: 500 })
  }
}