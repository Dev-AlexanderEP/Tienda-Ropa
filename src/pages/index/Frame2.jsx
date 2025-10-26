import React, { useState } from "react";
import { motion } from "framer-motion";
import imgleft from "../../assets/images/index/frame2/imgleft.webp";
import imgrigth from "../../assets/images/index/frame2/imgrigth.webp";
import SideMenu from "../../components/index/SideMenu";

export default function Frame2() {
  const [isOpenCasacas, setIsOpenCasacas] = useState(false);
  const [isOpenBlusas, setIsOpenBlusas] = useState(false);

  return (
    <div className="w-full flex flex-col md:flex-row  h-screen gap-x-5 gap-y-1 max-lg:h-auto ">
      {/* Casacas */}
      <div
        className="flex-1 relative min-h-[500px] flex items-end   max-md:flex-none max-md:h-[600px]"
        style={{
          backgroundImage: `url(${imgleft})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for text */}
        <div className="absolute inset-0 bg-black/0" />
        <div className="relative z-10 p-8 pb-16 md:pb-24 flex flex-col gap-3"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          <span className="text-white text-4xl font-bold drop-shadow mb-0">
            Casacas
          </span>
          <span className="text-white text-xl font-bold">
            Hasta <span className="font-bold">50% dscto.</span>
          </span>
          <motion.button
            whileHover={{
              backgroundColor: "#ef4444",
              color: "#fff",
              borderColor: "#ef4444",
              scale: 1.04,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="mt-2 px-8 py-2 bg-transparent text-white text-base font-bold rounded-none outline-none border-2 border-white"
            style={{ fontFamily: "Poppins, sans-serif", boxShadow: "none" }}
            onClick={() => setIsOpenCasacas(true)}
          >
            COMPRAR EL LOOK
          </motion.button>
          <button
            className="mt-2 flex items-center gap-2 text-white text-base font-bold group"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            VER COLECCIÓN <span className="text-xl group-hover:translate-x-1 transition">&#8594;</span>
          </button>
        </div>
      </div>
      {/* SideMenu for Casacas (right) */}
      <SideMenu open={isOpenCasacas} side="right" onClose={() => setIsOpenCasacas(false)}>
        {/* Deja el contenido en blanco por ahora */}
      </SideMenu>
      {/* Blusas */}
      <div
        className="flex-1 relative min-h-[500px] flex items-end max-md:flex-none max-md:h-[600px]"
        style={{
          backgroundImage: `url(${imgrigth})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for text */}
        <div className="absolute inset-0 bg-black/0" />
        <div className="relative z-10 p-8 pb-16 md:pb-24 flex flex-col gap-3 items-start"
          style={{ fontFamily: "Poppins, sans-serif" }}>
          <span className="text-white text-4xl font-bold drop-shadow mb-0">
            Blusas
          </span>
          <span className="text-white text-xl font-bold">
            Hasta <span className="font-bold">50% dscto.</span>
          </span>
          <motion.button
            whileHover={{
              backgroundColor: "#ef4444",
              color: "#fff",
              borderColor: "#ef4444",
              scale: 1.04,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="mt-2 px-8 py-2 bg-transparent text-white text-base font-bold rounded-none outline-none border-2 border-white"
            style={{ fontFamily: "Poppins, sans-serif", boxShadow: "none" }}
            onClick={() => setIsOpenBlusas(true)}
          >
            COMPRAR EL LOOK
          </motion.button>
          <button
            className="mt-2 flex items-center gap-2 text-white text-base font-bold group"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            VER COLECCIÓN <span className="text-xl group-hover:translate-x-1 transition">&#8594;</span>
          </button>
        </div>
      </div>
      {/* SideMenu for Blusas (left) */}
      <SideMenu open={isOpenBlusas} side="left" onClose={() => setIsOpenBlusas(false)}>
        {/* Deja el contenido en blanco por ahora */}
      </SideMenu>
    </div>
  );
}