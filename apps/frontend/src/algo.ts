import { createClient } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const protectedPaths = [
    '/api/clientes',
    '/api/mascotas',
    '/api/citas',
    '/api/pagos',
    '/api/inventario',
    '/api/ovimientos-inventario'
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
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const { data: { user }, error } = await supabase.auth.getUser(token)

      if (error || !user) {
        return NextResponse.json(
          { success: false, error: 'Token inválido o expirado' },
          { status: 401 }
        )
      }

      const supabaseAdmin = createServiceClient()
      const { data: usuario, error: dbError } = await supabaseAdmin
        .from('usuarios')
        .select('nombre, rol, activo')
        .eq('id', user.id)
        .single()

      if (dbError || !usuario) {
        return NextResponse.json(
          { success: false, error: 'Usuario no encontrado en la base de datos' },
          { status: 404 }
        )
      }

      if (!usuario.activo) {
        return NextResponse.json(
          { success: false, error: 'Usuario inactivo' },
          { status: 401 }
        )
      }

      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', user.id)
      requestHeaders.set('x-user-email', user.email || '')
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
    '/api/ovimientos-inventario/:path*',
  ],
}