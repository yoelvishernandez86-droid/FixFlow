import { useState } from "react";
import IncidenciasList from "./components/incidenciasList.tsx";
import Login from "./components/login.tsx";

import "./App.css";

function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  if (!token) {
    return (
      <main className="app-shell">
        <Login onLogin={setToken} />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <IncidenciasList />
    </main>
  );
}

export default App;
