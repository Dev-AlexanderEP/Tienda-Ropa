import React, { useEffect, useState } from 'react';

import { ShoppingCart, Truck, User, ChevronDown  } from 'lucide-react';
import FlyoutLink from './FlyoutLink';
import { Button, Badge, IconButton } from "@material-tailwind/react";
import CategoryFlyoutContent from "./CategoryFlyoutContent";
import InfantilCategory from './InfantilCategory';
import BasicosCategory from './BasicosCategory';

import { useNavigate } from "react-router-dom"; // <-- AGREGA ESTO


import { mujerLinks, mujerbasicosLinks, mujeraccesoriosLinks } from './DataNav';
import { hombreLinks, hombrebasicosLinks, hombreaccesoriosLinks } from './DataNav';
import { ninosLinks, ninasLinks, accesoriosLinks } from './DataNav';

import mujer1 from "../../assets/images/nav/mujer1.png"
import mujer2 from "../../assets/images/nav/mujer2.png"
import hombre1 from "../../assets/images/nav/hombre1.png"
import hombre2 from "../../assets/images/nav/hombre2.png"
import nino1 from "../../assets/images/nav/nino1.png"
import nino2 from "../../assets/images/nav/nino2.png"
// Si DataNav.jsx está en src/components/Navbar/DataNav.jsx
import axios from "axios";
import { Link } from "react-router-dom";


const Navbar = () => {
  const [user, setUser] = useState(null);
const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate(); // <-- Y ESTO


useEffect(() => {
  const accessToken = localStorage.getItem('accessToken');
  if (accessToken) {
    axios.get('http://localhost:8080/usuarios', {
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
  localStorage.removeItem('cartCount'); // Limpia el contador del carrito
  setCartCount(0); // Actualiza el estado local
  window.dispatchEvent(new Event('cart-updated')); // Notifica a otros componentes
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

  return (
    <nav className="flex items-center justify-between px-[10%] shadow-md bg-white  h-[80px]  ">
      {/* Logo */}
      <a href="/">
        <div className="font-KiwiFruit text-6xl  flex ">
          <p className="text-red-600">Mix</p>
          <p className=""> &Match</p>
        </div>
      </a>

      {/* Menú principal */}
      <div className='h-full  '>

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
                  buttonHref="#"
                />
              )} >
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
                  buttonHref="#"
                />
              )} >
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
                    buttonLabel="Ver Todo"
                    buttonHref="#"
                  />
              )} 
            >
            Basicos
            <ChevronDown className="w-5 h-5 cursor-pointer" />
          </FlyoutLink>
        </ul>
      </div>
      {/* Iconos + botón */}
      <div className="flex items-center gap-10   h-[50px] ">
        <div className='flex gap-5'>
            

                <Badge content={cartCount > 0 ? cartCount : undefined}>
                <Badge.Content>
                  <IconButton color="" className='hover:shadow-none border-none'
                  onClick={handleCartClick}>
                  <ShoppingCart className="h-7 w-7 stroke-2" />
                  </IconButton>
              </Badge.Content>
              <Badge.Indicator>{cartCount > 0 ? cartCount : null}</Badge.Indicator>
            </Badge>
          <Link to="/envio">
  <IconButton color="" className="hover:shadow-none border-none">
    <Truck className="h-7 w-7 stroke-2" />
  </IconButton>
</Link>
        </div>
        {!loadingUser && (
    user ? (
      <Button
        variant="ghost"
        className='bg-red-200 hover:bg-red-300 text-[16px] text-gray-800 font-Poppins px-4 py-2 rounded h-[50px]'
        onClick={handleLogout}
      >
        Cerrar Sesión
      </Button>
    ) : (
      <Button
        as="a"
        href="/login"
        variant="ghost"
        className='bg-red-200 hover:bg-red-300 text-[16px] text-gray-800 font-Poppins px-4 py-2 rounded h-[50px]'
      >
        Iniciar Sesión
      </Button>
    )
  )}
      </div>
    </nav>
  );
};


export default Navbar;
