import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const API_BASE = "https://mixmatch.zapto.org/api/v1";
const API_BASE_BASE = "https://mixmatch.zapto.org";

export default function Frame3() {
  const [hovered, setHovered] = useState(null);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTallas, setSelectedTallas] = useState({}); // {productoId: tallaId}
  const navigate = useNavigate();

  // Responsive: mostrar 3 en desktop, 1 en md y menos
  const [cardsPerView, setCardsPerView] = useState(3);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 768) {
        setCardsPerView(1);
      } else {
        setCardsPerView(3);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cargar productos desde la API (Novedades - Hombre)
  useEffect(() => {
    const fetchNovedades = async () => {
      try {
        // Usamos la API de prendas filtradas para "hombre"
        const res = await fetch(`${API_BASE}/prendas/descuentos-aplicados-por-genero/hombre`);
        const data = await res.json();
        if (data.object && Array.isArray(data.object)) {
          // Limitamos a 12 productos para el carrusel
          setProductos(data.object.slice(0, 12));
        } else {
          setProductos([]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar novedades:", error);
        setProductos([]);
        setLoading(false);
      }
    };

    fetchNovedades();
  }, []);

  const tallasVariants = {
    initial: { opacity: 0, y: 30 },
    hover: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.18 },
    },
    exit: { opacity: 0, y: 30 },
  };

  const carouselVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      position: "absolute",
      width: "100%",
      display: "flex",
      gap: "2rem",
    }),
    animate: {
      x: 0,
      opacity: 1,
      position: "relative",
      width: "100%",
      display: "flex",
      gap: "2rem",
      transition: { type: "spring", stiffness: 70, damping: 18 },
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      position: "absolute",
      width: "100%",
      display: "flex",
      gap: "2rem",
      transition: { duration: 0.23 },
    }),
  };

  const TOTAL = productos.length;

  // LOOPING LOGIC
  const handlePrev = () => {
    setDirection(-1);
    if (index === 0) {
      setIndex(TOTAL - cardsPerView);
    } else {
      setIndex(index - cardsPerView);
    }
  };

  const handleNext = () => {
    setDirection(1);
    if (index + cardsPerView >= TOTAL) {
      setIndex(0);
    } else {
      setIndex(index + cardsPerView);
    }
  };

  // Función para verificar si hay usuario logeado
  const isUserLoggedIn = () => {
    return !!localStorage.getItem("accessToken");
  };

  // Función para agregar al carrito
  const handleAddToCart = async (producto) => {
    const selectedTalla = selectedTallas[producto.id];

    if (!selectedTalla) {
      Swal.fire({
        icon: "warning",
        title: "Selecciona una talla",
        text: "Por favor, selecciona una talla antes de agregar al carrito.",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    if (!isUserLoggedIn()) {
      localStorage.setItem("redirectAfterLogin", window.location.pathname + window.location.search);
      Swal.fire({
        icon: "info",
        title: "Necesitas logearte",
        text: "Por favor, inicia sesión para agregar productos al carrito.",
        showConfirmButton: false,
        timer: 2000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
      return;
    }

    try {
      const token = localStorage.getItem("accessToken");
      if (!token) throw new Error("No hay token de acceso");

      // 1. Obtener usuarioId
      const userRes = await axios.get(`${API_BASE_BASE}/usuario-id`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usuarioId = userRes.data;

      let carritoId;
      const abiertoRes = await axios.get(`${API_BASE}/carrito/abierto/usuario/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (abiertoRes.data.object && abiertoRes.data.object.length > 0) {
        carritoId = abiertoRes.data.object[0].id;
        console.log("Carrito abierto encontrado:", carritoId);
      } else {
        // Si no hay, crear uno nuevo
        const carritoRes = await axios.post(
          `${API_BASE}/carrito`,
          { usuarioId, estado: "ABIERTO" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        carritoId = carritoRes.data.object.id;
      }
      localStorage.setItem("carritoId", carritoId);

      try {
        console.log("selectedTalla (debe ser id):", selectedTalla);

        // 1. Intentar incrementar cantidad si el item ya existe
        await axios.post(`${API_BASE}/carrito-item/agregar`, null, {
          params: {
            carritoId,
            prendaId: Number(producto.id),
            tallaId: selectedTalla,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire({
          icon: "success",
          title: "Cantidad incrementada",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch {
        // Si no existe el item, lo creamos
        const precioConDescuento = (producto.precio * (1 - producto.descuentoAplicado / 100)).toFixed(2);

        // Buscar el nombre de la talla
        const tallaObj = producto.tallas?.find((t) => t.talla.id === selectedTalla);
        const tallaNombre = tallaObj ? tallaObj.talla.nomTalla : "";

        await axios.post(
          `${API_BASE}/carrito-item`,
          {
            carritoId,
            prendaId: Number(producto.id),
            talla: tallaNombre,
            cantidad: 1,
            precioUnitario: Number(precioConDescuento),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        handleRestarUno(producto.id, selectedTalla);
        Swal.fire({
          icon: "success",
          title: "Producto agregado al carrito",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      // ACTUALIZA EL CONTADOR DEL CARRITO AQUÍ
      const cantidadRes = await axios.get(`${API_BASE}/carrito/${carritoId}/cantidad-items`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Cantidad de items en el carrito:", cantidadRes.data);
      const cantidad = cantidadRes.data.object;
      localStorage.setItem("cartCount", String(cantidad || 0));
      window.dispatchEvent(new Event("cart-updated"));
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo agregar el producto al carrito.",
      });
      console.error(error);
    }
  };

  const handleRestarUno = async (prendaId, tallaId) => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_BASE}/restar-uno?prendaId=${prendaId}&tallaId=${tallaId}`, {
        method: "PUT",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      const data = await res.json();
      if (!res.ok || !data.object) {
        Swal.fire("Sin stock", data.mensaje || "No hay stock suficiente.", "warning");
        return;
      }
    } catch {
      Swal.fire("Error", "No se pudo actualizar el stock.", "error");
    }
  };

  // Función para seleccionar talla
  const handleSelectTalla = (productoId, tallaId) => {
    setSelectedTallas((prev) => ({
      ...prev,
      [productoId]: tallaId,
    }));
  };

  // Mostrar sólo los necesarios (loop seguro)
  let visibleProducts = [];
  if (TOTAL > 0) {
    for (let i = 0; i < cardsPerView; i++) {
      visibleProducts.push(productos[(index + i) % TOTAL]);
    }
  }

  if (loading) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <span className="text-2xl font-bold font-[Poppins] text-[#222]">Cargando novedades...</span>
      </div>
    );
  }

  if (productos.length === 0) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <span className="text-2xl font-bold font-[Poppins] text-[#222]">No hay novedades disponibles</span>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-white px-0 pt-6 relative overflow-x-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-4 md:px-10">
        <span className="text-3xl font-bold font-[Poppins] text-[#222]">Novedades Hombre</span>
        <a
          href="/hombre"
          className="text-sm font-[Poppins] font-semibold text-black hover:underline flex items-center gap-1"
        >
          VER TODO <span className="text-lg">&#8594;</span>
        </a>
      </div>

      {/* Product Cards Carousel */}
      <div className="flex items-stretch gap-4 md:gap-8 px-4 md:px-10 pt-4 h-[calc(100%-3.5rem)] w-full relative">
        {/* Left Arrow */}
        <button
          className="absolute left-2 top-[50%] -translate-y-1/2 z-10 bg-white border shadow w-10 h-10 rounded-full flex items-center justify-center text-xl"
          onClick={handlePrev}
          aria-label="Anterior"
        >
          &#8592;
        </button>
        {/* Cards (Animated) */}
        <div className="flex-1 h-full flex items-stretch justify-center relative overflow-x-hidden">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={carouselVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex w-full items-stretch gap-4 md:gap-8"
              style={{
                width: "100%",
                minWidth: 0,
                flex: 1,
              }}
            >
              {visibleProducts.map((product, idx) => {
                // idx absoluto para hover
                const globalIdx = (index + idx) % TOTAL;
                const isHovered = hovered === globalIdx;
                const precioConDescuento = (product.precio * (1 - product.descuentoAplicado / 100)).toFixed(2);
                const selectedTallaForProduct = selectedTallas[product.id];

                return (
                  <motion.div
                    key={product.id}
                    className={` border border-black relative rounded-lg shadow-none flex flex-col justify-between pb-0 ${
                      cardsPerView === 1 ? "w-full max-w-xs mx-auto" : "w-1/3"
                    } h-full group border bg-white overflow-hidden`}
                    onHoverStart={() => setHovered(globalIdx)}
                    onHoverEnd={() => setHovered(null)}
                    style={{
                      cursor: "pointer",
                      minWidth: 0,
                      flex: cardsPerView === 1 ? "unset" : "1 1 0",
                    }}
                  >
                    {/* Top icons */}
                    <div className="absolute top-4 left-4 z-30">
                      <div className="bg-black text-white text-base font-[Poppins] font-bold px-3 py-1 rounded-full">
                        {product.descuentoAplicado}%
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 z-30">
                      <button className="p-1 rounded-full border-none outline-none bg-white/60 hover:bg-gray-200">
                        <Heart className="h-6 w-6 stroke-2 text-black" />
                      </button>
                    </div>
                    {/* Image with hover effect */}
                    <div>

                    </div>
                    <a
                      href={`/hombre/${product.categoria?.nomCategoria || "categoria"}/${product.id}/${
                        product.descuentoAplicado
                      }`}
                      className="relative group w-full h-[350px] md:h-full overflow-hidden rounded-lg"
                    >
                      <img
                        src={`${API_BASE_BASE}/${product.imagenPrincipal}`}
                        alt={product.nombre}
                        className="w-full h-full  object-cover transition-opacity duration-300 absolute top-0 left-0 z-10 group-hover:opacity-0"
                      />
                      <img
                        src={`${API_BASE_BASE}/${product.imagenHover}`}
                        alt={product.nombre + " hover"}
                        className="w-full h-full object-cover transition-opacity duration-300 absolute top-0 left-0 z-20 opacity-0 group-hover:opacity-100"
                      />
                    </a>
                    {/* Card Bottom: Info - SIN ANIMACION */}
                    <div className="px-5 pt-3 pb-2 relative z-10 bg-white">
                      <div className="text-[13px] font-[Poppins] font-medium text-[#222]">
                        {product.marca?.nomMarca || "Marca"}
                      </div>
                      <div className="text-base font-[Poppins] text-[#222] font-semibold truncate">
                        {product.nombre}
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <div className="flex gap-2 items-center">
                          {product.descuentoAplicado > 0 && (
                            <span className="text-sm text-gray-400 line-through font-[Poppins] font-semibold">
                              S/ {product.precio}
                            </span>
                          )}
                          <span className="text-lg font-bold font-[Poppins] text-[#222]">
                            S/ {precioConDescuento}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Right Arrow */}
        <button
          className="absolute right-2 top-[50%] -translate-y-1/2 z-10 bg-white border shadow w-10 h-10 rounded-full flex items-center justify-center text-xl"
          onClick={handleNext}
          aria-label="Siguiente"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}
