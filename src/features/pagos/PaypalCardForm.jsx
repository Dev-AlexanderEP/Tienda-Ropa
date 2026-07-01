import { useEffect, useRef, useState } from "react";
import {
  PayPalScriptProvider,
  PayPalCardFieldsProvider,
  PayPalCardFieldsForm,
  usePayPalCardFields,
} from "@paypal/react-paypal-js";
import Swal from "sweetalert2";
import { PAYPAL_CLIENT_ID } from "../../config/api";
import { getPaypalClientToken, createPagoPaypal, capturarPagoPaypal } from "./api/pagosApi";
import { registrarDatosPersonalesYEnvio, guardarDireccion } from "../envio/api/envioApi";

const SubmitButton = () => {
  const { cardFieldsForm } = usePayPalCardFields();
  const [enviando, setEnviando] = useState(false);

  const handleClick = async () => {
    if (!cardFieldsForm) return;
    setEnviando(true);
    try {
      await cardFieldsForm.submit();
    } catch (error) {
      console.error(error);
      setEnviando(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={enviando}
      className="w-full mt-4 bg-gray-800 text-white py-3 rounded font-Poppins disabled:opacity-50"
    >
      {enviando ? "Procesando..." : "Pagar con tarjeta"}
    </button>
  );
};

const PaypalCardForm = ({ amount, ventaId, metodoId, carritoId, datos }) => {
  const [clientToken, setClientToken] = useState(null);
  const pagoIdRef = useRef(null);

  useEffect(() => {
    getPaypalClientToken()
      .then(setClientToken)
      .catch((error) => {
        console.error(error);
        Swal.fire({ icon: "error", title: "No se pudo cargar PayPal", text: "Intenta nuevamente." });
      });
  }, []);

  const createOrder = async () => {
    const pago = await createPagoPaypal({ ventaId, metodoId });
    pagoIdRef.current = pago.pagoId;
    return pago.orderId;
  };

  const onApprove = async (data) => {
    Swal.fire({
      title: "Procesando pago...",
      text: "Por favor, espera mientras procesamos tu pago y enviamos los detalles a tu correo.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const pago = await capturarPagoPaypal({ pagoId: pagoIdRef.current, orderId: data.orderID });

      if (pago.estado === "COMPLETADO") {
        await registrarDatosPersonalesYEnvio(datos, ventaId);

        if (datos.guardarData1 && datos.guardarData2) {
          await guardarDireccion(datos);
        }

        localStorage.removeItem("carritoId");
        localStorage.setItem("cartCount", "0");
        window.dispatchEvent(new Event("cart-updated"));

        Swal.fire({
          icon: "success",
          title: "Pago con éxito",
          html: `<b>${datos.nombre}</b><br>Monto: <b>S/ ${amount}</b><br><br><b>Revisa tu correo por favor</b>`,
          confirmButtonText: "OK",
        });
        return;
      }

      Swal.fire({ icon: "error", title: "Pago rechazado", text: "Intenta nuevamente." });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Pago rechazado",
        text: error.response?.data?.message || "Intenta nuevamente.",
      });
      console.error(error);
    }
  };

  const onError = (error) => {
    Swal.fire({ icon: "error", title: "Error en el pago con PayPal", text: "Intenta nuevamente." });
    console.error(error);
  };

  if (!clientToken) {
    return <p className="mt-4 text-gray-500 font-Poppins">Cargando formulario de PayPal...</p>;
  }

  return (
    <div className="w-full mt-4">
      <PayPalScriptProvider
        key={clientToken}
        options={{
          clientId: PAYPAL_CLIENT_ID,
          dataClientToken: clientToken,
          components: "card-fields",
          currency: "USD",
        }}
      >
        <PayPalCardFieldsProvider createOrder={createOrder} onApprove={onApprove} onError={onError}>
          <PayPalCardFieldsForm />
          <SubmitButton />
        </PayPalCardFieldsProvider>
      </PayPalScriptProvider>
    </div>
  );
};

export default PaypalCardForm;
