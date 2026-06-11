import React, { useState } from "react";
import { motion } from "framer-motion";
import imglef from "../../assets/images/index/frame5/imglef.webp";
import imgri from "../../assets/images/index/frame5/imgri.webp";
import SideMenu from "../../components/index/SideMenu";

export default function Frame5() {
  const [isOpenPoleras, setIsOpenPoleras] = useState(false);
  const [isOpenChompas, setIsOpenChompas] = useState(false);

  return (
    <div className="w-full flex flex-col md:flex-row h-screen gap-x-5 gap-y-1  max-lg:h-auto">
      {/* Poleras */}
      <div
        className="flex-1 relative min-h-[500px] flex items-end max-md:flex-none max-md:h-[600px]"
        style={{
          backgroundImage: `url(${imglef})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for text */}
        <div className="absolute inset-0 bg-black/0" />
        <div
          className="relative z-10 p-8 pb-16 md:pb-24 flex flex-col gap-3"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <span className="text-black text-4xl font-bold drop-shadow mb-0">
            Poleras
          </span>
          <span className="text-black text-xl font-bold">
            Hasta <span className="font-bold">50% dscto.</span>
          </span>
          <motion.button
            whileHover={{
              backgroundColor: "#222",
              color: "#fff",
              borderColor: "#222",
              scale: 1.04,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="mt-2 px-8 py-2 bg-transparent text-black text-base font-bold rounded-none outline-none border-2 border-black"
            style={{ fontFamily: "Poppins, sans-serif", boxShadow: "none" }}
            onClick={() => setIsOpenPoleras(true)}
          >
            COMPRAR EL LOOK
          </motion.button>
          <button
            className="mt-2 flex items-center gap-2 text-black text-base font-bold group"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            VER COLECCIÓN{" "}
            <span className="text-xl group-hover:translate-x-1 transition">
              &#8594;
            </span>
          </button>
        </div>
      </div>
      {/* SideMenu for Poleras (right) */}
      <SideMenu open={isOpenPoleras} side="right" onClose={() => setIsOpenPoleras(false)}>
        {/* Deja el contenido en blanco por ahora */}
      </SideMenu>
      {/* Chompas */}
      <div
        className="flex-1 relative min-h-[500px] flex items-end max-md:flex-none max-md:h-[600px]"
        style={{
          backgroundImage: `url(${imgri})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for text */}
        <div className="absolute inset-0 bg-black/0" />
        <div
          className="relative z-10 p-8 pb-16 md:pb-24 flex flex-col gap-3 items-start"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          <span className="text-black text-4xl font-bold drop-shadow mb-0">
            Chompas
          </span>
          <span className="text-black text-xl font-bold">
            Hasta <span className="font-bold">50% dscto.</span>
          </span>
          <motion.button
            whileHover={{
              backgroundColor: "#222",
              color: "#fff",
              borderColor: "#222",
              scale: 1.04,
            }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="mt-2 px-8 py-2 bg-transparent text-black text-base font-bold rounded-none outline-none border-2 border-black"
            style={{ fontFamily: "Poppins, sans-serif", boxShadow: "none" }}
            onClick={() => setIsOpenChompas(true)}
          >
            COMPRAR EL LOOK
          </motion.button>
          <button
            className="mt-2 flex items-center gap-2 text-black text-base font-bold group"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            VER COLECCIÓN{" "}
            <span className="text-xl group-hover:translate-x-1 transition">
              &#8594;
            </span>
          </button>
        </div>
      </div>
      {/* SideMenu for Chompas (left) */}
      <SideMenu open={isOpenChompas} side="left" onClose={() => setIsOpenChompas(false)}>
        {/* Deja el contenido en blanco por ahora */}
      </SideMenu>
    </div>
  );
}