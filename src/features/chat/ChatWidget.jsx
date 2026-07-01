import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Loader2, Sparkles, Tag, ShoppingBag, ExternalLink } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { preguntar } from "./api/chatApi";

const BIENVENIDA = {
  rol: "assistant",
  contenido: "¡Hola! Soy el asistente de MixAndMatch. ¿En qué te puedo ayudar hoy? Puedo orientarte sobre nuestras prendas, categorías y precios.",
  productos: null,
};

const RED      = "#bb2427";
const RED_DARK = "#b21e13";
const RED_LIGHT = "#fff1f1";
const RED_PALE  = "#fde8e8";
const DARK      = "#1A1A2E";

const generoRuta = (genero) => {
  const g = (genero ?? "").toLowerCase();
  if (g === "mujer") return "mujer";
  if (g === "hombre") return "hombre";
  return "infantil"; // niño, niña
};

const cardVariants = {
  rest:  { y: 0,  boxShadow: "0 2px 8px rgba(187,36,39,0.10)" },
  hover: { y: -4, boxShadow: "0 8px 22px rgba(187,36,39,0.22)" },
};
const overlayVariants = {
  rest:  { opacity: 0 },
  hover: { opacity: 1 },
};

// Tarjeta de producto dentro del chat
function ProductoCard({ producto }) {
  const to = `/${generoRuta(producto.genero)}/${producto.categoria}/${producto.id}/0`;

  return (
    <Link to={to} style={{ textDecoration: "none", flexShrink: 0, scrollSnapAlign: "start" }}>
      <motion.div
        initial="rest"
        animate="rest"
        whileHover="hover"
        variants={cardVariants}
        transition={{ type: "spring", stiffness: 340, damping: 22 }}
        style={{
          background: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          border: `1.5px solid ${RED_PALE}`,
          display: "flex",
          flexDirection: "column",
          width: 155,
          cursor: "pointer",
        }}
      >
        {/* Imagen con gradiente inferior */}
        <div style={{ position: "relative", width: "100%", height: 160, background: "#f0f0f0", overflow: "hidden" }}>
          {producto.imagenUrl ? (
            <img
              src={producto.imagenUrl}
              alt={producto.nombre}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: RED_LIGHT }}>
              <ShoppingBag size={36} color={RED} opacity={0.3} />
            </div>
          )}

          {/* Gradiente inferior sobre imagen */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 50,
            background: "linear-gradient(to top, rgba(0,0,0,0.38) 0%, transparent 100%)",
          }} />

          {/* Precio flotante sobre imagen */}
          <div style={{
            position: "absolute", bottom: 7, left: 8,
            background: RED, borderRadius: 6, padding: "2px 7px",
            fontSize: 11, fontWeight: 800, color: "#fff",
          }}>
            S/. {Number(producto.precio).toFixed(2)}
          </div>

          {/* Overlay "Ver prenda" al hover */}
          <motion.div
            variants={overlayVariants}
            transition={{ duration: 0.16 }}
            style={{
              position: "absolute", inset: 0,
              background: "rgba(178,30,19,0.65)",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 5,
            }}
          >
            <ExternalLink size={20} color="#fff" />
            <span style={{ color: "#fff", fontSize: 11.5, fontWeight: 700, letterSpacing: 0.4 }}>
              Ver prenda
            </span>
          </motion.div>
        </div>

        {/* Info */}
        <div style={{ padding: "8px 10px 10px", display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Nombre — máx 2 líneas */}
          <div style={{
            fontSize: 12, fontWeight: 700, color: DARK, lineHeight: 1.4,
            display: "-webkit-box", WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical", overflow: "hidden",
          }}>
            {producto.nombre}
          </div>

          {/* Categoría + género */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <Tag size={9} color={RED} strokeWidth={2.5} />
              <span style={{ fontSize: 10, color: "#999" }}>{producto.categoria}</span>
            </div>
            <span style={{
              fontSize: 9, fontWeight: 600, color: RED,
              background: RED_LIGHT, borderRadius: 20, padding: "1px 6px",
            }}>
              {producto.genero}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

// Carrusel horizontal de productos
function ProductosCarrusel({ productos }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        display: "flex",
        gap: 10,
        overflowX: "auto",
        paddingBottom: 6,
        paddingTop: 2,
        paddingLeft: 4,
        paddingRight: 4,
        scrollbarWidth: "none",
        scrollSnapType: "x mandatory",
      }}
    >
      {productos.map((p) => (
        <ProductoCard key={p.id} producto={p} />
      ))}
    </motion.div>
  );
}

