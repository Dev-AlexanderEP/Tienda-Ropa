import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Input, Button, Card } from "@material-tailwind/react";
import NavBarResponsive from "../../components/navbaar/NavBarResponsive";
import { enviarOtpRecuperacion, verificarOtpRecuperacion } from "./api/authApi";

const OTP_LENGTH = 6;

export default function RecuperarPasswordForm() {
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1); // 1: email | 2: otp + nueva pass
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  const [email, setEmail] = useState("");
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);
  const [contraseniaNueva, setContraseniaNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // ─── Paso 1: enviar OTP al email ─────────────────────────────────────────
  const handleEnviarOtp = async (e) => {
    e.preventDefault();
    setError(null);
    if (!email) return setError("Ingresa tu correo electrónico.");

    setCargando(true);
    try {
      await enviarOtpRecuperacion({ email });
      setMensaje(`Enviamos un código a ${email}. Expira en 10 minutos.`);
      setPaso(2);
    } catch (err) {
      setError(err.response?.data?.message ?? "No encontramos una cuenta con ese correo.");
    } finally {
      setCargando(false);
    }
  };

  // ─── OTP input helpers ────────────────────────────────────────────────────
  const handleDigitChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < OTP_LENGTH - 1) inputRefs.current[index + 1]?.focus();
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === "Backspace" && !digits[index] && index > 0)
      inputRefs.current[index - 1]?.focus();
  };

  const handleDigitPaste = (e) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!pasted) return;
    e.preventDefault();
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  // ─── Paso 2: verificar OTP + cambiar contraseña ──────────────────────────
  const handleConfirmar = async (e) => {
    e.preventDefault();
    setError(null);

    const codigo = digits.join("");
    if (codigo.length < OTP_LENGTH) return setError("Ingresa los 6 dígitos del código.");
    if (!contraseniaNueva) return setError("La contraseña nueva es obligatoria.");
    if (contraseniaNueva.length < 8) return setError("La contraseña debe tener al menos 8 caracteres.");
    if (contraseniaNueva !== confirmar) return setError("Las contraseñas no coinciden.");

    setCargando(true);
    try {
      await verificarOtpRecuperacion({ email, codigo, nuevaContrasenia: contraseniaNueva });
      setMensaje("¡Contraseña restablecida correctamente!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message ?? "Código inválido o expirado.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gray-50">
      <NavBarResponsive />

      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4 py-10">
        <Card className="w-full max-w-md p-10 shadow-lg flex flex-col gap-6">

          {/* Título */}
          <div className="text-center">
            <Typography color="blue-gray" className="text-3xl font-semibold mb-1">
              Recuperar contraseña
            </Typography>
            <Typography className="text-sm text-gray-500">
              {paso === 1
                ? "Ingresa tu correo y te enviaremos un código de verificación."
                : "Ingresa el código que recibiste y tu nueva contraseña."}
            </Typography>
          </div>

          {/* Indicador de pasos */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2].map((n) => (
              <div key={n} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${paso >= n ? "bg-[#1a1a2e] text-white" : "bg-gray-200 text-gray-400"}`}>
                  {n}
                </div>
                {n < 2 && <div className={`w-10 h-0.5 ${paso > n ? "bg-[#1a1a2e]" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {/* Mensaje de éxito */}
          {mensaje && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-sm text-center">
              {mensaje}
            </div>
          )}

          {/* Paso 1: email */}
          {paso === 1 && (
            <form onSubmit={handleEnviarOtp} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Correo electrónico
                </label>
                <Input
                  type="email"
                  label="tu@correo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border hover:border-[#1a1a2e] focus:border-[#1a1a2e]"
                />
              </div>
              <Button
                type="submit"
                disabled={cargando}
                className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white text-sm py-3 rounded-lg w-full"
              >
                {cargando ? "Enviando..." : "Enviar código"}
              </Button>
            </form>
          )}

          {/* Paso 2: OTP + nueva contraseña */}
          {paso === 2 && (
            <form onSubmit={handleConfirmar} className="flex flex-col gap-5">

              {/* OTP */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-3 text-center">
                  Código de verificación
                </label>
                <div className="flex justify-center gap-3" onPaste={handleDigitPaste}>
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputRefs.current[i] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(i, e)}
                      className="w-11 h-12 text-center text-xl font-bold border-2 rounded-lg border-gray-300 focus:border-[#1a1a2e] focus:outline-none transition-colors"
                    />
                  ))}
                </div>
              </div>

              {/* Nueva contraseña */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Nueva contraseña
                </label>
                <Input
                  type="password"
                  label="Mínimo 8 caracteres"
                  value={contraseniaNueva}
                  onChange={(e) => setContraseniaNueva(e.target.value)}
                  className="border hover:border-[#1a1a2e] focus:border-[#1a1a2e]"
                />
              </div>

              {/* Confirmar */}
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Confirmar contraseña
                </label>
                <Input
                  type="password"
                  label="Repite la contraseña"
                  value={confirmar}
                  onChange={(e) => setConfirmar(e.target.value)}
                  className="border hover:border-[#1a1a2e] focus:border-[#1a1a2e]"
                />
              </div>

              <Button
                type="submit"
                disabled={cargando}
                className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white text-sm py-3 rounded-lg w-full"
              >
                {cargando ? "Actualizando..." : "Restablecer contraseña"}
              </Button>

              <p className="text-center text-sm text-gray-500">
                ¿No recibiste el código?{" "}
                <button
                  type="button"
                  onClick={() => { setPaso(1); setMensaje(null); setDigits(Array(OTP_LENGTH).fill("")); }}
                  className="text-[#1a1a2e] font-medium hover:underline"
                >
                  Reenviar
                </button>
              </p>
            </form>
          )}

          {/* Error */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Volver al login */}
          <p className="text-center text-sm">
            <a href="/login" className="text-gray-400 hover:text-gray-600 hover:underline">
              ← Volver al inicio de sesión
            </a>
          </p>

        </Card>
      </div>
    </div>
  );
}
