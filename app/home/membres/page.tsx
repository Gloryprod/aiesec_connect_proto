"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { WebHeader } from "@/components/layout/WebHeader";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { WebSidebar } from "@/components/layout/WebSidebar";
import { 
  Search, 
  Building2, 
  UserPlus, 
  Check, 
  Sparkles, 
  X,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";
import { UserProfile } from "@/data/mockUsers";

export default function MembersPage() {
  const { users } = useData();
  const { user : currentUser, isAuthenticated, isLoading } = useAuth();   
  const router = useRouter();

  // Redirection si non authentifié
      useEffect(() => {
        if (!isLoading && (!isAuthenticated || !currentUser)) {
          router.push("/login");
        }
      }, [isLoading, isAuthenticated, currentUser, router]);

  // États des filtres et recherche
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLc, setSelectedLc] = useState<string>("ALL");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("ALL");
  const [selectedSkill, setSelectedSkill] = useState<string>("ALL");
  
  // État de connexion suivie (Simulation)
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  
  // État pour la modale d'aperçu rapide
  const [previewUser, setPreviewUser] = useState<UserProfile | null>(null);

  // Extraire les options uniques pour les filtres
  const allLcs = useMemo(() => {
    const lcs = new Set<string>();
    users.forEach((u) => u.lc && lcs.add(u.lc));
    return Array.from(lcs);
  }, [users]);

  const allSkills = useMemo(() => {
    const skills = new Set<string>();
    users.forEach((u) => u.skills?.forEach((s: string) => skills.add(s)));
    return Array.from(skills);
  }, [users]);

  // Filtrage dynamique des membres
  const filteredMembers = useMemo(() => {
    return users.filter((member) => {
      // Ne pas s'afficher soi-même
      if (member.id === currentUser?.id) return false;

      // Recherche globale (nom, rôle, bio, compétences)
      const matchesSearch =
        searchQuery === "" ||
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.skills?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      // Filtre LC
      const matchesLc = selectedLc === "ALL" || member.lc === selectedLc;

      // Filtre Département / Rôle
      const matchesDepartment =
        selectedDepartment === "ALL" ||
        member.role?.toLowerCase().includes(selectedDepartment.toLowerCase());

      // Filtre Compétence
      const matchesSkill =
        selectedSkill === "ALL" || member.skills?.includes(selectedSkill);

      return matchesSearch && matchesLc && matchesDepartment && matchesSkill;
    });
  }, [users, currentUser, searchQuery, selectedLc, selectedDepartment, selectedSkill]);

  const toggleConnect = (memberId: string) => {
    setConnectedUsers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLc("ALL");
    setSelectedDepartment("ALL");
    setSelectedSkill("ALL");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aiesec-background">
        <div className="w-8 h-8 border-4 border-aiesec-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aiesec-background flex flex-col">
      <WebHeader />
      <div className="md:hidden"><MobileHeader /></div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-0 md:px-6 py-0 md:py-6 flex gap-6">
        <WebSidebar activeTab="explorer" onTabChange={() => {}} />

        <section className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 md:px-0 pb-20 md:pb-6 space-y-6">
          
          {/* En-tête de la page */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-aiesec-text">Découvrir le Réseau</h1>
                <p className="text-xs text-aiesec-text-muted">
                  Explorez et connectez-vous avec les membres et alimni de votre comité et d&apos;ailleurs.
                </p>
              </div>
              <span className="self-start sm:self-auto bg-aiesec-blue/10 text-aiesec-blue text-xs font-semibold px-3 py-1 rounded-full">
                {filteredMembers.length} Membre{filteredMembers.length > 1 ? "s" : ""} trouvé{filteredMembers.length > 1 ? "s" : ""}
              </span>
            </div>

            {/* Barre de Recherche */}
            <div className="relative">
              <Search className="w-4 h-4 text-aiesec-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom, rôle, compétence (ex: Leadership, oGV)..."
                className="w-full bg-aiesec-background border border-aiesec-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-aiesec-text-muted hover:text-aiesec-text"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sélecteurs de Filtres */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-aiesec-border">
              {/* Filtre par LC */}
              <div>
                <label className="text-[11px] text-aiesec-text-muted font-medium mb-1 block">Comité Local (LC)</label>
                <select
                  value={selectedLc}
                  onChange={(e) => setSelectedLc(e.target.value)}
                  className="w-full bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-1.5 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                >
                  <option value="ALL">Tous les comités</option>
                  {allLcs.map((lc) => (
                    <option key={lc} value={lc}>{lc}</option>
                  ))}
                </select>
              </div>

              {/* Filtre par Pôle / Département */}
              <div>
                <label className="text-[11px] text-aiesec-text-muted font-medium mb-1 block">Département / Pôle</label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-1.5 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                >
                  <option value="ALL">Tous les pôles</option>
                  <option value="TM">Talent Management (TM)</option>
                  <option value="oGV">Outgoing Global Volunteer (oGV)</option>
                  <option value="iGV">Incoming Global Volunteer (iGV)</option>
                  <option value="oGT">Outgoing Global Talent (oGT)</option>
                  <option value="F&A">Finance & Administration</option>
                  <option value="MKT">Marketing / B2C</option>
                </select>
              </div>

              {/* Filtre par Compétence */}
              <div>
                <label className="text-[11px] text-aiesec-text-muted font-medium mb-1 block">Compétence</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-1.5 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                >
                  <option value="ALL">Toutes les compétences</option>
                  {allSkills.map((skill) => (
                    <option key={skill} value={skill}>{skill}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Réinitialisation si au moins un filtre est actif */}
            {(searchQuery || selectedLc !== "ALL" || selectedDepartment !== "ALL" || selectedSkill !== "ALL") && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={resetFilters}
                  className="text-xs text-aiesec-blue hover:underline font-medium flex items-center gap-1"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Réinitialiser les filtres</span>
                </button>
              </div>
            )}
          </div>

          {/* Grille des membres */}
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredMembers.map((member) => {
                const isConnected = connectedUsers.includes(member.id);
                const initials = member.fullName
                  ? member.fullName.split(" ").map((n: string) => n[0]).join("").substring(0, 2)
                  : "U";

                return (
                  <div
                    key={member.id}
                    className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-5 shadow-sm hover:border-aiesec-blue/40 transition-all flex flex-col justify-between group cursor-pointer"
                    onClick={() => setPreviewUser(member)}
                  >
                    <div className="space-y-3">
                      {/* En-tête Carte */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-aiesec-blue/10 border border-aiesec-blue/20 flex items-center justify-center font-bold text-base text-aiesec-blue group-hover:bg-aiesec-blue group-hover:text-white transition-all shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-sm text-aiesec-text truncate group-hover:text-aiesec-blue transition-colors">
                              {member.fullName}
                            </h3>
                            <p className="text-xs font-semibold text-aiesec-blue truncate">
                              {member.role || "Membre"}
                            </p>
                            <div className="flex items-center gap-1 text-[11px] text-aiesec-text-muted mt-0.5">
                              <Building2 className="w-3 h-3 text-aiesec-blue" />
                              <span className="truncate">{member.lc || "Comité non spécifié"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bio courte */}
                      {member.bio && (
                        <p className="text-xs text-aiesec-text-muted line-clamp-2 leading-relaxed">
                          {member.bio}
                        </p>
                      )}

                      {/* Compétences (Badges) */}
                      {member.skills && member.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {member.skills.slice(0, 3).map((skill: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-aiesec-background border border-aiesec-border text-aiesec-text-muted text-[10px] px-2 py-0.5 rounded-md"
                            >
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 3 && (
                            <span className="text-[10px] text-aiesec-text-muted self-center">
                              +{member.skills.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Pied de Carte / Actions */}
                    <div className="pt-4 mt-4 border-t border-aiesec-border flex items-center justify-between gap-2">
                      <span className="text-[10px] text-aiesec-text-muted flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {member.journey ? `${member.journey.length} étapes Journey` : "Nouveau membre"}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleConnect(member.id);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isConnected
                            ? "bg-green-500/10 text-green-600 border border-green-500/20"
                            : "bg-aiesec-blue text-white hover:bg-aiesec-blue-dark"
                        }`}
                      >
                        {isConnected ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Connecté</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Connecter</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-12 text-center space-y-3">
              <Search className="w-8 h-8 text-aiesec-text-muted mx-auto" />
              <h3 className="font-bold text-aiesec-text text-sm">Aucun membre ne correspond à vos critères</h3>
              <p className="text-xs text-aiesec-text-muted max-w-sm mx-auto">
                Essayez de modifier votre recherche ou de réinitialiser vos filtres pour trouver plus de profils.
              </p>
              <button
                onClick={resetFilters}
                className="bg-aiesec-blue text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-aiesec-blue-dark transition-colors"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Modale Aperçu Rapide du Profil */}
      {previewUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-aiesec-surface border border-aiesec-border w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl relative">
            <button
              onClick={() => setPreviewUser(null)}
              className="absolute top-4 right-4 text-aiesec-text-muted hover:text-aiesec-text"
            >
              <X className="w-5 h-5" />
            </button>

            {/* En-tête Aperçu */}
            <div className="flex items-center gap-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-aiesec-blue text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                {previewUser.fullName.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div>
                <h2 className="text-base font-bold text-aiesec-text">{previewUser.fullName}</h2>
                <p className="text-xs font-semibold text-aiesec-blue">{previewUser.role}</p>
                <p className="text-xs text-aiesec-text-muted flex items-center gap-1 mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-aiesec-blue" />
                  {previewUser.lc}
                </p>
              </div>
            </div>

            {/* Bio */}
            {previewUser.bio && (
              <p className="text-xs text-aiesec-text leading-relaxed bg-aiesec-background p-3 rounded-xl border border-aiesec-border">
                {previewUser.bio}
              </p>
            )}

            {/* Aperçu AIESEC Journey */}
            {previewUser.journey && previewUser.journey.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-aiesec-text flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-aiesec-blue" />
                  AIESEC Journey
                </h4>
                <div className="space-y-1.5">
                  {previewUser.journey.map((j: any, i: number) => (
                    <div key={i} className="text-xs flex justify-between bg-aiesec-background px-3 py-1.5 rounded-lg border border-aiesec-border">
                      <span className="font-bold text-aiesec-blue">{j.year}</span>
                      <span className="text-aiesec-text">{j.role}</span>
                      <span className="text-aiesec-text-muted text-[10px]">{j.lc}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pied de Modale */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  router.push(`/home/membres/${previewUser.id}`);
                  setPreviewUser(null);
                }}
                className="flex-1 bg-aiesec-blue text-white py-2.5 rounded-xl text-xs font-bold hover:bg-aiesec-blue-dark transition-colors flex items-center justify-center gap-1"
              >
                <span>Voir le profil complet</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden"><BottomNavigation activeTab="explorer" onTabChange={() => {}} /></div>
    </div>
  );
}