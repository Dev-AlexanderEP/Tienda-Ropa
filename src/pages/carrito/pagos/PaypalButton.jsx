import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React from "react";
import Swal from "sweetalert2";
import axios from "axios";

const TIPO_CAMBIO = 3.7; // Puedes actualizar este valor según el tipo de cambio actual

const PaypalButton = ({ amount, ventaId, metodoId, carritoId, datos }) => {
  // --- Funciones auxiliares iguales que en FormCreditCart ---
  const actualizarVentaPagada = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      // 1. Obtener usuarioId
      const userRes = await axios.get("https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/usuario-id", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usuarioId = userRes.data;

      // 2. Obtener la venta pendiente
      const ventaPendienteRes = await axios.get(`https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/api/v1/venta/segunda-pendiente/${usuarioId}`);
      const ventaId = ventaPendienteRes.data.object;

      // 3. Actualizar la venta a PAGADO
      await axios.put(`https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/api/v1/venta/${ventaId}`, {
        id: ventaId,
        usuarioId,
        estado: "PAGADO"
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
      const userRes = await axios.get("https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/usuario-id", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usuarioId = userRes.data;
      await axios.put(`https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/api/v1/carrito/${carritoId}`, {
        usuarioId,
        estado: "COMPLETADO"
      });
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar el carrito a COMPLETADO", "error");
      console.error(error);
    }
  };

  // Retorna envioId creado
  const registrarDatosPersonalesYEnvio = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const userRes = await axios.get("https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/usuario-id", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const usuarioId = userRes.data;

      // Registrar datos personales
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
      const datosPersonalesRes = await axios.post("https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/api/v1/dato-personal", datosPersonalesBody);
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
      const envioRes = await axios.post("https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/api/v1/envio", envioBody);
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
    const userRes = await axios.get("https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/usuario-id", {
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
    await axios.post("https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/api/v1/direccion", direccionBody);
  };

  // Enviar correo con envioId
  const enviarCorreoConDetalle = async envioIdParam => {
    if (!envioIdParam) {
      console.error("envioId no está definido, no se puede enviar el correo.");
      return;
    }
    try {
      await axios.get(`https://sv-02udg1brnilz4phvect8.cloud.elastika.pe/api-tienda/api/v1/registrar?id=${envioIdParam}`);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
    }
  };

  const amountUSD = (amount / TIPO_CAMBIO).toFixed(2);

  return (
    <PayPalScriptProvider options={{ "client-id": "ATaavYymwB377Sr8RLMX2SFGLA71tjUY8ULuQAc_bab4luBD7uq4DSdcVXvy5kY3HGvMoaRS30jzyvwt", currency: "USD" }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        fundingSource="paypal"
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: { value: amountUSD.toString() }
            }]
          });
        }}
        onApprove={async (data, actions) => {
          Swal.fire({
            title: "Procesando pago...",
            text: "Por favor, espera mientras procesamos tu pago y enviamos los detalles a tu correo.",
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          try {
            const details = await actions.order.capture();
            // --- 1. Actualizar venta y carrito ---
            await actualizarVentaPagada();
            await actualizarCarrito();
            // --- 2. Registrar datos personales/envio y obtener envioId ---
            const envioId = await registrarDatosPersonalesYEnvio();

            // --- 3. Guardar dirección si es necesario ---
            if (datos.guardarData1 && datos.guardarData2) {
              await guardarDireccionSiEsNecesario();
            }
            // --- 4. Enviar correo con detalles ---
            await enviarCorreoConDetalle(envioId);
            // --- 5. Limpiar carritoId y cartCount del localStorage ---
            localStorage.removeItem('carritoId');
            localStorage.setItem('cartCount', '0');
            window.dispatchEvent(new Event('cart-updated'));
            // --- 6. Notificar éxito ---
            Swal.fire({
              icon: "success",
              title: "Pago con éxito",
              html: `<b>${datos.nombre}</b><br>Monto: <b>S/ ${amount}</b><br><br><b>Revisa tu correo por favor</b>`,
              confirmButtonText: "OK",
            });

          } catch (error) {
            Swal.fire({
              icon: "error",
              title: "Error al procesar el pago",
              text: "Intenta nuevamente.",
            });
            console.error(error);
          }
        }}
        onError={err => {
          Swal.fire({
            icon: "error",
            title: "Error en el pago con PayPal",
            text: "Intenta nuevamente.",
          });
          console.error(err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;