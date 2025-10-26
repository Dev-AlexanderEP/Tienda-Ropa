import { useEffect, useState } from "react";
import PropTypes from "prop-types";

const ResumenCompra = ({ carritoId, descuento, onNextStep }) => {
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8080/api/v1/carrito/${carritoId}`)
      .then(res => res.json())
      .then(data => setCarrito(data.object))
      .finally(() => setLoading(false));
  }, [carritoId]);

  if (loading) return <div>Cargando...</div>;
  if (!carrito) return <div>No se encontró el carrito.</div>;

  const subtotal = carrito.carritoItems.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
  const descuentoValor = descuento ? subtotal * (descuento.porcentaje / 100) : 0;
  const total = subtotal - descuentoValor;

  return (
    <div className="bg-white rounded-lg p-6 shadow w-full ">
      <h3 className="font-bold text-xl text-center mb-4">Resumen de la compra</h3>
      <div className="mb-4">
        {carrito.carritoItems.map(item => (
          <div key={item.id} className="flex items-center gap-2 mb-2">
            <img src={`http://localhost:8080/${item.prenda.imagen.principal}`} alt={item.prenda.nombre} className="w-10 h-12 object-cover rounded" />
            <div>
              <div className="font-semibold text-sm">{item.prenda.nombre} {item.talla.nomTalla && <span className="text-xs">({item.talla.nomTalla})</span>}</div>
              <div className="text-xs text-gray-500">Cantidad: {item.cantidad}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mb-1">
        <span>Subtotal</span>
        <span className="font-bold">S/ {subtotal.toFixed(2)}</span>
      </div>
      {descuento && (
        <div className="flex justify-between mb-1">
          <span>Descuentos</span>
          <span className="font-bold text-green-700">S/ -{descuentoValor.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between mb-1">
        <span>Gastos del envío</span>
        <span className="font-bold text-green-700">Gratis</span>
      </div>
      <hr className="my-2" />
      <div className="flex justify-between mb-2 text-lg font-bold">
        <span>Total</span>
        <span className="text-red-600">S/ {total.toFixed(2)}</span>
      </div>
      <div className="text-right">
        <button
          type="button"
          className="text-blue-600 text-xs underline"
          onClick={() => onNextStep && onNextStep()}
        >
          Volver a carrito
        </button>
      </div>
    </div>
  );
};

ResumenCompra.propTypes = {
  carritoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  descuento: PropTypes.object,
  onNextStep: PropTypes.func,
};

export default ResumenCompra;