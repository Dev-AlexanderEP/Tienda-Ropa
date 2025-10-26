import React from "react";
import PropTypes from "prop-types";
import NavBarResponsive from "../NavBarResponsive";

/**
 * InfantilContent component displays two sections for Infantil:
 * - Niños (mainLinks)
 * - Niñas (basicosLinks)
 * Each section shows its own set of categories in a responsive 2-column grid (sm/md).
 *
 * @param {Object} props
 * @param {string} props.categoryName - Should be "Infantil"
 * @param {Array} props.mainLinks - Array of links for "Niños"
 * @param {Array} props.basicosLinks - Array of links for "Niñas"
 */
const InfantilContent = ({
  categoryName = "Infantil",
  mainLinks = [],
  basicosLinks = [],
}) => {
  const sections = [
    { title: "Niños", links: mainLinks, color: "text-black" },
    { title: "Niñas", links: basicosLinks, color: "text-pink-700" },
  ];

  return (
    <>
      <NavBarResponsive />
      <section className="w-full py-6 px-2">
        <h2 className="font-Poppins text-2xl font-semibold mb-8 text-gray-800 text-center">
          {categoryName}
        </h2>
        <div className="flex flex-col lg:flex-row gap-10 justify-center">
          {sections.map(
            (section, idx) =>
              section.links &&
              section.links.length > 0 && (
                <div
                  key={idx}
                  className="flex-1 min-w-[220px] max-w-[600px] mx-auto"
                >
                  <h3
                    className={`text-lg font-semibold mb-4 text-center font-Poppins ${section.color}`}
                  >
                    {section.title}
                  </h3>
                  <div
                    className="
                      grid gap-5
                      max-md:grid-cols-2
                      max-xl:grid-cols-3
                      sm:grid-cols-2
                      md:grid-cols-2
                      lg:grid-cols-3
                      justify-items-center
                    "
                  >
                    {section.links.map((item, idy) => (
                      <a
                        key={idy}
                        href={item.href}
                        className="
                          group flex flex-col items-center w-full max-w-[210px] rounded-lg shadow hover:shadow-lg bg-white overflow-hidden transition
                          hover:bg-red-50
                          focus:outline-none
                        "
                        tabIndex={0}
                        aria-label={item.label}
                      >
                        <div className="w-full aspect-[1] bg-gray-100 flex items-center justify-center overflow-hidden">
                          {"image" in item && item.image ? (
                            <img
                              src={item.image}
                              alt={item.label}
                              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                              <span className="font-bold">No Image</span>
                            </div>
                          )}
                        </div>
                        <div className="py-3 text-center w-full">
                          <span className="font-Poppins text-base text-gray-700 font-medium group-hover:text-red-700 transition">
                            {item.label}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )
          )}
        </div>
      </section>
    </>
  );
};

InfantilContent.propTypes = {
  categoryName: PropTypes.string,
  mainLinks: PropTypes.array,
  basicosLinks: PropTypes.array,
};

export default InfantilContent;