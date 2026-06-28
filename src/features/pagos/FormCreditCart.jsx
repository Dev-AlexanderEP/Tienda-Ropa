import { Button, Input, Typography } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import { CreditCardSchema } from "./dto/creditCard.schema";
import { actualizarVentaPagada } from "../carrito/api/ventaApi";
import { actualizarCarrito } from "../carrito/api/carritoApi";
import { createPago } from "./api/pagosApi";
import { registrarDatosPersonalesYEnvio, guardarDireccion, enviarCorreo } from "../envio/api/envioApi";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 12 }, (_, i) => currentYear + i);
const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));

const FormCreditCart = ({ amount, ventaId, metodoId, carritoId, datos }) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(CreditCardSchema),
    defaultValues: { name: "", card: "", month: "", year: "", ccv: "" },
  });

  const onSubmit = async (formData) => {
    try {
      Swal.fire({
        title: "Procesando pago...",
        text: "Por favor, espera mientras procesamos tu pago y enviamos los detalles a tu correo.",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      await createPago(ventaId, amount, metodoId);
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

      reset();

      Swal.fire({
        icon: "success",
        title: "Pago con éxito",
        html: `<b>${formData.name}</b><br>Monto: <b>S/ ${amount}</b><br><br><b>Revisa tu correo por favor</b>`,
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error al registrar el pago", text: "Intenta nuevamente." });
      console.error(error);
    }
  };

  return (
    <form className="flex flex-col gap-4 w-full mt-5 p-4 bg-white rounded shadow" onSubmit={handleSubmit(onSubmit)}>
      <Typography variant="" className="text-lg font-bold mb-2 font-Poppins">
        Pago con tarjeta de crédito
      </Typography>

      <Typography as="label" htmlFor="credit-name" variant="small" className="font-Poppins font-medium">
        Nombre del Titular
      </Typography>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <Input
            id="credit-name"
            label=""
            {...field}
            maxLength={50}
            className="font-Poppins"
            onChange={(e) => field.onChange(e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, ""))}
          />
        )}
      />
      {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

      <Typography as="label" htmlFor="credit-card" variant="small" className="font-Poppins font-medium">
        Número de tarjeta
      </Typography>
      <Controller
        name="card"
        control={control}
        render={({ field }) => (
          <Input
            id="credit-card"
            label=""
            {...field}
            maxLength={19}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            inputMode="numeric"
            className="font-Poppins"
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/\D/g, "").slice(0, 16);
              field.onChange(onlyNums.match(/.{1,4}/g)?.join("-") ?? "");
            }}
          />
        )}
      />
      {errors.card && <p className="text-red-500 text-sm">{errors.card.message}</p>}

      <div className="flex gap-2">
        <div className="flex-1">
          <Typography as="label" htmlFor="credit-month" variant="small" className="font-Poppins font-medium">Mes</Typography>
          <select
            id="credit-month"
            {...register("month")}
            className="w-full border rounded p-2 font-Poppins"
          >
            <option value="">Mes</option>
            {months.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          {errors.month && <p className="text-red-500 text-sm">{errors.month.message}</p>}
        </div>
        <div className="flex-1">
          <Typography as="label" htmlFor="credit-year" variant="small" className="font-Poppins font-medium">Año</Typography>
          <select
            id="credit-year"
            {...register("year")}
            className="w-full border rounded p-2 font-Poppins"
          >
            <option value="">Año</option>
            {years.map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
          {errors.year && <p className="text-red-500 text-sm">{errors.year.message}</p>}
        </div>
        <div className="flex-1">
          <Typography as="label" htmlFor="credit-ccv" variant="small" className="font-Poppins font-medium">CVV</Typography>
          <Controller
            name="ccv"
            control={control}
            render={({ field }) => (
              <Input
                id="credit-ccv"
                label=""
                {...field}
                maxLength={3}
                placeholder="123"
                inputMode="numeric"
                className="font-Poppins"
                onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 3))}
              />
            )}
          />
          {errors.ccv && <p className="text-red-500 text-sm">{errors.ccv.message}</p>}
        </div>
      </div>

      <Button type="submit" color="blue" className="mt-2" disabled={isSubmitting}>
        {isSubmitting ? "Procesando..." : "Pagar"}
      </Button>
    </form>
  );
};

export default FormCreditCart;
