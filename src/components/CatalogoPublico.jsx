import { useState, useEffect } from "react"
import { supabase } from "./lib/supabase"
import { obtenerCarrito, agregarAlCarrito, calcularTotal } from "./lib/carrito"

export default function CatalogoPublico() {
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [categoriaActiva, setCategoriaActiva] = useState(null)
  const [carrito, setCarrito] = useState(obtenerCarrito())
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarDatos()
  }, [])

  async function cargarDatos() {
    const { data: cats } = await supabase.from("categorias").select("*").order("orden")
    const { data: prods } = await supabase.from("productos").select("*").eq("disponible", true).order("orden")
    setCategorias(cats || [])
    setProductos(prods || [])
    setCargando(false)
  }

  function manejarAgregar(producto) {
    setCarrito(agregarAlCarrito(producto))
  }

  const productosFiltrados = categoriaActiva
    ? productos.filter(p => p.categoria_id === categoriaActiva)
    : productos


  const totalCarrito = calcularTotal(carrito)
  const cantidadCarrito = carrito.reduce((sum, i) => sum + i.cantidad, 0)

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-24">
      <header className="sticky top-0 bg-neutral-950/90 backdrop-blur border-b border-neutral-800 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-naranja">Bodegón La Fé 🛒</h1>
        </div>
        <div className="max-w-4xl mx-auto px-4 flex gap-2 overflow-x-auto pb-3">
          <ChipCategoria activa={categoriaActiva === null} 

onClick={() => setCategoriaActiva(null)}>Todos</ChipCategoria>
          {categorias.map(c => (
            <ChipCategoria key={c.id} activa={categoriaActiva === c.id} onClick={() => setCategoriaActiva(c.id)}>
              {c.nombre}
            </ChipCategoria>
          ))}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {cargando ? (
          <p className="text-center text-neutral-400 py-10">Cargando productos...</p>
        ) : productosFiltrados.length === 0 ? (
          <div className="text-center py-14 border border-dashed border-neutral-700 

rounded-xl">
            <p className="text-neutral-400">Aún no hay productos disponibles.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {productosFiltrados.map(p => (
              <TarjetaProducto key={p.id} producto={p} onAgregar={manejarAgregar} />
            ))}
          </div>
        )}
      </main>

      {cantidadCarrito > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-naranja text-black font-bold px-4 py-4 flex items-center justify-between 

shadow-lg">
          <span>{cantidadCarrito} producto{cantidadCarrito !== 1 ? "s" : ""}</span>
          <span>${totalCarrito.toFixed(2)}</span>
        </div>
      )}
    </div>
  )
}

function ChipCategoria({ activa, onClick, children }) {
  return (
    <button onClick={onClick} className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${activa ? "bg-naranja text-black" : "bg-neutral-800 text-neutral-300"}`}>
      {children}

    </button>
  )
}

function TarjetaProducto({ producto, onAgregar }) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
      {producto.imagen_url && (
        <img src={producto.imagen_url} alt={producto.nombre} className="w-full h-28 object-cover" />
      )}
      <div className="p-3">
        <p className="font-medium text-sm">{producto.nombre}</p>
        {producto.descripcion && <p className="text-xs text-neutral-400 mt-0.5">{producto.descripcion}</p>}

        <div className="flex items-center justify-between mt-2">
          <span className="text-naranja font-bold">${Number(producto.precio).toFixed(2)}</span>
          <button onClick={() => onAgregar(producto)} className="bg-naranja text-black text-xs font-bold px-3 py-1.5 rounded-lg active:scale-95 transition-transform">
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
