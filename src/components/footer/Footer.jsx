import { Typography, IconButton } from "@material-tailwind/react";
import { Facebook, Instagram, X, Github, Dribbble }  from 'lucide-react';
import AmericanExpress from "../../assets/images/footer/AmericanExpress.svg";
import Visa from "../../assets/images/footer/Visa.svg";
import Mastercard from "../../assets/images/footer/Mastercard.svg";
import DinersClub from "../../assets/images/footer/DinersClub.svg";
import libro from "../../assets/images/footer/libro.svg";
import familia from "../../assets/images/footer/familia.jpg";

const LINKS = [
  {
    title: "Servicio al Cliente",
    items: [
      {
        title: "Preguntas Frecuentes",
        href: "#",
      },
      {
        title: "Guia de Compras",
        href: "#",
      },
      {
        title: "Tiempos y costos de envío",
        href: "#",
      },
      {
        title: "Formas de pago",
        href: "#",
      },
      {
        title: "Cambios y Devoluciones ",
        href: "#",
      },
    ],
  },
  {
    title: "Legal",
    items: [
      {
        title: "Terminos y condiciones",
        href: "#",
      },
      {
        title: "Politica de privacidad",
        href: "#",
      },
      {
        title: "Libro de quejas y reclamos ",
        href: "#",
      },
    ],
  },
  {
    title: "Contáctenos",
    items: [
      {
        title: "servicioalcliente@tiendasm&m.com",
        href: "#",
      },
      {
        title: "9am - 6pm Lunes a Viernes",
        href: "#",
      },
      {
        title: "Av. Siempre Viva 1234",
        href: "#",
      },
    ],
  },
];

const YEAR = new Date().getFullYear();

export default function FooterC() {
  return (
    <footer className="relative w-full  overflow-hidden  "
    style={{ backgroundImage: `url(${familia})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
<div className="absolute inset-0 bg-white opacity-95"></div>
 
      <div className="mx-auto w-full max-w-7xl px-8  grid grid-flow-row p-5 relative z-10  ">
        <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-4   max-md:grid-cols-4">
            <div className=" flex  items-center justify-center   max-md:col-span-4">
                <Typography className="font-KiwiFruit text-red-600 font-normal !text-7xl max-lg:!text-5xl max-md:!text-6xl ">
                  Mix
                </Typography>
                <Typography className="font-KiwiFruit font-normal !text-7xl max-lg:!text-5xl max-md:!text-6xl">
                  &Match
                </Typography>
                
            </div>
          <div className="grid grid-cols-3 justify-between gap-x-6 gap-y-4  col-span-3 max-md:grid-cols-1 max-md:col-span-4 ">
            {LINKS.map(({ title, items }) => (
              <ul key={title} className=" max-md:flex max-md:flex-col max-md:items-center ">
                <Typography className="mb-2 font-semibold ">
                  {title}
                </Typography>
                {items.map(({ title, href }) => (
                  <li key={title}>
                    <Typography
                      as="a"
                      href={href}
                      className="py-1 hover:text-primary flex r"
                    >
                        {title}
                    </Typography>
                        {title === "Libro de quejas y reclamos " && (
                            <a href="#">
                                <img src={libro} alt="Libro de quejas" className="inline h-[90px] w-[100px] " />
                            </a>
                        )}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <div className="flex w-full items-center justify-evenly   py-4 h-[100px] flex-wrap max-md:h-auto gap-y-4">
            <img src={AmericanExpress} alt="American Express" />
            <img src={Visa} alt="Visa" />
            <img src={Mastercard} alt="Mastercard" />
            <img src={DinersClub} alt="Diners Club" />
        </div>
        <div className=" flex w-full flex-col items-center justify-center gap-4  ">
            <Typography className="w-full text-center text-[10px]" >
           El uso de este sitio web implica la aceptación de los    Términos y Condiciones   y de las   Políticas de Privacidad   de W&W S.A. Las foto son a modo ilustrativo. Los precios publicados en nuestra página web   www.tiendasw&w.com   son validos exclusivamente vía internet. Las promociones son válidas el día de hoy, sotcl minimo 1 unidad, promociones no acumulables.
            </Typography>
        </div>
      </div>
        <div className="bg-red-200 w-full flex flex-col py-2 relative z-10 ">
            <Typography type="small" className="text-center">
                &copy; {YEAR}{" "} El S.A.C. Todos los derechos reservados.
            </Typography>
            <div className="flex gap-1 sm:justify-center  max-md:justify-center">
                <IconButton
                as="a"
                href="#"
                color="secondary"
                variant="ghost"
                size="sm"
                >
                <Facebook className="h-4 w-4" />
                </IconButton>
                <IconButton
                as="a"
                href="#"
                color="secondary"
                variant="ghost"
                size="sm"
                >
                <Instagram className="h-4 w-4" />
                </IconButton>
                <IconButton
                as="a"
                href="#"
                color="secondary"
                variant="ghost"
                size="sm"
                >
                <X className="h-4 w-4" />
                </IconButton>
                <IconButton
                as="a"
                href="#"
                color="secondary"
                variant="ghost"
                size="sm"
                >
                <Github className="h-4 w-4" />
                </IconButton>
                <IconButton
                as="a"
                href="#"
                color="secondary"
                variant="ghost"
                size="sm"
                >
                <Dribbble className="h-4 w-4" />
                </IconButton>
            </div>
        </div>

    </footer>
  );
}
