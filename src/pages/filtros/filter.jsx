import * as React from "react";
import {
  Collapse,
  List,
  Checkbox,
  Card,
  Typography,
  Select,
} from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import WhatsAppButton from "../../components/contact/WhatsAppButton";
import { Search } from "lucide-react";

import Navbar from "../../components/navbaar/NavBar";
import NavBarResponsive from "../../components/navbaar/NavBarResponsive";
import { AnimatePresence, motion } from "framer-motion";

const FilterPage = () => {
  // ...otros imports y estados...

  const [isOpenFilters, setIsOpenFilters] = React.useState(false);
  const [selectedTalla, setSelectedTalla] = React.useState("");
  const [selectedMarca, setSelectedMarca] = React.useState("");
  const [selectedPrecio, setSelectedPrecio] = React.useState("");
  const [selectedDescuento, setSelectedDescuento] = React.useState("");
  const [busqueda, setBusqueda] = React.useState("");


        const token = localStorage.getItem('accessToken'); // o sessionStorage.getItem('token')
// const API_BASE = "http://localhost:8080/api/v1";
const API_BASE = "https://mixmatch.zapto.org/api/v1";
  //prendas
  const [productos, setProductos] = React.useState([]);

  const [isOpenTallas, setIsOpenTallas] = React.useState(false);
  const [isOpenMarcas, setIsOpenMarcas] = React.useState(false);
  const [isOpenCategorias, setIsOpenCategorias] = React.useState(false);

  const [isOpenPrecios, setIsOpenPrecios] = React.useState(false);
  const [rangosPrecios, setRangosPrecios] = React.useState([]);

  // 1. Estado para el collapse y los rangos de descuento
  const [isOpenDescuentos, setIsOpenDescuentos] = React.useState(false);
  const [rangosDescuentos, setRangosDescuentos] = React.useState([]);

  const [tallas, setTallas] = React.useState([]);
  const [marcas, setMarcas] = React.useState([]);
  const { categoria } = useParams();
  const genero = window.location.pathname.split("/")[1]; // Esto te da "mujer"

  const handleSingleSelect = (value, setSelected) => (event) => {
    if (event.target.checked) {
      setSelected(value);
    } else {
      setSelected("");
    }
  };
  React.useEffect(() => {
    const fetchProductos = async () => {
      try {
        const params = new URLSearchParams();

        // Agrega los filtros seleccionados a los parámetros
        if (categoria) params.append("categoria", categoria);
        if (genero) params.append("genero", genero); // ← AGREGAR ESTA LÍNEA
        if (selectedTalla) params.append("talla", selectedTalla);
        if (selectedMarca) params.append("marca", selectedMarca);

        // Extrae los valores de precio mínimo y máximo del rango seleccionado
        if (selectedPrecio) {
          const [min, max] = selectedPrecio
            .replace(/[^\d\-∞]/g, "") // Elimina caracteres no numéricos
            .replace("∞", "10000") // Reemplaza infinito por un valor alto
            .split("-")
            .map(Number);
          params.append("precioMin", min);
          if (selectedPrecio !== "Más de S/ 100") {
          params.append("precioMax", max);
        } else {
          params.append("precioMax", 10000);
        }
        }

        // Extrae los valores de descuento mínimo y máximo del rango seleccionado
        if (selectedDescuento) {
          const [min, max] = selectedDescuento
            .replace(/[^\d\-∞]/g, "") // Elimina caracteres no numéricos
            .replace("∞", "100") // Reemplaza infinito por un valor alto
            .split("-")
            .map(Number);
          params.append("descMin", min);
          params.append("descMax", max);
        }

        // Llama a la API con los parámetros construidos
        const res = await fetch(
          `${API_BASE}/prendas-filtradas?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
          }
        );
        const data = await res.json();
console.log(`${API_BASE}/prendas-filtradas?${params.toString()}`)
console.log("Productos filtrados:", data);
        // Actualiza el estado con los productos obtenidos
        if (data.object) {
          // Elimina duplicados basados en el ID
          const productosUnicos = data.object.filter(
            (producto, index, self) =>
              self.findIndex((p) => p.id === producto.id) === index
          );
          setProductos(productosUnicos);
        } else {
          setProductos([]);
        }
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setProductos([]);
      }
    };

    fetchProductos();
  }, [
    categoria,
    selectedTalla,
    selectedMarca,
    selectedPrecio,
    selectedDescuento,
  ]);

  React.useEffect(() => {
    if (categoria && genero) {
      fetch(`${API_BASE}/prenda-tallas/${categoria}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.object) setTallas(data.object);
        })
        .catch(() => setTallas([]));

      fetch(`${API_BASE}/prenda-marcas/${categoria}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.object) setMarcas(data.object);
        })
        .catch(() => setMarcas([]));

      fetch(`${API_BASE}/prenda-precios/${categoria}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.object && Array.isArray(data.object[0])) {
            const [minimo, , maximo] = data.object[0]; // [min, promedio, max]
            const rangos = [
              { label: "S/ 20 - S/ 40", min: 20, max: 40 },
              { label: "S/ 40 - S/ 60", min: 40, max: 60 },
              { label: "S/ 60 - S/ 80", min: 60, max: 80 },
              { label: "S/ 80 - S/ 100", min: 80, max: 100 },
              { label: "Más de S/ 100", min: 100, max: Infinity },
            ];
            // Filtra solo los rangos necesarios según el mínimo y máximo
            const visibles = rangos.filter(
              (r) =>
                (minimo <= r.max && maximo >= r.min) ||
                (minimo >= r.min && minimo <= r.max) ||
                (maximo >= r.min && maximo <= r.max)
            );
            setRangosPrecios(visibles);
          }
        })
        .catch(() => setRangosPrecios([]));

      // Este fetch se removió porque el useEffect principal ya maneja los productos filtrados
      // fetch(
      //   `http://localhost:8080/api/v1/prendas/descuentos-aplicados?categoria=${categoria}&genero=${genero}`,
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`,
      //     },
      //   }
      // )
      //   .then((res) => res.json())
      //   .then((data) => {
      //     if (data.object) setProductos(data.object);
      //     console.log(data);
      //     console.log("hola")
      //   })
      //   .catch(() => setProductos([]));
    }
  }, [categoria, genero]);

  // 3. Agrega este List.Item y Collapse donde quieras mostrar el filtro de descuentos
  React.useEffect(() => {
    if (categoria) {
      fetch(`${API_BASE}/prendas/todos-descuentos/${categoria}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          // Suponiendo que data.object es un array de descuentos aplicados
          if (data.object && Array.isArray(data.object)) {
            const maxDescuento = Math.max(...data.object, 0);
            const rangos = [
              { label: "0% - 20%", min: 0, max: 20 },
              { label: "20% - 40%", min: 20, max: 40 },
              { label: "40% - 60%", min: 40, max: 60 },
              { label: "60% - 80%", min: 60, max: 80 },
            ];
            // Solo muestra los rangos que aplican según el máximo descuento
            const visibles = rangos.filter((r) => maxDescuento >= r.min);
            setRangosDescuentos(visibles);
          }
        })
        .catch(() => setRangosDescuentos([]));
    }
  }, [categoria]);

  // Debounce para evitar demasiadas peticiones
  React.useEffect(() => {
    const query = busqueda.trim();
    if (!query) {
      // Si no hay búsqueda, no hacemos nada (el primer useEffect ya maneja los productos)
      return;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      const params = new URLSearchParams({
        nombre: query,
        categoria: categoria,
        genero: genero,
      });
      fetch(`${API_BASE}/prendas/buscar?${params.toString()}`, {
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Respuesta de backend:", data);
          if (Array.isArray(data)) setProductos(data);
          else if (data && data.object && Array.isArray(data.object))
            setProductos(data.object);
          else setProductos([]);
        })
        .catch((error) => {
          if (error.name !== "AbortError") setProductos([]);
        });
    }, 350);
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [busqueda, categoria, genero]);

  return (
    <div className="w-full flex flex-col gap-5">
      <WhatsAppButton />

      <NavBarResponsive />
      <div className=" w-full px-[100px]  flex justify-center max-lg:px-[20px]">
        {/* parte derecha */}
        <div className="w-[250px] max-lg:hidden">
          <List>
            {/* CATEGORIAS */}
            <div className="border-b border-gray-300 p-1">
              <List.Item onClick={() => setIsOpenCategorias((cur) => !cur)}>
                <div className="flex justify-between w-full">
                  <Typography className="font-semibold">Categorias</Typography>
                  <ChevronDown className="w-5 h-5 cursor-pointer" />
                </div>
              </List.Item>
              <AnimatePresence initial={false}>
                {isOpenCategorias && (
                  <motion.div
                    key="categorias"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.23, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <List className="pb-2">
                      <List.Item>
                        <Checkbox id={categoria}>
                          <Checkbox.Indicator />
                        </Checkbox>
                        {categoria}
                      </List.Item>
                    </List>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* TALLAS */}
            <div className="border-b border-gray-300 p-1">
              <List.Item onClick={() => setIsOpenTallas((cur) => !cur)}>
                <div className="flex justify-between w-full">
                  <Typography className="font-semibold">Tallas</Typography>
                  <ChevronDown className="w-5 h-5 cursor-pointer" />
                </div>
              </List.Item>
              <AnimatePresence initial={false}>
                {isOpenTallas && (
                  <motion.div
                    key="tallas"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.23, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <List className="pb-2">
                      {tallas.map((talla, idx) => (
                        <List.Item key={idx}>
                          <label className="flex gap-2 items-center justify-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                              checked={selectedTalla === talla}
                              onChange={() =>
                                setSelectedTalla(
                                  selectedTalla === talla ? "" : talla
                                )
                              }
                            />
                            <Typography className="text-[14px] leading-none">
                              {talla}
                            </Typography>
                          </label>
                        </List.Item>
                      ))}
                    </List>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MARCAS */}
            <div className="border-b border-gray-300 p-1">
              <List.Item onClick={() => setIsOpenMarcas((cur) => !cur)}>
                <div className="flex justify-between w-full">
                  <Typography className="font-semibold">Marcas</Typography>
                  <ChevronDown className="w-5 h-5 cursor-pointer" />
                </div>
              </List.Item>
              <AnimatePresence initial={false}>
                {isOpenMarcas && (
                  <motion.div
                    key="marcas"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.23, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <List>
                      {marcas.map((marca, idx) => (
                        <List.Item key={idx}>
                          <label className="flex gap-2 items-center justify-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                              checked={selectedMarca === marca}
                              onChange={() =>
                                setSelectedMarca(
                                  selectedMarca === marca ? "" : marca
                                )
                              }
                            />
                            <Typography className="text-[14px] leading-none">
                              {marca}
                            </Typography>
                          </label>
                        </List.Item>
                      ))}
                    </List>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PRECIO */}
            <div className="border-b border-gray-300 p-1">
              <List.Item onClick={() => setIsOpenPrecios((cur) => !cur)}>
                <div className="flex justify-between w-full">
                  <Typography className="font-semibold">Precio</Typography>
                  <ChevronDown className="w-5 h-5 cursor-pointer" />
                </div>
              </List.Item>
              <AnimatePresence initial={false}>
                {isOpenPrecios && (
                  <motion.div
                    key="precios"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.23, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <List>
                      {rangosPrecios.map((rango, idx) => (
                        <List.Item key={idx}>
                          <label className="flex gap-2 items-center justify-center">
                            <input
                              type="checkbox"
                              className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                              checked={selectedPrecio === rango.label}
                              onChange={() =>
                                setSelectedPrecio(
                                  selectedPrecio === rango.label
                                    ? ""
                                    : rango.label
                                )
                              }
                            />
                            <Typography className="text-[14px] leading-none">
                              {rango.label}
                            </Typography>
                          </label>
                        </List.Item>
                      ))}
                    </List>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* DESCUENTO */}
            <div className="border-b border-gray-300 p-1">
              <List.Item onClick={() => setIsOpenDescuentos((cur) => !cur)}>
                <div className="flex justify-between w-full">
                  <Typography className="font-semibold">Descuento</Typography>
                  <ChevronDown className="w-5 h-5 cursor-pointer" />
                </div>
              </List.Item>
              <AnimatePresence initial={false}>
                {isOpenDescuentos && (
                  <motion.div
                    key="descuentos"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.23, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <List>
                      {rangosDescuentos.map((rango, idx) => (
                        <List.Item key={idx}>
                          <label className="flex gap-2 items-center justify-center">
                            <input
                              type="checkbox"
                              checked={selectedDescuento === rango.label}
                              className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                              onChange={() =>
                                setSelectedDescuento(
                                  selectedDescuento === rango.label
                                    ? ""
                                    : rango.label
                                )
                              }
                            />
                            <Typography className="text-[14px] leading-none">
                              {rango.label}
                            </Typography>
                          </label>
                        </List.Item>
                      ))}
                    </List>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </List>
        </div>
        {/* parte derecha */}

        {/* parte izquierda */}
        <div className="  pl-10 w-[calc(100%-250px)] max-lg:w-[100%]  max-lg:pl-0  relative z-0">
          {/* header */}
          <div className="w-full h-[60px] flex flex-wrap gap-y-3 max-lg:h-auto justify-between items-center mb-10 max-lg:items-start ">
            <Typography className="text-gray-700 text-[25px] font-semibold font-Poppins max-lg:text-[20px]">
              {productos.length} productos
            </Typography>
            {/* input de busqueda */}
            <motion.div
              initial={{ boxShadow: "0 1px 3px #00000011" }}
              whileFocus={{ boxShadow: "0 2px 12px #00000033" }}
              className="flex items-center border border-gray-300 rounded w-[250px] px-2 py-1 bg-white lg:h-[50px] lg:w-[300px]"
              style={{ borderRadius: 4 }} // Puedes ajustar el radio si quieres más rectangular (0) o redondeado (4)
            >
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar producto..."
                className="w-full outline-none bg-transparent text-black placeholder:text-gray-400"
                style={{ border: "none", boxShadow: "none" }}
              />
              <Search className="text-gray-400 ml-2 w-5 h-5" />
            </motion.div>
            {/* boton de filtrar */}
            <div className="w-[250px] hidden max-lg:block relative ">
              {/* Botón para mostrar/ocultar filtros */}
              <button
                className="w-full flex items-center gap-2 px-4 py-2  border border-gray-400 rounded shadow-sm bg-white text-gray-700 font-semibold relative z-20"
                onClick={() => setIsOpenFilters?.((cur) => !cur)}
              >
                Filtrar por
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    isOpenFilters ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {isOpenFilters && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: "easeInOut" }}
                    className="w-full "
                  >
                    <List className="absolute z-20 bg-white  w-[250px]">
                      {/* CATEGORIAS */}
                      <div className="border-b border-gray-300 p-1">
                        <List.Item
                          onClick={() => setIsOpenCategorias((cur) => !cur)}
                        >
                          <div className="flex justify-between w-full">
                            <Typography className="font-semibold">
                              Categorias
                            </Typography>
                            <ChevronDown className="w-5 h-5 cursor-pointer" />
                          </div>
                        </List.Item>
                        <AnimatePresence initial={false}>
                          {isOpenCategorias && (
                            <motion.div
                              key="categorias"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.23, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              <List className="pb-2">
                                <List.Item>
                                  <Checkbox id={categoria}>
                                    <Checkbox.Indicator />
                                  </Checkbox>
                                  {categoria}
                                </List.Item>
                              </List>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* TALLAS */}
                      <div className="border-b border-gray-300 p-1">
                        <List.Item
                          onClick={() => setIsOpenTallas((cur) => !cur)}
                        >
                          <div className="flex justify-between w-full">
                            <Typography className="font-semibold">
                              Tallas
                            </Typography>
                            <ChevronDown className="w-5 h-5 cursor-pointer" />
                          </div>
                        </List.Item>
                        <AnimatePresence initial={false}>
                          {isOpenTallas && (
                            <motion.div
                              key="tallas"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.23, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              <List className="pb-2">
                                {tallas.map((talla, idx) => (
                                  <List.Item key={idx}>
                                    <label className="flex gap-2 items-center justify-center">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                                        checked={selectedTalla === talla}
                                        onChange={() =>
                                          setSelectedTalla(
                                            selectedTalla === talla ? "" : talla
                                          )
                                        }
                                      />
                                      <Typography className="text-[14px] leading-none">
                                        {talla}
                                      </Typography>
                                    </label>
                                  </List.Item>
                                ))}
                              </List>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* MARCAS */}
                      <div className="border-b border-gray-300 p-1">
                        <List.Item
                          onClick={() => setIsOpenMarcas((cur) => !cur)}
                        >
                          <div className="flex justify-between w-full">
                            <Typography className="font-semibold">
                              Marcas
                            </Typography>
                            <ChevronDown className="w-5 h-5 cursor-pointer" />
                          </div>
                        </List.Item>
                        <AnimatePresence initial={false}>
                          {isOpenMarcas && (
                            <motion.div
                              key="marcas"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.23, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              <List>
                                {marcas.map((marca, idx) => (
                                  <List.Item key={idx}>
                                    <label className="flex gap-2 items-center justify-center">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                                        checked={selectedMarca === marca}
                                        onChange={() =>
                                          setSelectedMarca(
                                            selectedMarca === marca ? "" : marca
                                          )
                                        }
                                      />
                                      <Typography className="text-[14px] leading-none">
                                        {marca}
                                      </Typography>
                                    </label>
                                  </List.Item>
                                ))}
                              </List>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* PRECIO */}
                      <div className="border-b border-gray-300 p-1">
                        <List.Item
                          onClick={() => setIsOpenPrecios((cur) => !cur)}
                        >
                          <div className="flex justify-between w-full">
                            <Typography className="font-semibold">
                              Precio
                            </Typography>
                            <ChevronDown className="w-5 h-5 cursor-pointer" />
                          </div>
                        </List.Item>
                        <AnimatePresence initial={false}>
                          {isOpenPrecios && (
                            <motion.div
                              key="precios"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.23, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              <List>
                                {rangosPrecios.map((rango, idx) => (
                                  <List.Item key={idx}>
                                    <label className="flex gap-2 items-center justify-center">
                                      <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                                        checked={selectedPrecio === rango.label}
                                        onChange={() =>
                                          setSelectedPrecio(
                                            selectedPrecio === rango.label
                                              ? ""
                                              : rango.label
                                          )
                                        }
                                      />
                                      <Typography className="text-[14px] leading-none">
                                        {rango.label}
                                      </Typography>
                                    </label>
                                  </List.Item>
                                ))}
                              </List>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* DESCUENTO */}
                      <div className="border-b border-gray-300 p-1">
                        <List.Item
                          onClick={() => setIsOpenDescuentos((cur) => !cur)}
                        >
                          <div className="flex justify-between w-full">
                            <Typography className="font-semibold">
                              Descuento
                            </Typography>
                            <ChevronDown className="w-5 h-5 cursor-pointer" />
                          </div>
                        </List.Item>
                        <AnimatePresence initial={false}>
                          {isOpenDescuentos && (
                            <motion.div
                              key="descuentos"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.23, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              <List>
                                {rangosDescuentos.map((rango, idx) => (
                                  <List.Item key={idx}>
                                    <label className="flex gap-2 items-center justify-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          selectedDescuento === rango.label
                                        }
                                        className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                                        onChange={() =>
                                          setSelectedDescuento(
                                            selectedDescuento === rango.label
                                              ? ""
                                              : rango.label
                                          )
                                        }
                                      />
                                      <Typography className="text-[14px] leading-none">
                                        {rango.label}
                                      </Typography>
                                    </label>
                                  </List.Item>
                                ))}
                              </List>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </List>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          {productos.length === 0 ? (
            <div className="w-full flex justify-center items-center h-40  relative z-0">
              <Typography variant="h5" className="text-gray-500">
                No hay prendas para mostrar
              </Typography>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4 max-lg:grid-cols-3 max-md:grid-cols-2 relative z-0">
              {productos.map((producto) => (
                <Card
                  key={producto.id}
                  className=" flex flex-col items-start shadow-md  rounded-none relative "
                >
                  <a
                    className="relative group  mb-2 "
                    href={`/${genero}/${categoria}/${producto.id}/${producto.descuentoAplicado}`}
                  >
                    <img
                      src={"https://mixmatch.zapto.org/" + producto.imagenPrincipal}
                      alt={producto.nombre}
                      className="w-full object-center  transition-opacity duration-300 absolute top-0 left-0 z-10 group-hover:opacity-0"
                    />
                    <img
                      src={"https://mixmatch.zapto.org/" + producto.imagenHover}
                      alt={producto.nombre + " hover"}
                      className="w-full object-contain  transition-opacity duration-300 obsolute  top-0 left-0 z-20 opacity-0 group-hover:opacity-100"
                    />
                   
                  </a>
                  {/* Badge de descuento */}
                  {producto.descuentoAplicado > 0 && (
                    <span className="absolute top-0 left-0 z-30 bg-black text-white text-xs font-bold px-2 py-1 ">
                      -{producto.descuentoAplicado}%
                    </span>
                  )}
                  <div className="w-full flex flex-col items-start px-3 gap-2 pb-4">
                    <Typography
                      variant="small"
                      as="a"
                      href="#"
                      className="text-gray-600  mb-1"
                    >
                      {producto.marca}
                    </Typography>
                    <div className="flex flex-col gap-1">
                      <a
                        className="h-[50px]"
                        href={`/${genero}/${categoria}/${producto.id}/${producto.descuentoAplicado}`}
                      >
                        {producto.nombre}
                      </a>
                      <Typography
                        variant="small"
                        className="text-gray-500  mb-1"
                      >
                        {producto.descuentoAplicado > 0 ? (
                          <>
                            <span className="line-through mr-2">
                              S/ {producto.precio}
                            </span>
                            <span className="text-green-600 font-bold">
                              S/{" "}
                              {(
                                producto.precio *
                                (1 - producto.descuentoAplicado / 100)
                              ).toFixed(2)}
                            </span>
                          </>
                        ) : (
                          <>S/ {producto.precio}</>
                        )}
                      </Typography>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterPage;
