import './index.css';
import './assets/fonts/fonts.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import FilterPage from './pages/filtros/filter';
import PrendaDetails from './pages/filtros/prendaDetails';
import CarritoPage from './pages/carrito/CarritoPage';
const Index = lazy(() => import("./pages/index/index"));
const Login = lazy(() => import("./pages/login"));
const Register = lazy(() => import("./pages/register"));

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Suspense fallback={<div>Cargando...</div>}><Index /></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<div>Cargando...</div>}><Login /></Suspense>} />
          <Route path="/register" element={<Suspense fallback={<div>Cargando...</div>}><Register /></Suspense>} />
          <Route path="/mujer/:categoria" element={<Suspense fallback={<div>Cargando...</div>}><FilterPage /></Suspense>} />
          <Route path="/mujer/:categoria/:id/:descuento" element={<Suspense fallback={<div>Cargando...</div>}><PrendaDetails /></Suspense>} />
          <Route
  path="/mujer/carrito/:id"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
      <CarritoPage />
    </Suspense>
  }
/>
<Route
  path="/mujer/carrito"
  element={
    <Suspense fallback={<div>Cargando...</div>}>
      <CarritoPage />
    </Suspense>
  }
/>
        </Routes>
      </Router>
    </>
  )
}

export default App