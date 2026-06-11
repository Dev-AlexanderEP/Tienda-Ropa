import imagen1 from "../../assets/images/index/imagen1.png";
import imagen2 from "../../assets/images/index/imagen2.png";
import imagen3 from "../../assets/images/index/imagen3.png";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

const imgs = [imagen1, imagen2, imagen3];

const ONE_SECOND = 1000;
const AUTO_DELAY = ONE_SECOND * 10;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring",
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export default function Carousel() {
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
    // eslint-disable-next-line
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
      <div className=" relative w-full h-[95%] overflow-hidden max-sm:h-[220px] max-md:h-[350px] max-lg:h-[400px] max-xl:h-[450px] max-2xl:h-[580px]">
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
      </div>
      <Dots imgIndex={imgIndex} setImgIndex={setImgIndex} />
    </>
  );
}

const Images = ({ imgIndex }) => {
  return (
    <div
      className="
        relative flex w-full h-full gap-[95px] items-start shrink-0
        aspect-video rounded-xl px-[50px]
        max-xl:gap-[40px] max-xl:px-[20px]
        max-lg:gap-[20px] max-lg:px-[10px]
        max-md:gap-[8px] max-md:px-[4px]
      "
    >
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
            className="
              w-[100%] h-[75%] shrink-0 rounded-sm object-contain aspect-video 
              max-xl:h-[70%]
              max-lg:h-[80%]
              max-md:h-[90%]
            "
          />
        );
      })}
    </div>
  );
};

const Dots = ({ imgIndex, setImgIndex }) => {
  return (
    <div className="mt-2 flex w-full justify-center gap-2 relative max-xl:gap-1 max-md:mt-1">
      {imgs.map((_, idx) => {
        return (
          <button
            key={idx}
            onClick={() => setImgIndex(idx)}
            className={`h-3 w-3 rounded-full transition-colors ${
              idx === imgIndex ? "bg-red-700" : "bg-red-400"
            } max-lg:h-2.5 max-lg:w-2.5 max-md:h-2 max-md:w-2`}
          />
        );
      })}
    </div>
  );
};