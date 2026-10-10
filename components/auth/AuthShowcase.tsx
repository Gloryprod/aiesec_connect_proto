"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

type Slide = {
  photo: string; // photo de fond (/public/...)
  title: string;
  text: string;
};

const SLIDES: Slide[] = [
  {
    photo: "/photoAuth7.jpeg",
    title: "Ton réseau, partout dans le monde",
    text: "Retrouve les membres de ton comité et ceux des autres pays.",
  },
  {
    photo: "/photoAuth1.jpeg",
    title: "Partage tes expériences",
    text: "Raconte ton parcours et inspire la prochaine génération de leaders.",
  },
  {
    photo: "/photoAuth4.jpeg",
    title: "Construis ton avenir",
    text: "Valorise tes compétences et ouvre-toi de nouvelles opportunités.",
  },
  {
    photo: "/photoAuth5.jpeg",
    title: "Grandis en équipe",
    text: "Collabore avec des jeunes engagés et développe ton leadership au quotidien.",
  },
  {
    photo: "/photoAuth6.jpeg",
    title: "Rejoins une communauté qui a de l'impact",
    text: "Fais partie d'un mouvement de jeunes qui agissent pour un monde meilleur.",
  },
];

const SLIDE_DURATION = 6000;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/* -------------------------------------------------------------------------- */
/*  Panneau desktop (lg+) : diaporama de photos avec texte                    */
/* -------------------------------------------------------------------------- */
export const AuthShowcasePanel: React.FC = () => {
  const [active, setActive] = useState(0);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(
      () => setActive((i) => (i + 1) % SLIDES.length),
      SLIDE_DURATION
    );
    return () => clearInterval(id);
  }, [reduced]);

  return (
    <aside
      className="relative hidden lg:block overflow-hidden bg-aiesec-blue"
      aria-label="Présentation de la plateforme"
    >
      {SLIDES.map((slide, i) => {
        const isActive = i === active;
        return (
          <div
            key={slide.photo}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.photo}
              alt=""
              fill
              sizes="50vw"
              priority={i === 0}
              className="object-cover"
            />

            {/* Voile de couleur pour la lisibilité du texte */}
            <div className="absolute inset-0 bg-linear-to-t from-aiesec-blue/90 via-aiesec-blue/40 to-aiesec-blue/10" />

            {/* Texte */}
            <div className="absolute inset-x-0 bottom-0 p-10 xl:p-14 text-white">
              <h2 className="font-heading text-3xl xl:text-4xl font-bold leading-tight max-w-md">
                {slide.title}
              </h2>
              <p className="font-sans mt-3 text-base text-white/85 max-w-md">
                {slide.text}
              </p>
            </div>
          </div>
        );
      })}

      {/* Indicateurs */}
      <div className="absolute bottom-6 left-10 xl:left-14 flex gap-2 z-10">
        {SLIDES.map((s, i) => (
          <button
            key={s.photo}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Afficher la diapositive ${i + 1}`}
            aria-current={i === active}
            className={`h-1.5 rounded-full transition-all duration-500 cursor-pointer ${
              i === active ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </aside>
  );
};

/* -------------------------------------------------------------------------- */
/*  Fond mobile (< lg) : une seule image fixe                                 */
/* -------------------------------------------------------------------------- */
export const AuthMobileBackground: React.FC = () => (
  <div className="lg:hidden absolute inset-0 z-0" aria-hidden>
    <Image
      src={SLIDES[0].photo}
      alt=""
      fill
      sizes="100vw"
      priority
      className="object-cover"
    />
    {/* Voile léger : l'image reste bien visible, le flou est géré par la carte */}
    <div className="absolute inset-0 bg-aiesec-blue/30" />
  </div>
);
