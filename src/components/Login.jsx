
import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export default function Login() {
  const { iniciarSesion } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [cargando, setCargando] = useState(false)

  async function manejarSubmit(e) {
    e.preventDefault()
    setError("")
    setCargando(true)
    try {
      await iniciarSesion(email, password)
    } catch (err) {
      setError("Correo o contraseña 

incorrectos.")
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center px-4">
      <form onSubmit={manejarSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold text-naranja text-center">Bodegón La Fé — Admin</h1>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Correo" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white" />

        <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-4 py-3 text-white" />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={cargando} className="w-full bg-naranja text-black font-bold py-3 rounded-lg disabled:opacity-50">
          {cargando ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  )
}
