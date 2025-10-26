import React from "react";
import { motion } from "framer-motion";
import vid from "../../assets/images/index/frame3/vid.mp4";

export default function Frame4() {
  return (
    <div
      className="
        flex w-full h-screen bg-white 
        flex-row
        max-md:flex-col max-md:h-auto pb-5
      "
    >
      {/* Left section: Text and controls */}
      <div
        className="
          flex flex-col justify-center items-start
          w-[34%] px-12 pt-8 pb-6
          max-lg:w-[40%] max-lg:px-7
          max-md:w-full max-md:px-4 max-md:pt-6 max-md:pb-3
        "
      >
        <div>
          <div className="bg-black text-white px-8 py-2 mb-6 text-3xl font-bold font-[Poppins] max-md:text-xl max-md:px-4 max-md:py-2">
            Business Man
          </div>
          <div className="text-[#222] text-lg font-[Poppins] font-normal mb-8 max-w-[380px] max-md:text-base max-md:mb-4">
            Prendas clásicas con cortes cómodos que combinan una actitud relajada con un look impecable, perfecto para la oficina.
          </div>
          <hr className="border-black/40 mb-8 w-[90%] max-md:mb-3" />
        </div>
      </div>

      {/* Middle section: Video */}
      <div
        className="
          flex items-center justify-center w-[32%] min-h-[700px] py-5
          max-lg:w-[40%] max-lg:min-h-[500px]
          max-md:w-full max-md:min-h-[240px] max-md:p-3
        "
      >
        <video
          className="
            h-[90%] w-full object-cover shadow-lg
             max-md:h-[700px] 
          "
          src={vid}
          autoPlay
          muted
          loop
          playsInline
        />
      </div>

      {/* Right section: Product list */}
      <div
        className="
          flex flex-col w-[34%] px-8 justify-center
          max-lg:w-[60%] max-lg:px-4
          max-md:w-full max-md:px-4 max-md:pt-4
        "
      >
        {[1, 2, 3].map((item, idx) => (
          <div
            key={idx}
            className="
              flex gap-4 items-start border-b pb-6 last:border-0 last:pb-0
              max-md:gap-3 max-md:pb-4
            "
          >
            {/* Gray image placeholder */}
            <div className="w-24 h-32 bg-gray-300 rounded-md flex-shrink-0 max-md:w-20 max-md:h-28" />
            {/* Product info */}
            <div className="flex-1">
              <div className="text-xs font-[Poppins] text-[#222] font-medium mb-2 max-md:text-xs">
                Topitop hombre
              </div>
              <div className="text-base font-[Poppins] text-[#222] font-semibold mb-1 max-md:text-sm">
                {item === 1 && "Pantalón Hombre Hoziel Gris Claro"}
                {item === 2 && "Casaca Hombre Hazal Gris Claro"}
                {item === 3 && "Camisa Hombre Drago Blanco Optico"}
              </div>
              <div className="flex items-end gap-2">
                <div className="text-xl font-bold font-[Poppins] text-[#222] max-md:text-base">
                  {item === 1 && "S/ 84.44"}
                  {item === 2 && "S/ 136.44"}
                  {item === 3 && "S/ 64.94"}
                </div>
                <div className="text-sm line-through text-gray-400 font-[Poppins] font-semibold max-md:text-xs">
                  {item === 1 && "S/ 129.90"}
                  {item === 2 && "S/ 209.90"}
                  {item === 3 && "S/ 99.90"}
                </div>
              </div>
              {/* Tallas */}
              <div className="flex gap-2 mt-2">
                {item === 1 &&
                  ["28", "30", "32", "34"].map((t, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center justify-center w-7 h-7 border border-black rounded-full text-sm font-semibold font-[Poppins] max-md:w-6 max-md:h-6 max-md:text-xs ${
                        t === "28" ? "bg-black text-white" : "bg-white text-black"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
                {item !== 1 &&
                  ["S", "M", "L", "XL"].map((t, i) => (
                    <span
                      key={i}
                      className={`inline-flex items-center justify-center w-7 h-7 border border-black rounded-full text-sm font-semibold font-[Poppins] max-md:w-6 max-md:h-6 max-md:text-xs ${
                        t === "S" ? "bg-black text-white" : "bg-white text-black"
                      }`}
                    >
                      {t}
                    </span>
                  ))}
              </div>
              {/* Agregar al carrito */}
              <motion.button
                whileHover={{
                  backgroundColor: "#111",
                  color: "#fff",
                  borderColor: "#111",
                  scale: 1.04,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="w-full mt-3 px-8 py-2 bg-white text-black text-base font-bold rounded-none outline-none border-2 border-black max-md:px-2 max-md:py-1 max-md:text-sm"
                style={{ fontFamily: "Poppins, sans-serif", boxShadow: "none" }}
              >
                AGREGAR AL CARRITO
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}