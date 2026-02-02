import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase'
import { z } from 'zod'
import { Inventario, ApiResponse } from '@/types'

const inventarioSchema = z.object({
  nombre_producto: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  categoria: z.string().optional(),
  stock_actual: z.number().int().min(0, 'El stock debe ser un número entero no negativo'),
  stock_minimo: z.number().int().min(0, 'El stock mínimo debe ser un número entero no negativo'),
  precio_venta: z.number().positive('El precio debe ser positivo').optional()
})

const inventarioUpdateSchema = inventarioSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceClient()
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const categoria = searchParams.get('categoria')
    const stock_bajo = searchParams.get('stock_bajo')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    let query = supabase
      .from('inventario')
      .select('*', { count: 'exact' })

    if (search) {
      query = query.or(`nombre_producto.ilike.%${search}%,categoria.ilike.%${search}%`)
    }

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    if (stock_bajo === 'true') {
      query = query.lt('stock_actual', 'stock_minimo')
    }

    const { data: productos, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('nombre_producto', { ascending: true })

    if (error) {
      console.error('Error fetching inventario:', error)
      return NextResponse.json(
        { success: false, error: 'Error al obtener inventario' } as ApiResponse<Inventario>,
        { status: 500 }
      )
    }

    const productosConEstado = productos.map(producto => ({
      ...producto,
      estado_stock: 
        producto.stock_actual === 0 ? 'agotado' :
        producto.stock_actual < (producto.stock_minimo || 5) ? 'bajo' : 'normal'
    }))

    return NextResponse.json({
      success: true,
      data: productosConEstado,
      count,
      page,
      limit
    } as ApiResponse<Inventario>)
  } catch (error) {
    console.error('Error in GET /api/inventario:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<Inventario>,
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validationResult = inventarioSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos',
          message: validationResult.error.issues.map((e: any) => e.message).join(', ')
        } as ApiResponse<Inventario>,
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    
    const { data: producto, error } = await supabase
      .from('inventario')
      .insert(validationResult.data)
      .select()
      .single()

    if (error) {
      console.error('Error creating producto:', error)
      return NextResponse.json(
        { success: false, error: 'Error al crear producto' } as ApiResponse<Inventario>,
        { status: 500 }
      )
    }

    const productoConEstado = {
      ...producto,
      estado_stock: 
        producto.stock_actual === 0 ? 'agotado' :
        producto.stock_actual < (producto.stock_minimo || 5) ? 'bajo' : 'normal'
    }

    return NextResponse.json({
      success: true,
      data_single: productoConEstado,
      message: 'Producto creado exitosamente'
    } as ApiResponse<Inventario>, { status: 201 })
  } catch (error) {
    console.error('Error in POST /api/inventario:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<Inventario>,
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de producto es requerido' } as ApiResponse<Inventario>,
        { status: 400 }
      )
    }

    const validationResult = inventarioUpdateSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Datos inválidos',
          message: validationResult.error.issues.map((e: any) => e.message).join(', ')
        } as ApiResponse<Inventario>,
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    
    const { data: producto, error } = await supabase
      .from('inventario')
      .update(validationResult.data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Producto no encontrado' } as ApiResponse<Inventario>,
          { status: 404 }
        )
      }
      console.error('Error updating producto:', error)
      return NextResponse.json(
        { success: false, error: 'Error al actualizar producto' } as ApiResponse<Inventario>,
        { status: 500 }
      )
    }

    const productoConEstado = {
      ...producto,
      estado_stock: 
        producto.stock_actual === 0 ? 'agotado' :
        producto.stock_actual < (producto.stock_minimo || 5) ? 'bajo' : 'normal'
    }

    return NextResponse.json({
      success: true,
      data_single: productoConEstado,
      message: 'Producto actualizado exitosamente'
    } as ApiResponse<Inventario>)
  } catch (error) {
    console.error('Error in PUT /api/inventario:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<Inventario>,
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID de producto es requerido' } as ApiResponse<Inventario>,
        { status: 400 }
      )
    }

    const supabase = createServiceClient()
    
    const { error } = await supabase
      .from('inventario')
      .delete()
      .eq('id', parseInt(id))

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { success: false, error: 'Producto no encontrado' } as ApiResponse<Inventario>,
          { status: 404 }
        )
      }
      console.error('Error deleting producto:', error)
      return NextResponse.json(
        { success: false, error: 'Error al eliminar producto' } as ApiResponse<Inventario>,
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Producto eliminado exitosamente'
    } as ApiResponse<Inventario>)
  } catch (error) {
    console.error('Error in DELETE /api/inventario:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' } as ApiResponse<Inventario>,
      { status: 500 }
    )
  }
}