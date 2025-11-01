import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/navbaar/NavBar';
import NavBarResponsive from '../../components/navbaar/NavBarResponsive';
import img from "../../assets/images/img.gif";
import { Typography, Collapse, List, Button, Breadcrumb  } from "@material-tailwind/react";
import { Plus, Minus, Ruler, House, Store, BadgeCheck, Box     } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
 import FooterC from '../../components/footer/Footer';
 import Swal from 'sweetalert2';
import axios from "axios";

import WhatsAppButton from "../../components/contact/WhatsAppButton";



const PrendaDetails = () => {
  const { id,descuento } = useParams(); // Obtener el ID de la prenda desde la URL
    const location = useLocation();

  const [prenda, setPrenda] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagen, setImagen] = useState(''); // Estado para la imagen principal

   // Estados para los collapses
  const [openDesc, setOpenDesc] = useState(false);
  const [openCarac, setOpenCarac] = useState(false);
  const [openMedidas, setOpenMedidas] = useState(false);
  const [selectedTalla, setSelectedTalla] = useState(null); // Estado para la talla seleccionada
        const token = localStorage.getItem('accessToken'); // o sessionStorage.getItem('token')

  
  const navigate = useNavigate();

    // Extraer información de la URL para el breadcrumb
  const getUrlInfo = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment !== '');
    // Esperamos una URL como /mujer/Casacas/7/20 o similar
    const genero = pathSegments[0] || '';
    const categoria = pathSegments[1] || '';
    
    return {
      genero: genero.charAt(0).toUpperCase() + genero.slice(1), // Capitalizar primera letra
      categoria: categoria.charAt(0).toUpperCase() + categoria.slice(1) // Capitalizar primera letra
    };
  };

  const { genero, categoria } = getUrlInfo();

  // Función para verificar si hay usuario logeado
  const isUserLoggedIn = () => {
    // Ejemplo: verifica si hay un token en localStorage (ajusta según tu auth)
    return !!localStorage.getItem('accessToken');
  };

  useEffect(() => {
    const fetchPrenda = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/v1/prenda/${id}`,{
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        const data = await response.json();
        setPrenda(data.object);
                setImagen(`http://localhost:8080/${data.object.imagen.principal}`); // Imagen inicial

        setLoading(false);
      } catch (error) {
        console.error('Error fetching prenda:', error);
        setLoading(false);
      }
    };

    fetchPrenda();
  }, [id]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!prenda) {
    return <div>Error al cargar los detalles de la prenda.</div>;
  }

  const precioConDescuento = (prenda.precio * (1 - descuento / 100)).toFixed(2);

  
  
