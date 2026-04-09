# 📄 Sistema de Reportes de Ingresos - Guía de Uso

## 🚀 Cómo Usar el Componente

### **1. Acceso al Sistema**
- Inicia sesión como administrador
- Navega al menú lateral → **📄 Reportes**
- Selecciona **"Reporte de Ingresos"**

### **2. Navegación**
```
/admin/reportes          → Dashboard de reportes
/admin/reportes/ingresos → Reporte de ingresos
```

### **3. Funcionalidades Principales**

#### **📅 Selector de Rango de Fechas**
- **Botones rápidos**: Últimos 7 días, 30 días, Este mes, Este año
- **Rango personalizado**: Calendario interactivo
- **Agrupación**: Día / Mes / Año
- **Resumen visual**: Muestra el rango seleccionado

#### **📊 Tarjetas de Resumen**
- **Total Ingresos**: Suma de todos los pagos
- **Promedio**: Monto promedio por transacción
- **Cantidad**: Número total de transacciones
- **Rango**: Pago mínimo y máximo

#### **📋 Tabla Detallada**
- **Columnas**: Fecha, Cliente, Mascota, Servicio, Monto, Tipo Pago
- **Ordenamiento**: Por fecha y monto
- **Estilos**: Filas alternadas con colores corporativos
- **Totales**: Fila final con suma total

#### **📄 Exportación PDF**
- **Botón**: "Descargar PDF" en la esquina superior derecha
- **Diseño elaborado**: Header con logo, resumen, tabla detallada
- **Colores corporativos**: Basados en el dashboard (#8B4513, #D2691E, #FF8C00)
- **Footer**: Fecha de generación y número de página

---

## 🗂️ Estructura de Archivos

```
src/app/admin/reportes/
├── page.tsx                           # Dashboard de reportes
├── ingresos/
│   ├── page.tsx                       # Vista principal de ingresos
│   └── components/
│       ├── types.ts                    # Tipos TypeScript
│       ├── mockData.ts                # Datos de ejemplo
│       ├── DateRangePicker.tsx        # Selector de fechas
│       ├── SummaryCards.tsx           # Tarjetas de resumen
│       ├── IncomeTable.tsx            # Tabla de datos
│       ├── PDFExportButton.tsx        # Botón de exportación
│       └── pdf/
│           └── IncomeReportPDF.tsx    # Plantilla PDF
└── components/
    └── ReportCard.tsx                 # Tarjeta de reporte
```

---

## 🎨 Diseño y Estilos

### **Colores Corporativos**
- **Primary**: `#8B4513` (Marrón café)
- **Secondary**: `#D2691E` (Naranja oscuro)
- **Accent**: `#FF8C00` (Naranja brillante)
- **Light**: `#FFF8E1` (Crema claro)

### **Componentes Reutilizables**
- **ReportCard**: Tarjeta para cada tipo de reporte
- **DateRangePicker**: Selector de rango de fechas
- **SummaryCards**: Métricas clave con iconos
- **IncomeTable**: Tabla estilizada con datos

---

## 📊 Datos de Ejemplo

El sistema incluye datos hardcodeados que simulan:

```typescript
interface ReportDetail {
  fecha: string;           // '2024-01-15'
  cliente: string;         // 'Juan Pérez'
  mascota: string;         // 'Firulais'
  servicio: string;        // 'Corte completo'
  monto: number;           // 150
  tipo_pago: 'qr' | 'efectivo';
}
```

### **Métricas de Resumen**
- Total ingresos: Bs 12,500
- Promedio: Bs 250
- Transacciones: 50
- Rango: Bs 50 - 800

---

## 🔧 Personalización

### **Para Conectar con API Real**
1. Reemplazar `mockData.ts` con llamadas a tu endpoint
2. Modificar `page.tsx` para usar `fetch` o tu servicio API
3. Actualizar tipos según la respuesta de tu backend

### **Endpoint Sugerido**
```typescript
// /api/reports/ingresos
interface ReportParams {
  fecha_inicio: string;
  fecha_fin: string;
  agrupacion: 'dia' | 'mes' | 'anio';
}
```

### **Para Modificar Diseño PDF**
- Editar `IncomeReportPDF.tsx`
- Cambiar colores en `styles`
- Modificar logo en `Image src`

---

## 🚀 Próximos Pasos

### **Funcionalidades Futuras**
- Reporte de Citas
- Reporte de Clientes  
- Reporte de Servicios
- Reporte de Inventario
- Reportes Personalizados

### **Mejoras Sugeridas**
- Filtros adicionales (por cliente, por servicio)
- Gráficos interactivos
- Exportación a Excel/CSV
- Programación de reportes automáticos
- Vista previa del PDF antes de descargar

---

## 📝 Notas Técnicas

### **Dependencias Instaladas**
```bash
npm install @react-pdf/renderer react-date-range date-fns
npm install --save-dev @types/react-date-range
```

### **Compatibilidad**
- ✅ Next.js 16.1.1
- ✅ React 19.2.3
- ✅ TypeScript
- ✅ Tailwind CSS 4
- ✅ Supabase (para futura integración)

### **Rendimiento**
- Datos filtrados en cliente con `useMemo`
- Componentes optimizados con `React.memo`
- Lazy loading para PDF generation

---

## 🎯 Uso Inmediato

1. **Navega** a `/admin/reportes/ingresos`
2. **Selecciona** un rango de fechas
3. **Revisa** las métricas y tabla
4. **Descarga** el PDF con el botón superior derecho

¡Listo! Ya tienes un sistema completo de reportes de ingresos con diseño elaborado y exportación PDF.