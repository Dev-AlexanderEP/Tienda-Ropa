import React from "react";
import whatsappIcon from "../contact/whatsap.png"; // Ajusta la ruta si es necesario

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/51900818835?text=Hola%2C%20quisiera%20informaci%C3%B3n"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9999,
        background: "#25D366",
        borderRadius: "50%",
        width: 80,
        height: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        color: "white",
        fontSize: 32,
        textDecoration: "none",
        padding: 0,
        overflow: "hidden",
      }}
      title="Chatea por WhatsApp"
    >
      <img
        src={whatsappIcon}
        alt="WhatsApp"
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
    </a>
  );
}