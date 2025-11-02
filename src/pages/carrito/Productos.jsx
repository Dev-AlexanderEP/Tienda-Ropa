import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Typography, Input, Button   } from "@material-tailwind/react";
import { Plus, Minus,Trash2  } from "lucide-react";
import Swal from "sweetalert2";
// const API_URL = "http://localhost:8080/api/v1/carrito/";
// const API_ITEM_URL = "http://localhost:8080/api/v1/carrito-item/";
// const API_APLICAR = "http://localhost:8080/api/v1/aplicar";
// const API_USUARIO_ID = "http://localhost:8080/usuario-id";
// const API_BASE = "http://localhost:8080/api/v1";

const API_URL = "https://mixmatch.zapto.org/api/v1/carrito/";
const API_ITEM_URL = "https://mixmatch.zapto.org/api/v1/carrito-item/";
const API_APLICAR = "https://mixmatch.zapto.org/api/v1/aplicar";
const API_USUARIO_ID = "https://mixmatch.zapto.org/usuario-id";
const API_BASE = "https://mixmatch.zapto.org/api/v1";

const Productos = ({ carritoId, onNextStep, descuento, setDescuento , total, setTotal }) => {
  const [carrito, setCarrito] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [total, setTotal] = useState(0);
   const [cupon, setCupon] = useState("");
  const [totalConDescuento, setTotalConDescuento] = useState(0);
  const [aplicando, setAplicando] = useState(false);
  const [mensajeCupon, setMensajeCupon] = useState("");
        const token = localStorage.getItem('accessToken'); // o sessionStorage.getItem('token')

  // Actualiza el carrito y el total
  const fetchCarrito = () => {
    setLoading(true);
    fetch(`${API_URL}${carritoId}`, {
      headers: {
        'Authorization': token ? `Bearer ${token}` : ''
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setCarrito(data.object);
        const totalSum = data.object?.carritoItems?.reduce(
          (acc, item) => acc + (item.precioUnitario * item.cantidad),
          0
        );
        setTotal(totalSum || 0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!carritoId) return;
    fetchCarrito();
    // eslint-disable-next-line
  }, [carritoId]);

  // Cambia la cantidad de un item
  const handleChangeCantidad = (itemId, cantidad) => {
  if (cantidad < 1) return;

  // 1. Actualización optimista del estado local
  setCarrito((prev) => {
    if (!prev) return prev;
    const newItems = prev.carritoItems.map((item) =>
      item.id === itemId ? { ...item, cantidad } : item
    );
    return { ...prev, carritoItems: newItems };
  });
  setTotal((prevTotal) => {
    if (!carrito) return prevTotal;
    const newItems = carrito.carritoItems.map((item) =>
      item.id === itemId ? { ...item, cantidad } : item
    );
    return newItems.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
  });

  // 2. Llama a la API para actualizar en backend
  fetch(`${API_ITEM_URL}${itemId}/cantidad?cantidad=${cantidad}`, {
    method: "PUT",
    headers: {
      'Authorization': token ? `Bearer ${token}` : ''
    }
  })
    .then((res) => {
      if (!res.ok) throw new Error("Error al actualizar cantidad");
      return res.json();
    })
    .then(() => {
      // Si quieres, puedes volver a sincronizar con el backend aquí
      // fetchCarrito();
    })
    .catch(() => {
      // Si falla, recarga el carrito para mantener consistencia
      fetchCarrito();
    });
};

const handleRestarUno = async (item) => {
  if (item.cantidad <= 1) return;
  try {
    const res = await fetch(
      `${API_BASE}/sumar-uno?prendaId=${item.prenda.id}&tallaId=${item.talla.id}`,
      { method: "PUT", headers: { 'Authorization': token ? `Bearer ${token}` : '' } }
    );
    const data = await res.json();
    if (!res.ok || !data.object) {
      Swal.fire("Sin stock", data.mensaje || "No hay stock suficiente.", "warning");
      return;
    }
    handleChangeCantidad(item.id, item.cantidad - 1);
  } catch (e) {
    Swal.fire("Error", "No se pudo actualizar el stock.", "error");
  }
};

const handleSumarUno = async (item) => {
  try {
    const res = await fetch(
      `${API_BASE}/restar-uno?prendaId=${item.prenda.id}&tallaId=${item.talla.id}`,
      { method: "PUT", headers: { 'Authorization': token ? `Bearer ${token}` : '' } }
    );
    const data = await res.json();
    if (!res.ok || !data.object) {
      Swal.fire("Sin stock", data.mensaje || "No hay stock suficiente.", "warning");
      return;
    }
    handleChangeCantidad(item.id, item.cantidad + 1);
  } catch (e) {
    Swal.fire("Error", "No se pudo actualizar el stock.", "error");
  }
};


// Aplica el cupón de descuento
 const handleAplicarCupon = async () => {
    setAplicando(true);
    try {
      // 1. Obtener el token del localStorage
      const token = localStorage.getItem("accessToken");
      if (!token) {
        Swal.fire("Error", "No hay sesión activa.", "error");
        setAplicando(false);
        return;
      }
      // 2. Obtener el usuarioId
      const resId = await fetch(API_USUARIO_ID, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!resId.ok) throw new Error("No se pudo obtener el usuario");
      const usuarioId = await resId.text();

      // 3. Enviar el cupón
      const resCupon = await fetch(API_APLICAR, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          usuarioId: Number(usuarioId),
          codigo: cupon,
        }),
      });
      const data = await resCupon.json();
      if (!resCupon.ok || !data.object) {
        Swal.fire("Cupón inválido", data.mensaje || "Cupón inválido", "error");
        setAplicando(false);
        return;
      }
      setDescuento(data.object);
      Swal.fire(
        "Cupón aplicado",
        `Cupón aplicado: ${data.object.porcentaje}% de descuento`,
        "success"
      );
      // Aplica el descuento al total
      const nuevoTotal = total - (total * data.object.porcentaje / 100);
      setTotalConDescuento(nuevoTotal);
    } catch (e) {
      Swal.fire("Error", "Error al aplicar cupón", "error");
    }
    setAplicando(false);
  };

  useEffect(() => {
    // Si cambia el total o el descuento, recalcula el total con descuento
    if (descuento) {
      const nuevoTotal = total - (total * descuento.porcentaje / 100);
      setTotalConDescuento(nuevoTotal);
    } else {
      setTotalConDescuento(total);
    }
  }, [total, descuento]);

  if (loading) return <div>Cargando productos...</div>;
  if (!carrito) return <div>No se encontró el carrito.</div>;

    const handleEliminarItem = (itemId, item) => {
    Swal.fire({
      title: "¿Eliminar producto?",
      text: "¿Estás seguro de que deseas eliminar este producto del carrito?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // 1. Sumar el stock al eliminar el item del carrito
          await fetch(
            `${API_BASE}/sumar?prendaId=${item.prenda.id}&tallaId=${item.talla.id}&cantidad=${item.cantidad}`,
            { method: "PUT", headers: { 'Authorization': token ? `Bearer ${token}` : '' } }
          );
          // 2. Eliminar el item del carrito
          const res = await fetch(`${API_ITEM_URL}${itemId}`, {
            method: "DELETE",
            headers: { 'Authorization': token ? `Bearer ${token}` : '' }
          });
          if (!res.ok) throw new Error("No se pudo eliminar el producto");
          // Actualiza la vista recargando el carrito
          fetchCarrito();
          Swal.fire("Eliminado", "El producto fue eliminado del carrito.", "success");
        } catch (error) {
          Swal.fire("Error", "No se pudo eliminar el producto.", "error");
        }
      }
    });
  };

  return (
    <>
        <div className="w-full mt-6 flex px-[10%] gap-10  max-xl:flex-col  max-md:px-[5%]">
            <div className="w-[65%] max-xl:w-[100%]">
                <table className="w-full text-left   ">
                    <thead>
                    <tr className="text-base font-semibold">
                        <th className="py-2 text-center ">Prenda</th>
                        <th className="py-2 text-center ">Precio</th>
                        <th className="py-2 text-center ">Cantidad</th>
                        <th className="py-2 text-center ">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {carrito.carritoItems.map((item) => (
                        <tr key={item.id} className="align-middle">
                        {/* Prenda */}
                        <td className="py-4 border-b border-slate-600 ">
                            <div className="flex items-center flex-col gap-4">
                            <img
                                src={`http://localhost:8080/${item.prenda.imagen.principal}`}
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
                        {/* Precio */}
                        <td className="py-4 border-b border-slate-600 w-[100px] ">
                            {item.prenda.precio !== item.precioUnitario ? (
                            <div className="flex flex-col items-center justify-center ">
                                <span className="text-gray-500 line-through text-sm block">
                                S/ {item.prenda.precio.toFixed(2)}
                                </span>
                                <span className="text-red-600 font-bold">
                                S/ {item.precioUnitario.toFixed(2)}
                                </span>
                            </div>
                            ) : (
                            <span className="text-blue-700 font-bold">
                                S/ {item.precioUnitario.toFixed(2)}
                            </span>
                            )}
                        </td>
                        {/* Cantidad */}
                        <td className="py-4 border-b border-slate-600">
                            <div className="flex items-center gap-2 justify-center">
                            <IconButton className="bg-gray-200 hover:bg-gray-100" size="sm"
                                                    onClick={() => {
                                                      handleRestarUno(item);
                                                    }}
>
                                <Minus className="h-4 w-4 stroke-2 stroke-black" />
                            </IconButton>
                            <span className="w-8 text-center">{item.cantidad}</span>
                            <IconButton className="bg-gray-200 hover:bg-gray-100" size="sm"
                            onClick={() => {
                              handleSumarUno(item);
                            }}
>
                                <Plus className="h-4 w-4 stroke-2 stroke-black" />
                            </IconButton>
                            </div>
                        </td>
                        {/* Total */}
                        <td className="py-4 border-b border-slate-600 text-center w-[130px]">
                            <span className="text-green-700 font-bold">
                            S/ {(item.precioUnitario * item.cantidad).toFixed(2)}
                            </span>
                        </td>
                        <td className="py-4 border-b border-slate-600  text-center cursor-pointer ">
                          <Trash2
                            className="stroke-red-600 w-8 h-18"
                              onClick={() => handleEliminarItem(item.id, item)}

                          />
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>
            <div className="w-[35%] h-[400px] flex flex-col justify-start items-center max-xl:w-[100%] max-xl:h-auto">
  <div className="w-full mbg-white rounded-lg shadow p-5 mt-2">
    {/* Cupón */}
        <div className="flex mb-4">
            <Input
              type="text"
              placeholder="Cupón de descuento"
              value={cupon}
              onChange={e => setCupon(e.target.value)}
              className="rounded-none rounded-l "
              labelProps={{
                className: "hidden",
              }}
              containerProps={{
                className: "min-w-0 flex-1",
              }}
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
          {/* Ya no se muestran mensajes aquí, solo SweetAlert */}
          {descuento && (
            <div className="mb-2 text-center text-green-700 font-semibold">
              Descuento aplicado: {descuento.porcentaje}% ({descuento.descripcion})
            </div>
          )}
    <hr className="my-4" />
    {/* Resumen */}
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
{/*             
        <div className="mt-6 text-right text-xl font-bold">
            Total: <span className="text-green-600">S/ {total.toFixed(2)}</span>
        </div> */}
        </div>
    </>
  );
};

Productos.propTypes = {
  carritoId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onNextStep: PropTypes.func, // <-- Añade esto
};

export default Productos;