import React, { useState } from "react";
import Navbar from "../components/navbaar/NavBar";
import { Typography, Input, Button, Card } from "@material-tailwind/react";
import imagen1 from "../assets/images/login/imagen1.webp";
import imagen2 from "../assets/images/login/imagen2.webp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
  e.preventDefault();
  setError(null);

  // Validación de contraseña fuerte
  // const esFuerte = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(contrasenia);
  // if (!esFuerte) {
  //   setError("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.");
  //   return;
  // }

  if (contrasenia !== confirmarContrasenia) {
    setError("Las contraseñas no coinciden");
    return;
  }

  setLoading(true);
  try {
    await axios.post("http://localhost:8080/api/v1/usuario", {
      nombreUsuario,
      email,
      contrasenia,
      // rol se asigna por defecto en el backend
    });
    alert("Registro exitoso. Ahora puedes iniciar sesión.");
    navigate("/login");
  } catch (err) {
    setError(
      err.response?.data?.error ||
        "Error al registrar. Intenta con otro usuario o correo    ."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <div className="h-screen w-screen overflow-hidden ">
        <Navbar className="" />
        <div className="flex h-full items-center justify-center ">
          <div className="w-1/2 h-full  relative flex justify-center items-start py-10 max-xl:hidden">
            <div className="w-3/4 h-3/4 flex justify-end items-center ">
              <img src={imagen1} alt="Imagen1" className="w-[400px]  absolute  " />
            </div>
            <div className="w-1/2 h-full flex justify-start items-center">
              <img src={imagen2} alt="Imagen2" className="w-[350px] absolute  " />
            </div>
          </div>

          <div className="w-1/2 h-full  flex justify-center items-start max-xl:w-3/4 max-lg:w-[90%]">
            <div className=" flex justify-center items-center flex-col gap-y-2 h-[90%]  w-full">
              <Card className="w-[60%] h-[90%]  p-10 shadow-lg  flex flex-col justify-center items-center max-lg:w-[90%]">
                <div className="w-full flex flex-col ">
                  <Typography color="blue-gray" className="mb-6 text-center text-2xl font-sans">
                    Registro
                  </Typography>
                  <form onSubmit={handleRegister} className="flex flex-col gap-2">
                    <label htmlFor="nombreUsuario" className="text-md font-medium">
                      Nombre de usuario
                    </label>
                    <Input
                      id="nombreUsuario"
                      label="Nombre de usuario"
                      name="nombreUsuario"
                      type="text"
                      value={nombreUsuario}
                      className="border hover:border-red-600 h-[40px] text-[16px]"
                      onChange={e => setNombreUsuario(e.target.value)}
                      required
                    />
                    <label htmlFor="email" className="text-md font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      label="Email"
                      name="email"
                      type="email"
                      value={email}
                      className="border hover:border-red-600 h-[40px] text-[16px]"
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                    <label htmlFor="contrasenia" className="text-md font-medium">
                      Contraseña
                    </label>
                    <Input
                      id="contrasenia"
                      label="Contraseña"
                      name="contrasenia"
                      type="password"
                      value={contrasenia}
                      className="border hover:border-red-600 h-[40px] text-[16px]"
                      onChange={e => setContrasenia(e.target.value)}
                      required
                    />
                    <label htmlFor="confirmarContrasenia" className="text-md font-medium">
                      Confirmar contraseña
                    </label>
                    <Input
                      id="confirmarContrasenia"
                      label="Confirmar contraseña"
                      name="confirmarContrasenia"
                      type="password"
                      value={confirmarContrasenia}
                      className="border hover:border-red-600 h-[40px] text-[16px]"
                      onChange={e => setConfirmarContrasenia(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      className=" hover:bg-red-200 border border-red-300 hover:text-black text-md"
                      disabled={loading}
                    >
                      {loading ? "Registrando..." : "Registrarse"}
                    </Button>
                  </form>
                  <div className="flex gap-x-2 mt-4">
                    <span>¿Ya tienes una cuenta?</span>
                    <a href="/login" className="text-red-500 hover:text-red-700">
                      Inicia Sesión
                    </a>
                  </div>
                  {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}