import './index.css';
import './assets/fonts/fonts.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import FilterPage from './pages/filtros/filter';
import PrendaDetails from './pages/filtros/prendaDetails';
import CarritoPage from './pages/carrito/CarritoPage';
import EnvioTrackingPage from './pages/envio/EnvioTrackingPage';
const Index = lazy(() => import("./pages/index/index"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));

import { mujerLinks, mujerbasicosLinks, mujeraccesoriosLinks } from './components/navbaar/DataNav';
import { hombreLinks, hombrebasicosLinks, hombreaccesoriosLinks } from './components/navbaar/DataNav';
import { ninosLinks, ninasLinks, accesoriosLinks } from './components/navbaar/DataNav';
import CategoryContent from './components/navbaar/categorias/CategoryContent';
import BasicosContent from './components/navbaar/categorias/BasicosContent';
import InfantilContent from './components/navbaar/categorias/InfantilContent';

import AllPrendas from './pages/filtros/AllPrendas';
function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Suspense fallback={<div>Cargando...</div>}><Index /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<div>Cargando...</div>}><Login /></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<div>Cargando...</div>}><Register /></Suspense>} />
          <Route path="/mujer/:categoria" element={<Suspense fallback={<div>Cargando...</div>}><FilterPage /></Suspense>} />
          <Route path="/hombre/:categoria" element={<Suspense fallback={<div>Cargando...</div>}><FilterPage /></Suspense>} />
          <Route path="/infantil-ninios/:categoria" element={<Suspense fallback={<div>Cargando...</div>}><FilterPage /></Suspense>} />
          <Route path="/infantil-ninias/:categoria" element={<Suspense fallback={<div>Cargando...</div>}><FilterPage /></Suspense>} />

          <Route path="/mujer/:categoria/:id/:descuento" element={<Suspense fallback={<div>Cargando...</div>}><PrendaDetails /></Suspense>} />
          <Route path="/hombre/:categoria/:id/:descuento" element={<Suspense fallback={<div>Cargando...</div>}><PrendaDetails /></Suspense>} />
          <Route path="/infantil/:categoria/:id/:descuento" element={<Suspense fallback={<div>Cargando...</div>}><PrendaDetails /></Suspense>} />
          <Route
            path="/carrito/:id"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <CarritoPage />
              </Suspense>
            }
          />
          <Route
            path="/carrito"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <CarritoPage />
              </Suspense>
            }
          />
          <Route
            path="/envio"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <EnvioTrackingPage />
              </Suspense>
            }
          />
          <Route
            path="/tracking/:tracking"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <EnvioTrackingPage />
              </Suspense>
            }
          />

          // Mujer
<Route
  path="/categoria/mujer"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
      <CategoryContent
        categoryName="Mujer"
        mainLinks={mujerLinks}
        basicosLinks={mujerbasicosLinks}
        accesoriosLinks={mujeraccesoriosLinks}
      />
    </Suspense>
  }
/>

{/* Hombre */}
<Route
  path="/categoria/hombre"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
      <CategoryContent
        categoryName="Hombre"
        mainLinks={hombreLinks}
        basicosLinks={hombrebasicosLinks}
        accesoriosLinks={hombreaccesoriosLinks}
      />
    </Suspense>
  }
/>

{/* Infantil */}
<Route
  path="/categoria/infantil"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
      <InfantilContent
        categoryName="Infantil"
        mainLinks={ninosLinks}
        basicosLinks={ninasLinks}
      />
    </Suspense>
  }
/>
{/* // Mujer */}
<Route
  path="/categoria/mujer"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
      <CategoryContent
        categoryName="Mujer"
        mainLinks={mujerLinks}
        basicosLinks={mujerbasicosLinks}
        accesoriosLinks={mujeraccesoriosLinks}
      />
    </Suspense>
  }
/>

{/* Hombre */}
<Route
  path="/categoria/hombre"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
      <CategoryContent
        categoryName="Hombre"
        mainLinks={hombreLinks}
        basicosLinks={hombrebasicosLinks}
        accesoriosLinks={hombreaccesoriosLinks}
      />
    </Suspense>
  }
/>

{/* Infantil */}
<Route
  path="/categoria/infantil"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
      <InfantilContent
        categoryName="Infantil"
        mainLinks={ninosLinks}
        basicosLinks={ninasLinks}
      />
    </Suspense>
  }
/>
<Route
  path="/categoria/basicos"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
      <BasicosContent
  mujerBasicos={mujerbasicosLinks}
  mujerAccesorios={mujeraccesoriosLinks}
  hombreBasicos={hombrebasicosLinks}
  hombreAccesorios={hombreaccesoriosLinks}
  infantilBasicos={ninosLinks}
  infantilAccesorios={accesoriosLinks}
/>
    </Suspense>
  }
/>

{/* // Mujer */}
<Route
  path="/mujer/todas-las-prendas"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
            <AllPrendas/>

    </Suspense>
  }
/>
<Route
  path="/hombre/todas-las-prendas"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
            <AllPrendas/>

    </Suspense>
  }
/>
<Route
  path="/infantil/todas-las-prendas"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
      <AllPrendas/>
    </Suspense>
  }
/>

        </Routes>
      </Router>
    </>
  )
}

export default App