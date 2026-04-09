import { Cliente, Mascota, Cita, Pago, Inventario, MovimientoInventario, Usuario } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

class ApiService {
  private getAuthHeaders(): HeadersInit {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      return {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      }
    }
    return {
      'Content-Type': 'application/json'
    }
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Error en la solicitud')
    }
    return response.json()
  }

  // Autenticación
  async login(email: string, password: string): Promise<{ success: boolean; data_single: { usuario: Usuario; token: string } }> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ email, password })
    })
    return this.handleResponse(response)
  }

  // Clientes
  async getClientes(params?: {
    search?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: Cliente[]; count?: number }> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${API_BASE_URL}/clientes?${searchParams.toString()}`,
      {
        headers: this.getAuthHeaders()
      }
    )
    return this.handleResponse(response)
  }

  async createCliente(cliente: Omit<Cliente, 'id' | 'created_at'>): Promise<{ success: boolean; data_single: Cliente }> {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(cliente)
    })
    return this.handleResponse(response)
  }

  async updateCliente(id: string, cliente: Partial<Cliente>): Promise<{ success: boolean; data_single: Cliente }> {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ id, ...cliente })
    })
    return this.handleResponse(response)
  }

  async deleteCliente(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/clientes?id=${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // Mascotas
  async getMascotas(params?: {
    search?: string
    cliente_id?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: any[]; count?: number }> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.cliente_id) searchParams.append('cliente_id', params.cliente_id)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${API_BASE_URL}/mascotas?${searchParams.toString()}`,
      {
        headers: this.getAuthHeaders()
      }
    )
    return this.handleResponse(response)
  }

  async createMascota(mascota: any): Promise<{ success: boolean; data_single: any }> {
    const response = await fetch(`${API_BASE_URL}/mascotas`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(mascota)
    })
    return this.handleResponse(response)
  }

  async updateMascota(id: string, mascota: Partial<any>): Promise<{ success: boolean; data_single: any }> {
    const response = await fetch(`${API_BASE_URL}/mascotas`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ id, ...mascota })
    })
    return this.handleResponse(response)
  }

  async deleteMascota(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/mascotas?id=${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // Citas
  async getCitas(params?: {
    search?: string
    cliente_id?: string
    mascota_id?: string
    estado?: string
    fecha_inicio?: string
    fecha_fin?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: any[]; count?: number }> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.cliente_id) searchParams.append('cliente_id', params.cliente_id)
    if (params?.mascota_id) searchParams.append('mascota_id', params.mascota_id)
    if (params?.estado) searchParams.append('estado', params.estado)
    if (params?.fecha_inicio) searchParams.append('fecha_inicio', params.fecha_inicio)
    if (params?.fecha_fin) searchParams.append('fecha_fin', params.fecha_fin)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${API_BASE_URL}/citas?${searchParams.toString()}`,
      {
        headers: this.getAuthHeaders()
      }
    )
    return this.handleResponse(response)
  }

  async createCita(cita: any): Promise<{ success: boolean; data_single: any }> {
    const response = await fetch(`${API_BASE_URL}/citas`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(cita)
    })
    return this.handleResponse(response)
  }

  async updateCita(id: string, cita: Partial<any>): Promise<{ success: boolean; data_single: any }> {
    const response = await fetch(`${API_BASE_URL}/citas`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ id, ...cita })
    })
    return this.handleResponse(response)
  }

  async deleteCita(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/citas?id=${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // Pagos
  async getPagos(params?: {
    search?: string
    cita_id?: string
    estado?: string
    metodo?: string
    fecha_inicio?: string
    fecha_fin?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: any[]; count?: number }> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.cita_id) searchParams.append('cita_id', params.cita_id)
    if (params?.estado) searchParams.append('estado', params.estado)
    if (params?.metodo) searchParams.append('metodo', params.metodo)
    if (params?.fecha_inicio) searchParams.append('fecha_inicio', params.fecha_inicio)
    if (params?.fecha_fin) searchParams.append('fecha_fin', params.fecha_fin)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${API_BASE_URL}/pagos?${searchParams.toString()}`,
      {
        headers: this.getAuthHeaders()
      }
    )
    return this.handleResponse(response)
  }

  async createPago(pago: any): Promise<{ success: boolean; data_single: any }> {
    const response = await fetch(`${API_BASE_URL}/pagos`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(pago)
    })
    return this.handleResponse(response)
  }

  async updatePago(id: string, pago: Partial<any>): Promise<{ success: boolean; data_single: any }> {
    const response = await fetch(`${API_BASE_URL}/pagos`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ id, ...pago })
    })
    return this.handleResponse(response)
  }

  async deletePago(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/pagos?id=${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // Inventario
  async getInventario(params?: {
    search?: string
    categoria?: string
    stock_bajo?: boolean
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: any[]; count?: number }> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.categoria) searchParams.append('categoria', params.categoria)
    if (params?.stock_bajo) searchParams.append('stock_bajo', 'true')
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${API_BASE_URL}/inventario?${searchParams.toString()}`,
      {
        headers: this.getAuthHeaders()
      }
    )
    return this.handleResponse(response)
  }

  async createProducto(producto: any): Promise<{ success: boolean; data_single: any }> {
    const response = await fetch(`${API_BASE_URL}/inventario`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(producto)
    })
    return this.handleResponse(response)
  }

  async updateProducto(id: string, producto: Partial<any>): Promise<{ success: boolean; data_single: any }> {
    const response = await fetch(`${API_BASE_URL}/inventario`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ id, ...producto })
    })
    return this.handleResponse(response)
  }

  async deleteProducto(id: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/inventario?id=${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    })
    return this.handleResponse(response)
  }

  // Movimientos de Inventario
  async getMovimientosInventario(params?: {
    search?: string
    inventario_id?: string
    tipo?: string
    fecha_inicio?: string
    fecha_fin?: string
    page?: number
    limit?: number
  }): Promise<{ success: boolean; data: any[]; count?: number }> {
    const searchParams = new URLSearchParams()
    if (params?.search) searchParams.append('search', params.search)
    if (params?.inventario_id) searchParams.append('inventario_id', params.inventario_id)
    if (params?.tipo) searchParams.append('tipo', params.tipo)
    if (params?.fecha_inicio) searchParams.append('fecha_inicio', params.fecha_inicio)
    if (params?.fecha_fin) searchParams.append('fecha_fin', params.fecha_fin)
    if (params?.page) searchParams.append('page', params.page.toString())
    if (params?.limit) searchParams.append('limit', params.limit.toString())

    const response = await fetch(
      `${API_BASE_URL}/movimientos-inventario?${searchParams.toString()}`,
      {
        headers: this.getAuthHeaders()
      }
    )
    return this.handleResponse(response)
  }

  async createMovimientoInventario(movimiento: any): Promise<{ success: boolean; data_single: any }> {
    const response = await fetch(`${API_BASE_URL}/movimientos-inventario`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(movimiento)
    })
    return this.handleResponse(response)
  }
}

export const apiService = new ApiService()