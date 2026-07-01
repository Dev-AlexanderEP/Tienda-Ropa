# Endpoints del Frontend — Estado de Implementación

Listado completo de todos los endpoints que el frontend consume, con función JS, método HTTP, ruta, autenticación y estado de implementación.

> **Convención:** `r.data.data` — todas las respuestas siguen el envelope `ApiResponse<T>`.  
> **usuarioId:** nunca se envía desde el frontend; el backend lo extrae del JWT.

---

## Auth — `src/features/auth/api/authApi.js`

| Función JS | Método | Ruta | Auth | Estado |
|---|---|---|---|---|
| `login` | POST | `/api/auth/login` | Público | ✅ Correcto |
| `loginWithGoogle` | POST | `/api/auth/google` | Público | ✅ Correcto |
| `register` | POST | `/api/auth/register` | Público | ✅ Correcto |
| `changePassword` | POST | `/api/auth/change-password` | Bearer JWT | ✅ Correcto |

**Notas:**
- `login` y `register` no envían `Authorization` header — correcto para endpoints públicos.
- `changePassword` envía body `{ contraseniaActual, contraseniaNueva }` — el userId se toma del JWT.

---

## Carrito — `src/features/carrito/api/carritoApi.js`

### Endpoints de Carrito

| Función JS | Método | Ruta | Auth | Estado |
|---|---|---|---|---|
| `getCarritoAbierto` | GET | `/api/carritos/abierto/usuario/0` | CLIENTE | ✅ Correcto — usuarioId de ruta ignorado por el backend; usa JWT |
| `getCarrito` | GET | `/api/carritos/{id}` | CLIENTE | ✅ Correcto |
| `getCantidadItems` | GET | `/api/carritos/{id}/cantidad-items` | CLIENTE | ✅ Correcto |
| `createCarrito` | POST | `/api/carritos` | CLIENTE | ✅ Correcto — sin body, usuarioId del JWT |
| `updateCarrito` | PUT | `/api/carritos/{id}` | CLIENTE | ✅ Correcto — body es el string del estado directamente |
| `actualizarCarrito` | PUT | `/api/carritos/{id}` | CLIENTE | ✅ Correcto — alias de `updateCarrito("COMPLETADO")` |
| `deleteCarrito` | DELETE | `/api/carritos/{id}` | CLIENTE | ✅ Correcto |

### Endpoints de CarritoItem

| Función JS | Método | Ruta | Auth | Estado |
|---|---|---|---|---|
| `getCarritoItems` | GET | `/api/carrito-items/carrito/{carritoId}` | CLIENTE | ✅ Correcto — retorna items enriquecidos con prenda/talla |
| `agregarCarritoItem` | POST | `/api/carrito-items/agregar` | CLIENTE | ✅ Correcto — params: carritoId, prendaId, tallaId |
| `createCarritoItem` | POST | `/api/carrito-items` | CLIENTE | ✅ Correcto — body: carritoId, prendaTallaId, cantidad, precioUnitario |
| `updateItemCantidad` | PUT | `/api/carrito-items/{id}/cantidad` | CLIENTE | ✅ Correcto — param: cantidad |
| `deleteCarritoItem` | DELETE | `/api/carrito-items/{id}` | CLIENTE | ✅ Correcto |

### Endpoints de Stock (Prenda-Tallas)

| Función JS | Método | Ruta | Auth | Estado |
|---|---|---|---|---|
| `sumarUno` | PUT | `/api/prenda-tallas/stock/incremento` | ADMIN+CLIENTE | ✅ Correcto |
| `restarUno` | PUT | `/api/prenda-tallas/stock/decremento` | ADMIN+CLIENTE | ✅ Correcto |
| `sumarStock` | PUT | `/api/prenda-tallas/stock/suma` | ADMIN+CLIENTE | ✅ Correcto |

> ⚠️ **Discrepancia de URL:** `prendas.md` documenta la base como `/api/prendatallas` (sin guion), pero `carritoApi.js` usa `/api/prenda-tallas` (con guion). Verificar cuál es la ruta real del backend.

### Cupones / Descuentos

