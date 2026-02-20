import React, { useEffect } from "react";
import Login from "./Login";

/*
  AuthModal
  - Overlay + animação
  - Fecha no ESC
  - Fecha clicando fora
*/

const AuthModal = ({ open, onClose }) => {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-3xl animate-[fadeIn_.2s_ease-out]">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 shadow flex items-center justify-center transition"
          aria-label="Close"
        >
          ✕
        </button>

        <div className="rounded-[30px] overflow-hidden shadow-2xl bg-white">
          <Login onClose={onClose} />
        </div>
      </div>

      {/* animação simples */}
      <style>{`
        @keyframes fadeIn {
          from { transform: translateY(8px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AuthModal;