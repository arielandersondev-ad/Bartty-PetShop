'use client'

import { useState } from 'react'

interface TestResult {
  endpoint: string
  method: string
  status: number
  data: any
  success: boolean
  timestamp: string
  error?: string
}

export default function AuthTest() {
  const [email, setEmail] = useState('admin@peluqueria.com')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<TestResult[]>([])
  const [token, setToken] = useState('')

  const testEndpoint = async (endpoint: string, method = 'GET', body?: any) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        ...(body && { body: JSON.stringify(body) })
      })

      const data = await response.json()
      const result: TestResult = {
        endpoint,
        method,
        status: response.status,
        data,
        success: data.success || response.ok,
        timestamp: new Date().toLocaleTimeString()
      }

      setResults(prev => [result, ...prev].slice(-9)])

      return result
    } catch (error) {
      const result: TestResult = {
        endpoint,
        method,
        error: error instanceof Error ? error.message : 'Error desconocido',
        success: false,
        status: 0,
        data: null,
        timestamp: new Date().toLocaleTimeString()
      }
      setResults(prev => [result, ...prev].slice(-9))
      return result
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    const result = await testEndpoint('/api/auth/login', 'POST', { email, password })
    if (result.success && result.data?.data_single?.token) {
      setToken(result.data.data_single.token)
      localStorage.setItem('auth_token', result.data.data_single.token)
      localStorage.setItem('user_info', JSON.stringify(result.data.data_single.usuario))
    }
  }

  const handleRegister = async () => {
    await testEndpoint('/api/auth/register', 'POST', { 
      email: `test-${Date.now()}@example.com`,
      password: 'testpass123',
      nombre: 'Test User',
      rol: 'empleado'
    })
  }

  const testCRUD = {
    clientes: async () => {
      const create = await testEndpoint('/api/clientes', 'POST', {
        ci: `CI${Date.now()}`,
        nombre: 'Test Cliente',
        apellido_paterno: 'Apellido',
        apellido_materno: 'Materno',
        email: `cliente${Date.now()}@test.com`,
        telefono: '1234567890'
      })
      
      await testEndpoint('/api/clientes')
      
      if (create.data?.data_single?.id) {
        await testEndpoint('/api/clientes', 'PUT', {
          id: create.data.data_single.id,
          nombre: 'Updated Cliente'
        })
      }
      
      if (create.data?.data_single?.id) {
        await testEndpoint('/api/clientes', 'DELETE', { id: create.data.data_single.id })
      }
    },
    
    mascotas: async () => {
      const cliente = await testEndpoint('/api/clientes', 'POST', {
        ci: `CI${Date.now()}`,
        nombre: 'Pet Owner',
        apellido_paterno: 'Owner',
        apellido_materno: 'Test',
        email: `owner${Date.now()}@test.com`,
        telefono: '1234567890'
      })

      if (cliente.data?.data_single?.id) {
        const pet = await testEndpoint('/api/mascotas', 'POST', {
          cliente_id: cliente.data.data_single.id,
          nombre: 'Test Pet',
          raza: 'Labrador',
          edad: 3,
          color: 'Dorado',
          sexo: 'M'
        })
        
        await testEndpoint('/api/mascotas')
        
        if (pet.data?.data_single?.id) {
          await testEndpoint('/api/mascotas', 'PUT', {
            id: pet.data.data_single.id,
            nombre: 'Updated Pet'
          })
        }
      }
    },

    citas: async () => {
      const cliente = await testEndpoint('/api/clientes', 'POST', {
        ci: `CI${Date.now()}`,
        nombre: 'Pet Owner',
        apellido_paterno: 'Owner',
        apellido_materno: 'Test',
        email: `owner${Date.now()}@test.com`,
        telefono: '1234567890'
      })

      const mascota = await testEndpoint('/api/mascotas', 'POST', {
        cliente_id: cliente.data?.data_single?.id,
        nombre: 'Test Pet',
        raza: 'Poodle',
        edad: 2
      })

      if (mascota.data?.data_single?.id) {
        const cita = await testEndpoint('/api/citas', 'POST', {
          cliente_id: cliente.data.data_single.id,
          mascota_id: mascota.data.data_single.id,
          fecha: new Date().toISOString().split('T')[0],
          hora_inicio: '10:00',
          estado: 'pendiente'
        })
        
        await testEndpoint('/api/citas')
        
        if (cita.data?.data_single?.id) {
          await testEndpoint('/api/citas', 'PUT', {
            id: cita.data.data_single.id,
            estado: 'confirmado'
          })
        }
      }
    },

    inventario: async () => {
      const product = await testEndpoint('/api/inventario', 'POST', {
        nombre_producto: 'Test Product',
        categoria: 'Higiene',
        stock_actual: 100,
        stock_minimo: 10,
        precio_venta: 25.50
      })
      
      await testEndpoint('/api/inventario')
      
      if (product.data?.data_single?.id) {
        await testEndpoint('/api/movimientos-inventario', 'POST', {
          inventario_id: product.data.data_single.id,
          tipo: 'entrada',
          cantidad: 50,
          motivo: 'Test stock movement'
        })
        
        await testEndpoint('/api/ovimientos-inventario')
        
        if (product.data?.data_single?.id) {
          await testEndpoint('/api/inventario', 'PUT', {
            id: product.data.data_single.id,
            stock_actual: 75
          })
        }
      }
    },

    pagos: async () => {
      const cliente = await testEndpoint('/api/clientes', 'POST', {
        ci: `CI${Date.now()}`,
        nombre: 'Client',
        apellido_paterno: 'Test',
        apellido_materno: 'User',
        email: `client${Date.now()}@test.com`,
        telefono: '1234567890'
      })

      const mascota = await testEndpoint('/api/mascotas', 'POST', {
        cliente_id: cliente.data?.data_single?.id,
        nombre: 'Test Pet',
        raza: 'Test'
      })

      const cita = await testEndpoint('/api/citas', 'POST', {
        cliente_id: cliente.data?.data_single?.id,
        mascota_id: mascota.data?.data_single?.id,
        fecha: new Date().toISOString().split('T')[0],
        hora_inicio: '14:00',
        estado: 'confirmado'
      })

      if (cita.data?.data_single?.id) {
        const pago = await testEndpoint('/api/pagos', 'POST', {
          cita_id: cita.data.data_single.id,
          monto: 50.00,
          tipo_pago: 'efectivo',
          tipo_pago_cita: 'total',
          confirmado: true
        })
        
        await testEndpoint('/api/pagos')
        
        if (pago.data?.data_single?.id) {
          await testEndpoint('/api/pagos', 'PUT', {
            id: pago.data.data_single.id,
            confirmado: false
          })
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">🧪 API Test Console</h1>
        
        {/* Login Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🔐 Autenticación</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleLogin}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? 'Login...' : 'Login'}
            </button>
            <button
              onClick={handleRegister}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mb-2"
            >
              Crear Usuario Test
            </button>
          </div>
        </div>

        {/* Test Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">🧪 Test de Endpoints</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => testEndpoint('/api/auth/login')}
              className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
            >
              Test Login
            </button>
            <button
              onClick={testCRUD.clientes}
              className="px-3 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
            >
              Test Clientes
            </button>
            <button
              onClick={testCRUD.mascotas}
              className="px-3 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600"
            >
              Test Mascotas
            </button>
            <button
              onClick={testCRUD.citas}
              className="px-3 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
            >
              Test Citas
            </button>
            <button
              onClick={testCRUD.inventario}
              className="px-3 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600"
            >
              Test Inventario
            </button>
            <button
              onClick={testCRUD.pagos}
              className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Test Pagos
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Resultados</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Success</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data/Error</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((result, index) => (
                  <tr key={index} className={result.success ? 'bg-green-50' : 'bg-red-50'}>
                    <td className="px-3 py-2 text-sm">{result.endpoint}</td>
                    <td className="px-3 py-2 text-sm">{result.method}</td>
                    <td className="px-3 py-2 text-sm">{result.status}</td>
                    <td className="px-3 py-2 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.success ? '✓' : '✗'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-sm max-w-xs truncate">
                      {JSON.stringify(result.data || result.error || 'null', 2)}
                    </td>
                    <td className="px-3 py-2 text-sm">{result.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">📝 Instrucciones:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
            <li>Primero haz clic en "Test Login" para obtener el token de autenticación</li>
            <li>Luego prueba los diferentes endpoints con los botones</li>
            <li>Los resultados se mostrarán en la tabla inferior</li>
            <li>Los endpoints protegidos mostrarán error 401 si no tienes token</li>
          </ol>
        </div>
      </div>
    </div>
  )
}