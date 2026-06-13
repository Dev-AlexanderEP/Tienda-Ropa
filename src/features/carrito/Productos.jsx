import { useEffect, useState } from "react";
import { API_BASE_BASE as BASE_URL } from "../../config/api";
import PropTypes from "prop-types";
import { IconButton, Typography, Input, Button } from "@material-tailwind/react";
import { Plus, Minus, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { getUsuarioId } from "../auth/api/userApi";
import {
  getCarrito,
  updateItemCantidad,
  sumarUno,
  restarUno,
  sumarStock,
  deleteCarritoItem,
  aplicarCupon,
} from "./api/carritoApi";

const Productos = ({ carritoId, onNextStep, descuento, setDescuento, total, setTotal }) => {
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cupon, setCupon] = useState("");
  const [totalConDescuento, setTotalConDescuento] = useState(0);
  const [aplicando, setAplicando] = useState(false);

  const fetchCarrito = async () => {
    setLoading(true);
    try {
      const data = await getCarrito(carritoId);
      setCarrito(data);
      const totalSum = data?.carritoItems?.reduce(
        (acc, item) => acc + item.precioUnitario * item.cantidad,
        0
      );
      setTotal(totalSum || 0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!carritoId) return;
    fetchCarrito();
    // eslint-disable-next-line
  }, [carritoId]);

  const handleChangeCantidad = (itemId, cantidad) => {
    if (cantidad < 1) return;
    setCarrito((prev) => {
      if (!prev) return prev;
      return { ...prev, carritoItems: prev.carritoItems.map((item) => item.id === itemId ? { ...item, cantidad } : item) };
    });
    setTotal((prevTotal) => {
      if (!carrito) return prevTotal;
      return carrito.carritoItems
        .map((item) => (item.id === itemId ? { ...item, cantidad } : item))
        .reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
    });
    updateItemCantidad(itemId, cantidad).catch(() => fetchCarrito());
  };

  const handleRestarUno = async (item) => {
    if (item.cantidad <= 1) return;
    try {
      const data = await sumarUno(item.prenda.id, item.talla.id);
      if (!data.object) {
        Swal.fire("Sin stock", data.mensaje || "No hay stock suficiente.", "warning");
        return;
      }
      handleChangeCantidad(item.id, item.cantidad - 1);
    } catch {
      Swal.fire("Error", "No se pudo actualizar el stock.", "error");
    }
  };

  const handleSumarUno = async (item) => {
    try {
      const data = await restarUno(item.prenda.id, item.talla.id);
      if (!data.object) {
        Swal.fire("Sin stock", data.mensaje || "No hay stock suficiente.", "warning");
        return;
      }
      handleChangeCantidad(item.id, item.cantidad + 1);
    } catch {
      Swal.fire("Error", "No se pudo actualizar el stock.", "error");
    }
  };

  const handleAplicarCupon = async () => {
    setAplicando(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Swal.fire("Error", "No hay sesión activa.", "error");
        return;
      }
      const usuarioId = await getUsuarioId();
      const data = await aplicarCupon(usuarioId, cupon);
      if (!data.object) {
        Swal.fire("Cupón inválido", data.mensaje || "Cupón inválido", "error");
        return;
      }
      setDescuento(data.object);
      Swal.fire("Cupón aplicado", `Descuento: ${data.object.porcentaje}%`, "success");
      setTotalConDescuento(total - (total * data.object.porcentaje) / 100);
    } catch {
      Swal.fire("Error", "Error al aplicar cupón", "error");
    }
    setAplicando(false);
  };

  const handleEliminarItem = (itemId, item) => {
    Swal.fire({
      title: "¿Eliminar producto?",
      text: "¿Estás seguro de que deseas eliminar este producto del carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await sumarStock(item.prenda.id, item.talla.id, item.cantidad);
          await deleteCarritoItem(itemId);
          fetchCarrito();
          Swal.fire("Eliminado", "El producto fue eliminado del carrito.", "success");
        } catch {
          Swal.fire("Error", "No se pudo eliminar el producto.", "error");
        }
      }
    });
  };

  useEffect(() => {
    if (descuento) {
      setTotalConDescuento(total - (total * descuento.porcentaje) / 100);
    } else {
      setTotalConDescuento(total);
    }
  }, [total, descuento]);

  if (loading) return <div>Cargando productos...</div>;
  if (!carrito) return <div>No se encontró el carrito.</div>;

  return (
    <div className="w-full mt-6 flex px-[10%] gap-10 max-xl:flex-col max-md:px-[5%]">
      <div className="w-[65%] max-xl:w-[100%]">
        <table className="w-full text-left">
          <thead>
            <tr className="text-base font-semibold">
              <th className="py-2 text-center">Prenda</th>
              <th className="py-2 text-center">Precio</th>
              <th className="py-2 text-center">Cantidad</th>
              <th className="py-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {carrito.carritoItems.map((item) => (
              <tr key={item.id} className="align-middle">
                <td className="py-4 border-b border-slate-600">
                  <div className="flex items-center flex-col gap-4">
                    <img
                      src={`${BASE_URL}/${item.prenda.imagen.principal}`}
                      alt={item.prenda.nombre}
                      className="w-16 h-20 object-cover rounded max-sm:hidden"
                    />
                    <div>
                      <div className="font-semibold">{item.prenda.nombre}</div>
                      <div className="text-xs text-gray-500">
                        Talla: {item.talla.nomTalla} | Marca: {item.prenda.marca.nomMarca}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 border-b border-slate-600 w-[100px]">
                  {item.prenda.precio !== item.precioUnitario ? (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-gray-500 line-through text-sm block">
                        S/ {item.prenda.precio.toFixed(2)}
                      </span>
                      <span className="text-red-600 font-bold">S/ {item.precioUnitario.toFixed(2)}</span>
                    </div>
                  ) : (
                    <span className="text-blue-700 font-bold">S/ {item.precioUnitario.toFixed(2)}</span>
                  )}
                </td>
                <td className="py-4 border-b border-slate-600">
                  <div className="flex items-center gap-2 justify-center">
                    <IconButton className="bg-gray-200 hover:bg-gray-100" size="sm" onClick={() => handleRestarUno(item)}>
                      <Minus className="h-4 w-4 stroke-2 stroke-black" />
                    </IconButton>
                    <span className="w-8 text-center">{item.cantidad}</span>
                    <IconButton className="bg-gray-200 hover:bg-gray-100" size="sm" onClick={() => handleSumarUno(item)}>
                      <Plus className="h-4 w-4 stroke-2 stroke-black" />
                    </IconButton>
                  </div>
                </td>
                <td className="py-4 border-b border-slate-600 text-center w-[130px]">
                  <span className="text-green-700 font-bold">
                    S/ {(item.precioUnitario * item.cantidad).toFixed(2)}
                  </span>
                </td>
                <td className="py-4 border-b border-slate-600 text-center cursor-pointer">
                  <Trash2 className="stroke-red-600 w-8 h-18" onClick={() => handleEliminarItem(item.id, item)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-[35%] h-[400px] flex flex-col justify-start items-center max-xl:w-[100%] max-xl:h-auto">
        <div className="w-full bg-white rounded-lg shadow p-5 mt-2">
          <div className="flex mb-4">
            <Input
              type="text"
              placeholder="Cupón de descuento"
              value={cupon}
              onChange={(e) => setCupon(e.target.value)}
              className="rounded-none rounded-l"
              labelProps={{ className: "hidden" }}
              containerProps={{ className: "min-w-0 flex-1" }}
              disabled={aplicando}
            />
            <Button
              className="rounded-none rounded-r px-5 py-2 font-semibold bg-black text-white hover:bg-gray-900"
              onClick={handleAplicarCupon}
              disabled={aplicando || !cupon}
            >
              {aplicando ? "Aplicando..." : "Agregar"}
            </Button>
          </div>
          {descuento && (
            <div className="mb-2 text-center text-green-700 font-semibold">
              Descuento aplicado: {descuento.porcentaje}% ({descuento.descripcion})
            </div>
          )}
          <hr className="my-4" />
          <div>
            <h3 className="font-bold text-lg text-center mb-4">Resumen de compra</h3>
            <div className="flex justify-between mb-2">
              <span>Subtotal</span>
              <span className="font-bold text-gray-800">S/ {total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Gastos del envío</span>
              <span className="font-bold text-green-700">Gratis</span>
            </div>
            <hr className="my-4" />
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-red-600 text-lg">
                S/ {totalConDescuento ? totalConDescuento.toFixed(2) : total.toFixed(2)}
              </span>
            </div>
            <Button
              variant="outline"
              className="w-full border border-red-500 text-black hover:bg-red-500 hover:text-white font-bold py-3 rounded text-lg transition"
              onClick={onNextStep}
            >
              Ir a comprar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

Productos.propTypes = {
  carritoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onNextStep: PropTypes.func,
  descuento: PropTypes.object,
  setDescuento: PropTypes.func,
  total: PropTypes.number,
  setTotal: PropTypes.func,
};

export default Productos;
