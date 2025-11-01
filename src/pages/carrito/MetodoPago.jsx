import { useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import axios from "axios";
import PaypalButton from "./pagos/PaypalButton";
import FormCreditCart from "./pagos/FormCreditCart";

const MetodoPago = ({ onSeleccionar, total, ventaId, carritoId, datos }) => {
  const [metodos, setMetodos] = useState([]);
  const [contenidoExtra, setContenidoExtra] = useState(
    <FormCreditCart amount={total} ventaId={ventaId} metodoId={3} carritoId={carritoId} datos={datos} />
  );
        const token = localStorage.getItem('accessToken'); // o sessionStorage.getItem('token')

  useEffect(() => {
    axios.get("http://localhost:8080/api/v1/metodo-pagos", {
      headers: { 'Authorization': token ? `Bearer ${token}` : '' }
    })
      .then(res => setMetodos(res.data.object || []))
      .catch(() => setMetodos([]));
  }, []);

  const handleMetodoClick = (metodo) => {
    if (metodo.tipoPago.toLowerCase().includes("paypal")) {
      setContenidoExtra(
        <div className="w-full mt-4">
          <PaypalButton amount={total} onSuccess={details => {
            alert("Pago realizado con éxito. ID: " + details.id);
          }} ventaId={ventaId} metodoId={metodo.id} carritoId={carritoId} datos={datos} />
        </div>
      );
    } else if (metodo.tipoPago.toLowerCase().includes("tarjeta")) {
      setContenidoExtra(
        <FormCreditCart amount={total} ventaId={ventaId} metodoId={metodo.id} />
      );
    } else {
      setContenidoExtra(null);
    }
    if (onSeleccionar) onSeleccionar(metodo);
  };
 
  return (
    <div className="w-[600px] items-center gap-6 p-8 border border-gray-200 h-full max-lg:w-auto">
      <div className="flex items-center gap-3 mb-6">
        <Typography className="font-bold font-Poppins text-3xl">Metodo de Pago</Typography>
      </div>
      <hr className="mb-6 border-b border-gray-400" />
      <div className="flex gap-4 w-full ">
        {metodos.map(metodo => (
          <Button
            key={metodo.id}
            onClick={() => handleMetodoClick(metodo)}
            className="w-full font-Poppins"
          >
            {metodo.tipoPago}
          </Button>
        ))}
      </div>
      {contenidoExtra}
    </div>
  );
};

export default MetodoPago;