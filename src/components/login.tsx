import { useState } from "react";

type LoginProps = {
  onLogin: (token: string, rol: string) => void;
};

function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();

    const respuesta = await fetch("https://fixflow-production-8cda.up.railway.app/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!respuesta.ok) {
      setError("Email o contraseña incorrectos");
      return;
    }

    const datos = await respuesta.json();

    localStorage.setItem("token", datos.token);
    localStorage.setItem("nombre", datos.nombre);
    localStorage.setItem("email", datos.email);
    localStorage.setItem("rol", datos.rol);

    onLogin(datos.token, datos.rol);
  };

  return (
    <form className="login-form" onSubmit={iniciarSesion}>
      <h1>Iniciar sesión</h1>

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

      <button type="submit">Entrar</button>

      {error && <p>{error}</p>}
    </form>
  );
}

export default Login;
