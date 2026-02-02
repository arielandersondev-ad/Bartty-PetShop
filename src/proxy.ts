import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedPaths = [
    '/api/clientes',
    '/api/mascotas',
    '/api/citas',
    '/api/pagos',
    '/api/inventario'
  ]

  const isProtectedPath = protectedPaths.some(path => pathname.startsWith(path))

  if (isProtectedPath) {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, error: 'Token de autorización requerido' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    try {
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
      
      if (!decoded.id || !decoded.email || !decoded.rol) {
        return NextResponse.json(
          { success: false, error: 'Token inválido' },
          { status: 401 }
        )
      }

      const supabase = createServiceClient()
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('id, nombre, email, rol, activo')
        .eq('id', decoded.id)
        .eq('email', decoded.email)
        .eq('activo', true)
        .single()

      if (error || !usuario) {
        return NextResponse.json(
          { success: false, error: 'Usuario no encontrado o inactivo' },
          { status: 401 }
        )
      }

      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', usuario.id)
      requestHeaders.set('x-user-email', usuario.email)
      requestHeaders.set('x-user-role', usuario.rol)
      requestHeaders.set('x-user-nombre', usuario.nombre)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error('Error de autenticación:', error)
      return NextResponse.json(
        { success: false, error: 'Error de autenticación' },
        { status: 401 }
      )
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/clientes/:path*',
    '/api/mascotas/:path*',
    '/api/citas/:path*',
    '/api/pagos/:path*',
    '/api/inventario/:path*',
  ],
}