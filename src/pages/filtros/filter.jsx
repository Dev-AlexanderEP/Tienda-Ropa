import * as React from "react";
import { Collapse, List, Checkbox, Card, Typography, Select  } from "@material-tailwind/react";
import { useParams } from "react-router-dom";
import {  ChevronDown  } from 'lucide-react';

import Navbar from "../../components/navbaar/NavBar";


const FilterPage = () => {
   // ...otros imports y estados...

const [selectedTalla, setSelectedTalla] = React.useState("");
const [selectedMarca, setSelectedMarca] = React.useState("");
const [selectedPrecio, setSelectedPrecio] = React.useState("");
const [selectedDescuento, setSelectedDescuento] = React.useState("");



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
        params.append("precioMax", max);
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
      const res = await fetch(`http://127.0.0.1:8080/api/v1/prendas-filtradas?${params.toString()}`);
      const data = await res.json();

      // Actualiza el estado con los productos obtenidos
      if (data.object) {
        // Elimina duplicados basados en el ID
        const productosUnicos = data.object.filter(
          (producto, index, self) => self.findIndex((p) => p.id === producto.id) === index
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
}, [categoria, selectedTalla, selectedMarca, selectedPrecio, selectedDescuento]);

  React.useEffect(() => {

    if (categoria) {
        
      fetch(`http://127.0.0.1:8080/api/v1/prenda-tallas/${categoria}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.object) setTallas(data.object);
        })
        .catch(() => setTallas([]));

      fetch(`http://127.0.0.1:8080/api/v1/prenda-marcas/${categoria}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.object) setMarcas(data.object);
        })
        .catch(() => setMarcas([]));

                fetch(`http://127.0.0.1:8080/api/v1/prenda-precios/${categoria}`)
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


          fetch(`http://127.0.0.1:8080/api/v1/prendas/descuentos-aplicados/${categoria}`)
  .then((res) => res.json())
  .then((data) => {
    if (data.object) setProductos(data.object);
    console.log(data)
  })
  .catch(() => setProductos([]));
    }
  }, [categoria]);

  // 3. Agrega este List.Item y Collapse donde quieras mostrar el filtro de descuentos
  React.useEffect(() => {
    if (categoria) {
      fetch(`http://127.0.0.1:8080/api/v1/prendas/todos-descuentos/${categoria}`)
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
            const visibles = rangos.filter(
              (r) => maxDescuento >= r.min
            );
            setRangosDescuentos(visibles);
          }
        })
        .catch(() => setRangosDescuentos([]));
    }
  }, [categoria]);

  const url = "http://127.0.0.1:8080/";
    return (
      <div className="w-full flex flex-col gap-5">
        <Navbar />
        <div className=" w-full px-[100px] flex justify-center">
            
            {/* parte derecha */}
            <div className=" w-[250px] ">
                <List>
                    {/* categorias */}
                    <div className="border-b border-gray-300 p-1">
                        <List.Item onClick={() => setIsOpenCategorias((cur) => !cur)}>
                            <div className="flex justify-between w-full">
                                <Typography variant="" className="font-semibold">
                                    Categorias  
                                </Typography>
                                <ChevronDown className="w-5 h-5 cursor-pointer" />
                            </div>
                        </List.Item>
                        <Collapse open={isOpenCategorias}>
                            <List className=" pb-2">
                                <List.Item  >
                                <Checkbox id={categoria}>
                                    <Checkbox.Indicator />
                                </Checkbox>
                                {categoria}
                                </List.Item>
                            </List>
                        </Collapse>
                    </div>

                    {/* Tallas */}
                    <div className="border-b border-gray-300 p-1">
                         <List.Item onClick={() => setIsOpenTallas((cur) => !cur)}>
                                <div className="flex justify-between w-full">
                                    <Typography variant="" className="font-semibold">
                                        Tallas
                                    </Typography>
                                    <ChevronDown className="w-5 h-5 cursor-pointer" />  
                                </div>
                        </List.Item>
                        <Collapse open={isOpenTallas}>
                            <List className=" pb-2">
                                {tallas.map((talla, idx) => (
                                <List.Item key={idx}>
                                    <label className=" flex gap-2 items-center justify-center     ">
                                        <input
                                        type="checkbox"
                                        className="w-4 h-4 accent-indigo-600 rounded border-gray-300 " 
                                        checked={selectedTalla === talla}
                                        onChange={() => setSelectedTalla(selectedTalla === talla ? "" : talla)}
                                        />
                                        <Typography variant="" className="text-[14px] leading-none ">
                                            {talla}
                                        </Typography>
                                    </label>
                                </List.Item>
                                ))}
                            </List>
                        </Collapse>
                    </div>

                    {/* Marcas */}
                    <div className="border-b border-gray-300 p-1">
                        <List.Item onClick={() => setIsOpenMarcas((cur) => !cur)}>
                                <div className="flex justify-between w-full">
                                    <Typography variant="" className="font-semibold">
                                        Marcas
                                    </Typography>
                                    <ChevronDown className="w-5 h-5 cursor-pointer" />
                                </div>
                        </List.Item>
                        <Collapse open={isOpenMarcas}>
                            <List>
                                {marcas.map((marca, idx) => (
                                <List.Item key={idx}>
                                    <label  className=" flex gap-2 items-center justify-center ">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 accent-indigo-600 rounded border-gray-300 " 

                                            checked={selectedMarca === marca}
                                            onChange={() => setSelectedMarca(selectedMarca === marca ? "" : marca)}
                                        />
                                        <Typography variant="" className="text-[14px] leading-none ">
                                            {marca}
                                        </Typography>
                                    </label>
                                </List.Item>
                                ))}
                            </List>
                        </Collapse>
                    </div>

                    {/* Precio */}
                    <div className="border-b border-gray-300 p-1">
                        <List.Item onClick={() => setIsOpenPrecios((cur) => !cur)}>
                            <div className="flex justify-between w-full">
                                <Typography variant="" className="font-semibold">
                                    Precio
                                </Typography>
                                <ChevronDown className="w-5 h-5 cursor-pointer" />                       
                            </div>
                        </List.Item>
                        <Collapse open={isOpenPrecios}>
                            <List>
                                {rangosPrecios.map((rango, idx) => (
                                <List.Item key={idx}>
                                    <label  className=" flex gap-2 items-center justify-center ">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 accent-indigo-600 rounded border-gray-300 " 
                                            checked={selectedPrecio === rango.label}
                                            onChange={() => setSelectedPrecio(selectedPrecio === rango.label ? "" : rango.label)}
                                        />
                                        <Typography variant="" className="text-[14px] leading-none ">
                                            {rango.label}
                                        </Typography>
                                    </label>
                                </List.Item>
                                ))}
                            </List>
                        </Collapse>
                    </div>

                    {/* Descuento */}
                    <div className="border-b border-gray-300 p-1">
                        <List.Item onClick={() => setIsOpenDescuentos((cur) => !cur)}>
                            <div className="flex justify-between w-full">
                                <Typography variant="" className="font-semibold">
                                    Descuento
                                </Typography>
                                <ChevronDown className="w-5 h-5 cursor-pointer" />                        
                            </div>
                        </List.Item>
                        <Collapse open={isOpenDescuentos}>
                            <List>
                                {rangosDescuentos.map((rango, idx) => (
                                <List.Item key={idx}>
                                    <label className=" flex gap-2 items-center justify-center ">
                                        <input
                                            type="checkbox"
                                            checked={selectedDescuento === rango.label}
                                            className="w-4 h-4 accent-indigo-600 rounded border-gray-300 " 
                                            
                                            onChange={() => setSelectedDescuento(selectedDescuento === rango.label ? "" : rango.label)}
                                        />
                                        <Typography variant="" className="text-[14px] leading-none ">
                                            {rango.label}
                                        </Typography>
                                    </label>
                                </List.Item>
                                ))}
                            </List>
                        </Collapse>
                    </div>
                </List>
            </div>

            {/* parte izquierda */}
            <div className="  pl-10 w-[calc(100%-250px)]  ">
                {/* header */}
                <div className="w-full h-[60px] flex justify-between items-center mb-10">
                    <Typography  className="text-gray-700 text-[25px] font-semibold font-Poppins">
                        {productos.length} productos
                    </Typography>
                    <Select>
                        <Select.Trigger className="w-72" placeholder="Ordenar por:" />
                        <Select.List>
                            <Select.Option>No filtrar</Select.Option>
                            <Select.Option>Menor a mayor precio</Select.Option>
                            <Select.Option>Mayor a menor precio</Select.Option>
                            <Select.Option>Mas vendidos</Select.Option>
                            <Select.Option>Mas vendidos</Select.Option>
                            <Select.Option>Mejor valorados</Select.Option>
                        </Select.List>
                    </Select>
                </div>
                {productos.length === 0 ? (
                    <div className="w-full flex justify-center items-center h-40">
                        <Typography variant="h5" className="text-gray-500">
                            No hay prendas para mostrar
                        </Typography>
                    </div>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {productos.map((producto) => (
                            <Card key={producto.id} className=" flex flex-col items-start shadow-md relative rounded-none">
                               <a className="relative group  mb-2 "  href={`/mujer/${categoria}/${producto.id}/${producto.descuentoAplicado}`}>
                                    <img
                                    src={url + producto.imagenPrincipal}
                                    alt={producto.nombre}
                                    className="w-full object-center  transition-opacity duration-300 absolute top-0 left-0 z-10 group-hover:opacity-0"
                                    />
                                    <img
                                    src={url + producto.imagenHover}
                                    alt={producto.nombre + ' hover'}
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
                                    <Typography variant="small" as="a" href="#" className="text-gray-600  mb-1">
                                        {producto.marca}
                                    </Typography>
                                    <div className="flex flex-col gap-1">
                                        <a  className="h-[50px]" href={`/mujer/${categoria}/${producto.id}/${producto.descuentoAplicado}`}>
                                            {producto.nombre}
                                        </a>
                                        <Typography variant="small" className="text-gray-500  mb-1">
                                            {producto.descuentoAplicado > 0 ? (
                                                <>
                                                <span className="line-through mr-2">S/ {producto.precio}</span>
                                                <span className="text-green-600 font-bold">
                                                    S/ {(producto.precio * (1 - producto.descuentoAplicado / 100)).toFixed(2)}
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