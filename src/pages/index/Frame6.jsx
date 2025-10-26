import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";

const products = [
  {
    id: 1,
    color: "bg-gray-200",
    discount: 45,
    brand: "Topitop mujer",
    name: "Jogger Mujer Valencia Grey Fit Poly Htr",
    price: 43.95,
    oldPrice: 79.90,
  },
  {
    id: 2,
    color: "bg-gray-400",
    discount: 45,
    brand: "Topitop mujer",
    name: "Jogger Mujer Fio Negro",
    price: 49.45,
    oldPrice: 89.90,
  },
  {
    id: 3,
    color: "bg-gray-400",
    discount: 45,
    brand: "Topitop mujer",
    name: "Jogger Mujer Fio Negro",
    price: 49.45,
    oldPrice: 89.90,
  },
  {
    id: 4,
    color: "bg-gray-200",
    discount: 35,
    brand: "Topitop hombre",
    name: "Polo Hombre Basic Fit Blanco",
    price: 29.95,
    oldPrice: 45.00,
  },
  {
    id: 5,
    color: "bg-gray-300",
    discount: 50,
    brand: "Topitop mujer",
    name: "Casaca Mujer Urban Negro",
    price: 65.99,
    oldPrice: 130.00,
  },
  {
    id: 6,
    color: "bg-gray-500",
    discount: 30,
    brand: "Topitop hombre",
    name: "Jogger Hombre Relaxed Azul",
    price: 39.99,
    oldPrice: 57.00,
  },
  {
    id: 7,
    color: "bg-gray-200",
    discount: 45,
    brand: "Topitop mujer",
    name: "Pantalón Mujer Chino Beige",
    price: 52.00,
    oldPrice: 95.00,
  },
  {
    id: 8,
    color: "bg-gray-400",
    discount: 20,
    brand: "Topitop hombre",
    name: "Casaca Hombre Denim Azul",
    price: 89.90,
    oldPrice: 112.00,
  },
  {
    id: 9,
    color: "bg-gray-300",
    discount: 60,
    brand: "Topitop mujer",
    name: "Blusa Mujer Summer Rosa",
    price: 25.00,
    oldPrice: 62.00,
  },
  {
    id: 10,
    color: "bg-gray-200",
    discount: 15,
    brand: "Topitop mujer",
    name: "Falda Mujer Midi Negra",
    price: 38.50,
    oldPrice: 45.50,
  },
  {
    id: 11,
    color: "bg-gray-500",
    discount: 40,
    brand: "Topitop hombre",
    name: "Short Hombre Sport Gris",
    price: 35.00,
    oldPrice: 58.00,
  },
  {
    id: 12,
    color: "bg-gray-400",
    discount: 25,
    brand: "Topitop mujer",
    name: "Vestido Mujer Casual Azul",
    price: 55.00,
    oldPrice: 73.00,
  },
];

const categories = [
  "Casacas",
  "Poleras y Jogger Basic",
  "Camisas",
  "Polos"
];

