import { useState, useEffect } from "react";
import { Typography, Input, Textarea, Button, Checkbox } from "@material-tailwind/react";
import departamentosData from "./departamentos.json";
import provinciasData from "./provincias.json";
import distritosData from "./distritos.json";

const Direccion = ({ datos, setDatos, onContinuar }) => {
  const [departamentos, setDepartamentos] = useState([]);
  const [provincias, setProvincias] = useState([]);
  const [distritos, setDistritos] = useState([]);

  useEffect(() => {
    setDepartamentos(departamentosData);
  }, []);

  useEffect(() => {
  if (datos.departamento) {
    const depObj = provinciasData.find(
      dep => dep.departamento_id === datos.departamento
    );
    setProvincias(depObj ? depObj.provincias : []);
    // Solo limpia si la provincia actual no pertenece al nuevo departamento
    if (!depObj?.provincias.some(p => p.id === datos.provincia)) {
      setDatos(prev => ({
        ...prev,
        provincia: "",
        distrito: ""
      }));
      setDistritos([]);
    }
  } else {
    setProvincias([]);
    setDistritos([]);
    setDatos(prev => ({
      ...prev,
      provincia: "",
      distrito: ""
    }));
  }
  // eslint-disable-next-line
}, [datos.departamento]);

useEffect(() => {
  if (datos.provincia) {
    let distritoList = [];
    for (const grupo of distritosData) {
      const provObj = grupo.find(
        prov => prov.provincia_id === datos.provincia
      );
      if (provObj) {
        distritoList = provObj.distritos;
        break;
      }
    }
    setDistritos(distritoList || []);
    // Solo limpia si el distrito actual no pertenece a la nueva provincia
    if (!distritoList.some(d => d.id === datos.distrito)) {
      setDatos(prev => ({
        ...prev,
        distrito: ""
      }));
    }
  } else {
    setDistritos([]);
    setDatos(prev => ({
      ...prev,
      distrito: ""
    }));
  }
  // eslint-disable-next-line
}, [datos.provincia]);

  const handleChange = e => {
    const { name, value } = e.target;
    setDatos(prev => ({
      ...prev,
      [name]: value,
      ...(name === "departamento" ? { provincia: "", distrito: "" } : {}),
      ...(name === "provincia" ? { distrito: "" } : {}),
    }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (onContinuar) onContinuar();
  };

  const handleCheckbox = e => {
  const { name, checked } = e.target;
  setDatos(prev => ({
    ...prev,
    [name]: checked,
  }));
};

  return (
    <>
    <div className="w-[600px] border border-gray-200 p-5 max-lg:w-auto">
        <div className="flex items-center gap-3 mb-6">
          <Typography className="font-bold font-Poppins text-3xl">Datos de entrega</Typography>
        </div>
        <hr className="mb-6 border-b border-gray-400" />
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Typography variant="small" className="font-bold mb-1 font-Poppins">Departamento</Typography>
            <select
              name="departamento"
              value={datos.departamento}
              onChange={handleChange}
              className="w-full border rounded p-2"
            >
              <option value="" className="font-Poppins">Seleccione departamento</option>
              {departamentos.map(dep => (
                <option key={dep.id} value={dep.id} className="font-Poppins">
                  {dep.nombre}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Typography variant="small" className="font-bold mb-1 font-Poppins">Provincia</Typography>
            <select
              name="provincia"
              value={datos.provincia}
              onChange={handleChange}
              className="w-full border rounded p-2"
              disabled={!datos.departamento}
            >
              <option value="" className="font-Poppins">Seleccione provincia</option>
              {provincias.map(prov => (
                <option key={prov.id} value={prov.id} className="font-Poppins">{prov.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <Typography variant="small" className="font-bold mb-1 font-Poppins">Distrito</Typography>
            <select
              name="distrito"
              value={datos.distrito}
              onChange={handleChange}
              className="w-full border rounded p-2"
              disabled={!datos.provincia}
            >
              <option value="" className="font-Poppins">Seleccione distrito</option>
              {distritos.map(dist => (
                <option key={dist.id} value={dist.id} className="font-Poppins">{dist.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <Typography variant="small" className="font-bold mb-1 font-Poppins">Calle</Typography>
            <Input
              type="text"
              name="calle"
              value={datos.calle}
              onChange={handleChange}
              className="w-full font-Poppins"
              maxLength={100}
            />
          </div>
          <div>
            <Typography variant="small" className="font-bold mb-1 font-Poppins">Más detalles</Typography>
            <Textarea
              name="detalle"
              value={datos.detalle}
              onChange={handleChange}
              className="w-full resize-none font-Poppins"
              rows={3}
              maxLength={200}
            />
          </div>
         <div className="flex items-center gap-2">
            <Checkbox
              id="guardarData2"
              name="guardarData2"
              checked={!!datos.guardarData2}
              onChange={handleCheckbox}
            >
              <Checkbox.Indicator />
            </Checkbox>
            <Typography
              as="label"
              htmlFor="guardarData2"
              className="cursor-pointer text-foreground font-Poppins"
            >
              Quisiera guardar mis datos para futuras compras.
            </Typography>
          </div>
          <Button
            type="submit"
            className="w-full font-bold py-3 text-lg bg-red-500 hover:bg-red-600 border-none"
          >
            Continuar
          </Button>
        </form>

    </div>
    </>
  );
};

export default Direccion;