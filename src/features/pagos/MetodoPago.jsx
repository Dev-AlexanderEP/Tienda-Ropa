import { useEffect, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { getMetodosPago } from "./api/pagosApi";
import { TipoPago } from "./dto/pago.schema";
import PaypalCardForm from "./PaypalCardForm";
import FormCreditCart from "./FormCreditCart";
import MercadoPagoBrick from "./MercadoPagoBrick";

const renderContenido = (metodo, { total, ventaId, carritoId, datos }) => {
  switch (metodo.tipoPago) {
    case TipoPago.PAYPAL:
      return (
        <PaypalCardForm
          key={metodo.id}
          amount={total}
          ventaId={ventaId}
          metodoId={metodo.id}
          carritoId={carritoId}
          datos={datos}
        />
      );
    case TipoPago.TARJETA_CREDITO:
      return <FormCreditCart amount={total} ventaId={ventaId} metodoId={metodo.id} carritoId={carritoId} datos={datos} />;
    case TipoPago.MERCADO_PAGO:
      return (
        <MercadoPagoBrick
          key={metodo.id}
          amount={total}
          ventaId={ventaId}
          metodoId={metodo.id}
          carritoId={carritoId}
          datos={datos}
        />
      );
    case TipoPago.YAPE:
      return <p className="mt-4 text-gray-500 font-Poppins">Próximamente disponible.</p>;
    default:
      return null;
  }
};

const MetodoPago = ({ onSeleccionar, total, ventaId, carritoId, datos }) => {
  const [metodos, setMetodos] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);

  useEffect(() => {
    getMetodosPago()
      .then((lista) => {
        setMetodos(lista);
        if (lista.length > 0) setSeleccionado(lista[0]);
      })
      .catch(() => setMetodos([]));
  }, []);

  const handleMetodoClick = (metodo) => {
    setSeleccionado(metodo);
    if (onSeleccionar) onSeleccionar(metodo);
  };

  return (
    <div className="w-[600px] items-center gap-6 p-8 border border-gray-200 h-full max-lg:w-auto">
      <div className="flex items-center gap-3 mb-6">
        <Typography className="font-bold font-Poppins text-3xl">Metodo de Pago</Typography>
      </div>
      <hr className="mb-6 border-b border-gray-400" />
      {metodos.length === 0 ? (
        <p className="text-gray-500 font-Poppins">Cargando métodos de pago...</p>
      ) : (
        <div className="flex gap-4 w-full">
          {metodos.map((metodo) => (
            <Button
              key={metodo.id}
              onClick={() => handleMetodoClick(metodo)}
              className={`w-full font-Poppins ${seleccionado?.id === metodo.id ? "bg-red-500" : "bg-gray-800"}`}
            >
              {metodo.tipoPago}
            </Button>
          ))}
        </div>
      )}
      {seleccionado && renderContenido(seleccionado, { total, ventaId, carritoId, datos })}
    </div>
  );
};

export default MetodoPago;
