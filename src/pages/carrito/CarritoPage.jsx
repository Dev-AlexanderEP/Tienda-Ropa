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

  
  useEffect(() => {
    const fetchDireccionGuardada = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        // Obtener usuarioId
        const userRes = await fetch("http://127.0.0.1:8080/usuario-id", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const usuarioId = await userRes.json();

        // Consultar direcciones guardadas
        const res = await fetch(`http://localhost:8080/api/v1/direcciones/usuario/${usuarioId}`);
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
      <div className="flex flex-col items-center justify-center h-96">
        <img src="/no-cart.png" alt="No hay carrito" className="w-40 h-40 mb-4" />
        <p className="text-gray-500 text-lg">No tienes un carrito activo.</p>
      </div>
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
    <div className="flex gap-8  w-full justify-center">
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
      <div className="w-[350px]">
<ResumenCompra carritoId={id} descuento={descuento} onNextStep={() => setStep(0)} />      </div>
    </div>
  );
  } else if (step === 2) {
  contenidoPaso = (
    <div className="flex gap-8  w-full justify-center">
      <div className="">
        <Direccion
          datos={datosPersonales}
          setDatos={setDatosPersonales}
          onContinuar={() => setStep(step + 1)}
        />
      </div>
      <div className="w-[350px]">
        <ResumenCompra carritoId={id} descuento={descuento} onNextStep={() => setStep(0)} /> 
      </div>
    </div>
  );
} else if (step === 3) {
  contenidoPaso = (
    <div className="flex gap-8  w-full justify-center">
      <div className="  flex items-center justify-center">
        <MetodoPago total={total} ventaId={ventaId}  carritoId={id} datos={datosPersonales} />
      </div>
      <div className="w-[350px]">
        <ResumenCompra carritoId={id} descuento={descuento} onNextStep={() => setStep(0)} />
      </div>
    </div>
  );
}


  // Aquí va la lógica para mostrar el carrito con el id
  return (
    <>
        <div className="w-full h-[80px]   flex  justify-between  items-center pl-[10%]">
            <div className="flex  items-center  h-full gap-10  ">
                <div className="font-KiwiFruit text-7xl  flex  ">
                <p className="text-red-600">Mix</p>
                <p className=""> &Match</p>
                </div>
                    <Typography color="blue-gray" className=" text-center text-2xl font-Poppins ">
                        Carrito de compras                                
                    </Typography>

            </div>
                        <div
              className="flex items-center justify-center h-full  w-[500px] cursor-pointer"
              onClick={() => navigate(-1)} // Esto te regresa a la página anterior
            >
              <Typography color="blue-gray" className="text-center text-2xl font-Poppins flex items-center gap-5 ">
                <ArrowLeftFromLine className="w-9 h-9"/>
                Seguir comprando 
              </Typography>
            </div>
        </div>
        <div className="px-[10%] w-full h-[230px] flex justify-center  flex-col items-center">
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
            <Typography variant=""  className="text-xl font-Poppins" color={step >= 0 ? "blue" : "inherit"}>
              Carrito de compras
            </Typography>
            <Typography variant="small">Detalles del carrito.</Typography>
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
            <Typography variant="" className="text-xl font-Poppins" color={step >= 1 ? "blue" : "inherit"}>
              Datos personales
            </Typography>
            <Typography variant="small">Completa tus datos.</Typography>
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
            <Typography variant="h6" className="text-xl font-Poppins" color={step >= 3 ? "blue" : "inherit"}>
              Tipos de entrega
            </Typography>
            <Typography variant="small">Selecciona el tipo de entrega.</Typography>
          </Timeline.Body>

        </Timeline.Item>

        <Timeline.Item disabled={step < 3} value={3} className="w-full ">
            
          <Timeline.Header>
            <Timeline.Icon className="mx-auto w-[50px] h-[50px] selected:bg-red-400 group-data-[active=true]:bg-red-500 group-data-[completed=true]:bg-red-500">
              <Wallet className="h-7 w-7" />
            </Timeline.Icon>
          </Timeline.Header>
        <Timeline.Body className="text-center">
            <Typography variant="h6"  className="text-xl font-Poppins" color={step >= 3 ? "blue" : "inherit"}>
            Método de pago
            </Typography>
            <Typography variant="small">Selecciona el método de pago.</Typography>
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
