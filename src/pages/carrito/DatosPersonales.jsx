import PropTypes from "prop-types";
import { useState } from "react";
import { Input, Typography, Button, Checkbox } from "@material-tailwind/react";
import axios from "axios";

const DatosPersonales = ({ datos, setDatos, onContinuar, carritoId, ventaId, setVentaId }) => {
  const [errores, setErrores] = useState({});
        const token = localStorage.getItem('accessToken'); // o sessionStorage.getItem('token')
// const API_BASE = "http://localhost:8080/api/v1";
const API_BASE = "https://mixmatch.zapto.org/api/v1";

// const API_BASE_BASE = "http://localhost:8080";
const API_BASE_BASE = "https://mixmatch.zapto.org";


  const handleChange = e => {
    const { name, value, type, checked } = e.target;

    // Limitar caracteres para nombre, apellidos y correo (100)
    if (
      (name === "nombre" || name === "apellidos" || name === "correo") &&
      value.length > 50
    ) {
      return;
    }

    // Solo 8 dígitos para documento de identidad
    if (name === "documento") {
      const soloNumeros = value.replace(/\D/g, "");
      if (soloNumeros.length > 8) return;
      setDatos(prev => ({
        ...prev,
        [name]: soloNumeros,
      }));
      setErrores(prev => ({ ...prev, [name]: false }));
      return;
    }

    // Solo 9 dígitos y formato 900 818 835 para teléfono
    if (name === "telefono") {
      const soloNumeros = value.replace(/\D/g, "").slice(0, 9);
      let formateado = soloNumeros;
      if (soloNumeros.length > 3 && soloNumeros.length <= 6) {
        formateado = `${soloNumeros.slice(0, 3)} ${soloNumeros.slice(3)}`;
      } else if (soloNumeros.length > 6) {
        formateado = `${soloNumeros.slice(0, 3)} ${soloNumeros.slice(3, 6)} ${soloNumeros.slice(6)}`;
      }
      setDatos(prev => ({
        ...prev,
        [name]: formateado,
      }));
      setErrores(prev => ({ ...prev, [name]: false }));
      return;
    }

    setDatos(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrores(prev => ({ ...prev, [name]: false }));
  };

  const handleCheckbox = e => {
  const { name, checked } = e.target;
  setDatos(prev => ({
    ...prev,
    [name]: checked,
    // Si el checkbox es el de guardar datos, actualiza guardarData1
    guardarData1: name === "guardarData1" || (name === "novedades" && e.target.id === "novedades") ? checked : prev.guardarData1,
  }));
  setErrores(prev => ({ ...prev, [name]: false }));
};

  const handleSubmit = async e => {
    e.preventDefault();
    const nuevosErrores = {};
    if (!datos.correo) nuevosErrores.correo = true;
    if (!datos.nombre) nuevosErrores.nombre = true;
    if (!datos.apellidos) nuevosErrores.apellidos = true;
    if (!datos.documento || datos.documento.length !== 8) nuevosErrores.documento = true;
    if (!datos.telefono || datos.telefono.replace(/\D/g, "").length !== 9) nuevosErrores.telefono = true;
    if (!datos.acepta) nuevosErrores.acepta = true;

    setErrores(nuevosErrores);

    if (Object.keys(nuevosErrores).length === 0) {
      try {
        // 1. Obtener el usuarioId
        const userRes = await axios.get(`${API_BASE_BASE}/usuario-id`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usuarioId = userRes.data; // asume que es solo el número

        // 2. Crear la venta
      const ventaRes = await axios.post(`${API_BASE}/venta`, {
        usuarioId,
        estado: "PENDIENTE",
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const ventaId = ventaRes.data.object.id;
      setVentaId(ventaId); // <-- Actualiza el estado en el padre

      // 2.1 Verificar si hay otra venta pendiente
      const segundaPendienteRes = await axios.get(
        `${API_BASE}/venta/segunda-pendiente/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      const otraVentaPendienteId = segundaPendienteRes.data.object;

      // Si existe otra venta pendiente y es diferente a la recién creada, elimínala
      if (otraVentaPendienteId && otraVentaPendienteId !== ventaId) {
        await axios.delete(`${API_BASE}/venta/${otraVentaPendienteId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // 3. Pasar el carrito a venta_detalle
      await axios.post(`${API_BASE}/carritodetalle`, {
        ventaId,
        carritoId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

        // 4. Continuar al siguiente paso
        onContinuar();
      } catch (error) {
        alert("Ocurrió un error al procesar la venta. Intenta nuevamente.");
        console.error(error);
      }
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
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <Typography variant="small" className="font-bold mb-1">Correo</Typography>
          <Input
            type="email"
            name="correo"
            value={datos.correo}
            onChange={handleChange}
            className="w-full"
            required
            error={errores.correo}
            maxLength={100}
          />
        </div>
        <div className="flex gap-4 max-lg:flex-col">
          <div className="flex-1">
            <Typography variant="small" className="font-bold mb-1">Nombre</Typography>
            <Input
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleChange}
              className="w-full"
              required
              error={errores.nombre}
              maxLength={100}
            />
          </div>
          <div className="flex-1">
            <Typography variant="small" className="font-bold mb-1">Apellidos</Typography>
            <Input
              type="text"
              name="apellidos"
              value={datos.apellidos}
              onChange={handleChange}
              className="w-full"
              required
              error={errores.apellidos}
              maxLength={100}
            />
          </div>
        </div>
        <div className="flex gap-4 max-lg:flex-col">
          <div className="flex-1">
            <Typography variant="small" className="font-bold mb-1">Documento de Identidad</Typography>
            <Input
              type="text"
              name="documento"
              value={datos.documento}
              onChange={handleChange}
              className="w-full"
              required
              error={errores.documento}
              inputMode="numeric"
              maxLength={8}
            />
          </div>
          <div className="flex-1">
            <Typography variant="small" className="font-bold mb-1">Teléfono / Móvil</Typography>
            <Input
              type="text"
              name="telefono"
              value={datos.telefono}
              onChange={handleChange}
              className="w-full"
              required
              error={errores.telefono}
              inputMode="numeric"
              maxLength={11} // 9 dígitos + 2 espacios
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex items-center gap-2">
            <Checkbox
              id="guardarData1"
              name="guardarData1"
              checked={!!datos.guardarData1}
              onChange={handleCheckbox}
            >
              <Checkbox.Indicator />
            </Checkbox>
            <Typography
              as="label"
              htmlFor="guardarData1"
              className="cursor-pointer text-foreground"
            >
              Quisiera guardar mis datos para futuras compras.
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="deseaFactura"
              name="deseaFactura"
              checked={!!datos.deseaFactura}
              onChange={handleCheckbox}
            >
              <Checkbox.Indicator />
            </Checkbox>
            <Typography
              as="label"
              htmlFor="deseaFactura"
              className="cursor-pointer text-foreground"
            >
              Deseo factura
            </Typography>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="novedades"
              name="novedades"
              checked={!!datos.novedades}
              onChange={handleCheckbox}
            >
              <Checkbox.Indicator />
            </Checkbox>
            <Typography
              as="label"
              htmlFor="novedades"
              className="cursor-pointer text-foreground"
            >
              Quiero recibir novedades y promociones.
            </Typography>
          </div>
                  <div className="flex items-center gap-2  ">
          <Checkbox
            id="acepta"
            name="acepta"
            checked={!!datos.acepta}
            onChange={handleChange}
            className="max-md:w-8 h-5"
          >
            <Checkbox.Indicator />
          </Checkbox>
          <Typography
            as="label"
            htmlFor="acepta"
            className="cursor-pointer text-foreground "
          >
            <span className="max-md:text-sm">
              Acepto los <a href="#" className="text-blue-600 underline">Términos y Condiciones</a> y la{" "}
              <a href="#" className="text-blue-600 underline">Política de protección de datos personales</a>.
            </span>
          </Typography>
        </div>
        {errores.acepta && (
          <Typography variant="small" color="red" className="ml-1">
            Debes aceptar los términos y condiciones.
          </Typography>
        )}
        </div>
        <Button
          type="submit"
          className="mt-6 w-full font-bold py-3 text-lg bg-red-500 hover:bg-red-600 border-none "
        >
          Continuar
        </Button>
      </form>
    </div>
  );
};

DatosPersonales.propTypes = {
  datos: PropTypes.object.isRequired,
  setDatos: PropTypes.func.isRequired,
  onContinuar: PropTypes.func.isRequired,
};

export default DatosPersonales;