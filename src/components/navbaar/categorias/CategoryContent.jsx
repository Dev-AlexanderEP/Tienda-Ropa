import React from "react";
import PropTypes from "prop-types";
import NavBarResponsive from "../NavBarResponsive";
/**
 * CategoryContent component displays a responsive grid for up to three sets of category links:
 * principales, básicos y accesorios (o similar) de una categoría global como Mujer, Hombre, etc.
 * 
 * @param {Object} props
 * @param {string} props.categoryName - Global category name (e.g., 'Mujer', 'Hombre', etc.)
 * @param {Array} props.mainLinks - Main links array for the category
 * @param {Array} props.basicosLinks - "Básicos" links array for the category
 * @param {Array} props.accesoriosLinks - "Accesorios" links array for the category
 */
const CategoryContent = ({
  categoryName,
  mainLinks = [],
  basicosLinks = [],
  accesoriosLinks = [],
}) => {
  const sections = [
    { title: "Categorías", links: mainLinks },
    { title: "Básicos", links: basicosLinks },
    { title: "Accesorios", links: accesoriosLinks },
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
                className="flex-1 min-w-[220px] max-w-[420px] mx-auto"
              >
                <h3 className="text-lg font-semibold mb-4 text-center text-red-700 font-Poppins">
                  {section.title}
                </h3>
                <div
                  className="
                    grid gap-5
                    max-md:grid-cols-2
                    sm:grid-cols-2
                    md:grid-cols-2
                    lg:grid-cols-2
                    justify-items-center
                  "
                >
                  {section.links.map((item, idy) => (
                    <a
                      key={idy}
                      href={item.href}
                      className="
                        group flex flex-col items-center w-full max-w-[210px] max-md:w-[150px]  rounded-lg shadow hover:shadow-lg bg-white overflow-hidden transition
                        hover:bg-red-50
                        focus:outline-none
                      "
                      tabIndex={0}
                      aria-label={item.label}
                    >
                      <div className="w-full aspect-[1] bg-gray-100 flex items-center justify-center overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.label}
                          className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                          loading="lazy"
                        />
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

CategoryContent.propTypes = {
  categoryName: PropTypes.string.isRequired,
  mainLinks: PropTypes.array,
  basicosLinks: PropTypes.array,
  accesoriosLinks: PropTypes.array,
};

export default CategoryContent;