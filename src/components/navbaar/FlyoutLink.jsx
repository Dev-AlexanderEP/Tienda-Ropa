import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
const FlyoutLink = ({ children, href, FlyoutContent }) => {
  const [open, setOpen] = useState(false);
  const showFlyout = FlyoutContent && open;
    const [hovering, setHovering] = useState(false);


  return (
    <div
      className="h-full  cursor-pointer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center h-full justify-center  w-[100px]  ">
      
      <a
      href={href}
      className="relative   flex justify-center flex-nowrap  "
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {children}
      
      <span
        style={{
          transform: hovering ? "scaleX(1)" : "scaleX(0)",
        }}
        className={`absolute -bottom-1 left-0 right-0 h-1 border-t-[2px]  border-red-500 rounded-full transition-transform duration-500 ease-out ${
          hovering ? "origin-left" : "origin-right"
        }`}
      />
    </a>
    
      </div>
      <AnimatePresence mode="wait">

        {/* {true && ( */}
      {showFlyout && (
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute left-[0%]  w-full  top-[80px] text-black  rounded  z-50 px-[150px] "
        >
         
          <div className="w-full h-[350px] bg-white  shadow-md" onMouseLeave={() => setOpen(false)}>
            {FlyoutContent && <FlyoutContent />}
          </div>
           
        </motion.div>
      )}
      </AnimatePresence>
      
    </div>
  );
};

export default FlyoutLink;