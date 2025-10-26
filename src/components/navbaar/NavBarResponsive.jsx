import React, { useEffect, useState } from 'react';
import { ShoppingCart, Truck, User, ChevronRight,ChevronDown, AlignJustify, X } from 'lucide-react';
import FlyoutLink from './FlyoutLink';
import FlyoutLinkResponsive from './FlyoutLinkResponsive';
import { Button, Badge, IconButton } from "@material-tailwind/react";
import CategoryFlyoutContent from "./CategoryFlyoutContent";
import InfantilCategory from './InfantilCategory';
import BasicosCategory from './BasicosCategory';
import { useNavigate } from "react-router-dom";
import { mujerLinks, mujerbasicosLinks, mujeraccesoriosLinks } from './DataNav';
import { hombreLinks, hombrebasicosLinks, hombreaccesoriosLinks } from './DataNav';
import { ninosLinks, ninasLinks, accesoriosLinks } from './DataNav';
import mujer1 from "../../assets/images/nav/mujer1.png"
import mujer2 from "../../assets/images/nav/mujer2.png"
import hombre1 from "../../assets/images/nav/hombre1.png"
import hombre2 from "../../assets/images/nav/hombre2.png"
import nino1 from "../../assets/images/nav/nino1.png"
import nino2 from "../../assets/images/nav/nino2.png"
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const NAV_MENUS = [
  { label: "Mujer", icon: <ChevronRight className="w-5 h-5 cursor-pointer" />, href: "/categoria/mujer" },
  { label: "Hombre", icon: <ChevronRight className="w-5 h-5 cursor-pointer" />, href: "/categoria/hombre" },
  { label: "Infantil", icon: <ChevronRight className="w-5 h-5 cursor-pointer" />, href: "/categoria/infantil" },
  { label: "Basicos", icon: <ChevronRight className="w-5 h-5 cursor-pointer" />, href: "/categoria/basicos"  },
];

const sidebarVariants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: '0%', opacity: 1, transition: { type: "spring", stiffness: 320, damping: 40 } },
  exit: { x: '-100%', opacity: 0, transition: { duration: 0.18 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.35, transition: { duration: 0.15 }},
  exit: { opacity: 0, transition: { duration: 0.12 }},
};

