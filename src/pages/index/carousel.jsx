import imagen1 from "../../assets/images/index/imagen1.png";
import imagen2 from "../../assets/images/index/imagen2.png";
import imagen3 from "../../assets/images/index/imagen3.png";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { div } from "motion/react-client";

const imgs = [ imagen1, imagen2, imagen3];

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export default function  Carousel  ()  {
  const [imgIndex, setImgIndex] = useState(0);

  const dragX = useMotionValue(0);

  useEffect(() => {
    const intervalRef = setInterval(() => {
      const x = dragX.get();

      if (x === 0) {
        setImgIndex((pv) => {
          if (pv === imgs.length - 1) {
            return 0;
          }
          return pv + 1;
        });
      }
    }, AUTO_DELAY);

    return () => clearInterval(intervalRef);
  }, []);

  const onDragEnd = () => {
    const x = dragX.get();

    if (x <= -DRAG_BUFFER && imgIndex < imgs.length - 1) {
      setImgIndex((pv) => pv + 1);
    } else if (x >= DRAG_BUFFER && imgIndex > 0) {
      setImgIndex((pv) => pv - 1);
    }
  };

  return (
    <>
    <div className="relative h-[95%] w-full overflow-hidden  ">
      <motion.div
        drag="x"
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        style={{
          x: dragX,
        }}
        animate={{
          translateX: `-${imgIndex * 100}%`,
        }}
        transition={SPRING_OPTIONS}
        onDragEnd={onDragEnd}
        className="flex cursor-grab items-center active:cursor-grabbing"
      >
        <Images imgIndex={imgIndex} />
      </motion.div>

      <GradientEdges />
    </div>
      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} />
    </>
  );
};

const Images = ({ imgIndex }) => {
  return (
    <>
    <div className="relative flex w-full h-[100%] gap-[95px] items-start shrink-0 aspect-video rounded-xl  px-[50px]  ">
      {imgs.map((imgSrc, idx) => {
        return (
    
          <motion.div
            key={idx}
            style={{
              backgroundImage: `url(${imgSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            animate={{
              scale: imgIndex === idx ? 0.95 : 0.85,
            }}
            transition={SPRING_OPTIONS}
            className=" w-[100%] h-[75%] shrink-0 rounded-sm   object-contain aspect-video "
          />
        );
      })}

    </div>
    </>
  );
};

const Dots = ({ imgIndex, setImgIndex }) => {
  return (
    <div className="mt-2 flex w-full justify-center gap-2 relative ">
      {imgs.map((_, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${
              idx === imgIndex ? "bg-red-700" : "bg-red-400"
            }`}
          />
        );
      })}
    </div>
  );
};

const GradientEdges = () => {
  return (
    <>
    {/* <div className="pointer-events-none absolute bottom-0 left-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-r from-neutral-950/50 to-neutral-950/0" /> */}
    {/* <div className="pointer-events-none absolute bottom-0 right-0 top-0 w-[10vw] max-w-[100px] bg-gradient-to-l from-neutral-950/50 to-neutral-950/0" /> */}
    </>
  );
};

// const images = [imagen1, imagen2, imagen3];

// const variants = {
//   enter: (direction) => ({
//     x: direction > 0 ? 300 : -300,
//     opacity: 0,
//     position: "absolute",
//   }),
//   center: {
//     x: 0,
//     opacity: 1,
//     position: "relative",
//   },
//   exit: (direction) => ({
//     x: direction < 0 ? 300 : -300,
//     opacity: 0,
//     position: "absolute",
//   }),
// };

// export default function Carousel() {
//   const [[index, direction], setIndex] = useState([0, 0]);

//   // Automático cada 3 segundos
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIndex(([prevIndex]) => {
//         let newIndex = prevIndex + 1;
//         if (newIndex >= images.length) newIndex = 0;
//         return [newIndex, 1];
//       });
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const paginate = (newDirection) => {
//     setIndex(([prevIndex]) => {
//       let newIndex = prevIndex + newDirection;
//       if (newIndex < 0) newIndex = images.length - 1;
//       if (newIndex >= images.length) newIndex = 0;
//       return [newIndex, newDirection];
//     });
//   };

//   return (
//     <div className="relative w-full flex items-center justify-center border border-black">
//       <button
//         className="absolute left-2 z-10 bg-white/70 rounded-full p-2 shadow hover:bg-white transition"
//         onClick={() => paginate(-1)}
//         aria-label="Anterior"
//       >
//         <ChevronLeft className="w-7 h-7" />
//       </button>
//       <div className="w-full flex items-center justify-center overflow-hidden rounded-lg shadow-lg bg-white">
//         <AnimatePresence initial={false} custom={direction}>
//           <motion.img
//             key={index}
//             src={images[index]}
//             alt={`Slide ${index + 1}`}
//             custom={direction}
//             variants={variants}
//             initial="enter"
//             animate="center"
//             exit="exit"
//             transition={{ type: "spring", stiffness: 300, damping: 30 }}
//             className="object-cover w-full h-full"
//           />
//         </AnimatePresence>
//       </div>
//       <button
//         className="absolute right-2 z-10 bg-white/70 rounded-full p-2 shadow hover:bg-white transition"
//         onClick={() => paginate(1)}
//         aria-label="Siguiente"
//       >
//         <ChevronRight className="w-7 h-7" />
//       </button>
//       <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 items-center">
//         {images.map((_, i) => (
//           <span
//             key={i}
//             className={`w-2 h-2 rounded-full ${i === index ? "bg-red-500 w-3 h-3" : "bg-gray-300"}`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }