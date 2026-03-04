export type Categoria = { 
    id: string; 
    nombre: string; 
    estado: boolean; 
    updatedAt: string; 
    createdAt: string 
}
export type UnidadMedida = { 
    id: string; 
    estado: boolean; 
    unidad: string; 
    nombre: string; 
    updatedAt: string; 
    createdAt: string; 
    valor: number 
}

export type Inventario = { 
    id?: string;
    cantidad: number; 
    productoId: string; 
    updatedAt: string; 
}

export type Producto = { 
    estado: boolean; 
    stockMinimo: number;
    descripcion: string;
    unidadMedidaId: string; 
    categoriaId: string; 
    tipo: string;
    nombre: string; 
    id: string;
    updatedAt: string; 
    createdAt: string; 
    precioVenta: number 
    unidadMinimaVenta: number
    precioCompra: number 
}
export type ProductoCategoriaMedida = {
    estado: boolean; 
    stockMinimo: number;
    descripcion: string;
    unidadMedidaId: string; 
    categoriaId: string; 
    tipo: string;
    nombre: string; 
    id: string;
    updatedAt: string; 
    createdAt: string; 
    precioVenta: number 
    unidadMinimaVenta: number
    precioCompra: number 
    categoria: Categoria;
    unidadMedida: UnidadMedida;
}
export type InventarioProducto = {
    id?: string;
    cantidad: number; 
    productoId: string; 
    updatedAt: string; 
    producto: ProductoCategoriaMedida;
}