export default function ChatWidget() {
  const [abierto, setAbierto]   = useState(false);
  const [mensajes, setMensajes] = useState([BIENVENIDA]);
  const [input, setInput]       = useState("");
  const [cargando, setCargando] = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajes, cargando]);

  const enviar = async () => {
    const texto = input.trim();
    if (!texto || cargando) return;

    setMensajes((prev) => [...prev, { rol: "user", contenido: texto, productos: null }]);
    setInput("");
    setCargando(true);

    try {
      const respuesta = await preguntar(texto); // { texto, productos? }
      setMensajes((prev) => [
        ...prev,
        { rol: "assistant", contenido: respuesta.texto, productos: respuesta.productos ?? null },
      ]);
    } catch {
      setMensajes((prev) => [
        ...prev,
        { rol: "assistant", contenido: "Lo siento, hubo un problema al conectar con el asistente. Intentá de nuevo.", productos: null },
      ]);
    } finally {
      setCargando(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviar();
    }
  };

  return (
    <>
      {/* Panel de chat */}
      <AnimatePresence>
        {abierto && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.85, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{
              position: "fixed",
              bottom: 92,
              right: 24,
              width: 360,
              height: 510,
              background: "#fff",
              borderRadius: 18,
              boxShadow: "0 12px 40px rgba(187,36,39,0.18), 0 2px 8px rgba(0,0,0,0.08)",
              display: "flex",
              flexDirection: "column",
              zIndex: 9998,
              overflow: "hidden",
              fontFamily: "inherit",
            }}
          >
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${RED_DARK} 0%, ${RED} 100%)`,
              color: "#fff",
              padding: "13px 16px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}>
              <motion.div
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.55 }}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  background: "rgba(255,255,255,0.18)",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}
              >
                <Bot size={20} color="#fff" />
              </motion.div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, letterSpacing: 0.2 }}>
                  Asistente Mix&Match
                </div>
                <div style={{ fontSize: 11, opacity: 0.85, display: "flex", alignItems: "center", gap: 5 }}>
                  <motion.span
                    style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                  Impulsado por IA · En línea
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.15, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setAbierto(false)}
                style={{
                  background: "rgba(255,255,255,0.18)", border: "none", borderRadius: "50%",
                  width: 28, height: 28, display: "flex", alignItems: "center",
                  justifyContent: "center", cursor: "pointer", color: "#fff",
                }}
              >
                <X size={15} />
              </motion.button>
            </div>

            {/* Mensajes */}
            <div style={{
              flex: 1, overflowY: "auto", overflowX: "hidden",
              padding: "14px 12px", display: "flex", flexDirection: "column",
              gap: 10, background: RED_LIGHT,
            }}>
              <AnimatePresence initial={false}>
                {mensajes.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    style={{ display: "flex", flexDirection: "column", gap: 6 }}
                  >
                    {/* Burbuja de texto */}
                    <div style={{
                      display: "flex",
                      justifyContent: m.rol === "user" ? "flex-end" : "flex-start",
                      alignItems: "flex-end",
                      gap: 6,
                    }}>
                      {m.rol === "assistant" && (
                        <div style={{
                          width: 26, height: 26, borderRadius: "50%", background: RED,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexShrink: 0, marginBottom: 2,
                        }}>
                          <Bot size={14} color="#fff" />
                        </div>
                      )}
                      <div style={{
                        maxWidth: "78%",
                        padding: "9px 13px",
                        borderRadius: m.rol === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: m.rol === "user"
                          ? `linear-gradient(135deg, ${RED_DARK} 0%, ${RED} 100%)`
                          : "#fff",
                        color: m.rol === "user" ? "#fff" : DARK,
                        fontSize: 13.5,
                        lineHeight: 1.55,
                        boxShadow: m.rol === "user"
                          ? "0 2px 8px rgba(187,36,39,0.25)"
                          : "0 1px 4px rgba(0,0,0,0.07)",
                      }}>
                        {m.rol === "assistant" ? (
                          <ReactMarkdown
                            components={{
                              p:      ({ children }) => <p style={{ margin: "0 0 6px 0" }}>{children}</p>,
                              strong: ({ children }) => <strong style={{ fontWeight: 700 }}>{children}</strong>,
                              em:     ({ children }) => <em style={{ fontStyle: "italic" }}>{children}</em>,
                              ul:     ({ children }) => <ul style={{ margin: "4px 0 4px 14px", padding: 0 }}>{children}</ul>,
                              ol:     ({ children }) => <ol style={{ margin: "4px 0 4px 16px", padding: 0 }}>{children}</ol>,
                              li:     ({ children }) => <li style={{ marginBottom: 2 }}>{children}</li>,
                            }}
                          >
                            {m.contenido}
                          </ReactMarkdown>
                        ) : (
                          m.contenido
                        )}
                      </div>
                    </div>

                    {/* Carrusel de productos (solo mensajes del asistente) */}
                    {m.rol === "assistant" && m.productos && m.productos.length > 0 && (
                      <ProductosCarrusel productos={m.productos} />
                    )}
                  </motion.div>
                ))}

                {/* Indicador de escritura */}
                {cargando && (
                  <motion.div
                    key="typing"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ display: "flex", alignItems: "flex-end", gap: 6 }}
                  >
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%", background: RED,
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}>
                      <Bot size={14} color="#fff" />
                    </div>
                    <div style={{
                      padding: "10px 14px", borderRadius: "16px 16px 16px 4px",
                      background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                      display: "flex", gap: 4, alignItems: "center",
                    }}>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          style={{ width: 7, height: 7, borderRadius: "50%", background: RED, display: "inline-block" }}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ repeat: Infinity, duration: 0.65, delay: i * 0.15, ease: "easeInOut" }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{
              padding: "10px 12px",
              borderTop: `1px solid ${RED_PALE}`,
              display: "flex", gap: 8, alignItems: "center",
              background: "#fff",
            }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Escribí tu pregunta..."
                disabled={cargando}
                style={{
                  flex: 1, border: `1.5px solid ${RED_PALE}`, borderRadius: 20,
                  padding: "8px 14px", fontSize: 13.5, outline: "none",
                  background: cargando ? "#fafafa" : "#fff", color: DARK,
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = RED)}
                onBlur={(e)  => (e.target.style.borderColor = RED_PALE)}
              />
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={enviar}
                disabled={cargando || !input.trim()}
                style={{
                  width: 38, height: 38, borderRadius: "50%",
                  background: cargando || !input.trim()
                    ? "#CBD5E1"
                    : `linear-gradient(135deg, ${RED_DARK} 0%, ${RED} 100%)`,
                  color: "#fff", border: "none",
                  cursor: cargando || !input.trim() ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                  boxShadow: cargando || !input.trim() ? "none" : "0 2px 8px rgba(187,36,39,0.35)",
                  transition: "background 0.2s, box-shadow 0.2s",
                }}
              >
                {cargando ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <Loader2 size={17} />
                  </motion.div>
                ) : (
                  <Send size={16} />
                )}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Botón flotante */}
      <motion.button
        onClick={() => setAbierto((v) => !v)}
        whileHover={{ scale: 1.1, boxShadow: "0 6px 24px rgba(187,36,39,0.45)" }}
        whileTap={{ scale: 0.92 }}
        style={{
          position: "fixed", bottom: 24, right: 24,
          width: 56, height: 56, borderRadius: "50%",
          background: `linear-gradient(135deg, ${RED_DARK} 0%, ${RED} 100%)`,
          color: "#fff", border: "none", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(187,36,39,0.40)",
          zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        }}
        title="Asistente MixAndMatch"
      >
        <AnimatePresence mode="wait">
          {abierto ? (
            <motion.div key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="open"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Badge cuando el chat está cerrado */}
      <AnimatePresence>
        {!abierto && (
          <motion.div
            key="badge"
            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 25 }}
            style={{
              position: "fixed", bottom: 68, right: 20,
              width: 20, height: 20, borderRadius: "50%",
              background: "#fff", border: `2px solid ${RED}`,
              zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            <Sparkles size={10} color={RED} strokeWidth={2.5} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
