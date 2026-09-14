import { useState } from "react";

function CrearUsuarios() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("trabajador");
  const [mensaje, setMensaje] = useState("");

  const crearUsuarios = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    const respuesta = await fetch("http://localhost:3000/api/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre,
        email,
        password,
        rol,
      }),
    });

    const datos = await respuesta.json();

    if (!respuesta.ok) {
      setMensaje(datos.mensaje || "Error al crear usuario");
      return;
    }

    setMensaje("Usuario creado correctamente");

    setNombre("");
    setEmail("");
    setPassword("");
    setRol("trabajador");
  };

  return (
    <form onSubmit={crearUsuarios}>
      <h2>Crear usuario</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="trabajador">Trabajador</option>
        <option value="admin">Administrador</option>
      </select>

      <button type="submit">Crear usuario</button>

      {mensaje && <p>{mensaje}</p>}
    </form>
  );
}

export default CrearUsuarios;
