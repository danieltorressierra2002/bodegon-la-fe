import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Login from "./components/Login"
import AdminPanel from "./components/AdminPanel"
import CatalogoPublico from "./components/CatalogoPublico"

function AppContent() {
  const { session, cargando } = useAuth()
  const esRutaAdmin = window.location.pathname.includes("/admin")

  if (!esRutaAdmin) return <CatalogoPublico />

  if (cargando) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">Cargando...</div>
  }

  return session ? <AdminPanel /> : <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}