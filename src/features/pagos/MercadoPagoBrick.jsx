import { initMercadoPago, CardPayment } from "@mercadopago/sdk-react";
import Swal from "sweetalert2";
import { MP_PUBLIC_KEY } from "../../config/api";
import { createPagoMercadoPago } from "./api/pagosApi";
import { registrarDatosPersonalesYEnvio, guardarDireccion } from "../envio/api/envioApi";

initMercadoPago(MP_PUBLIC_KEY, { locale: "es-PE" });

const MercadoPagoBrick = ({ amount, ventaId, metodoId, carritoId, datos }) => {
  const onSubmit = async (formData) => {
    Swal.fire({
      title: "Procesando pago...",
      text: "Por favor, espera mientras procesamos tu pago y enviamos los detalles a tu correo.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const pago = await createPagoMercadoPago({
        ventaId,
        metodoId,
        token: formData.token,
        paymentMethodId: formData.payment_method_id,
        issuerId: formData.issuer_id,
        installments: formData.installments,
        payerEmail: formData.payer.email,
        identificacionTipo: formData.payer.identification?.type,
        identificacionNumero: formData.payer.identification?.number,
      });

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

      // "in_process" / "pending" en Mercado Pago: el pago queda PENDIENTE y se confirma luego por webhook.
      Swal.fire({
        icon: "info",
        title: "Pago en revisión",
        text: "Tu pago está siendo procesado. Te avisaremos por correo cuando se confirme.",
      });
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
    Swal.fire({ icon: "error", title: "Error al procesar el pago", text: "Intenta nuevamente." });
    console.error(error);
  };

  return (
    <div className="w-full mt-4">
      <CardPayment
        initialization={{
          amount,
          payer: {
            email: datos.correo,
            identification: { type: "DNI", number: datos.documento },
          },
        }}
        customization={{ visual: { hideFormTitle: true } }}
        onSubmit={onSubmit}
        onError={onError}
      />
    </div>
  );
};

export default MercadoPagoBrick;
