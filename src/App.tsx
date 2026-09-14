import { useState } from "react";
import IncidenciasList from "./components/incidenciasList.tsx";
import Login from "./components/login.tsx";
import "./App.css";
import CrearUsuarios from "./components/crearUsuarios.tsx";
function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [rol, setRol] = useState<string | null>(localStorage.getItem("rol"));

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("rol");

    setToken(null);
    setRol(null);
  };

  if (!token) {
    return (
      <main className="app-shell">
        <Login
          onLogin={(token, rolUsuario) => {
            setToken(token);
            setRol(rolUsuario);
          }}
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <button type="button" onClick={cerrarSesion}>
        Cerrar sesión
      </button>
      {rol === "admin" && <p>Usuario administrador</p>}
      {rol === "admin" && <CrearUsuarios />}
      <IncidenciasList onSesionExpirada={cerrarSesion} />
    </main>
  );
}

export default App;
