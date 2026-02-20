import React from "react";

/*
  RippleButton

  Botão reutilizável com efeito ripple (estilo Material / Stripe).

  Vantagens:
  - feedback visual imediato
  - melhora percepção de performance
  - componente plug-and-play

  Aceita todas props nativas de <button>.
*/

const RippleButton = ({ children, className = "", ...props }) => {

  /*
    Cria dinamicamente o círculo do ripple
    baseado na posição do clique.
  */
  const createRipple = (e) => {

    const button = e.currentTarget;

    const circle = document.createElement("span");

    // garante que o ripple cubra todo o botão
    const diameter = Math.max(
      button.clientWidth,
      button.clientHeight
    );

    circle.style.width = circle.style.height = `${diameter}px`;

    // posiciona o ripple exatamente onde clicou
    circle.style.left =
      `${e.clientX - button.offsetLeft - diameter / 2}px`;

    circle.style.top =
      `${e.clientY - button.offsetTop - diameter / 2}px`;

    circle.classList.add("ripple");

    // remove ripple anterior para evitar acúmulo no DOM
    const ripple = button.getElementsByClassName("ripple")[0];
    if (ripple) ripple.remove();

    button.appendChild(circle);
  };

  return (
    <button
      {...props}
      onClick={(e) => {
        createRipple(e);

        // preserva qualquer onClick externo
        props.onClick?.(e);
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {children}

      {/* CSS isolado evita poluir globals */}
      <style>
        {`
          .ripple{
            position:absolute;
            border-radius:50%;
            transform:scale(0);
            animation:ripple 600ms linear;
            background:rgba(255,255,255,.6);
            pointer-events:none;
          }

          @keyframes ripple{
            to{
              transform:scale(4);
              opacity:0;
            }
          }
        `}
      </style>
    </button>
  );
};

export default RippleButton;
