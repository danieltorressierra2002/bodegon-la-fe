
import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/AuthContext"

export default function AdminPanel() {
  const { cerrarSesion } = useAuth()
  const [categorias, setCategorias] = useState([])
  const [productos, setProductos] = useState([])
  const [nombreCat, setNombreCat] = useState("")
  const [formProducto, setFormProducto] = useState({ nombre: "", descripcion: "", precio: "", categoria_id: "", imagen_url: "" })

  useEffect(() => { cargar() }, [])

  async function cargar() {
    const { data: cats } = await 

supabase.from("categorias").select("*").order("orden")
    const { data: prods } = await supabase.from("productos").select("*").order("orden")
    setCategorias(cats || [])
    setProductos(prods || [])
  }

  async function agregarCategoria(e) {
    e.preventDefault()
    if (!nombreCat.trim()) return
    await supabase.from("categorias").insert({ nombre: nombreCat.trim() })
    setNombreCat("")
    cargar()
  }

  async function eliminarCategoria(id) {
    if (!confirm("¿Eliminar esta categoría?")) 

return
    await supabase.from("categorias").delete().eq("id", id)
    cargar()
  }

  async function agregarProducto(e) {
    e.preventDefault()
    if (!formProducto.nombre.trim() || !formProducto.precio) return
    await supabase.from("productos").insert({
      nombre: formProducto.nombre.trim(),
      descripcion: formProducto.descripcion.trim(),
      precio: Number(formProducto.precio),
      categoria_id: formProducto.categoria_id || null,
      imagen_url: formProducto.imagen_url.trim() || null,

    })
    setFormProducto({ nombre: "", descripcion: "", precio: "", categoria_id: "", imagen_url: "" })
    cargar()
  }

  async function eliminarProducto(id) {
    if (!confirm("¿Eliminar este producto?")) return
    await supabase.from("productos").delete().eq("id", id)
    cargar()
  }

  async function alternarDisponible(producto) {
    await supabase.from("productos").update({ disponible: !producto.disponible }).eq("id", 

producto.id)
    cargar()
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white pb-16">
      <header className="border-b border-neutral-800 px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-naranja">Panel Admin</h1>
        <button onClick={cerrarSesion} className="text-sm text-neutral-400 border border-neutral-700 px-3 py-1.5 rounded-lg">Salir</button>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-8">
        <section>

          <h2 className="font-bold text-lg mb-3">Categorías</h2>
          <form onSubmit={agregarCategoria} className="flex gap-2 mb-3">
            <input value={nombreCat} onChange={(e) => setNombreCat(e.target.value)} placeholder="Nueva categoría" className="flex-1 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2" />
            <button type="submit" className="bg-naranja text-black font-bold px-4 rounded-lg">Añadir</button>
          </form>
          <div className="space-y-2">
            {categorias.map(c => (
              <div key={c.id} className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2">
                <span>{c.nombre}</span>

                <button onClick={() => eliminarCategoria(c.id)} className="text-red-400 text-sm">Eliminar</button>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-bold text-lg mb-3">Nuevo producto</h2>
          <form onSubmit={agregarProducto} className="space-y-2 bg-neutral-900 border border-neutral-800 rounded-lg p-4">
            <input value={formProducto.nombre} onChange={(e) => setFormProducto(p => ({ ...p, nombre: e.target.value }))} placeholder="Nombre" className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2" />

            <input value={formProducto.descripcion} onChange={(e) => setFormProducto(p => ({ ...p, descripcion: e.target.value }))} placeholder="Descripción (ej. capacidad)" className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2" />
            <input value={formProducto.precio} onChange={(e) => setFormProducto(p => ({ ...p, precio: e.target.value }))} type="number" step="0.01" placeholder="Precio" className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2" />
            <select value={formProducto.categoria_id} onChange={(e) => setFormProducto(p => ({ ...p, categoria_id: e.target.value }))} className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2">
              <option value="">Sin categoría</

option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
            <input value={formProducto.imagen_url} onChange={(e) => setFormProducto(p => ({ ...p, imagen_url: e.target.value }))} placeholder="URL de imagen (opcional)" className="w-full bg-neutral-950 border border-neutral-700 rounded-lg px-3 py-2" />
            <button type="submit" className="w-full bg-naranja text-black font-bold py-2.5 rounded-lg">Guardar producto</button>
          </form>
        </section>

        <section>
          <h2 className="font-bold text-lg 

mb-3">Productos ({productos.length})</h2>
          <div className="space-y-2">
            {productos.map(p => (
              <div key={p.id} className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2.5">
                <div>
                  <p className="font-medium">{p.nombre}</p>
                  <p className="text-xs text-neutral-400">${Number(p.precio).toFixed(2)} · {p.disponible ? "Disponible" : "Oculto"}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => alternarDisponible(p)} className="text-xs border border-neutral-700 px-2 py-1 rounded-lg">{p.disponible ? "Ocultar" : 

"Mostrar"}</button>
                  <button onClick={() => eliminarProducto(p.id)} className="text-xs text-red-400 border border-red-900 px-2 py-1 rounded-lg">Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
