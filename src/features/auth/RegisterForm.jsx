import React, { useState } from "react";
import Navbar from "../../components/navbaar/NavBar";
import { Typography, Input, Button, Card } from "@material-tailwind/react";
import imagen1 from "../../assets/images/login/imagen1.webp";
import imagen2 from "../../assets/images/login/imagen2.webp";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "./api/authApi";
import { RegisterSchema } from "./dto/register.schema";

export default function RegisterForm() {
  const [serverError, setServerError] = useState(null);
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(RegisterSchema), mode: "onTouched" });

  const onSubmit = async ({ nombreUsuario, email, contrasenia }) => {
    setServerError(null);
    try {
      const { token } = await register({ nombreUsuario, email, contrasenia });
      localStorage.setItem("accessToken", token);

      const redirectPath = localStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirectPath);
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setServerError("El usuario o email ya existe. Intenta con otros datos.");
      } else if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError("Error al registrar. Intenta con otro usuario o correo.");
      }
      console.error("Error en el registro:", err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Navbar />
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
          <div className="flex justify-center items-center flex-col gap-y-2 h-[90%] w-full">
            <Card className="w-[60%] h-[90%] p-10 shadow-lg flex flex-col justify-center items-center max-lg:w-[90%]">
              <div className="w-full flex flex-col">
                <Typography color="blue-gray" className="mb-6 text-center text-2xl font-sans">
                  Registro
                </Typography>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
                  <label htmlFor="nombreUsuario" className="text-md font-medium">
                    Nombre de usuario
                  </label>
                  <Input
                    id="nombreUsuario"
                    label="Nombre de usuario"
                    type="text"
                    {...registerField("nombreUsuario")}
                    className="border hover:border-red-600 h-[40px] text-[16px]"
                  />
                  {errors.nombreUsuario && <p className="text-red-500 text-sm">{errors.nombreUsuario.message}</p>}

                  <label htmlFor="email" className="text-md font-medium">
                    Email
                  </label>
                  <Input
                    id="email"
                    label="Email"
                    type="email"
                    {...registerField("email")}
                    className="border hover:border-red-600 h-[40px] text-[16px]"
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

                  <label htmlFor="contrasenia" className="text-md font-medium">
                    Contraseña
                  </label>
                  <Input
                    id="contrasenia"
                    label="Contraseña"
                    type="password"
                    {...registerField("contrasenia")}
                    className="border hover:border-red-600 h-[40px] text-[16px]"
                  />
                  {errors.contrasenia && <p className="text-red-500 text-sm">{errors.contrasenia.message}</p>}

                  <label htmlFor="confirmarContrasenia" className="text-md font-medium">
                    Confirmar contraseña
                  </label>
                  <Input
                    id="confirmarContrasenia"
                    label="Confirmar contraseña"
                    type="password"
                    {...registerField("confirmarContrasenia")}
                    className="border hover:border-red-600 h-[40px] text-[16px]"
                  />
                  {errors.confirmarContrasenia && <p className="text-red-500 text-sm">{errors.confirmarContrasenia.message}</p>}

                  <Button
                    type="submit"
                    variant="outline"
                    className="hover:bg-red-200 border border-red-300 hover:text-black text-md"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Registrando..." : "Registrarse"}
                  </Button>
                </form>
                <div className="flex gap-x-2 mt-4">
                  <span>¿Ya tienes una cuenta?</span>
                  <a href="/login" className="text-red-500 hover:text-red-700">
                    Inicia Sesión
                  </a>
                </div>
                {serverError && <p className="text-red-500 text-center mt-2">{serverError}</p>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
