import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react"; // Importa el ícono X de Lucide
import PropTypes from "prop-types";

/**
 * SideMenu component
 * @param {boolean} open - Whether the menu is open
 * @param {"left"|"right"} side - From which side the menu should appear
 * @param {function} onClose - Callback to close the menu
 * @param {React.ReactNode} children - Content in the menu
 */
const SideMenu = ({ open, side = "right", onClose, children }) => {
  const isRight = side === "right";
  const variants = {
    hidden: {
      x: isRight ? "100%" : "-100%",
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
    exit: {
      x: isRight ? "100%" : "-100%",
      transition: { type: "spring", stiffness: 400, damping: 40 },
    },
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40 bg-black bg-opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {/* Side Menu */}
          <motion.aside
            className={`fixed top-0 ${isRight ? "right-0" : "left-0"} z-50 h-full w-full max-w-[390px] max-md:w-[300px] bg-white shadow-xl flex flex-col`}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
          >
            <div className="flex items-center justify-between px-5 py-2 border-b bg-red-500">
              <span className="font-bold text-lg font-Poppins text-white">CERRAR</span>
              <motion.div
                whileHover={{
                  scale: 1.14,
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="cursor-pointer"
                onClick={onClose}
              >
                <X size={25} strokeWidth={2.2} stroke="#fff" />
              </motion.div>
            </div>
            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

SideMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  side: PropTypes.oneOf(["left", "right"]),
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};

export default SideMenu;