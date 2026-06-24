'use client';

import React from 'react';

export default function GoldCardDemo() {
  const inlineStyles = `
    :root {
      --glitter: url("https://assets.codepen.io/13471/silver-glitter-background.png");
      --duration: 6.66s;
    }

    .gold-card-container {
      display: grid;
      grid-template-rows: minmax(20px, 100px) 1fr;
      place-items: center;
      min-height: 100vh;
      perspective: 1000px;
      overflow: hidden;
      background: #1e293b;
      background-image: radial-gradient(circle at 50% 50%, #334155 0%, #0f172a 100%);
      color: white;
      font-family: "Heebo", sans-serif;
      padding: 20px;
    }

    .gold-card-title {
      margin: 1em;
      color: #fef08a;
      text-align: center;
      font-size: 1.8rem;
      font-weight: 700;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
      letter-spacing: 0.05em;
    }

    .gold-card-title em {
      font-style: normal;
      color: #fbbf24;
      text-decoration: underline;
      text-decoration-color: rgba(251, 191, 36, 0.4);
    }

    .card-front {
      display: grid;
      position: relative;
      transform: translate3d(0, 0, 0.01px);
      
      height: 320px;
      width: 480px;
      aspect-ratio: 3/2;
      border-radius: 16px;

      /* Rich metallic gold gradient base */
      background: linear-gradient(135deg, #9a3412 0%, #d97706 20%, #f59e0b 40%, #fef08a 60%, #d97706 80%, #7c2d12 100%);
      background-size: cover;

      box-shadow: 
        0 30px 60px -15px rgba(0, 0, 0, 0.8),
        inset 0 1px 1px rgba(255, 255, 255, 0.4);
      border: 1px solid rgba(254, 240, 138, 0.3);
      overflow: hidden;
      animation: tilt var(--duration) ease infinite;
      image-rendering: optimizequality;
    }

    /* Glitter and sheen overlays */
    .card-front:before {
      content: "";
      inset: 0;
      position: absolute;
      transform: translate3d(0, 0, 0.01px);

      /* Overlaying grayscale glitter over the gold base */
      background-image: var(--glitter), var(--glitter),
        linear-gradient(120deg, #7c2d12 25%, #ffffff 50%, #7c2d12 75%);
      background-size: 100% 100%, 80% 80%, 200% 200%;
      background-blend-mode: multiply, multiply, overlay;
      background-position: 50% 50%, 50% 50%, 50% 50%;

      mix-blend-mode: color-dodge;
      filter: brightness(1.7) contrast(1.3);
      animation: bg var(--duration) ease infinite;
    }

    .card-front:after {
      content: "";
      position: absolute;
      inset: 0;
      background: none, none, linear-gradient(125deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.4) 0.1%, rgba(255,255,255,0) 60%);
      background-size: 200% 200%;
      mix-blend-mode: hard-light;
      animation: bg var(--duration) ease infinite;
    }

    .card-front * {
      font-family: 'Courier New', Courier, monospace;
      font-weight: bold;
    }

    .cardLogo,
    .expiry,
    .name,
    .number,
    .chip {
      position: absolute;
      margin: 0;
      padding: 0;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      font-size: 1rem;
      inset: 6%;
      text-shadow: 
        -1px -1px 0px rgba(255,255,255,0.4),
        1px -1px 0px rgba(255,255,255,0.4),
        1px 1px 0px rgba(0,0,0,0.6),
        -1px 1px 0px rgba(0,0,0,0.6);
      z-index: 5;
    }

    /* Gold foil text effect */
    .name, .number, .expiry {
      background-image: 
        linear-gradient(to bottom, #ffffff 10%, #fef08a 40%, #b45309 90%), 
        none,
        linear-gradient(120deg, transparent 10%, white 40%, white 60%, transparent 90%);
      background-size: cover, cover, 200%;
      background-position: 50% 50%;
      background-blend-mode: overlay;
      -webkit-text-fill-color: transparent;
      -webkit-background-clip: text;
      animation: bg var(--duration) ease infinite;
    }

    .number {
      text-align: center;
      font-size: 1.8rem;
      letter-spacing: 0.05em;
      top: 55%;
      bottom: auto;
      width: 88%;
    }

    .expiry,
    .name {
      top: auto;
    }

    .name {
      right: auto;
      max-width: 240px;
      line-height: 1.2;
      text-align: left;
      font-size: 0.95rem;
    }

    .expiry {
      left: auto;
      font-size: 0.95rem;
    }

    .cardLogo {
      bottom: auto;
      left: auto;
      width: 14%;
      filter: invert(1) saturate(0) brightness(1.2) contrast(1.2);
      mix-blend-mode: screen;
    }

    /* Golden Chip */
    .chip {
      display: grid;
      place-items: center;
      width: 12%;
      aspect-ratio: 5/4;
      left: 10%;
      top: 28%;
      border-radius: 6px;
      background-image: none, none,
        linear-gradient(120deg, #7c2d12 10%, #fef08a 40%, #ffffff 65%, #d97706 90%);
      background-size: 200% 200%;
      background-position: 50% 50%;
      overflow: hidden;
      animation: bg var(--duration) ease infinite;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.5);
    }

    .chip svg {
      display: block;
      width: 90%;
      fill: none;
      stroke: #7c2d12;
      stroke-width: 2.5;
    }

    .contactless {
      position: absolute;
      left: 24%;
      top: 27.5%;
      width: 10%;
    }

    .contactless svg {
      transform: rotate(90deg);
      stroke-width: 2.25;
      stroke: #fef08a;
      fill: none;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0.85;
      filter: drop-shadow(0 1px 1px rgba(0,0,0,0.5));
    }

    @keyframes tilt {
      0%, 100% { transform: translate3d(0, 0, 0.01px) rotateY(-18deg) rotateX(6deg); }
      50% { transform: translate3d(0, 0, 0.01px) rotateY(18deg) rotateX(6deg); }
    }

    @keyframes bg {
      0%, 100% { background-position: 50% 50%, calc(50% + 1px) calc(50% + 1px), 0% 50%; }
      50% { background-position: 50% 50%, calc(50% - 1px) calc(50% - 1px), 100% 50%; }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: inlineStyles }} />

      <div className="gold-card-container">
        <h1 className="gold-card-title">Click & hover to see the <em>GOLD GLITTER</em> ✨!</h1>
        
        <aside className="card-front">
          <label className="number" htmlFor="cardNumber">
            5355 1234 0000 9999
          </label>
          <label className="name" htmlFor="cardHolder">
            Jane Appleseed
          </label>
          <label className="expiry" htmlFor="expiryMonth">
            03/27
          </label>
          
          <img 
            className="cardLogo" 
            src="https://simey-credit-card.netlify.app/img/logos/master.svg" 
            alt="Mastercard logo"
          />
          
          <div className="chip">
            <svg role="img" viewBox="0 0 100 100" aria-label="Chip">
              <path d="M0,50 L35,50" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
              <path d="M0,20 L20,20 L35,35" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
              <path d="M50,0 L50,35" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
              <path d="M65,35 L80,20 L100,20" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
              <path d="M100,50 L65,50" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
              <path d="M35,35 L65,35 L65,65 L35,65 Z" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
              <path d="M0,80 L20,80 L35,65" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
              <path d="M50,100 L50,65" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
              <path d="M65,65 L80,80 L100,80" stroke="#7c2d12" strokeWidth="2.5" fill="none" />
            </svg>
          </div>

          <div className="contactless">
            <svg role="img" viewBox="0 0 24 24" aria-label="Contactless">
              <path d="M9.172 15.172a4 4 0 0 1 5.656 0" stroke="#fef08a" strokeWidth="2.25" fill="none" strokeLinecap="round" />
              <path d="M6.343 12.343a8 8 0 0 1 11.314 0" stroke="#fef08a" strokeWidth="2.25" fill="none" strokeLinecap="round" />
              <path d="M3.515 9.515c4.686 -4.687 12.284 -4.687 17 0" stroke="#fef08a" strokeWidth="2.25" fill="none" strokeLinecap="round" />
            </svg>
          </div>
        </aside>
      </div>
    </>
  );
}
