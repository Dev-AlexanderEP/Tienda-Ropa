import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/navbaar/NavBar";
import NavBarResponsive from "../../components/navbaar/NavBarResponsive";
import imgtruck from "../../assets/images/imgtruck.png";
import FooterC from "../../components/footer/Footer";
import {
  Home,
  Truck,
  PackageCheck,
  CheckCircle,
  Package,
} from "lucide-react";
import PedidoTrackingForm from "../../components/envio/PedidoTrackingForm";
import { motion, AnimatePresence } from "framer-motion";
import { useParams } from "react-router-dom";

const STEPS = [
  { label: "Procesando", icon: <Package className="h-8 w-8" /> },
  { label: "Preparando", icon: <Home className="h-8 w-8" /> },
  { label: "Enviado", icon: <Truck className="h-8 w-8" /> },
  { label: "En camino", icon: <PackageCheck className="h-8 w-8" /> },
  { label: "Entregado", icon: <CheckCircle className="h-8 w-8" /> },
];

const STEP_MAP = {
  "EN PROCESO": 0,
  PREPARANDO: 1,
  ENVIADO: 2,
  "EN CAMINO": 3,
  ENTREGADO: 4,
};

export default function EnvioTrackingPage() {
  const params = useParams();
  const trackingFromUrl = params.tracking || ""; // puede ser undefined o string
  const [tracking, setTracking] = useState(trackingFromUrl);
  const [data, setData] = useState(null);
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
        const token = localStorage.getItem('accessToken'); // o sessionStorage.getItem('token')
 // const API_BASE = "http://localhost:8080/api/v1";
const API_BASE = "https://mixmatch.zapto.org/api/v1";
  // Si la ruta es con tracking en url, busca automáticamente
  useEffect(() => {
    if (trackingFromUrl) {
      fetchTracking(trackingFromUrl);
    }
    // eslint-disable-next-line
  }, [trackingFromUrl]);

  const fetchTracking = async (codigo) => {
    setError("");
    setData(null);
    try {
      const res = await axios.get(
        `${API_BASE}/envio/tracking/${codigo.trim()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(res.data);
      setStep(STEP_MAP[res.data.estado] ?? 0);
    } catch (err) {
      setError(
        err.response?.data || "No se encontró el envío con ese tracking."
      );
      setStep(0);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!tracking) return;
    fetchTracking(tracking);
  };

  return (
    <>
      <NavBarResponsive />
      <div
        style={{
          backgroundImage: `url(${imgtruck})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        className="w-full h-[350px] shrink-0 rounded-sm object-contain aspect-video relative"
      >
        <div className="absolute inset-0 flex items-center justify-start pl-12 max-lg:justify-start">
          <h1 className="text-white text-[60px] font-bold  drop-shadow-lg">
            Seguimiento del pedido
          </h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <PedidoTrackingForm
          tracking={tracking}
          setTracking={setTracking}
          handleSearch={handleSearch}
        />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence>
          {data && (
            <motion.div
              key="tracking-content"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ duration: 0.3 }}
            >
              {/* Stepper */}
              <div className="mb-8">
                <ol className="flex items-center w-full">
                  {STEPS.map((s, idx) => (
                    <li
                      key={s.label}
                      className={`flex flex-col items-center flex-1`}
                    >
                      <div
                        className={`
                          flex items-center justify-center w-12 h-12 rounded-full border-2 mb-2 max-md:w-10 max-md:h-10
                          ${
                            idx <= step
                              ? "border-red-500 text-red-500 bg-red-50"
                              : "border-black text-black bg-white"
                          }
                        `}
                      >
                        {React.cloneElement(s.icon, {
                          className: `h-8 w-8 max-md:w-6 max-md:h-6 ${
                            idx <= step ? "stroke-red-500" : "stroke-black"
                          }`,
                        })}
                      </div>
                      <span
                        className={`text-sm font-semibold max-md:text-[11px] ${
                          idx <= step ? "text-red-500" : "text-black"
                        }`}
                      >
                        {s.label}
                      </span>
                      {/* Línea entre los pasos */}
                      {idx < STEPS.length - 1 && (
                        <div
                          className={`w-full h-1 mt-2 ${
                            idx < step ? "bg-red-500" : "bg-black/20"
                          }`}
                        ></div>
                      )}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Información de Envío */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow p-7 mb-5"
              >
                <h2 className="text-xl font-bold mb-4 text-black">
                  Información de Envío
                </h2>
                <table className="w-full mb-4">
                  <tbody className="text-base">
                    <tr>
                      <td className="pr-3 py-1 font-bold text-black">Tracking:</td>
                      <td className="py-1 text-black">{data.trackingNumber}</td>
                    </tr>
                    <tr>
                      <td className="pr-3 py-1 font-bold text-black">Estado:</td>
                      <td className="py-1 text-red-500 font-bold uppercase">{data.estado}</td>
                    </tr>
                    <tr>
                      <td className="pr-3 py-1 font-bold text-black">Método de Envío:</td>
                      <td className="py-1 text-black">{data.metodoEnvio}</td>
                    </tr>
                    <tr>
                      <td className="pr-3 py-1 font-bold text-black">Fecha de Envío:</td>
                      <td className="py-1 text-black">{data.fechaEnvio}</td>
                    </tr>
                    <tr>
                      <td className="pr-3 py-1 font-bold text-black">Fecha de Entrega:</td>
                      <td className="py-1 text-black">{data.fechaEntrega}</td>
                    </tr>
                    <tr>
                      <td className="pr-3 py-1 font-bold text-black">Nombre:</td>
                      <td className="py-1 text-black">
                        {data.datosPersonales.nombres} {data.datosPersonales.apellidos}
                      </td>
                    </tr>
                    <tr>
                      <td className="pr-3 py-1 font-bold text-black">Dirección:</td>
                      <td className="py-1 text-black">
                        {data.datosPersonales.calle},{" "}
                        {data.datosPersonales.detalle}
                      </td>
                    </tr>
                    <tr>
                      <td className="pr-3 py-1 font-bold text-black">Teléfono:</td>
                      <td className="py-1 text-black">
                        {data.datosPersonales.telefono}
                      </td>
                    </tr>
                    <tr>
                      <td className="pr-3 py-1 font-bold text-black">Email:</td>
                      <td className="py-1 text-black">
                        {data.datosPersonales.email}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <h3 className="text-lg font-bold mt-4 mb-2 text-black">Detalle de la venta:</h3>
                <table className="w-full mb-2 border border-black/10 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-3 text-left text-black font-semibold max-md:hidden">Imagen</th>
                      <th className="py-2 px-3 text-left text-black font-semibold">Nombre</th>
                      <th className="py-2 px-3 text-left text-black font-semibold">Talla</th>
                      <th className="py-2 px-3 text-left text-black font-semibold">Cantidad</th>
                      <th className="py-2 px-3 text-left text-black font-semibold max-md:hidden">Precio Unitario</th>
                      <th className="py-2 px-3 text-left text-black font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.venta.detalles.map((item) => (
                      <tr key={item.id} className="border-t border-black/10">
                        <td className="py-2 px-3 max-md:hidden">
                          <img
                            src={`http://localhost:8080/${item.prenda.imagen.principal}`}
                            alt={item.prenda.nombre}
                            className="w-16 h-16 object-cover rounded"
                          />
                        </td>
                        <td className="py-2 px-3 text-black font-medium">{item.prenda.nombre}</td>
                        <td className="py-2 px-3 text-black">{item.talla.nomTalla}</td>
                        <td className="py-2 px-3 text-black">{item.cantidad}</td>
                        <td className="py-2 px-3 text-red-500 font-semibold max-md:hidden">S/{item.precioUnitario}</td>
                        <td className="py-2 px-3 text-red-500 font-semibold">
                          S/{(item.precioUnitario * item.cantidad).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <FooterC />
    </>
  );
}