const NavBarResponsive = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      axios.get('/usuarios', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoadingUser(false));
    } else {
      setUser(null);
      setLoadingUser(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('cartCount');
    setCartCount(0);
    window.dispatchEvent(new Event('cart-updated'));
    setUser(null);
  };

  const [cartCount, setCartCount] = useState(() => {
    const count = Number(localStorage.getItem('cartCount'));
    return isNaN(count) ? 0 : count;
  });

  useEffect(() => {
    const updateCartCount = () => {
      const count = Number(localStorage.getItem('cartCount'));
      setCartCount(isNaN(count) ? 0 : count);
    };
    window.addEventListener('cart-updated', updateCartCount);
    updateCartCount();
    return () => window.removeEventListener('cart-updated', updateCartCount);
  }, []);

  const handleCartClick = () => {
    const carritoId = localStorage.getItem('carritoId');
    if (carritoId) {
      navigate(`/carrito/${carritoId}`);
    } else {
      navigate(`/carrito`);
    }
  };

  // Close sidebar when route changes
  useEffect(() => {
    if (!sidebarOpen) return;
    const closeSidebar = () => setSidebarOpen(false);
    window.addEventListener('popstate', closeSidebar);
    return () => window.removeEventListener('popstate', closeSidebar);
  }, [sidebarOpen]);

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            key="overlay"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={overlayVariants}
            className="fixed inset-0 z-40 bg-black"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            key="sidebar"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={sidebarVariants}
            className="fixed top-0 left-0 z-50 h-full w-[270px] bg-white shadow-xl flex flex-col py-6 px-5"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="font-KiwiFruit text-4xl flex">
                <p className="text-red-600">Mix</p>
                <p>&Match</p>
              </div>
              <button
                className="p-2 rounded hover:bg-gray-100"
                onClick={() => setSidebarOpen(false)}
                aria-label="Cerrar menú"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {NAV_MENUS.map((item) => (        
                <FlyoutLinkResponsive
                    key={item.label}
                    href={item.href}
                >
                    {item.label}
                </FlyoutLinkResponsive>
              ))}
            </nav>
            <div className="mt-auto pt-10 flex flex-col gap-2">
              {!loadingUser && (
            user ? (
              <Button
                variant="ghost"
                className='bg-red-200 hover:bg-red-300 text-[16px] text-gray-800 font-Poppins px-4 py-2 rounded h-[50px] '
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            ) : (
              <Button
                as="a"
                href="/login"
                variant="ghost"
                className='bg-red-200 hover:bg-red-300 text-[16px] text-gray-800 font-Poppins px-4 py-2 rounded h-[50px] max-lg:text-[13px] max-lg:h-[40px] max-md:text-[11px]'
              >
                Iniciar Sesión
              </Button>
            )
          )}
              <Button
                as="a"
                href="/envio"
                variant="ghost"
                className='bg-gray-200 hover:bg-gray-300 text-[16px] text-gray-800 font-Poppins px-4 py-2 rounded flex items-center gap-2'
              >
                <Truck className="h-5 w-5" /> Envíos
              </Button>
              <Button
                as="a"
                href="/carrito"
                variant="ghost"
                className='bg-gray-200 hover:bg-gray-300 text-[16px] text-gray-800 font-Poppins px-4 py-2 rounded flex items-center gap-2'
              >
                <ShoppingCart className="h-5 w-5" /> Carrito
                {cartCount > 0 && (
                  <span className="ml-2 bg-red-600 text-white rounded-full px-2 py-0.5 text-xs">{cartCount}</span>
                )}
              </Button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
      {/* Main Navbar */}
      <nav className="flex items-center justify-between px-[3%] shadow-md bg-white h-[80px]">
        {/* Hamburger */}
        <button
          aria-label="Abrir menú"
          className="mr-3 p-2 rounded hover:bg-gray-100 lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          <AlignJustify />
        </button>
        {/* Logo */}
        <a href="/">
          <div className="font-KiwiFruit text-6xl flex max-lg:text-5xl max-md:text-4xl">
            <p className="text-red-600">Mix</p>
            <p>&Match</p>
          </div>
        </a>
       {/* Menú principal */}
      <div className='h-full max-lg:hidden '>

        <ul className="flex items-center h-full  text-sm font-medium gap-4 text-gray-700 font-Poppins ">
            <FlyoutLink
              href="#"
              FlyoutContent={() => (
                <CategoryFlyoutContent
                  title="Moda Mujer"
                  moda={mujerLinks}
                  basicos={mujerbasicosLinks}
                  accesorios={mujeraccesoriosLinks}
                  images={[mujer1, mujer2]}
                  buttonLabel="Ver Todo"
                  buttonHref="/mujer/todas-las-prendas"
                />
              )}
            >
            Mujer
            <ChevronDown className="w-5 h-5 cursor-pointer" />
          </FlyoutLink>

          <FlyoutLink href="#" 
            FlyoutContent={() => (
                    <CategoryFlyoutContent
                    title="Moda Hombre"
                    moda={hombreLinks}
                    basicos={hombrebasicosLinks}
                    accesorios={hombreaccesoriosLinks}
                    images={[hombre1, hombre2]}
                    buttonLabel="Ver Todo"  
                      buttonHref="/hombre/todas-las-prendas"
                    />
                )} 
            >
            Hombre
            <ChevronDown className="w-5 h-5 cursor-pointer" />
          </FlyoutLink> 
          <FlyoutLink href="#" 
            FlyoutContent={() => (
                    <InfantilCategory
                    ninias={ninasLinks}
                    ninios={ninosLinks}
                    accesorios={accesoriosLinks}
                    img={[nino1, nino2]}
                    buttonLabel="Ver Todo"
                    buttonHref="/infantil/todas-las-prendas"
                    />
                )} 
            >
            Infantil
            <ChevronDown className="w-5 h-5 cursor-pointer" />
          </FlyoutLink>
          <FlyoutLink 
            href="#" 
            FlyoutContent={() => (
                  <BasicosCategory
                    basicosMujer={mujerbasicosLinks}
                    basicosHombre={hombrebasicosLinks}
                    accesorioMujer={mujeraccesoriosLinks}
                    accesorioHombre={hombreaccesoriosLinks}
                    img={[mujer1, mujer2]}
                  />
              )} 
            >
            Basicos
            <ChevronDown className="w-5 h-5 cursor-pointer" />
          </FlyoutLink>
        </ul>
      </div>
        {/* Iconos + botón */}
        <div className="flex items-center gap-10 h-[50px] max-lg:gap-5 max-md:gap-3">
          <div className='flex gap-5 max-md:gap-2'>
            <Badge content={cartCount > 0 ? cartCount : undefined}>
              <Badge.Content>
                <IconButton color="" className='hover:shadow-none border-none' onClick={handleCartClick}>
                  <ShoppingCart className="h-7 w-7 stroke-2 max-lg:h-6 max-lg:w-6 max-md:h-5 max-md:max-md:w-5" />
                </IconButton>
              </Badge.Content>
              <Badge.Indicator>{cartCount > 0 ? cartCount : null}</Badge.Indicator>
            </Badge>
            <Link to="/envio">
              <IconButton color="" className="hover:shadow-none border-none">
                <Truck className="h-7 w-7 stroke-2 max-lg:h-6 max-lg:w-6 max-md:max-md:h-5 max-md:max-md:w-5" />
              </IconButton>
            </Link>
          </div>
          {!loadingUser && (
            user ? (
              <Button
                variant="ghost"
                className='bg-red-200 hover:bg-red-300 text-[16px] text-gray-800 font-Poppins px-4 py-2 rounded h-[50px] max-lg:text-[13px] max-lg:h-[40px] max-md:text-[11px]'
                onClick={handleLogout}
              >
                Cerrar Sesión
              </Button>
            ) : (
              <Button
                as="a"
                href="/login"
                variant="ghost"
                className='bg-red-200 hover:bg-red-300 text-[16px] text-gray-800 font-Poppins px-4 py-2 rounded h-[50px] max-lg:text-[13px] max-lg:h-[40px] max-md:text-[11px]'
              >
                Iniciar Sesión
              </Button>
            )
          )}
        </div>
      </nav>
    </>
  );
};

export default NavBarResponsive;