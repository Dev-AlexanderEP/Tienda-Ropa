import { useState } from "react";
import { Button, Input, Typography } from "@material-tailwind/react";
import Swal from "sweetalert2";
import axios from "axios";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 12 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));

const FormCreditCart = ({ amount, ventaId, metodoId, carritoId, datos }) => {
  const [form, setForm] = useState({
    name: "",
    card: "",
    month: "",
    year: "",
    ccv: "",
  });
        const token = localStorage.getItem('accessToken'); // o sessionStorage.getItem('token')
  // const API_BASE = "http://localhost:8080/api/v1";
const API_BASE = "https://mixmatch.zapto.org/api/v1";

// const API_BASE_BASE = "http://localhost:8080";
const API_BASE_BASE = "https://mixmatch.zapto.org";

  // Nuevo estado para guardar el envioId
  const [envioId, setEnvioId] = useState(null);

  const handleChange = e => {
    const { name, value } = e.target;
    // Formatear el número de tarjeta con separación cada 4 dígitos
    if (name === "card") {
      const onlyNums = value.replace(/\D/g, "").slice(0, 16);
      let formatted = onlyNums.match(/.{1,4}/g)?.join("-") ?? "";
      setForm(prev => ({ ...prev, card: formatted }));
      return;
    }
    // Limitar CCV a 3 dígitos
    if (name === "ccv") {
      const ccv = value.replace(/\D/g, "").slice(0, 3);
      setForm(prev => ({ ...prev, ccv }));
      return;
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      // Mostrar loading mientras se procesa el pago y se envía el correo
      Swal.fire({
        title: "Procesando pago...",
        text: "Por favor, espera mientras procesamos tu pago y enviamos los detalles a tu correo.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // --- 1. Registrar el pago ---
      const pagoData = {
        ventaId,
        monto: amount,
        metodoId,
        estado: "PAGADO"
      };
      await axios.post(`${API_BASE}/pago`, pagoData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // --- 2. Actualizar venta ---
      await actualizarVentaPagada();

      // --- 3. Actualizar carrito ---
      await actualizarCarrito();

      // --- 4. Registrar datos personales y envío (y guardar envioId) ---
      const nuevoEnvioId = await registrarDatosPersonalesYEnvio(); // <- ahora retorna el envioId
      setEnvioId(nuevoEnvioId);

      // --- 5. Guardar dirección si es necesario ---
      if (datos.guardarData1 && datos.guardarData2) {
        await guardarDireccionSiEsNecesario();
      }

      // --- 6. Enviar correo con detalles de la compra (nuevo paso) ---
      // Llamar a tu API para enviar el correo (espera a que termine)
      await enviarCorreoConDetalle(nuevoEnvioId);

      // Limpiar carritoId y cartCount del localStorage
      localStorage.removeItem('carritoId');
      localStorage.setItem('cartCount', '0');
      window.dispatchEvent(new Event('cart-updated'));

      // Limpiar el formulario después del pago exitoso
      setForm({
        name: "",
        card: "",
        month: "",
        year: "",
        ccv: "",
      });

      // Mostrar mensaje de éxito y pedir revisar correo
      Swal.fire({
        icon: "success",
        title: "Pago con éxito",
        html: `<b>${form.name}</b><br>Monto: <b>S/ ${amount}</b><br><br><b>Revisa tu correo por favor</b>`,
        confirmButtonText: "OK",
      });

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar el pago",
        text: "Intenta nuevamente.",
      });
    }
  };

  // --- Funciones auxiliares (no cambian) ---
  const actualizarVentaPagada = async () => {
    try {
      // 1. Obtener usuarioId
      const userRes = await axios.get(`${API_BASE_BASE}/usuario-id`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usuarioId = userRes.data;

      // 2. Obtener la venta pendiente
      const ventaPendienteRes = await axios.get(`${API_BASE}/venta/segunda-pendiente/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ventaId = ventaPendienteRes.data.object;

      // 3. Actualizar la venta a PAGADO
      await axios.put(`${API_BASE}/venta/${ventaId}`, {
        id: ventaId,
        usuarioId,
        estado: "PAGADO"
      }, {        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la venta a PAGADO", "error");
      console.error(error);
    }
  };

  const actualizarCarrito = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      // 1. Obtener usuarioId
      const userRes = await axios.get(`${API_BASE_BASE}/usuario-id`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usuarioId = userRes.data;
      console.log("usuarioId para carrito:", carritoId);
      await axios.put(`${API_BASE}/carrito/${carritoId}`, {
        usuarioId,
        estado: "COMPLETADO"
      }, {        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el carrito a COMPLETADO", "error");
      console.error(error);
    }
  };

  // --- Cambiada: ahora retorna el envioId creado ---
  const registrarDatosPersonalesYEnvio = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userRes = await axios.get(`${API_BASE_BASE}/usuario-id`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usuarioId = userRes.data;

      // 2. Registrar datos personales
      const datosPersonalesBody = {
        nombres: datos.nombre,
        apellidos: datos.apellidos,
        usuarioId,
        dni: datos.documento,
        departamento: datos.departamento,
        provincia: datos.provincia,
        distrito: datos.distrito,
        calle: datos.calle,
        detalle: datos.detalle,
        telefono: datos.telefono,
        email: datos.correo,
      };
      const datosPersonalesRes = await axios.post(`${API_BASE}/dato-personal`, datosPersonalesBody, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const datosPersonalesId = datosPersonalesRes.data.object.id;

      // Fechas: inicio y fin de mes actual
      const now = new Date();
      const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
      const finMes = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split("T")[0];

      // Tracking aleatorio
      const randomTracking = Array.from({ length: 10 }, () =>
        Math.random() < 0.5
          ? String.fromCharCode(65 + Math.floor(Math.random() * 26)) // A-Z
          : Math.floor(Math.random() * 9) + 1 // 1-9
      ).join("");

      const envioBody = {
        ventaId,
        datosPersonalesId,
        costoEnvio: 0,
        fechaEnvio: inicioMes,
        fechaEntrega: finMes,
        estado: "EN PROCESO",
        metodoEnvio: "Delivery",
        trackingNumber: randomTracking,
      };
      // Guardamos el envio y retornamos el id del envio creado
      const envioRes = await axios.post(`${API_BASE}/envio`, envioBody, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Asegúrate de que el backend retorna el id en envioRes.data.object.id
      const envioIdCreado = envioRes.data.object.id;
      return envioIdCreado;

    } catch (error) {
      Swal.fire("Error", "No se pudo registrar los datos personales y el envío", "error");
      console.error(error);
      return null;
    }
  };

  const guardarDireccionSiEsNecesario = async () => {
    const token = localStorage.getItem("accessToken");
    // 1. Obtener usuarioId
    const userRes = await axios.get(`${API_BASE_BASE}/usuario-id`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const usuarioId = userRes.data;
    // 2. Construir el body de la dirección
    const direccionBody = {
      nombres: datos.nombre,
      apellidos: datos.apellidos,
      usuarioId,
      dni: datos.documento,
      departamento: datos.departamento,
      provincia: datos.provincia,
      calle: datos.calle,
      distrito: datos.distrito,
      detalle: datos.detalle,
      telefono: datos.telefono,
    };
    // 3. Guardar la dirección
    await axios.post(`${API_BASE}/direccion`, direccionBody, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  // Cambiada: recibe envioId por parámetro
  const enviarCorreoConDetalle = async (envioIdParam) => {
    if (!envioIdParam) {
      console.error("envioId no está definido, no se puede enviar el correo.");
      return;
    }
    try {
      await axios.get(`${API_BASE}/registrar?id=${envioIdParam}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      // Si el envío del correo falla, solo muestra un error en consola
      console.error("Error al enviar el correo:", error);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full mt-5 p-4 bg-white rounded shadow" onSubmit={handleSubmit}>
      <Typography variant="" className="text-lg font-bold mb-2 font-Poppins">Pago con tarjeta de crédito</Typography>
      
      <Typography as="label" htmlFor="credit-name" variant="small" className="font-Poppins  font-medium">Nombre en la tarjeta</Typography>
      <Input
        id="credit-name"
        label=""
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        maxLength={50}
        className="font-Poppins"
      />

      <Typography as="label" htmlFor="credit-card" variant="small" className=" font-Poppins  font-medium">Número de tarjeta</Typography>
      <Input
        id="credit-card"
        label=""
        name="card"
        value={form.card}
        onChange={handleChange}
        required
        maxLength={19}
        placeholder="XXXX-XXXX-XXXX-XXXX"
        inputMode="numeric"
        className="font-Poppins"
      />

      <div className="flex gap-2">
        <div className="flex-1">
          <Typography as="label" htmlFor="credit-month" variant="small" className=" font-Poppins  font-medium">Mes</Typography>
          <select
            id="credit-month"
            name="month"
            value={form.month}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 font-Poppins"
          >
            <option value="">Mes</option>
            {months.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <Typography as="label" htmlFor="credit-year" variant="small" className=" font-Poppins  font-medium">Año</Typography>
          <select
            id="credit-year"
            name="year"
            value={form.year}
            onChange={handleChange}
            required
            className="w-full border rounded p-2 font-Poppins"
          >
            <option value="">Año</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <Typography as="label" htmlFor="credit-ccv" variant="small" className=" font-Poppins  font-medium">CVV</Typography>
          <Input
            id="credit-ccv"
            label=""
            name="ccv"
            value={form.ccv}
            onChange={handleChange}
            required
            maxLength={3}
            placeholder="123"
            className="font-Poppins"
            inputMode="numeric"
          />
        </div>
      </div>
      <Button type="submit" color="blue" className="mt-2">Pagar</Button>
    </form>
  );
};

export default FormCreditCart;