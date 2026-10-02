"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useConnection } from "@/hook/sendConnection";
import { WebHeader } from "@/components/layout/WebHeader";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { WebSidebar } from "@/components/layout/WebSidebar";
import { 
  Search, 
  Building2, 
  UserPlus, 
  Clock,
  Sparkles, 
  X,
  ChevronRight,
  SlidersHorizontal,
  Inbox
} from "lucide-react";
import { UserProfile } from "@/data/mockUsers";

const LOCAL_STORAGE_PENDING_KEY = "aiesec_pending_connection_requests";

export default function MembersPage() {
  const { users } = useData();
  const { sendConnectionRequest } = useConnection();
  const { notifications, handleAction } = useNotifications();
  const { user: currentUser, isAuthenticated, isLoading } = useAuth();   
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
  
  // Suivi des IDs des membres à qui une demande a été envoyée
  const [pendingRequests, setPendingRequests] = useState<Record<string, string[]>>({});
  
  // Modale d'aperçu rapide
  const [previewUser, setPreviewUser] = useState<UserProfile | null>(null);

  // Charger les demandes en attente depuis le localStorage
  useEffect(() => {
    const loadPending = () => {
      const savedPending = localStorage.getItem(LOCAL_STORAGE_PENDING_KEY);
      if (savedPending) {
        try {
          setPendingRequests(JSON.parse(savedPending));
        } catch (e) {
          console.error("Erreur de chargement des demandes :", e);
        }
      }
    };

    loadPending();

    // Recharger le state quand le localStorage change
    window.addEventListener("storage", loadPending);
    return () => window.removeEventListener("storage", loadPending);
  }, []);

  const myPendingList = (currentUser?.id && pendingRequests[currentUser.id]) || [];
  // 1. Extraire les demandes d'invitations reçues par l'utilisateur connecté
  const incomingRequests = useMemo(() => {
    return notifications.filter(
      (n) => n.recipientId === currentUser?.id && n.type === "connection_request"
    );
  }, [notifications, currentUser]);

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

  // 2. Filtrage dynamique des membres suggérés
  const filteredMembers = useMemo(() => {
    const userConnections = currentUser?.connections || [];
    const sendersIds = incomingRequests.map((r) => r.sender?.id);

    return users.filter((member) => {
      if (member.id === currentUser?.id) return false;
      if (userConnections.includes(member.id)) return false;
      if (sendersIds.includes(member.id)) return false;

      const matchesSearch =
        searchQuery === "" ||
        member.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.skills?.some((s: string) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesLc = selectedLc === "ALL" || member.lc === selectedLc;

      const matchesDepartment =
        selectedDepartment === "ALL" ||
        member.role?.toLowerCase().includes(selectedDepartment.toLowerCase());

      const matchesSkill =
        selectedSkill === "ALL" || member.skills?.includes(selectedSkill);

      return matchesSearch && matchesLc && matchesDepartment && matchesSkill;
    });
  }, [users, currentUser, incomingRequests, searchQuery, selectedLc, selectedDepartment, selectedSkill]);

  // Handler pour envoyer la demande
  const handleSendRequest = (e: React.MouseEvent, member: UserProfile) => {
    e.stopPropagation(); // Évite l'ouverture de la modale lors du clic sur le bouton
    if (!currentUser?.id) return;

    sendConnectionRequest(member);
    const updated: Record<string, string[]> = {
      ...pendingRequests,
      [currentUser.id]: [...(pendingRequests[currentUser.id] || []), member.id],
    };
    setPendingRequests(updated);
    localStorage.setItem(LOCAL_STORAGE_PENDING_KEY, JSON.stringify(updated));
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLc("ALL");
    setSelectedDepartment("ALL");
    setSelectedSkill("ALL");
  };

  // Helper pour extraire proprement les initiales
  const getInitials = (fullName?: string) => {
    if (!fullName) return "U";
    return fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
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
      <div className="md:hidden"><MobileHeader title="Membres" showBack /></div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-0 md:px-6 py-0 md:py-6 flex gap-6">
        <WebSidebar activeTab="explorer" onTabChange={() => {}} />

        <section className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 md:px-0 pb-20 md:pb-6 space-y-6">
          
          {/* SECTION 1 : DEMANDES D'INVITATIONS REÇUES */}
          {incomingRequests.length > 0 && (
            <div className="bg-aiesec-surface border border-aiesec-blue/30 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-aiesec-border pb-3">
                <div className="flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-aiesec-blue" />
                  <h2 className="font-bold text-sm md:text-base text-aiesec-navy">
                    Demandes d&apos;invitation en attente
                  </h2>
                </div>
                <span className="bg-aiesec-blue text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                  {incomingRequests.length}
                </span>
              </div>

              <div className="space-y-3">
                {incomingRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 rounded-xl border border-aiesec-border bg-aiesec-background flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-aiesec-blue/10 border border-aiesec-blue/20 flex items-center justify-center font-bold text-sm text-aiesec-blue shrink-0">
                        {request.sender?.avatar || getInitials(request.sender?.fullName)}
                      </div>
                      <div>
                        <h4 className="font-bold text-xs md:text-sm text-aiesec-navy">
                          {request.sender?.fullName}
                        </h4>
                        <p className="text-[11px] text-aiesec-blue font-medium">
                          {request.sender?.role || "Membre"} • {request.sender?.lc || "AIESEC"}
                        </p>
                        <p className="text-[10px] text-aiesec-text-muted mt-0.5">
                          {request.message}
                        </p>
                      </div>
                    </div>

                    {request.actions && request.actions.length > 0 && (
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        {request.actions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleAction(request.id, action)}
                            className={`px-3 py-1.5 text-xs rounded-xl font-semibold transition-all cursor-pointer ${
                              action.variant === "primary"
                                ? "bg-aiesec-blue text-white hover:bg-aiesec-blue-dark shadow-sm"
                                : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-secondary hover:bg-aiesec-surface-soft"
                            }`}
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2 : MEMBRES SUGGÉRÉS ET RECHERCHE */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-xl font-bold text-aiesec-text">Découvres les AIESECers autour de toi !</h1>
                <p className="text-xs text-aiesec-text-muted">
                  Explorez et connectez-vous avec les membres et alumni de votre comité et d&apos;ailleurs.
                </p>
              </div>
              <span className="self-start sm:self-auto bg-aiesec-blue/10 text-aiesec-blue text-xs font-semibold px-3 py-1 rounded-full">
                {filteredMembers.length} Membre{filteredMembers.length > 1 ? "s" : ""} suggéré{filteredMembers.length > 1 ? "s" : ""}
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

            {(searchQuery || selectedLc !== "ALL" || selectedDepartment !== "ALL" || selectedSkill !== "ALL") && (
              <div className="flex justify-end pt-1">
                <button
                  onClick={resetFilters}
                  className="text-xs text-aiesec-blue hover:underline font-medium flex items-center gap-1 cursor-pointer"
                >
                  <SlidersHorizontal className="w-3 h-3" />
                  <span>Réinitialiser les filtres</span>
                </button>
              </div>
            )}
          </div>

          {/* Grille des membres */}
          {filteredMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
              {filteredMembers.map((member) => {
                const isPending = myPendingList.includes(member.id);

                return (
                  <div
                    key={member.id}
                    className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-5 shadow-sm hover:border-aiesec-blue/40 transition-all flex flex-col justify-between group cursor-pointer"
                    onClick={() => setPreviewUser(member)}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-aiesec-blue/10 border border-aiesec-blue/20 flex items-center justify-center font-bold text-base text-aiesec-blue group-hover:bg-aiesec-blue group-hover:text-white transition-all shrink-0">
                            {getInitials(member.fullName)}
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
                    </div>

                    <div className="pt-4 mt-4 border-t border-aiesec-border flex items-center justify-between gap-2">
                      <span className="text-[10px] text-aiesec-text-muted flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        {member.journey ? `${member.journey.length} étapes Journey` : "Nouveau membre"}
                      </span>

                      <button
                        disabled={isPending}
                        onClick={(e) => handleSendRequest(e, member)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isPending
                            ? "bg-amber-500/10 text-amber-600 border border-amber-500/20 cursor-not-allowed opacity-90"
                            : "bg-aiesec-blue text-white hover:bg-aiesec-blue-dark cursor-pointer"
                        }`}
                      >
                        {isPending ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                            <span>Invitation envoyée</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Se Connecter</span>
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
                className="bg-aiesec-blue text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-aiesec-blue-dark transition-colors cursor-pointer"
              >
                Réinitialiser la recherche
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Modale Aperçu Rapide */}
      {previewUser && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewUser(null)}
        >
          <div 
            className="bg-aiesec-surface border border-aiesec-border w-full max-w-md rounded-2xl p-6 space-y-5 shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewUser(null)}
              className="absolute top-4 right-4 text-aiesec-text-muted hover:text-aiesec-text cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-aiesec-blue text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                {getInitials(previewUser.fullName)}
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

            {previewUser.bio && (
              <p className="text-xs text-aiesec-text leading-relaxed bg-aiesec-background p-3 rounded-xl border border-aiesec-border">
                {previewUser.bio}
              </p>
            )}

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

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  router.push(`/home/membres/${previewUser.id}`);
                  setPreviewUser(null);
                }}
                className="flex-1 bg-aiesec-blue text-white py-2.5 rounded-xl text-xs font-bold hover:bg-aiesec-blue-dark transition-colors flex items-center justify-center gap-1 cursor-pointer"
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