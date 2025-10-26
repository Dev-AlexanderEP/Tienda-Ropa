import React, { useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import {ChevronRight } from 'lucide-react';
const FlyoutLinkResponsive = ({ children, href, FlyoutContent }) => {
  const [open, setOpen] = useState(false);
  const showFlyout = FlyoutContent && open;
    const [hovering, setHovering] = useState(false);


  return (
    <div
      className="h-full  cursor-pointer"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div className="flex items-center h-full justify-start  w-full  ">
      
      <a
      href={href}
      className="relative items-center  flex justify-center flex-nowrap text-2xl  font-Poppins "
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {children}
        <ChevronRight className="w-5 h-5 ml-2 text-gray-500 " />
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
      
      
    </div>
  );
};

export default FlyoutLinkResponsive;