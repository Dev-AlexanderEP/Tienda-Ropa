import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Input, Button, Card } from "@material-tailwind/react";
import NavBarResponsive from "../../components/navbaar/NavBarResponsive";
import { solicitarOtpCambioPassword, changePassword } from "./api/authApi";

const OTP_LENGTH = 6;

export default function ChangePasswordForm() {
  const navigate = useNavigate();

  // paso 1: solicitar OTP | paso 2: verificar + nueva contraseña
  const [paso, setPaso] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);

  // OTP: array de 6 dígitos
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const inputRefs = useRef([]);

  const [contraseniaNueva, setContraseniaNueva] = useState("");
  const [confirmar, setConfirmar] = useState("");

  // ─── Paso 1: solicitar OTP ─────────────────────────────────────────────────
  const handleSolicitarOtp = async () => {
    setError(null);
    setCargando(true);
    try {
      await solicitarOtpCambioPassword();
      setMensaje("Te enviamos un código de 6 dígitos a tu correo. Expira en 5 minutos.");
      setPaso(2);
    } catch (err) {
      setError(err.response?.data?.message ?? "No se pudo enviar el código. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // ─── OTP input: manejo de dígitos ─────────────────────────────────────────
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

  // ─── Paso 2: verificar OTP + cambiar contraseña ───────────────────────────
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
      await changePassword({ codigo, contraseniaNueva });
      setMensaje("¡Contraseña actualizada correctamente!");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setError(err.response?.data?.message ?? "Código inválido o expirado. Solicita uno nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen w-screen bg-gray-50">
      <NavBarResponsive />

      <div className="flex justify-center items-center min-h-[calc(100vh-64px)] px-4 py-10">
        <Card className="w-full max-w-md p-10 shadow-lg flex flex-col gap-6">

          {/* Título */}
          <div className="text-center">
            <Typography color="blue-gray" className="text-3xl font-semibold mb-1">
              Cambiar contraseña
            </Typography>
            <Typography className="text-sm text-gray-500">
              {paso === 1
                ? "Te enviaremos un código de verificación a tu correo registrado."
                : "Ingresa el código que recibiste y tu nueva contraseña."}
            </Typography>
          </div>

          {/* Mensaje de éxito */}
          {mensaje && (
            <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-green-700 text-sm text-center">
              {mensaje}
            </div>
          )}

          {/* Paso 1 */}
          {paso === 1 && (
            <Button
              onClick={handleSolicitarOtp}
              disabled={cargando}
              className="bg-[#1a1a2e] hover:bg-[#2a2a4e] text-white text-sm py-3 rounded-lg w-full"
            >
              {cargando ? "Enviando código..." : "Enviar código por correo"}
            </Button>
          )}

          {/* Paso 2 */}
          {paso === 2 && (
            <form onSubmit={handleConfirmar} className="flex flex-col gap-5">

              {/* Inputs OTP */}
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

              {/* Confirmar contraseña */}
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
                {cargando ? "Actualizando..." : "Cambiar contraseña"}
              </Button>

              {/* Reenviar código */}
              <p className="text-center text-sm text-gray-500">
                ¿No recibiste el código?{" "}
                <button
                  type="button"
                  onClick={() => { setMensaje(null); setPaso(1); setDigits(Array(OTP_LENGTH).fill("")); }}
                  className="text-[#1a1a2e] font-medium hover:underline"
                >
                  Solicitar de nuevo
                </button>
              </p>
            </form>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          {/* Volver */}
          <p className="text-center text-sm text-gray-500">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-gray-600 hover:underline"
            >
              ← Volver
            </button>
          </p>

        </Card>
      </div>
    </div>
  );
}
