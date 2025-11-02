import { useParams } from "react-router-dom";
import { useState, useEffect } from "react"; // <--- AGREGA useEffect AQUÍ

import { Typography ,Tabs, IconButton,Timeline, Button } from "@material-tailwind/react";
import { ArrowLeftFromLine, ShoppingCart, ScrollText, Truck, Wallet    } from 'lucide-react';
import Productos from "./Productos"; // Asegúrate de que la ruta sea correcta
import ResumenCompra from "./ResumenCompra";
import DatosPersonales from "./DatosPersonales";
import Direccion from "./Direccion";
import MetodoPago from "./MetodoPago"; // Asegúrate de que la ruta sea correcta
import { useNavigate } from "react-router-dom";
import FooterC from "../../components/footer/Footer";
const CarritoPage = () => {
  const { id } = useParams();
  const [total, setTotal] = useState(0);
  const [ventaId, setVentaId] = useState(null);
    const navigate = useNavigate();
  const [step, setStep] = useState(0);
    const [datosPersonales, setDatosPersonales] = useState({
    correo: "",
    nombre: "",
    apellidos: "",
    documento: "",
    telefono: "",
    deseaFactura: false,
    novedades: false,
    acepta: false,
    departamento: "",
    provincia: "",
    distrito: "",
    calle: "",
    detalle: "",
    guardarData1: false,
    guardarData2: false,
  });
        const token = localStorage.getItem("accessToken");
// const API_BASE = "http://localhost:8080/api/v1";
const API_BASE = "https://mixmatch.zapto.org/api/v1";

// const API_BASE_BASE = "http://localhost:8080";
const API_BASE_BASE = "https://mixmatch.zapto.org";

  
  useEffect(() => {
    const fetchDireccionGuardada = async () => {
      try {
        // Obtener usuarioId
        const userRes = await fetch(`${API_BASE_BASE}/usuario-id`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usuarioId = await userRes.json();

        // Consultar direcciones guardadas
        const res = await fetch(`${API_BASE}/direcciones/usuario/${usuarioId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.object && data.object.length > 0) {
          const dir = data.object[0];
          setDatosPersonales(prev => ({
            ...prev,
            nombre: dir.nombres || "",
            apellidos: dir.apellidos || "",
            documento: dir.dni || "",
            telefono: dir.telefono || "",
            departamento: dir.departamento || "",
            provincia: dir.provincia || "",
            distrito: dir.distrito || "",
            calle: dir.calle || "",
            detalle: dir.detalle || "",
          }));
        }
      } catch (error) {
        console.error("No se pudo cargar la dirección guardada", error);
      }
    };

    fetchDireccionGuardada();
  }, []);
const [descuento, setDescuento] = useState(null);
  if (!id) {
    // Si no hay id, muestra una imagen o mensaje
    return (
  <>
    <div className="w-full h-[80px] flex justify-between items-center pl-[10%]">
      <div className="flex items-center h-full gap-10">
        <div className="font-KiwiFruit text-7xl flex">
          <p className="text-red-600">Mix</p>
          <p className=""> &Match</p>
        </div>
        <Typography color="blue-gray" className="text-center text-2xl font-Poppins">
          Carrito de compras
        </Typography>
      </div>
      <div
        className="flex items-center justify-center h-full w-[500px] cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <Typography color="blue-gray" className="text-center text-2xl font-Poppins flex items-center gap-5 ">
          <ArrowLeftFromLine className="w-9 h-9" />
          Seguir comprando
        </Typography>
      </div>
    </div>

    {/* Carrito vacío */}
    <div className="flex flex-col items-center justify-center w-full h-[60vh]">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-24 w-24 text-red-400 mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.293 2.293a1 1 0 00.083 1.32C6.406 17.07 7.18 17.5 8 17.5h8a1 1 0 00.91-.59l1.293-2.293M7 13l-1-2m10 2l1-2M6 21a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2z"
        />
      </svg>
      <Typography className="text-2xl font-Poppins text-gray-500 mb-2">
        Tu carrito está vacío
      </Typography>
      <Typography className="text-md font-Poppins text-gray-400">
        Agrega productos para verlos aquí.
      </Typography>
    </div>
  </>
);
  }
  let contenidoPaso = null;
  if (step === 0) {
    contenidoPaso = <Productos carritoId={id} onNextStep={() => setStep(step + 1)}
    descuento={descuento}
    setDescuento={setDescuento} 
    total={total}
  setTotal={setTotal}/>;
  } else if (step === 1) {
    contenidoPaso = (
    <div className="flex gap-8  w-full justify-center max-lg:flex-col max-lg:items-center">
      <div className=" ">
        <DatosPersonales
          datos={datosPersonales}
          setDatos={setDatosPersonales}
          onContinuar={() => setStep(step + 1)}
          carritoId={id} 
          ventaId={ventaId}
  setVentaId={setVentaId}
        />
      </div>
      <div className="w-[350px] max-lg:w-[90%]">
<ResumenCompra carritoId={id} descuento={descuento} onNextStep={() => setStep(0)} />      </div>
    </div>
  );
  } else if (step === 2) {
  contenidoPaso = (
    <div className="flex gap-8  w-full justify-center max-lg:flex-col max-lg:items-center">
      <div className="">
        <Direccion
          datos={datosPersonales}
          setDatos={setDatosPersonales}
          onContinuar={() => setStep(step + 1)}
        />
      </div>
      <div className="w-[350px] max-lg:w-[90%]">
<ResumenCompra carritoId={id} descuento={descuento} onNextStep={() => setStep(0)} />      </div>
    </div>
  );
} else if (step === 3) {
  contenidoPaso = (
    <div className="flex gap-8  w-full justify-center max-lg:flex-col max-lg:items-center">
      <div className="  flex items-center justify-center">
        <MetodoPago total={total} ventaId={ventaId}  carritoId={id} datos={datosPersonales} />
      </div>
      <div className="w-[350px] max-lg:w-[90%]">
<ResumenCompra carritoId={id} descuento={descuento} onNextStep={() => setStep(0)} />      </div>
    </div>
  );
}


  // Aquí va la lógica para mostrar el carrito con el id
  return (
    <>
        <div className="w-full h-[80px]   flex  justify-between  items-center   px-[10%] max-lg:justify-center max-lg:px-[20px] max-lg:gap-2">
            <div className="flex  items-center  h-full gap-10 max-lg:gap-5  max-md:gap-1"> 
                <div className="font-KiwiFruit text-7xl  flex  max-lg:text-5xl ">
                <p className="text-red-600">Mix</p>
                <p className=""> &Match</p>
                </div>
                    <Typography color="blue-gray" className=" text-center text-2xl font-Poppins max-lg:!text-xl">
                        Carrito de compras                                
                    </Typography>

            </div>
                        <div
              className="flex items-center justify-center h-full  w-[500px] cursor-pointer max-lg:w-[300px]  max-md:w-[200px]"
              onClick={() => navigate(-1)} // Esto te regresa a la página anterior
            >
              <Typography color="blue-gray" className="text-center text-2xl font-Poppins flex items-center gap-5 max-lg:!text-xl  max-lg:gap-2 max-md:!text-lg">
                <ArrowLeftFromLine className="w-9 h-9 max-lg:w-7 max-lg:h-7 "/>
                Seguir comprando 
              </Typography>
            </div>
        </div>
        <div className="px-[10%] w-full h-[230px] flex justify-center  flex-col items-center max-xl:px-[5%]">
          <div className="w-full ">
      <Timeline
        mode="stepper"
        value={step}
        className="relative "
        onChange={val => setStep(Number(val))}
      >
        <Timeline.Item disabled={step < 0} value={0} className="  w-full ">
            
          <Timeline.Header className="">
            <Timeline.Separator className="translate-x-1/2 group-data-[completed=true]:bg-red-400" />
            <Timeline.Icon className="mx-auto w-[50px] h-[50px] selected:bg-red-400 group-data-[active=true]:bg-red-500 group-data-[completed=true]:bg-red-500 ">
              <ShoppingCart className="h-7 w-7" />
            </Timeline.Icon>
          </Timeline.Header>

          <Timeline.Body className="text-center ">
            <Typography variant=""  className="text-xl font-Poppins max-xl:text-lg max-md:text-base" color={step >= 0 ? "blue" : "inherit"}>
              Carrito de compras
            </Typography>
            <Typography variant="small" className="max-xl:hidden">Detalles del carrito.</Typography>
          </Timeline.Body>
        </Timeline.Item>

        

        <Timeline.Item value={1} disabled={step < 1} className="w-full ">

          <Timeline.Header>
            <Timeline.Separator className="translate-x-1/2 group-data-[completed=true]:bg-red-400" />
            <Timeline.Icon className="mx-auto w-[50px] h-[50px] selected:bg-red-400 group-data-[active=true]:bg-red-500 group-data-[completed=true]:bg-red-500">
              <ScrollText className="h-7 w-7" />
            </Timeline.Icon>
          </Timeline.Header>

          <Timeline.Body className="text-center">
            <Typography variant="" className="text-xl font-Poppins max-xl:text-lg max-md:text-base" color={step >= 1 ? "blue" : "inherit"}>
              Datos personales
            </Typography>
            <Typography variant="small" className="max-xl:hidden" >Completa tus datos.</Typography>
          </Timeline.Body>

        </Timeline.Item>
        <Timeline.Item value={2} disabled={step < 2} className="w-full ">

          <Timeline.Header>
            <Timeline.Separator className="translate-x-1/2 group-data-[completed=true]:bg-red-400" />

            <Timeline.Icon className="mx-auto w-[50px] h-[50px] selected:bg-red-400 group-data-[active=true]:bg-red-500 group-data-[completed=true]:bg-red-500">
              <Truck className="h-7 w-7" />
            </Timeline.Icon>
          </Timeline.Header>

          <Timeline.Body className="text-center">
            <Typography variant="h6" className="text-xl font-Poppins max-xl:text-lg max-md:text-base" color={step >= 3 ? "blue" : "inherit"}>
              Tipos de entrega
            </Typography>
            <Typography variant="small" className="max-xl:hidden">Selecciona el tipo de entrega.</Typography>
          </Timeline.Body>

        </Timeline.Item>

        <Timeline.Item disabled={step < 3} value={3} className="w-full ">
            
          <Timeline.Header>
            <Timeline.Icon className="mx-auto w-[50px] h-[50px] selected:bg-red-400 group-data-[active=true]:bg-red-500 group-data-[completed=true]:bg-red-500">
              <Wallet className="h-7 w-7" />
            </Timeline.Icon>
          </Timeline.Header>
        <Timeline.Body className="text-center">
            <Typography variant="h6"  className="text-xl font-Poppins max-xl:text-lg max-md:text-base" color={step >= 3 ? "blue" : "inherit"}>
            Método de pago
            </Typography>
            <Typography variant="small" className="max-xl:hidden">Selecciona el método de pago.</Typography>
        </Timeline.Body>  

        </Timeline.Item>
        

      </Timeline>

      
            </div>
    {/* <div className="flex w-full justify-between gap-4 ">
        <Button
         disabled={step === 0} onClick={() => setStep(step - 1)}>
          Anterior
        </Button>
        <Button
        
          disabled={step === 3}
          onClick={() => setStep(step + 1)}
        >
          Siguiente
        </Button>
      </div> */}
        </div>
        <div className="w-full pb-[100px]">
        {contenidoPaso}
      </div>
      <FooterC></FooterC>
    </>
  );
};

export default CarritoPage;
