import React from "react";
import PropTypes from "prop-types";
import NavBarResponsive from "../NavBarResponsive";

/**
 * BasicosContent component displays a responsive grid for "Básicos" y "Accesorios"
 * solo para Mujer y Hombre, y una columna separada solo para Accesorios.
 *
 * @param {Object} props
 * @param {Array} props.mujerBasicos - Básicos de Mujer
 * @param {Array} props.mujerAccesorios - Accesorios de Mujer
 * @param {Array} props.hombreBasicos - Básicos de Hombre
 * @param {Array} props.hombreAccesorios - Accesorios de Hombre
 */
const BasicosContent = ({
  mujerBasicos = [],
  mujerAccesorios = [],
  hombreBasicos = [],
  hombreAccesorios = [],
}) => {
  // Secciones: Mujer, Hombre, Accesorios (Mujer y Hombre accesorios juntos)
  const sections = [
    {
      name: "Mujer",
      basicos: mujerBasicos,
      color: "text-red-700",
      border: "border-red-200",
    },
    {
      name: "Hombre",
      basicos: hombreBasicos,
      color: "text-black-700",
      border: "border-black-200",
    },
    {
      name: "Accesorios",
      accesorios: [
        ...(mujerAccesorios ?? []),
        ...(hombreAccesorios ?? []),
      ],
      color: "text-black",
      border: "border-black",
    },
  ];

  return (
    <>
      <NavBarResponsive />
      <section className="w-full py-8 px-2">
        <h2 className="font-Poppins text-2xl font-semibold mb-10 text-gray-800 text-center">
          Básicos y Accesorios
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 justify-center items-start">
          {/* MUJER */}
          <div className={`flex-1 min-w-[260px] max-w-[420px] mx-auto bg-white rounded-xl shadow border ${sections[0].border} pb-6`}>
            <h3 className={`text-xl font-bold mb-2 pt-6 pb-2 text-center font-Poppins ${sections[0].color}`}>
              {sections[0].name}
            </h3>
            {sections[0].basicos.length > 0 && (
              <>
                <h4 className="text-md font-semibold mb-2 text-center text-gray-600 font-Poppins tracking-wide">
                  Básicos
                </h4>
                <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
                  {sections[0].basicos.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      className="
                        group flex flex-col items-center w-full rounded-lg shadow-sm hover:shadow-lg bg-gray-50 overflow-hidden transition
                        hover:bg-red-50 focus:outline-none
                      "
                      tabIndex={0}
                      aria-label={item.label}
                    >
                      <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.label}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="py-2 text-center w-full">
                        <span className="font-Poppins text-base text-gray-700 font-medium group-hover:text-red-700 transition">
                          {item.label}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>


          {/* HOMBRE */}
          <div className={`flex-1 min-w-[260px] max-w-[420px] mx-auto bg-white rounded-xl shadow border ${sections[1].border} pb-6`}>
            <h3 className={`text-xl font-bold mb-2 pt-6 pb-2 text-center font-Poppins ${sections[1].color}`}>
              {sections[1].name}
            </h3>
            {sections[1].basicos.length > 0 && (
              <>
                <h4 className="text-md font-semibold mb-2 text-center text-gray-600 font-Poppins tracking-wide">
                  Básicos
                </h4>
                <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
                  {sections[1].basicos.map((item, i) => (
                    <a
                      key={i}
                      href={item.href}
                      className="
                        group flex flex-col items-center w-full rounded-lg shadow-sm hover:shadow-lg bg-gray-50 overflow-hidden transition
                        hover:bg-red-50 focus:outline-none
                      "
                      tabIndex={0}
                      aria-label={item.label}
                    >
                      <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                        {item.image && (
                          <img
                            src={item.image}
                            alt={item.label}
                            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                            loading="lazy"
                          />
                        )}
                      </div>
                      <div className="py-2 text-center w-full">
                        <span className="font-Poppins text-base text-gray-700 font-medium group-hover:text-red-700 transition">
                          {item.label}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ACCESORIOS */}
          <div className={`flex-1 min-w-[260px] max-w-[420px] mx-auto bg-white rounded-xl shadow border ${sections[2].border} pb-6`}>
            <h3 className={`text-xl font-bold mb-2 pt-6 pb-2 text-center font-Poppins ${sections[2].color}`}>
              {sections[2].name}
            </h3>
            {sections[2].accesorios.length > 0 && (
              <div className="grid gap-4 px-4 pb-4 sm:grid-cols-2">
                {sections[2].accesorios.map((item, i) => (
                  <a
                    key={i}
                    href={item.href}
                    className="
                      group flex flex-col items-center w-full rounded-lg shadow-sm hover:shadow-lg bg-gray-50 overflow-hidden transition
                      hover:bg-red-50 focus:outline-none
                    "
                    tabIndex={0}
                    aria-label={item.label}
                  >
                    <div className="w-full aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.label}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="py-2 text-center w-full">
                      <span className="font-Poppins text-base text-gray-700 font-medium group-hover:text-red-700 transition">
                        {item.label}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

BasicosContent.propTypes = {
  mujerBasicos: PropTypes.array,
  mujerAccesorios: PropTypes.array,
  hombreBasicos: PropTypes.array,
  hombreAccesorios: PropTypes.array,
};

export default BasicosContent;