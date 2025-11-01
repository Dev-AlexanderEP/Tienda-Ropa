import React, { useState } from "react";
import Navbar from "../components/navbaar/NavBar";
import NavBarResponsive from "../components/navbaar/NavBarResponsive";
import { Typography, Input, Button, Card } from "@material-tailwind/react";
import imagen1 from "../assets/images/login/imagen1.webp";
import imagen2 from "../assets/images/login/imagen2.webp";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const clientId = "310346106693-bi49g8bprbv0kpqt09n228l45mu8c3ag.apps.googleusercontent.com";

export default function Login() {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8080/token",
        // "https://mixmatch.zapto.org/token",
        new URLSearchParams({
          username,
          password,
          grantType: "password", // esperado por el backend
          withRefreshToken: true, // el backend lo espera como string
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { accessToken, refreshToken } = res.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      console.log(accessToken);
      // Redirección inteligente
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    } else {
      navigate("/");
    }
    } catch (err) {
      setError("Credenciales incorrectas");
      console.error("Error en el login:", err.response ? err.response.data : err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("http://localhost:8080/google-login", {
        credential: response.credential,
        clientId: clientId,
      });
          console.log(res.data); // <-- Aquí ves la respuesta del backend
          

    const { accessToken, refreshToken } = res.data;
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

      // localStorage.setItem("user", JSON.stringify({ email, name, username, roles }));
        // Redirección inteligente
      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        navigate("/");
    }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Error al autenticar con el backend";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Error en la autenticación de Google");
  };

  return (
    <>
      <div className="h-screen w-screen overflow-hidden ">
        <NavBarResponsive  />
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
            <div className=" flex justify-center items-center flex-col gap-y-2 h-3/4  w-full">
              <Card className="w-[60%] h-[90%]  p-10 shadow-lg  flex flex-col justify-center items-center max-lg:w-[90%]">
                <div className="w-full flex flex-col gap-y-[10%]">
                  <Typography color="blue-gray" className="mb-6 text-center text-3xl font-sans">
                    Iniciar Sesión
                  </Typography>
                  <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <label htmlFor="username" className="text-xl font-medium">
                      Usuario o Correo electrónico
                    </label>
                    <Input
                      id="username"
                      label="Usuario"
                      name="username"
                      type="text"
                      value={username}
                      className="border hover:border-red-600 hover:shadow-sm hover:outline-red-200 h-[50px] focus:outline-red-200 focus:border-red-500 text-[17px]"
                      onChange={e => setUsername(e.target.value)}
                      required
                    />
                    <label htmlFor="password" className="text-xl font-medium">
                      Contraseña
                    </label>
                    <Input
                      id="password"
                      label="Contraseña"
                      name="password"
                      type="password"
                      value={password}
                      className="border hover:border-red-600 hover:shadow-sm hover:outline-red-200 h-[50px] focus:outline-red-200 focus:border-red-500 text-[17px]"
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="submit"
                      variant="outline"
                      className="mt-4 hover:bg-red-200 border border-red-300 hover:text-black text-md"
                      disabled={loading}
                    >
                      {loading ? "Cargando..." : "Ingresar"}
                    </Button>
                  </form>
                  <div className="my-4 ">
                    <GoogleOAuthProvider clientId={clientId}>
                      <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={handleGoogleError}
                        text="continue_with"
                      />
                    </GoogleOAuthProvider>
                  </div>
                  <div className="flex  gap-x-2">
                    <span>
                    No tienes una cuenta? 
                    </span>
                    <a href="/register" className="text-red-500 hover:text-red-700">
                       Regístrate
                    </a>
                  </div>
                </div>
              </Card>
              {error && <p className="text-red-500 text-center">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}