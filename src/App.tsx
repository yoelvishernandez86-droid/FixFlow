import { useState } from "react";
import IncidenciasList from "./components/incidenciasList.tsx";
import Login from "./components/login.tsx";
import "./App.css";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return (
      <main className="app-shell">
        <Login onLogin={setToken} />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <button type="button" onClick={cerrarSesion}>
        Cerrar sesión
      </button>

      <IncidenciasList onSesionExpirada={cerrarSesion} />
    </main>
  );
}

export default App;