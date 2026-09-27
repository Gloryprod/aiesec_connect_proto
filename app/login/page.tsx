import React from "react";
import { AuthCard } from "@/components/auth/AuthCard";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-aiesec-background flex flex-col justify-center items-center px-4 py-8 relative overflow-hidden">
      {/* Cercles décoratifs d'arrière-plan avec les couleurs de la marque */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-aiesec-blue/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-aiesec-purple/10 blur-3xl pointer-events-none" />

      {/* En-tête / Slogan discret */}
      <div className="mb-6 text-center hidden sm:block">
        <span className="font-heading text-xs font-bold uppercase tracking-widest text-aiesec-blue bg-aiesec-surface-soft px-3.5 py-1.5 rounded-full border border-aiesec-blue/20">
          Connect. Share. Grow.
        </span>
      </div>

      {/* Carte d'accès */}
      <AuthCard />

      {/* Tagline footer */}
      <p className="mt-8 text-center font-heading text-xs text-aiesec-text-muted">
        AIESEC for a better world 💙
      </p>
    </div>
  );
}