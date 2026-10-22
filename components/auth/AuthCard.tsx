"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth, RegisterData } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import Image from "next/image";
import { AuthShowcasePanel, AuthMobileBackground } from "./AuthShowcase";
import countries from "world-countries";

export const AuthCard: React.FC = () => {
  const router = useRouter();
  const { login, register, isLoading } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    lc: "",
    role: "Team Member",
    country: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  // Extraire et trier les pays en français
  const countryListFr = countries
    .map((c) => ({
      name: c.translations.fra?.common || c.name.common,
      flag: c.flag, // Emoji drapeau (ex: 🇧🇯)
    }))
    .sort((a, b) => a.name.localeCompare(b.name, "fr"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        const success = login(formData.email);
        if (success) {
          router.push("/home");
        } else {
          setError("Aucun compte trouvé avec cette adresse email.");
        }
      } else {
        const registerPayload: RegisterData = {
          email: formData.email,
          fullName: formData.fullName,
          lc: formData.lc,
          role: formData.role,
          country: formData.country,
          bio: "Membre passionné par l'impact et le leadership au sein d'AIESEC.",
          password: formData.password,
          skills: ["Leadership", "Teamwork"],
          experiences: [],
          journey: [{ year: "2026", role: formData.role, lc: formData.lc }],
          recognitions: [],
          connections: [],
        };

        const success = register(registerPayload);
        if (success) {
          router.push("/home");
        } else {
          setError("Un compte existe déjà avec cette adresse email.");
        }
      }
    } catch (err) {
      setError("Une erreur est survenue lors de l'authentification.");
    }
  };

  return (
    // Desktop : 2 colonnes (visuel | formulaire). Mobile : 1 colonne + image de fond.
    // `fixed inset-0` : occupe tout l'écran quel que soit le padding/margin du layout parent.
    <div className="fixed inset-0 z-50 overflow-y-auto bg-aiesec-background">
      <div className="relative min-h-dvh w-full lg:grid lg:grid-cols-2">
        <AuthMobileBackground />
        <AuthShowcasePanel />

        {/* Colonne formulaire */}
        <main className="relative z-10 flex flex-col items-center justify-center gap-5 px-4 py-8 sm:p-8 bg-transparent lg:bg-aiesec-background">
          {/* Badge Connect / Share / Grow, au-dessus du formulaire */}
          <div className="inline-flex items-center gap-3 rounded-full border border-white/30 bg-aiesec-surface/60 backdrop-blur-xl px-4 py-1.5 shadow-sm lg:border-aiesec-border lg:bg-aiesec-surface lg:backdrop-blur-none">
            {["Connect", "Share", "Grow"].map((word, i) => (
              <span
                key={word}
                className="inline-flex items-center gap-1.5 font-heading text-xs font-semibold text-aiesec-text"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    i === 0
                      ? "bg-aiesec-blue"
                      : i === 1
                      ? "bg-orange-400"
                      : "bg-emerald-500"
                  }`}
                />
                {word}
              </span>
            ))}
          </div>

        <div className="w-full max-w-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/30 bg-aiesec-surface/70 backdrop-blur-4xl backdrop-saturate-150 lg:border-aiesec-border lg:bg-aiesec-surface lg:backdrop-blur-none lg:backdrop-saturate-100">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-auto h-20 md:h-28">
              <Image
                src="/logo2.png"
                alt="Logo"
                width={200}
                height={60}
                className="w-auto h-full object-contain dark:brightness-0 dark:invert"
                priority
              />
            </div>
            <p className="font-sans text-xs text-aiesec-text-secondary  mt-1">
              Connecte-toi avec des membres, partage tes expériences, construis
              ton avenir.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="bg-aiesec-background p-1 rounded-xl flex items-center mb-6 border border-aiesec-border">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "login"
                  ? "bg-aiesec-surface text-aiesec-blue shadow-sm"
                  : "text-aiesec-text-muted hover:text-aiesec-text"
              }`}
            >
              Se connecter
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
              }}
              className={`flex-1 py-2 text-xs font-heading font-semibold rounded-lg transition-all cursor-pointer ${
                mode === "register"
                  ? "bg-aiesec-surface text-aiesec-blue shadow-sm"
                  : "text-aiesec-text-muted hover:text-aiesec-text"
              }`}
            >
              Créer un compte
            </button>
          </div>

          {error && (
            <div
              role="alert"
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 text-xs font-sans text-center"
            >
              {error}
            </div>
          )}

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <Input
                  label="Nom complet"
                  name="fullName"
                  placeholder="ex: Tina Agbomahena"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-aiesec-text">
                      Comité Local (LC)
                    </label>
                    <select
                      name="lc"
                      value={formData.lc}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-aiesec-surface border border-aiesec-border rounded-xl text-xs text-aiesec-text focus:outline-none focus:border-aiesec-blue focus:ring-1 focus:ring-aiesec-blue transition-all"
                      required
                    >
                      <option value="">Sélectionne ton LC</option>
                      <option value="LC Abomey-Calavi">LC Abomey-Calavi</option>
                      <option value="LC Cotonou">LC Cotonou</option>
                      <option value="LC Porto Novo">LC Porto Novo</option>
                      <option value="LC Parakou">LC Parakou</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-aiesec-text">
                      Rôle AIESEC
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-aiesec-surface border border-aiesec-border rounded-xl text-xs text-aiesec-text focus:outline-none focus:border-aiesec-blue focus:ring-1 focus:ring-aiesec-blue transition-all"
                      required
                    >
                      <option value="">Sélectionne ton Rôle</option>
                      <option value="Team Member">Team Member</option>
                      <option value="Team Leader">Team Leader</option>
                      <option value="Vice President">Vice President</option>
                      <option value="President">President</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-medium text-aiesec-text">Pays</label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-aiesec-surface border border-aiesec-border rounded-xl text-xs text-aiesec-text focus:outline-none focus:border-aiesec-blue focus:ring-1 focus:ring-aiesec-blue transition-all"
                    required
                  >
                    <option value="">Sélectionne ton pays</option>
                    {countryListFr.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <Input
              label="Adresse Email"
              type="email"
              name="email"
              placeholder="tina.agbomahena@aiesec.net"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="flex flex-col gap-1.5 relative">
              <Input
                label="Mot de passe"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? "Masquer le mot de passe"
                    : "Afficher le mot de passe"
                }
                className="absolute right-3.5 top-8.5 text-aiesec-text-muted hover:text-aiesec-text transition-colors cursor-pointer"
              >
                {showPassword ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M1 1l22 22"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <Button
              variant="primary"
              type="submit"
              isLoading={isLoading}
              className="w-full py-3! mt-2 font-heading font-semibold"
            >
              {mode === "login" ? "Se connecter" : "Créer mon compte"}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-aiesec-border text-center">
            <p className="font-sans text-xs text-aiesec-text-secondary">
              Rejoindre AIESEC ?{" "}
              <a
                href="#"
                className="text-aiesec-blue font-semibold hover:underline"
              >
                En savoir plus
              </a>
            </p>
          </div>
        </div>
        </main>
      </div>
    </div>
  );
};
