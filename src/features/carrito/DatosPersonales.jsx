import PropTypes from "prop-types";
import { useState } from "react";
import { Input, Typography, Button, Checkbox } from "@material-tailwind/react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DatosPersonalesSchema } from "./dto/datosPersonales.schema";
import { getUsuarioId } from "../auth/api/userApi";
import { createVenta, getSegundaPendiente, deleteVenta } from "./api/ventaApi";
import { createCarritoDetalle } from "./api/carritoApi";

const DatosPersonales = ({ datos, setDatos, onContinuar, carritoId, setVentaId }) => {
  const [serverError, setServerError] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(DatosPersonalesSchema),
    defaultValues: {
      correo: datos.correo || "",
      nombre: datos.nombre || "",
      apellidos: datos.apellidos || "",
      documento: datos.documento || "",
      telefono: datos.telefono || "",
      acepta: datos.acepta || false,
      guardarData1: datos.guardarData1 || false,
      deseaFactura: datos.deseaFactura || false,
      novedades: datos.novedades || false,
    },
  });

  const onSubmit = async (formData) => {
    setServerError(null);
    setDatos(formData);
    try {
      const usuarioId = await getUsuarioId();
      const venta = await createVenta(usuarioId);
      const ventaId = venta.id;
      setVentaId(ventaId);

      const otraVentaPendienteId = await getSegundaPendiente(usuarioId);
      if (otraVentaPendienteId && otraVentaPendienteId !== ventaId) {
        await deleteVenta(otraVentaPendienteId);
      }

      await createCarritoDetalle(ventaId, carritoId);
      onContinuar();
    } catch (error) {
      setServerError("Ocurrió un error al procesar la venta. Intenta nuevamente.");
      console.error(error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 shadow w-full max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Typography className="font-bold font-Poppins text-3xl">Datos personales</Typography>
      </div>
      <hr className="mb-6 border-b border-gray-400" />
      <Typography variant="paragraph" className="mb-6 text-lg font-Poppins">
        Solicitamos únicamente la información esencial para la finalización de la compra.
      </Typography>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Typography variant="small" className="font-bold mb-1">Correo</Typography>
          <Input type="email" {...register("correo")} className="w-full" maxLength={50} />
          {errors.correo && <p className="text-red-500 text-sm">{errors.correo.message}</p>}
        </div>
        <div className="flex gap-4 max-lg:flex-col">
          <div className="flex-1">
            <Typography variant="small" className="font-bold mb-1">Nombre</Typography>
            <Controller
              name="nombre"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  className="w-full"
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").slice(0, 50);
                    field.onChange(v);
                  }}
                />
              )}
            />
            {errors.nombre && <p className="text-red-500 text-sm">{errors.nombre.message}</p>}
          </div>
          <div className="flex-1">
            <Typography variant="small" className="font-bold mb-1">Apellidos</Typography>
            <Controller
              name="apellidos"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  className="w-full"
                  onChange={(e) => {
                    const v = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, "").slice(0, 50);
                    field.onChange(v);
                  }}
                />
              )}
            />
            {errors.apellidos && <p className="text-red-500 text-sm">{errors.apellidos.message}</p>}
          </div>
        </div>
        <div className="flex gap-4 max-lg:flex-col">
          <div className="flex-1">
            <Typography variant="small" className="font-bold mb-1">Documento de Identidad</Typography>
            <Controller
              name="documento"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  className="w-full"
                  inputMode="numeric"
                  maxLength={8}
                  onChange={(e) => field.onChange(e.target.value.replace(/\D/g, "").slice(0, 8))}
                />
              )}
            />
            {errors.documento && <p className="text-red-500 text-sm">{errors.documento.message}</p>}
          </div>
          <div className="flex-1">
            <Typography variant="small" className="font-bold mb-1">Teléfono / Móvil</Typography>
            <Controller
              name="telefono"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  className="w-full"
                  inputMode="numeric"
                  maxLength={11}
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
                    let formatted = digits;
                    if (digits.length > 6) {
                      formatted = `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
                    } else if (digits.length > 3) {
                      formatted = `${digits.slice(0, 3)} ${digits.slice(3)}`;
                    }
                    field.onChange(formatted);
                  }}
                />
              )}
            />
            {errors.telefono && <p className="text-red-500 text-sm">{errors.telefono.message}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          {[
            { name: "guardarData1", label: "Quisiera guardar mis datos para futuras compras." },
            { name: "deseaFactura", label: "Deseo factura" },
            { name: "novedades", label: "Quiero recibir novedades y promociones." },
          ].map(({ name, label }) => (
            <div key={name} className="flex items-center gap-2">
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={name}
                    checked={field.value || false}
                    onChange={(e) => field.onChange(e.target.checked)}
                  >
                    <Checkbox.Indicator />
                  </Checkbox>
                )}
              />
              <Typography as="label" htmlFor={name} className="cursor-pointer text-foreground">
                {label}
              </Typography>
            </div>
          ))}
          <div className="flex items-center gap-2">
            <Controller
              name="acepta"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="acepta"
                  checked={field.value || false}
                  onChange={(e) => field.onChange(e.target.checked)}
                  className="max-md:w-8 h-5"
                >
                  <Checkbox.Indicator />
                </Checkbox>
              )}
            />
            <Typography as="label" htmlFor="acepta" className="cursor-pointer text-foreground">
              <span className="max-md:text-sm">
                Acepto los <a href="#" className="text-blue-600 underline">Términos y Condiciones</a> y la{" "}
                <a href="#" className="text-blue-600 underline">Política de protección de datos personales</a>.
              </span>
            </Typography>
          </div>
          {errors.acepta && (
            <Typography variant="small" color="red" className="ml-1">
              {errors.acepta.message}
            </Typography>
          )}
        </div>
        {serverError && <p className="text-red-500 text-center">{serverError}</p>}
        <Button
          type="submit"
          className="mt-6 w-full font-bold py-3 text-lg bg-red-500 hover:bg-red-600 border-none"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Procesando..." : "Continuar"}
        </Button>
      </form>
    </div>
  );
};

DatosPersonales.propTypes = {
  datos: PropTypes.object.isRequired,
  setDatos: PropTypes.func.isRequired,
  onContinuar: PropTypes.func.isRequired,
  carritoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  setVentaId: PropTypes.func.isRequired,
};

export default DatosPersonales;
