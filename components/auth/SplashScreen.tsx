"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export const SplashScreen: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirection automatique vers /login après 2.5 secondes
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between items-center bg-aiesec-background py-12 px-6 select-none overflow-hidden">
      {/* Element vide pour équilibrer le flex layout */}
      <div />

      {/* Brand Central avec Animation */}
      <div className="flex flex-col items-center text-center animate-fade-in">
        {/* Logo Container avec Pulsation */}
        <div className="relative w-auto h-20 md:h-30">
            <Image 
            src="/logo2.png" 
            alt="Logo"
            width={200}
            height={60}
            className="w-auto h-full object-contain dark:brightness-0 dark:invert"
            priority
            />
        </div>
        <p className="font-sans text-sm text-aiesec-text-secondary max-w-xs font-medium">
          Connect. Share. Grow.
        </p>

        {/* Loader discret type Instagram */}
        <div className="mt-8 flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-aiesec-blue animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-aiesec-blue animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-aiesec-blue animate-bounce" />
        </div>
      </div>

      {/* Signature Bas de Page (façon Meta / Instagram) */}
      <div className="flex flex-col items-center gap-1">
        <span className="font-sans text-xs text-aiesec-text-muted tracking-wider uppercase font-semibold">
          From
        </span>
        <span className="font-heading font-extrabold text-sm text-aiesec-navy tracking-wide">
          AIESEC BENIN 🇧🇯
        </span>
      </div>
    </div>
  );
};