| Función JS | Método | Ruta | Auth | Estado |
|---|---|---|---|---|
| `aplicarCupon` (paso 1) | GET | `/api/descuento-codigos/codigo/{codigo}` | CLIENTE | ✅ Correcto |
| `aplicarCupon` (paso 2) | POST | `/api/descuento-usuarios` | CLIENTE | ✅ Correcto — body: `{ descuentoCodigoId }` |

---

## Ventas — `src/features/carrito/api/ventaApi.js`

| Función JS | Método | Ruta | Auth | Estado |
|---|---|---|---|---|
| `createVenta` | POST | `/api/ventas` | CLIENTE | ✅ Correcto — sin body, usuarioId del JWT |
| `getVenta` | GET | `/api/ventas/{id}` | ADMIN+CLIENTE | ✅ Correcto |
| `getSegundaPendiente` | GET | `/api/ventas/segunda-pendiente` | CLIENTE | ✅ Correcto |
| `deleteVenta` | DELETE | `/api/ventas/{id}` | ADMIN+CLIENTE | ✅ Correcto |
| `updateVenta` | PUT | `/api/ventas/{id}` | ADMIN+CLIENTE | ✅ Correcto — body: `{ estado }` |
| `actualizarVentaPagada` | PUT | `/api/ventas/{id}` | ADMIN+CLIENTE | ✅ Correcto — alias de `updateVenta(id, "PAGADO")` |
| `agregarDetallesDesdeCarrito` | POST | `/api/ventas/carrito-detalle` | CLIENTE | ✅ Correcto — body: `{ ventaId, carritoId }` |

> ⚠️ `ventas.md` documenta `PUT /api/ventas/{id}` y `DELETE /api/ventas/{id}` como solo ADMIN, pero el backend fue actualizado a ADMIN+CLIENTE. El MD de referencia está desactualizado.

---

## Envio — `src/features/envio/api/envioApi.js`

| Función JS | Método | Ruta | Auth | Estado |
|---|---|---|---|---|
| `getMisDirecciones` | GET | `/api/datos-envio/mis-direcciones` | CLIENTE | ✅ Correcto — sin usuarioId, usa JWT |
| `createDatosEnvio` | POST | `/api/datos-envio` | CLIENTE | ✅ Correcto — body validado con `CreateDatosEnvioBodySchema` |
| `updateDatosEnvio` | PUT | `/api/datos-envio/{id}` | CLIENTE | ⚠️ Sin validación Zod en body — considerar agregar |
| `deleteDatosEnvio` | DELETE | `/api/datos-envio/{id}` | CLIENTE | ✅ Correcto |
| `getEnvioTracking` | GET | `/api/envio/tracking/{trackingNumber}` | Público/CLIENTE | ✅ Correcto |
| `createEnvio` | POST | `/api/envio` | CLIENTE | ⚠️ Sin validación Zod en body — considerar agregar |
| `registrarDatosPersonalesYEnvio` | — | (compuesta) | — | ✅ Correcto — llama `createDatosEnvio` + `createEnvio` |

> ⚠️ `trackingNumber` generado aleatoriamente en el frontend (`registrarDatosPersonalesYEnvio`). Evaluar si el backend debería generarlo para garantizar unicidad.

---

## Pagos — `src/features/pagos/api/pagosApi.js`

| Función JS | Método | Ruta | Auth | Estado |
|---|---|---|---|---|
| `getMetodosPago` | GET | `/api/metodo-pago` | CLIENTE | ✅ Correcto |
| `createPago` | POST | `/api/pago` | CLIENTE | ✅ Correcto — body: `{ ventaId, metodoId }` |

---

## Catálogo / Prendas — `src/features/catalogo/api/catalogoApi.js`