export default function Frame6() {
  const [hovered, setHovered] = React.useState(null);
  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const [selectedCategory, setSelectedCategory] = React.useState(categories[0]);
  const [cardsPerView, setCardsPerView] = React.useState(3);

  // Responsive: 1 card in mobile, 2 in md, 3 in lg+
  React.useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(3);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Carousel logic
  const TOTAL = products.length;
  const TALLAS_HEIGHT = 110;

  const infoVariants = {
    initial: { y: 0 },
    hover: { y: -TALLAS_HEIGHT },
  };
  const tallasVariants = {
    initial: { opacity: 0, y: 30 },
    hover: {
      opacity: 1,
      y: 0,
      transition: { delay: 0.18 },
    },
    exit: { opacity: 0, y: 30 },
  };

  const carouselVariants = {
    initial: (direction) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      position: "absolute",
      width: "100%",
      display: "flex",
      gap: "2rem",
    }),
    animate: {
      x: 0,
      opacity: 1,
      position: "relative",
      width: "100%",
      display: "flex",
      gap: "2rem",
      transition: { type: "spring", stiffness: 70, damping: 18 },
    },
    exit: (direction) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      position: "absolute",
      width: "100%",
      display: "flex",
      gap: "2rem",
      transition: { duration: 0.23 },
    }),
  };

  // Looping logic
  const handlePrev = () => {
    setDirection(-1);
    setIndex((prev) =>
      prev === 0
        ? TOTAL - cardsPerView
        : prev - cardsPerView < 0
        ? 0
        : prev - cardsPerView
    );
  };

  const handleNext = () => {
    setDirection(1);
    setIndex((prev) =>
      prev + cardsPerView >= TOTAL ? 0 : prev + cardsPerView
    );
  };

  // Loop-safe visible products
  let visibleProducts = [];
  for (let i = 0; i < cardsPerView; i++) {
    visibleProducts.push(products[(index + i) % TOTAL]);
  }

  return (
    <div className="w-full h-screen bg-white px-0 pt-6 relative overflow-x-hidden">
      {/* Header con categorías */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center px-4 md:px-10">
        <div className="flex flex-wrap items-center gap-1 text-[17px] font-normal font-[Poppins]">
          <span className="text-[#222] font-semibold">Seleccione:</span>
          {categories.map((cat, i) => (
            <button
              key={cat}
              type="button"
              className={`mx-1 px-1 border-0 border-b-2 ${
                selectedCategory === cat
                  ? "text-[#222] font-bold border-[#222]"
                  : "text-gray-500 border-transparent"
              } hover:text-[#222] hover:border-[#222] transition-colors whitespace-nowrap`}
              onClick={() => setSelectedCategory(cat)}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {cat}
            </button>
          ))}
        </div>
        <button className="text-sm font-[Poppins] font-semibold text-black hover:underline flex items-center gap-1 mt-2 sm:mt-0">
          VER TODO <span className="text-lg">&#8594;</span>
        </button>
      </div>

      {/* Product Cards Carousel */}
      <div className="flex items-stretch gap-4 md:gap-8 px-4 md:px-10 pt-4 min-h-[530px] w-full relative">
        {/* Left Arrow */}
        <button
          className={`absolute left-2 top-[50%] -translate-y-1/2 z-10 bg-white border shadow w-10 h-10 rounded-full flex items-center justify-center text-xl ${
            TOTAL <= cardsPerView ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onClick={handlePrev}
          aria-label="Anterior"
        >
          &#8592;
        </button>
        {/* Cards (Animated) */}
        <div className="flex-1 h-full flex items-stretch justify-center relative overflow-x-hidden">
          <AnimatePresence custom={direction} initial={false} mode="wait">
            <motion.div
              key={index}
              custom={direction}
              variants={carouselVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex w-full items-stretch gap-4 md:gap-8 h-[650px]"
              style={{
                width: "100%",
                minWidth: 0,
                flex: 1,
              }}
            >
              {visibleProducts.map((product, idx) => {
                // idx absoluto para hover
                const globalIdx = (index + idx) % TOTAL;
                const isHovered = hovered === globalIdx;
                return (
                  <motion.div
                    key={product.id}
                    className={`relative rounded-lg shadow-none flex flex-col justify-between pb-0
                      ${cardsPerView === 1 ? "w-full max-w-xs mx-auto" : cardsPerView === 2 ? "w-1/2" : "w-1/3"}
                      h-full group border bg-white overflow-hidden`}
                    onHoverStart={() => setHovered(globalIdx)}
                    onHoverEnd={() => setHovered(null)}
                    style={{
                      cursor: "pointer",
                      minWidth: 0,
                      flex: cardsPerView === 1 ? "unset" : "1 1 0",
                    }}
                  >
                    {/* Top icons */}
                    <div className="absolute top-4 left-4 z-10">
                      <div className="bg-black text-white text-base font-[Poppins] font-bold px-3 py-1 rounded-full">
                        {product.discount}%
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 z-10">
                      <button className="p-1 rounded-full border-none outline-none bg-white/60 hover:bg-gray-200">
                        <Heart className="h-6 w-6 stroke-2 text-black" />
                      </button>
                    </div>
                    {/* Image placeholder */}
                    <div className={`w-full h-[220px] sm:h-[320px] md:h-[370px] lg:h-[420px] ${product.color} rounded-lg`} />
                    {/* Card Bottom: Info */}
                    <motion.div
                      className="px-5 pt-3 pb-2 min-h-20 relative z-10 bg-white"
                      variants={infoVariants}
                      animate={isHovered ? "hover" : "initial"}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{
                        boxShadow: isHovered ? "0 0 0 0" : undefined,
                        minHeight: "88px",
                      }}
                    >
                      <div className="text-[13px] font-[Poppins] font-medium text-[#222]">
                        {product.brand}
                      </div>
                      <div className="text-base font-[Poppins] text-[#222] font-semibold truncate">
                        {product.name}
                      </div>
                      <div className="flex justify-between items-end mt-1">
                        <div className="flex gap-2 items-center">
                          {product.oldPrice && (
                            <span className="text-sm text-gray-400 line-through font-[Poppins] font-semibold">
                              S/ {product.oldPrice}
                            </span>
                          )}
                          <span className="text-lg font-bold font-[Poppins] text-[#222]">
                            S/ {product.price}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                    {/* Hover action: Tallas */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className="absolute left-0 bottom-0 w-full bg-white border-t px-5 py-4 z-20"
                          variants={tallasVariants}
                          initial="initial"
                          animate="hover"
                          exit="exit"
                          style={{
                            borderBottomLeftRadius: 12,
                            borderBottomRightRadius: 12,
                            boxShadow: "0 4px 16px 0 rgba(0,0,0,0.06)",
                            height: TALLAS_HEIGHT,
                          }}
                        >
                          {/* Tallas */}
                          <div className="mb-3 flex gap-2 items-center">
                            <span className="text-sm block font-[Poppins] mr-2">
                              Talla
                            </span>
                            {["S", "M", "L", "XL"].map((s, i) => (
                              <span
                                key={s}
                                className={`inline-flex items-center justify-center w-7 h-7 border border-black rounded-full text-sm font-semibold font-[Poppins] ${
                                  i === 0
                                    ? "bg-black text-white"
                                    : "bg-white text-black"
                                }`}
                              >
                                {s}
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
                            className="w-full py-2 bg-black text-white rounded-none font-bold font-[Poppins] text-base tracking-wide transition-colors"
                          >
                            AGREGAR AL CARRITO
                          </motion.button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
        {/* Right Arrow */}
        <button
          className={`absolute right-2 top-[50%] -translate-y-1/2 z-10 bg-white border shadow w-10 h-10 rounded-full flex items-center justify-center text-xl ${
            TOTAL <= cardsPerView ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          onClick={handleNext}
          aria-label="Siguiente"
        >
          &#8594;
        </button>
      </div>
    </div>
  );
}