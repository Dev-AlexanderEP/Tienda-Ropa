import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import { actualizarVentaPagada } from "../carrito/api/ventaApi";
import { actualizarCarrito } from "../carrito/api/carritoApi";
import { registrarDatosPersonalesYEnvio, guardarDireccion, enviarCorreo } from "../envio/api/envioApi";

const TIPO_CAMBIO = 3.7;
const PAYPAL_CLIENT_ID = "ATaavYymwB377Sr8RLMX2SFGLA71tjUY8ULuQAc_bab4luBD7uq4DSdcVXvy5kY3HGvMoaRS30jzyvwt";

const PaypalButton = ({ amount, ventaId, metodoId, carritoId, datos }) => {
  const amountUSD = (amount / TIPO_CAMBIO).toFixed(2);

  return (
    <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "USD" }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        fundingSource="paypal"
        createOrder={(data, actions) =>
          actions.order.create({
            purchase_units: [{ amount: { value: amountUSD.toString() } }],
          })
        }
        onApprove={async (data, actions) => {
          Swal.fire({
            title: "Procesando pago...",
            text: "Por favor, espera mientras procesamos tu pago y enviamos los detalles a tu correo.",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
          });
          try {
            await actions.order.capture();
            await actualizarVentaPagada(ventaId);
            await actualizarCarrito(carritoId);

            const envioId = await registrarDatosPersonalesYEnvio(datos, ventaId);

            if (datos.guardarData1 && datos.guardarData2) {
              await guardarDireccion(datos);
            }

            await enviarCorreo(envioId);

            localStorage.removeItem("carritoId");
            localStorage.setItem("cartCount", "0");
            window.dispatchEvent(new Event("cart-updated"));

            Swal.fire({
              icon: "success",
              title: "Pago con éxito",
              html: `<b>${datos.nombre}</b><br>Monto: <b>S/ ${amount}</b><br><br><b>Revisa tu correo por favor</b>`,
              confirmButtonText: "OK",
            });
          } catch (error) {
            Swal.fire({ icon: "error", title: "Error al procesar el pago", text: "Intenta nuevamente." });
            console.error(error);
          }
        }}
        onError={(err) => {
          Swal.fire({ icon: "error", title: "Error en el pago con PayPal", text: "Intenta nuevamente." });
          console.error(err);
        }}
      />
    </PayPalScriptProvider>
  );
};

export default PaypalButton;
