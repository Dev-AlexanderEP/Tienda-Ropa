import React, { useState } from "react";
import NavBarResponsive from "../../components/navbaar/NavBarResponsive";
import { Typography, Input, Button, Card } from "@material-tailwind/react";
import imagen1 from "../../assets/images/login/imagen1.webp";
import imagen2 from "../../assets/images/login/imagen2.webp";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { login, loginWithGoogle } from "./api/authApi";
import { LoginSchema } from "./dto/login.schema";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export default function LoginForm() {
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(LoginSchema), mode: "onTouched" });

  const redirectAfterLogin = () => {
    const redirectPath = localStorage.getItem("redirectAfterLogin");
    if (redirectPath) {
      localStorage.removeItem("redirectAfterLogin");
      navigate(redirectPath);
    } else {
      navigate("/");
    }
  };

  const onSubmit = async ({ email, contrasenia }) => {
    setServerError(null);
    try {
      const { token } = await login({ email, contrasenia });
      localStorage.setItem("accessToken", token);
      redirectAfterLogin();
    } catch (err) {
      setServerError("Credenciales incorrectas");
      console.error("Error en el login:", err.response ? err.response.data : err.message);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setServerError(null);
    try {
      const { token } = await loginWithGoogle(response.credential);
      localStorage.setItem("accessToken", token);
      redirectAfterLogin();
    } catch (error) {
      setServerError(error.response?.data?.message || "Error al autenticar con el backend");
    }
  };

  const handleGoogleError = () => {
    setServerError("Error en la autenticación de Google");
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <NavBarResponsive />
      <div className="flex h-full items-center justify-center">
        <div className="w-1/2 h-full relative flex justify-center items-start py-10 max-xl:hidden">
          <div className="w-3/4 h-3/4 flex justify-end items-center">
            <img src={imagen1} alt="Imagen1" className="w-[400px] absolute" />
          </div>
          <div className="w-1/2 h-full flex justify-start items-center">
            <img src={imagen2} alt="Imagen2" className="w-[350px] absolute" />
          </div>
        </div>

        <div className="w-1/2 h-full flex justify-center items-start max-xl:w-3/4 max-lg:w-[90%]">
          <div className="flex justify-center items-center flex-col gap-y-2 h-3/4 w-full">
            <Card className="w-[60%] h-[90%] p-10 shadow-lg flex flex-col justify-center items-center max-lg:w-[90%]">
              <div className="w-full flex flex-col gap-y-[10%]">
                <Typography color="blue-gray" className="mb-6 text-center text-3xl font-sans">
                  Iniciar Sesión
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                  <label htmlFor="email" className="text-xl font-medium">
                    Correo electrónico
                  </label>
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    {...register("email")}
                    className="border hover:border-red-600 hover:shadow-sm hover:outline-red-200 h-[50px] focus:outline-red-200 focus:border-red-500 text-[17px]"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                  <label htmlFor="contrasenia" className="text-xl font-medium">
                    Contraseña
                  </label>
                  <Input
                    id="contrasenia"
                    label="Contraseña"
                    type="password"
                    {...register("contrasenia")}
                    className="border hover:border-red-600 hover:shadow-sm hover:outline-red-200 h-[50px] focus:outline-red-200 focus:border-red-500 text-[17px]"
                  />
                  {errors.contrasenia && <p className="text-red-500 text-sm">{errors.contrasenia.message}</p>}

                  <div className="flex justify-end">
                    <a href="/recuperar-contrasenia" className="text-xs text-gray-400 hover:text-gray-600 hover:underline">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>

                  <Button
                    type="submit"
                    variant="outline"
                    className="mt-4 hover:bg-red-200 border border-red-300 hover:text-black text-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Cargando..." : "Ingresar"}
                  </Button>
                </form>
                <div className="my-4">
                  <GoogleOAuthProvider clientId={clientId}>
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={handleGoogleError}
                      text="continue_with"
                    />
                  </GoogleOAuthProvider>
                </div>
                <div className="flex gap-x-2">
                  <span>No tienes una cuenta?</span>
                  <a href="/register" className="text-red-500 hover:text-red-700">
                    Regístrate
                  </a>
                </div>
              </div>
            </Card>
            {serverError && <p className="text-red-500 text-center">{serverError}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
