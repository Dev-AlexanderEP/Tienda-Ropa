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
      // Registrar el pago antes de mostrar el mensaje
      // await axios.post("http://localhost:8080/api/v1/pago", {
      //   ventaId,
      //   monto: amount,
      //   metodoId,
      //   estado: "PAGADO"
      // });
      
      
      const pagoData = {
      ventaId,
      monto: amount,
      metodoId,
      estado: "PAGADO"
    };
    console.log("Enviando pago:", pagoData);
    const response = await axios.post("http://localhost:8080/api/v1/pago", pagoData);
    console.log("Respuesta del backend:", response.data);

    
      Swal.fire({
        icon: "success",
        title: "Pago con éxito",
        html: `<b>${form.name}</b><br>Monto: <b>S/ ${amount}</b>`,
        confirmButtonText: "OK",
      });
      actualizarVentaPagada();
      actualizarCarrito();
      registrarDatosPersonalesYEnvio();
      if (datos.guardarData1 && datos.guardarData2) {
        guardarDireccionSiEsNecesario();
      }
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
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al registrar el pago",
        text: "Intenta nuevamente.",
      });
    }
  };


  
const actualizarVentaPagada = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    // 1. Obtener usuarioId
    const userRes = await axios.get("http://127.0.0.1:8080/usuario-id", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const usuarioId = userRes.data;

    // 2. Obtener la venta pendiente
    const ventaPendienteRes = await axios.get(`http://localhost:8080/api/v1/venta/segunda-pendiente/${usuarioId}`);
    const ventaId = ventaPendienteRes.data.object;

    // 3. Actualizar la venta a PAGADO
    await axios.put(`http://localhost:8080/api/v1/venta/${ventaId}`, {
      id: ventaId,
      usuarioId,
      estado: "PAGADO"
    });

    // Aquí puedes mostrar un mensaje de éxito o continuar el flujo
    // Swal.fire("Venta actualizada", "La venta fue marcada como PAGADO", "success");
  } catch (error) {
    Swal.fire("Error", "No se pudo actualizar la venta a PAGADO", "error");
    console.error(error);
  }
};

const actualizarCarrito = async () => {
  try {
    const token = localStorage.getItem("accessToken");
    // 1. Obtener usuarioId
    const userRes = await axios.get("http://127.0.0.1:8080/usuario-id", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const usuarioId = userRes.data;
    await axios.put(`http://localhost:8080/api/v1/carrito/${carritoId}`, {
      usuarioId,
      estado: "COMPLETADO"
    });
    // Opcional: mensaje de éxito
    // Swal.fire("Carrito actualizado", "El carrito fue marcado como COMPLETADO", "success");
  } catch (error) {
    Swal.fire("Error", "No se pudo actualizar el carrito a COMPLETADO", "error");
    console.error(error);
  }
};

const registrarDatosPersonalesYEnvio = async () => {
  try {
    // 1. Obtener usuarioId
    const token = localStorage.getItem("accessToken");
    const userRes = await axios.get("http://127.0.0.1:8080/usuario-id", {
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
    };
    const datosPersonalesRes = await axios.post("http://localhost:8080/api/v1/dato-personal", datosPersonalesBody);
    const datosPersonalesId = datosPersonalesRes.data.object.id;

    // 3. Registrar envío
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
    await axios.post("http://localhost:8080/api/v1/envio", envioBody);

    // Opcional: mensaje de éxito
    // Swal.fire("Envío registrado", "Datos personales y envío guardados correctamente", "success");
  } catch (error) {
    Swal.fire("Error", "No se pudo registrar los datos personales y el envío", "error");
    console.error(error);
  }
};

const guardarDireccionSiEsNecesario = async () => {
    // Solo guarda si ambos flags están en true
      const token = localStorage.getItem("accessToken");
      // 1. Obtener usuarioId
      const userRes = await axios.get("http://127.0.0.1:8080/usuario-id", {
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
      await axios.post("http://localhost:8080/api/v1/direccion", direccionBody);
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