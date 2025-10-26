import { ArrowRight } from "lucide-react";
import React, { useEffect, useRef } from "react";

export default function PedidoTrackingForm({ tracking, setTracking, handleSearch }) {
  // Autofocus input only if not pre-filled (i.e., if tracking is empty)
  const inputRef = useRef();
  useEffect(() => {
    if (!tracking && inputRef.current) inputRef.current.focus();
  }, [tracking]);

  return (
    <div className="max-w-xl mx-auto mt-10 mb-10  h-[200px]">
      {/* Título */}
      <h1 className="text-4xl font-bold text-center mb-2" style={{ fontFamily: "inherit" }}>
        Sigue tu pedido aquí
      </h1>
      {/* Subtítulo */}
      <p className="text-center text-base text-black mb-6" style={{ fontFamily: "inherit" }}>
        Para saber el estado de tu pedido, ingresa tu número de pedido que te enviamos al correo en el momento de realizar tu compra:
      </p>
      {/* Formulario */}
      <form onSubmit={handleSearch} className="flex w-full">
        <input
          ref={inputRef}
          type="text"
          placeholder="Codigo de Pedido "
          value={tracking}
          onChange={(e) => setTracking(e.target.value)}
          className="flex-1 h-12 border border-black border-r-0 rounded-l-none rounded-l-md outline-none px-4 text-base placeholder:text-gray-400"
          style={{
            fontFamily: "inherit",
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0,
            borderRight: "none",
          }}
        />
        <button
          type="submit"
          className="flex items-center justify-center h-12 px-8 bg-red-600 text-white text-lg font-semibold rounded-r-md transition-colors hover:bg-[#b21e13]"
          style={{
            fontFamily: "inherit",
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            letterSpacing: ".5px"
          }}
        >
          Rastrear <ArrowRight className="ml-2 h-5 w-5" />
        </button>
      </form>
    </div>
  );
}