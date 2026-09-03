
const CLAVE = "bodegon_carrito"

export function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CLAVE)) || []
  } catch {
    return []
  }
}

export function guardarCarrito(items) {
  localStorage.setItem(CLAVE, JSON.stringify(items))
}

export function agregarAlCarrito(producto) {
  const carrito = obtenerCarrito()
  const existente = carrito.find(i => i.id === 

producto.id)
  if (existente) {
    existente.cantidad += 1
  } else {
    carrito.push({ ...producto, cantidad: 1 })
  }
  guardarCarrito(carrito)
  return carrito
}

export function quitarDelCarrito(id) {
  const carrito = obtenerCarrito().filter(i => i.id !== id)
  guardarCarrito(carrito)
  return carrito
}

export function cambiarCantidad(id, cantidad) {
  const carrito = obtenerCarrito().map(i => i.id === id ? { ...i, cantidad } : i)

  guardarCarrito(carrito.filter(i => i.cantidad > 0))
  return obtenerCarrito()
}

export function vaciarCarrito() {
  localStorage.removeItem(CLAVE)
}

export function calcularTotal(items) {
  return items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
}
