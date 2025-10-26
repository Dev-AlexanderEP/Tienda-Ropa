import React from "react";
import img1c from "../../assets/images/index/frame8/img1c.svg";
import img2c from "../../assets/images/index/frame8/img2c.svg";
import img3c from "../../assets/images/index/frame8/img3c.svg";

export default function Frame8() {
  return (
    <div className="
      w-full 
      border-t border-gray-200 
      bg-white 
      py-8 md:py-12 
      px-2 sm:px-6 md:px-12 
      flex flex-col md:flex-row items-center 
      gap-10 md:gap-8 lg:gap-12
      min-h-[450px] 
      "
    >
      {/* Left section */}
      <div className="
        flex-1 flex flex-col justify-center
        pr-0 md:pr-8
        border-b md:border-b-0 md:border-r border-gray-200
        mb-7 md:mb-0
        max-w-full
      ">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#222] font-[Poppins] mb-2 leading-tight">
          ¿Cambios o devoluciones?
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-[#222] font-[Poppins] mb-6 md:mb-7 leading-relaxed max-w-xl">
          En nuestra tienda online puedes comprar con total confianza, si deseas devolver o cambiar una prenda por otra talla, puedes hacerlo de manera simple y rápida.
        </p>
        <button
          className="bg-black text-white font-bold font-[Poppins] max-md:text-[12px] text-sm sm:text-base px-6 sm:px-7 py-3 rounded-none shadow-none outline-none transition hover:bg-[#222] w-fit"
        >
          VER TÉRMINOS Y CONDICIONES
        </button>
      </div>
      {/* Steps */}
      <div
  className="
    flex-[2]
    grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
    gap-y-8 sm:gap-y-10 md:gap-y-10
    gap-x-6 sm:gap-x-8 lg:gap-x-12
    w-full items-start
    justify-center
  "
>
  {/* Paso 1 */}
  <div className="flex flex-col items-center text-center px-2 sm:px-3 max-w-[300px] mx-auto">
    <div className="flex items-center mb-1 sm:mb-2">
      <span className="text-2xl sm:text-3xl font-extrabold text-[#bb2427] font-[Poppins] mr-2">1.</span>
      <img src={img1c} alt="" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-0 sm:mb-1" />
    </div>
    <p className="text-xs sm:text-[15px] text-[#222] font-[Poppins] font-normal leading-tight">
      Asegúrate que el producto que devuelvas se encuentre en perfecto estado y sin señales de uso, con sus accesorios y etiquetas.
    </p>
  </div>
  {/* Paso 2 */}
  <div className="flex flex-col items-center text-center px-2 sm:px-3 max-w-[300px] mx-auto">
    <div className="flex items-center mb-1 sm:mb-2">
      <span className="text-2xl sm:text-3xl font-extrabold text-[#bb2427] font-[Poppins] mr-2">2.</span>
      <img src={img2c} alt="" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-0 sm:mb-1" />
    </div>
    <p className="text-xs sm:text-[15px] text-[#222] font-[Poppins] font-normal leading-tight">
      Lleva el producto que deseas devolver o cambiar a la tienda Topitop más cercana.
    </p>
  </div>
  {/* Paso 3 */}
  <div className="flex flex-col items-center text-center px-2 sm:px-3 max-w-[300px] mx-auto">
    <div className="flex items-center mb-1 sm:mb-2">
      <span className="text-2xl sm:text-3xl font-extrabold text-[#bb2427] font-[Poppins] mr-2">3.</span>
      <img src={img3c} alt="" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-0 sm:mb-1" />
    </div>
    <p className="text-xs sm:text-[15px] text-[#222] font-[Poppins] font-normal leading-tight">
      Te emitiremos una nota de crédito para que puedas volver a adquirir la prenda en tu talla correcta o podrás solicitar la devolución de tu dinero.
    </p>
  </div>
</div>
    </div>
  );
}