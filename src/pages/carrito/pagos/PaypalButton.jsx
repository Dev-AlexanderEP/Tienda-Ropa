import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";
import axios from "axios";  
// Puedes colocar esta función en MetodoPago.jsx o pasarla como prop a los métodos de pago




const PaypalButton = ({ amount, onSuccess, ventaId, metodoId, carritoId, datos }) => {
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
const TIPO_CAMBIO = 3.7; // Puedes actualizar este valor según el tipo de cambio actual
const amountUSD = (amount / TIPO_CAMBIO).toFixed(2);

  return(
    <PayPalScriptProvider options={{ "client-id": "ATaavYymwB377Sr8RLMX2SFGLA71tjUY8ULuQAc_bab4luBD7uq4DSdcVXvy5kY3HGvMoaRS30jzyvwt", currency: "USD" }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
            fundingSource="paypal" // <-- Esto fuerza solo el botón PayPal

        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amountUSD.toString(),
                },
              },
            ],
          });
        }}
        onApprove={async (data, actions) => {
          const details = await actions.order.capture();
          if (onSuccess) onSuccess(details);
          alert("Pago realizado con éxito. ID: " + details.id);
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
        }}
        onError={err => {
          alert("Error en el pago con PayPal");
          console.error(err);
        }}
      />
    </PayPalScriptProvider>

  );
};

export default PaypalButton;