const handleAddToCart = async () => {
  if (!isUserLoggedIn()) {
    localStorage.setItem('redirectAfterLogin', window.location.pathname + window.location.search);
    Swal.fire({
      icon: 'info',
      title: 'Necesitas logearte',
      text: 'Por favor, inicia sesión para agregar productos al carrito.',
      showConfirmButton: false,
      timer: 2000,
    });
    setTimeout(() => {
      navigate('/login');
    }, 1000);
    return;
  }

  try {
    const token = localStorage.getItem("accessToken");
    if (!token) throw new Error("No hay token de acceso");

    // 1. Obtener usuarioId
    const userRes = await axios.get("http://localhost:8080/usuario-id", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const usuarioId = userRes.data;

      let carritoId;
      let tituloCarrito = "";
    const abiertoRes = await axios.get(
      `http://localhost:8080/api/v1/carrito/abierto/usuario/${usuarioId}`, { headers: { Authorization: `Bearer ${token}` } }
    );
   if (abiertoRes.data.object && abiertoRes.data.object.length > 0) {
  carritoId = abiertoRes.data.object[0].id;
  console.log("Carrito abierto encontrado:", carritoId);
  tituloCarrito= "Producto agregado al carrito existente";
} else {
      // Si no hay, crear uno nuevo
      const carritoRes = await axios.post(
        "http://localhost:8080/api/v1/carrito",
        { usuarioId, estado: "ABIERTO" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      carritoId = carritoRes.data.object.id;
  tituloCarrito= "Producto agregado al carrito nuevo";

    }
localStorage.setItem('carritoId', carritoId);
    try {
        console.log("selectedTalla (debe ser id):", selectedTalla);

    // 1. Intentar incrementar cantidad si el item ya existe
    await axios.post(
      "http://localhost:8080/api/v1/carrito-item/agregar",
      null,
      {
        params: {
          carritoId,
          prendaId: Number(id),
          tallaId: selectedTalla // Aquí debes enviar el ID de la talla, no el nombre
        },
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    Swal.fire({
      icon: 'success',
      title: 'Cantidad incrementada para el item existente',
      showConfirmButton: false,
      timer: 1500,
    });


  } catch (error) {
     // Si no existe el item, lo creamos
        const selectedTallaObj = prenda.tallas.find(t => t.talla.id === selectedTalla);
    const tallaNombre = selectedTallaObj ? selectedTallaObj.talla.nomTalla : "";
    await axios.post(
      "http://localhost:8080/api/v1/carrito-item",
      {
        carritoId,
        prendaId: Number(id),
        talla: tallaNombre,
        cantidad: 1,
        precioUnitario: Number(precioConDescuento)
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    handleRestarUno(id, selectedTalla);
    Swal.fire({
      icon: 'success',
      title: 'Producto agregado al carrito',
      showConfirmButton: false,
      timer: 1500,
    });
  }
  // ACTUALIZA EL CONTADOR DEL CARRITO AQUÍ
    const cantidadRes = await axios.get(
      `http://localhost:8080/api/v1/carrito/${carritoId}/cantidad-items`, { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Cantidad de items en el carrito:", cantidadRes.data);
    // Si tu backend responde { cantidad: 3 }, usa cantidadRes.data.cantidad
   const cantidad = cantidadRes.data.object;
localStorage.setItem('cartCount', String(cantidad || 0));
window.dispatchEvent(new Event('cart-updated'));


  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'No se pudo agregar el producto al carrito.',
    });
    console.error(error);
  }
};

const handleRestarUno = async (id, selectedTalla) => {
  try {
    const res = await fetch(
      `http://localhost:8080/api/v1/restar-uno?prendaId=${id}&tallaId=${selectedTalla}`,
      { method: "PUT", headers: { 'Authorization': token ? `Bearer ${token}` : '' } }
    );
    const data = await res.json();
    if (!res.ok || !data.object) {
      Swal.fire("Sin stock", data.mensaje || "No hay stock suficiente.", "warning");
      return;
    }
  } catch (e) {
    Swal.fire("Error", "No se pudo actualizar el stock.", "error");
  }
};

 return (
    <>
    <div className='h-full  flex flex-col gap-10 '>
              <WhatsAppButton />
      
      <NavBarResponsive />
      <div className="w-full   px-[10%] max-lg:px-[20px]">
        {/* primera parte */}
        <div className='w-full h-[50px] pb-5  flex items-center justify-between '>
            <Breadcrumb className="font-Poppins ">
                <Breadcrumb.Link href="#" className="text-lg text-gray-400">
                    <House />
                </Breadcrumb.Link>
                <Breadcrumb.Separator />
                <Breadcrumb.Link href="#" className="text-lg text-gray-400">{genero}</Breadcrumb.Link>
                <Breadcrumb.Separator />
                <Breadcrumb.Link href="#" className="text-lg ">
                    {categoria} {genero}
                </Breadcrumb.Link>
            </Breadcrumb>
        </div>
        {/* segunda parte */}
        <div className="w-full    flex  gap-10 max-md:flex-col ">
            {/* imagenes parte derecha*/}
            <div className='flex flex-col w-[50%] gap-10 h-full justify-center  max-md:w-[100%]'>
                <div className='flex w-full h-full  gap-4 max-lg:flex-col'>
                    <div className='w-[107px]    flex flex-col gap-2 max-lg:flex-row max-lg:w-full'>

                        <div
                            className="  cursor-pointer w-full h-auto"
                            onClick={() =>
                                setImagen(`http://localhost:8080/${prenda.imagen.principal}`)
                            }
                            >
                            <img
                                src={`http://localhost:8080/${prenda.imagen.principal}`}
                                className=' object-contain w-full h-auto'
                                alt={prenda.nombre}
                            />
                        </div>

                        {prenda.imagen.video && (
                        <div className="  cursor-pointer w-full h-auto"
                        onClick={() =>
                            setImagen(`http://localhost:8080/${prenda.imagen.video}`)
                            }>
                            <img src={img} alt="GIF de ejemplo" className=" object-contain w-full h-auto"
                            />
                        </div>
                        )}

                        <div
                            className="  cursor-pointer w-full h-auto"
                            onClick={() =>
                                setImagen(`http://localhost:8080/${prenda.imagen.hover}`)
                            }
                        >
                            <img
                                src={`http://localhost:8080/${prenda.imagen.hover}`}
                                className=' object-contain w-full h-auto'
                                alt={`${prenda.nombre} hover`}
                            />
                        </div>

                        <div
                            className="  cursor-pointer w-full h-auto"
                            onClick={() =>
                            setImagen(`http://localhost:8080/${prenda.imagen.img1}`)
                            }
                        >
                            <img
                            src={`http://localhost:8080/${prenda.imagen.img1}`}
                                        className=' object-contain w-full h-auto'
                            alt={`${prenda.nombre} secundaria`}
                            />
                        </div>

                        <div
                            className="  cursor-pointer w-full h-auto"
                            onClick={() =>
                            setImagen(`http://localhost:8080/${prenda.imagen.img2}`)
                            }
                        >
                            <img
                            src={`http://localhost:8080/${prenda.imagen.img2}`}
                                        className=' object-contain w-full h-auto'
                            alt={`${prenda.nombre} secundaria`}
                            />
                        </div>

                    </div>
                    <div className=' h-[700px] w-[calc(100%-107px)] flex justify-center  max-lg:w-[100%]'>
                         
                        <div className=' h-full  '>

                        {imagen.includes('.mp4') ? (
                            
                            <video
                            className=" object-cover h-full  "
                            controls
                            muted
                            loop
                            autoPlay
                            >
                            <source src={imagen} type="video/mp4" />
                            Tu navegador no soporta el elemento de video.
                            </video>
                        ) : (
                            <img src={imagen} alt={prenda.nombre} className=" object-cover w-full h-full" />
                        )}
                        </div>
                    </div>
                </div>
                {/* carda/ */}
                <div  className='  flex justify-center  gap-4 flex-wrap max-2xl:h-auto max-md:hidden'>
                    <div className=' w-[200px] flex flex-col justify-center items-center gap-2 bg-gray-100/50 p-2'>
                        <Box  className='h-[30px] w-[30px]' />
                        <Typography className='text-gray-900 font-Poppins font-semibold text-[13px]'>¿Y si cambio de opinión?</Typography>
                        <Typography className="text-center text-gray-600 text-[11px]">Podrás cambiar o devolver tu compra</Typography>
                    </div>
                    <div className=' w-[200px] flex flex-col justify-center items-center gap-2 bg-gray-100/50 p-2'>
                        <Store className='h-[30px] w-[30px]' />
                        <Typography className='text-gray-900 font-Poppins font-semibold text-[13px]'>Recojo en tienda</Typography>
                        <Typography className="text-center text-gray-600 text-[11px]">Retira en más +70 tiendas a nivel nacional</Typography>
                    </div>
                    <div className=' w-[200px] flex flex-col justify-center items-center gap-2 bg-gray-100/50 p-2'>
                        <BadgeCheck className='h-[30px] w-[30px]' />
                        <Typography className='text-gray-900 font-Poppins font-semibold text-[13px]'>Revisa tu pedido</Typography>
                        <Typography className="text-center text-gray-600 text-[11px]">Ingresa tu N° pedido y conoce su estado.</Typography>
                    </div>
                </div>
                
            </div>
          {/* parte izquierda */}
            <div className="w-[60%]  font-Poppins max-md:w-[100%] max-md:px-10 max-sm:px-2">
                <div className=' flex flex-col h-full gap-6'>
                    {/* header */}
                        <div className='flex flex-col gap-3 '>
                            <div className='flex gap-2 justify-between w-full '>
                                <Typography className="text-[16px] font-Poppins ">{prenda.marca.nomMarca}</Typography>
                                <Typography className="text-[16px]  font-Poppins">Codigo: {id}</Typography>
                            </div>
                            <Typography className="text-2xl font-bold font-Poppins">{prenda.nombre}</Typography>
                            <div className='flex gap-4 '>
                                <Typography className="text-gray-500 text-lg line-through font-Poppins">S/ {prenda.precio}</Typography>
                                <Typography className="text-red-500 text-xl font-bold font-Poppins">S/ {precioConDescuento}</Typography>
                                <Typography className="text-white bg-red-500 text-xl font-bold px-2 font-Poppins">-{descuento}%</Typography>
                            </div>
                        </div>

                        {/* colors */}
                        <div className="  flex flex-col gap-3">
                            <h3 className="text-lg font-semibold font-Poppins">Colores</h3>
                            <div className="flex gap-4 ">
                                <div className='w-[100px] h-[150px] flex justify-center items-center bg-gray-200'>
                                    <Typography className='font-Poppins'>Imagen</Typography>
                                </div>
                                <div className='w-[100px] h-[150px] flex justify-center items-center bg-gray-200'>
                                    <Typography className='font-Poppins'>Imagen</Typography>
                                </div>
                                <div className='w-[100px] h-[150px] flex justify-center items-center bg-gray-200'>
                                    <Typography className='font-Poppins'>Imagen</Typography>
                                </div>

                            </div>

                        </div>
                     {/* Tallas */}
                        <div className="  flex flex-col gap-3">
                            <h3 className="text-lg font-semibold font-Poppins">Talla</h3>
                            <div className="flex justify-between items-center ">
                                <div className="flex gap-2 ">
                                                                {prenda.tallas.map((tallaObj) => (
                                  <button
                                    key={tallaObj.talla.id}
                                    className={`border rounded-full h-[60px] w-[60px] hover:bg-gray-200 ${
                                      selectedTalla === tallaObj.talla.id ? "border-black" : "border-gray-300"
                                    }`}
                                    onClick={() => setSelectedTalla(tallaObj.talla.id)}
                                    type="button"
                                  >
                                    {tallaObj.talla.nomTalla}
                                  </button>
                                ))}
                                </div>
                                <div>
                                    <Typography as="a" href='#' className="text-sm text-gray-600 flex">
                                        <Ruler /> Guia de tallas
                                    </Typography>
                                </div>
                            </div>

                        </div>
                        {/* botom */}
                        <div className='w-full flex flex-col gap-5 '>
                            <Typography className="text-sm text-gray-600  font-Poppins">Delivery gratis por compras desde S/ 139 .</Typography>

                                    {!selectedTalla ? (
                            <Button
                                className="mt-4 border-none font-Poppins font-bold bg-gray-300 text-gray-700 hover:text-gray-300 px-4 py-3 rounded cursor-not-allowed w-full"
                                disabled
                                fullWidth
                            >
                                Seleccione talla
                            </Button>
                            ) : (
                            <Button
                                className="mt-4 border-none font-Poppins font-bold text-white px-4 py-3 rounded cursor-pointer w-full bg-red-500 hover:bg-red-600"
                                fullWidth
                                onClick={handleAddToCart}
                            >
                                Agregar Carrito
                            </Button>
                            )}
                        </div>
                        {/* collapses */}
                        <div className="w-[100%]">
                <List>
                {/* Descripción */}
                <div className=" hover:bg-white rounded-none border-t border-black bg-gray-300"></div>
                <List.Item onClick={() => setOpenDesc((cur) => !cur)} className="cursor-pointer hover:bg-white rounded-none py-5">
                    <span className="font-semibold">Descripción</span>
                    <List.ItemEnd>
                    {openDesc ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </List.ItemEnd>
                </List.Item>
                <AnimatePresence>
                    {openDesc && (
                    <motion.div
                        key="desc"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-2 text-sm text-gray-600">{prenda.descripcion}</div>
                    </motion.div>
                    )}
                </AnimatePresence>
                <div className=" hover:bg-white rounded-none border-t border-black"></div>

                {/* Características */}
                <List.Item onClick={() => setOpenCarac((cur) => !cur)} className="cursor-pointer hover:bg-white rounded-none py-5">
                    <span className="font-semibold">Características</span>
                    <List.ItemEnd>
                    {openCarac ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </List.ItemEnd>
                </List.Item>
                <AnimatePresence>
                    {openCarac && (
                    <motion.div
                        key="carac"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden "
                    >
                        <ul className="p-2 list-disc list-inside text-sm text-gray-600">
                        <li>Marca: {prenda.marca.nomMarca}</li>
                        <li>Categoría: {prenda.categoria.nomCategoria}</li>
                        <li>Proveedor: {prenda.proveedor.nomProveedor}</li>
                        </ul>
                    </motion.div>
                    )}
                </AnimatePresence>
                <div className=" hover:bg-white rounded-none border-t border-black"></div>

                {/* Medidas del modelo */}
                <List.Item onClick={() => setOpenMedidas((cur) => !cur)} className="cursor-pointer hover:bg-white rounded-none py-5">
                    <span className="font-semibold">Medidas del modelo</span>
                    <List.ItemEnd>
                    {openMedidas ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    </List.ItemEnd>
                </List.Item>
                <AnimatePresence>
                    {openMedidas && (
                    <motion.div
                        key="medidas"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-2 text-sm text-gray-600">
                        Altura: 1.70m, Busto: 85cm, Cintura: 60cm, Cadera: 90cm
                        </div>
                    </motion.div>
                    )}
                </AnimatePresence>
                <div className=" hover:bg-white rounded-none border-t border-black"></div>

                </List>
                        </div>
                </div>
            </div>

            {/* carda/ */}
                <div  className='   justify-center  gap-4 flex-wrap max-2xl:h-auto hidden max-md:flex'>
                    <div className=' w-[200px] flex flex-col justify-center items-center gap-2 bg-gray-100/50 p-2'>
                        <Box  className='h-[30px] w-[30px]' />
                        <Typography className='text-gray-900 font-Poppins font-semibold text-[13px]'>¿Y si cambio de opinión?</Typography>
                        <Typography className="text-center text-gray-600 text-[11px]">Podrás cambiar o devolver tu compra</Typography>
                    </div>
                    <div className=' w-[200px] flex flex-col justify-center items-center gap-2 bg-gray-100/50 p-2'>
                        <Store className='h-[30px] w-[30px]' />
                        <Typography className='text-gray-900 font-Poppins font-semibold text-[13px]'>Recojo en tienda</Typography>
                        <Typography className="text-center text-gray-600 text-[11px]">Retira en más +70 tiendas a nivel nacional</Typography>
                    </div>
                    <div className=' w-[200px] flex flex-col justify-center items-center gap-2 bg-gray-100/50 p-2'>
                        <BadgeCheck className='h-[30px] w-[30px]' />
                        <Typography className='text-gray-900 font-Poppins font-semibold text-[13px]'>Revisa tu pedido</Typography>
                        <Typography className="text-center text-gray-600 text-[11px]">Ingresa tu N° pedido y conoce su estado.</Typography>
                    </div>
                </div>
        </div>

      </div>

        <FooterC  />
    </div>
        
    </>
  );

};

export default PrendaDetails;