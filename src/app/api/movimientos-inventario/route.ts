import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { z } from 'zod'
import { MovimientoInventario, ApiResponse } from '@/types'

const movimientoSchema = z.object({
  inventario_id: z.string().min(1, 'ID de inventario es requerido'),
  tipo: z.enum(['entrada', 'salida']),
  cantidad: z.number().positive('La cantidad debe ser positiva'),
  motivo: z.string().optional()
})

const movimientoUpdateSchema = movimientoSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const inventario_id = searchParams.get('inventario_id')
    const tipo = searchParams.get('tipo')
    const fecha_inicio = searchParams.get('fecha_inicio')
    const fecha_fin = searchParams.get('fecha_fin')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('movimientos_inventario')
      .select(`
        *,
        inventario:inventario_id (
          id,
          nombre_producto,
          categoria,
          stock_actual,
          stock_minimo,
          precio_venta
        )
      `, { count: 'exact' })

    if (search) {
      query = query.or(`motivo.ilike.%${search}%,inventario.nombre_producto.ilike.%${search}%`)
    }

    if (inventario_id) {
      query = query.eq('inventario_id', inventario_id)
    }

    if (tipo) {
      query = query.eq('tipo', tipo)
    }

    if (fecha_inicio) {
      query = query.gte('created_at', fecha_inicio)
    }

    if (fecha_fin) {
      query = query.lte('created_at', fecha_fin)
    }

    const { data: movimientos, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching movimientos:', error)
      return NextResponse.json(
        { success: false, error: 'Error al obtener movimientos' } as ApiResponse<MovimientoInventario>,
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: movimientos,
      count,
      page,
      limit
    } as ApiResponse<MovimientoInventario>)
  } catch (error) {
    console.error('Error in GET /api/movimientos-inventario:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<MovimientoInventario>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validationResult = movimientoSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos',
          message: validationResult.error.issues.map((e: any) => e.message).join(', ')
        } as ApiResponse<MovimientoInventario>,
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    
    // Verificar que existe el producto de inventario
    const { data: inventario, error: inventarioError } = await supabase
      .from('inventario')
      .select('stock_actual')
      .eq('id', validationResult.data.inventario_id)
      .single()

    if (inventarioError || !inventario) {
      return NextResponse.json(
        { success: false, error: 'Producto no encontrado en inventario' } as ApiResponse<MovimientoInventario>,
        { status: 404 }
      )
    }

    // Validar stock para salidas
    if (validationResult.data.tipo === 'salida' && inventario.stock_actual < validationResult.data.cantidad) {
      return NextResponse.json(
        { success: false, error: 'Stock insuficiente para realizar la salida' } as ApiResponse<MovimientoInventario>,
        { status: 400 }
      )
    }

    // Iniciar transacción: crear movimiento y actualizar stock
    const { data: movimiento, error } = await supabase.rpc('crear_movimiento_inventario', {
      p_inventario_id: validationResult.data.inventario_id,
      p_tipo: validationResult.data.tipo,
      p_cantidad: validationResult.data.cantidad,
      p_motivo: validationResult.data.motivo
    })

    if (error) {
      console.error('Error creating movimiento:', error)
      return NextResponse.json(
        { success: false, error: 'Error al crear movimiento' } as ApiResponse<MovimientoInventario>,
        { status: 500 }
      )
    }

    // Obtener el movimiento creado con información del inventario
    const { data: movimientoCompleto, error: fetchError } = await supabase
      .from('movimientos_inventario')
      .select(`
        *,
        inventario:inventario_id (
          id,
          nombre_producto,
          categoria,
          stock_actual,
          stock_minimo,
          precio_venta
        )
      `)
      .eq('id', movimiento.id)
      .single()

    if (fetchError) {
      console.error('Error fetching movimiento completo:', fetchError)
    }

    return NextResponse.json({
      success: true,
      data_single: movimientoCompleto || movimiento,
      message: 'Movimiento creado exitosamente'
    } as ApiResponse<MovimientoInventario>, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/movimientos-inventario:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<MovimientoInventario>,
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'Los movimientos de inventario no pueden ser modificados' } as ApiResponse<MovimientoInventario>,
    { status: 405 }
  )
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json(
    { success: false, error: 'Los movimientos de inventario no pueden ser eliminados' } as ApiResponse<MovimientoInventario>,
    { status: 405 }
  )
}