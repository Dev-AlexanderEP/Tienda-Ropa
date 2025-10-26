import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Typography } from "@material-tailwind/react";
import { ChevronDown } from "lucide-react";

export default function FilterSidebar({
  tallas = [],
  selectedTalla,
  setSelectedTalla,
  marcas = [],
  selectedMarca,
  setSelectedMarca,
  rangosPrecios = [],
  selectedPrecio,
  setSelectedPrecio,
  rangosDescuentos = [],
  selectedDescuento,
  setSelectedDescuento,
}) {
  // Local state for open/collapse
  const [isOpenTallas, setIsOpenTallas] = React.useState(false);
  const [isOpenMarcas, setIsOpenMarcas] = React.useState(false);
  const [isOpenPrecios, setIsOpenPrecios] = React.useState(false);
  const [isOpenDescuentos, setIsOpenDescuentos] = React.useState(false);

  return (
    <div className="w-[250px]">
      <ul>
        {/* TALLAS */}
        <li className="border-b border-gray-300 p-1">
          <div onClick={() => setIsOpenTallas((cur) => !cur)}>
            <div className="flex justify-between w-full cursor-pointer">
              <Typography className="font-semibold">Tallas</Typography>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
          <AnimatePresence initial={false}>
            {isOpenTallas && (
              <motion.div
                key="tallas"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.23, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <ul className="pb-2">
                  {tallas.map((talla, idx) => (
                    <li key={idx}>
                      <label className="flex gap-2 items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                          checked={selectedTalla === talla}
                          onChange={() =>
                            setSelectedTalla(
                              selectedTalla === talla ? "" : talla
                            )
                          }
                        />
                        <Typography className="text-[14px] leading-none">
                          {talla}
                        </Typography>
                      </label>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </li>

        {/* MARCAS */}
        <li className="border-b border-gray-300 p-1">
          <div onClick={() => setIsOpenMarcas((cur) => !cur)}>
            <div className="flex justify-between w-full cursor-pointer">
              <Typography className="font-semibold">Marcas</Typography>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
          <AnimatePresence initial={false}>
            {isOpenMarcas && (
              <motion.div
                key="marcas"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.23, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <ul className="pb-2">
                  {marcas.map((marca, idx) => (
                    <li key={idx}>
                      <label className="flex gap-2 items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                          checked={selectedMarca === marca}
                          onChange={() =>
                            setSelectedMarca(
                              selectedMarca === marca ? "" : marca
                            )
                          }
                        />
                        <Typography className="text-[14px] leading-none">
                          {marca}
                        </Typography>
                      </label>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </li>

        {/* PRECIO */}
        <li className="border-b border-gray-300 p-1">
          <div onClick={() => setIsOpenPrecios((cur) => !cur)}>
            <div className="flex justify-between w-full cursor-pointer">
              <Typography className="font-semibold">Precio</Typography>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
          <AnimatePresence initial={false}>
            {isOpenPrecios && (
              <motion.div
                key="precios"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.23, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <ul className="pb-2">
                  {rangosPrecios.map((rango, idx) => (
                    <li key={idx}>
                      <label className="flex gap-2 items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                          checked={selectedPrecio === rango.label}
                          onChange={() =>
                            setSelectedPrecio(
                              selectedPrecio === rango.label ? "" : rango.label
                            )
                          }
                        />
                        <Typography className="text-[14px] leading-none">
                          {rango.label}
                        </Typography>
                      </label>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </li>

        {/* DESCUENTO */}
        <li className="border-b border-gray-300 p-1">
          <div onClick={() => setIsOpenDescuentos((cur) => !cur)}>
            <div className="flex justify-between w-full cursor-pointer">
              <Typography className="font-semibold">Descuento</Typography>
              <ChevronDown className="w-5 h-5" />
            </div>
          </div>
          <AnimatePresence initial={false}>
            {isOpenDescuentos && (
              <motion.div
                key="descuentos"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.23, ease: "easeInOut" }}
                style={{ overflow: "hidden" }}
              >
                <ul className="pb-2">
                  {rangosDescuentos.map((rango, idx) => (
                    <li key={idx}>
                      <label className="flex gap-2 items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 accent-indigo-600 rounded border-gray-300"
                          checked={selectedDescuento === rango.label}
                          onChange={() =>
                            setSelectedDescuento(
                              selectedDescuento === rango.label ? "" : rango.label
                            )
                          }
                        />
                        <Typography className="text-[14px] leading-none">
                          {rango.label}
                        </Typography>
                      </label>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      </ul>
    </div>
  );
}