| Función JS | Método | Ruta | Auth | Estado |
|---|---|---|---|---|
| `getPrendasPorGenero` | GET | `/api/prendas/con-descuentos-aleatorio/{genero}` | Bearer JWT | ✅ Correcto |
| `getPrendasFiltradas` | GET | `/api/prendas/filtro?{params}` | Bearer JWT | ✅ Correcto |
| `getTallasPorGenero` | GET | `/api/prendas/tallas-por-genero/{genero}` | Bearer JWT | ✅ Correcto |
| `getMarcasPorGenero` | GET | `/api/prendas/marcas-por-genero/{genero}` | Bearer JWT | ✅ Correcto |
| `getCategoriasPorGenero` | GET | `/api/prendas/categorias-por-genero/{genero}` | Bearer JWT | ✅ Correcto |
| `getEstadisticasPreciosPorGenero` | GET | `/api/prendas/precios-por-genero/{genero}` | Bearer JWT | ✅ Correcto |
| `getDescuentosPorGenero` | GET | `/api/prendas/descuentos-por-genero/{genero}` | Bearer JWT | ✅ Correcto |
| `buscarPorNombreGenero` | GET | `/api/prendas/busqueda-por-nombre-genero?{params}` | Bearer JWT | ✅ Correcto |
| `getPrendasFiltradasPorCategoria` | GET | `/api/prendas/filtro?{params}` | Bearer JWT | ✅ Correcto |
| `getTallasPorCategoria` | GET | `/api/prendas/tallas-por-categoria/{categoria}` | Bearer JWT | ✅ Correcto |
| `getMarcasPorCategoria` | GET | `/api/prendas/marcas-por-categoria/{categoria}` | Bearer JWT | ✅ Correcto |
| `getPreciosPorCategoria` | GET | `/api/prendas/precios-por-categoria/{categoria}` | Bearer JWT | ✅ Correcto |
| `getDescuentosPorCategoria` | GET | `/api/prendas/descuentos-por-categoria/{categoria}` | Bearer JWT | ✅ Correcto |
| `buscarPorNombreCategoria` | GET | `/api/prendas/busqueda?{params}` | Bearer JWT | ✅ Correcto |
| `getPrenda` | GET | `/api/prendas/{id}` | Bearer JWT | ❌ **ROTO** — ver abajo |

> ❌ **`getPrenda` / `PrendaDetailView.jsx` — PENDIENTE DE FIX:**
> - `PrendaResponseSchema` solo tiene IDs planos (`marcaId`, `categoriaId`, etc.) pero `PrendaDetailView.jsx` necesita `prenda.imagen.principal`, `prenda.marca.nomMarca`, `prenda.tallas`, `prenda.categoria.nomCategoria`, `prenda.proveedor.nomProveedor`.
> - El endpoint `GET /api/prendas/{id}` del nuevo backend no devuelve esas relaciones anidadas.
> - **Acción requerida:** O el backend necesita un endpoint `/api/prendas/{id}/detalle` que devuelva la prenda con relaciones, o `PrendaResponseSchema` y `PrendaDetailView.jsx` necesitan refactorizarse para hacer llamadas adicionales.

---

## Otros JSX con forma vieja del backend

| Archivo | Problema | Estado |
|---|---|---|
| `ResumenCompra.jsx` | Usaba `getCarrito()` + `carrito.carritoItems` + `item.prenda.imagen.principal` | ✅ Corregido: usa `getCarritoItems()` + `item.prenda.imagenPrincipal` |
| `EnvioTrackingView.jsx` | Usa `data.venta.detalles[].prenda.imagen.principal` y `data.datosPersonales` | ❌ **Pendiente** — `EnvioResponseSchema` no incluye `venta.detalles` ni `datosPersonales`. Hay que extender el schema con la respuesta real del endpoint `GET /api/envio/tracking/{trackingNumber}` |

---

## Resumen de usuarioId

| Archivo | ¿Enviaba usuarioId? | Estado |
|---|---|---|
| `carritoApi.js` → `getCarritoAbierto` | Sí — en URL path | ✅ Corregido: usa `0` como placeholder; backend ignora el valor |
| `carritoApi.js` → `createCarrito` | No — nunca tuvo | ✅ Correcto |
| `PrendaDetailView.jsx` | Sí — llamaba `getUsuarioId()` | ✅ Corregido: eliminado |
| `Frame3.jsx` | Sí — llamaba `getUsuarioId()` | ✅ Corregido: eliminado |
| `CarritoView.jsx` | No — ya corregido sesión anterior | ✅ Correcto |
| `Productos.jsx` | No | ✅ Correcto |
| `ventaApi.js` | No | ✅ Correcto |
| `envioApi.js` → `getMisDirecciones` | No — usa `/mis-direcciones` | ✅ Correcto |
| `authApi.js` | No | ✅ Correcto |
| `pagosApi.js` | No | ✅ Correcto |
| `userApi.js` → `getUsuarioId` | Sí — endpoint Spring obsoleto | ✅ Corregido: función eliminada |
