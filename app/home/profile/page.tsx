"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { WebHeader } from "@/components/layout/WebHeader";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { WebSidebar } from "@/components/layout/WebSidebar";
import { WebRightPanel } from "@/components/layout/WebRightPanel";
import toast from "react-hot-toast";
import { 
  MapPin, 
  Building2, 
  Briefcase, 
  Award, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Share2, 
  Check, 
  Sparkles, 
  Calendar,
  Trash2
} from "lucide-react";
import { UserProfile } from "@/data/mockUsers";

interface Experience {
  role: string;
  department: string;
  period: string;
  description: string;
}

interface JourneyStep {
  year: string;
  role: string;
  lc: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading, updateUserConnections } = useAuth();
  const { users } = useData();
  const router = useRouter();

  // Redirection si non authentifié
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  const [isEditing, setIsEditing] = useState(false);
  const [copiedJourney, setCopiedJourney] = useState(false);

  // Fonction utilitaire pour trier le journey par année croissante
  const sortJourneyByYear = (steps: JourneyStep[]) => {
    return [...steps].sort((a, b) => parseInt(a.year || "0") - parseInt(b.year || "0"));
  };

  // Initialisation du state local du profil à partir du compte connecté
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "AIESECer",
    role: user?.role || "Team Member",
    lc: user?.lc || "LC Abomey-Calavi",
    country: user?.country || "Bénin",
    bio: user?.bio || "Membre passionné par le développement du potentiel humain et l'impact social.",
    skills: user?.skills || ["Leadership", "Project Management"],
    experiences: (user?.experiences || [
      {
        role: "Team Leader",
        department: "Talent Management (TM)",
        period: "2025 - Présent",
        description: "Gestion du recrutement, de l'engagement et de la rétention des membres."
      }
    ]) as Experience[],
    journey: sortJourneyByYear(user?.journey || [
      { year: "2025", role: user?.role || "Team Member", lc: user?.lc || "LC Abomey-Calavi" }
    ]) as JourneyStep[],
    recognitions: user?.recognitions || ["Membre actif 2026"],
    isJourneyPublic: user?.isJourneyPublic || false
  });

  // Synchronisation lorsque 'user' est chargé
  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || "",
        role: user.role || "",
        lc: user.lc || "",
        country: user.country || "Bénin",
        bio: user.bio || "",
        skills: user.skills || [],
        experiences: (user.experiences || []) as Experience[],
        journey: sortJourneyByYear(user.journey || []),
        recognitions: user.recognitions || [],
        isJourneyPublic: user.isJourneyPublic || false
      });
    }
  }, [user]);

  // États pour les formulaires d'ajout en mode Édition
  const [newSkillInput, setNewSkillInput] = useState("");
  const [newJourneyInput, setNewJourneyInput] = useState<JourneyStep>({ year: "2026", role: "", lc: user?.lc || "LC Abomey-Calavi" });
  const [newExpInput, setNewExpInput] = useState<Experience>({ role: "", department: "", period: "", description: "" });

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aiesec-background">
        <div className="w-8 h-8 border-4 border-aiesec-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --- Sauvegarder les modifications du profil ---
  const handleSaveProfile = () => {
    const updatedUser: UserProfile = {
      ...user,
      fullName: profileData.fullName,
      role: profileData.role,
      lc: profileData.lc,
      country: profileData.country,
      bio: profileData.bio,
      skills: profileData.skills,
      experiences: profileData.experiences,
      journey: profileData.journey,
      recognitions: profileData.recognitions,
      isJourneyPublic: profileData.isJourneyPublic,
    };

    const updatedUsersList = users.map((u) => (u.id === user.id ? updatedUser : u));
    updateUserConnections(updatedUsersList);

    setIsEditing(false);
    toast.success("Profil mis à jour avec succès ! 🎉");
  };

  // --- Gestion des Compétences ---
  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    setProfileData((prev) => ({
      ...prev,
      skills: [...prev.skills, newSkillInput.trim()]
    }));
    setNewSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfileData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove)
    }));
  };

  // --- Gestion du AIESEC Journey (Avec Tri Chronologique Automatique) ---
  const handleAddJourneyStep = () => {
    if (!newJourneyInput.role.trim() || !newJourneyInput.year.trim()) {
      toast.error("Veuillez renseigner l'année et le rôle.");
      return;
    }
    
    setProfileData((prev) => {
      const updatedJourney = sortJourneyByYear([...prev.journey, newJourneyInput]);
      return {
        ...prev,
        journey: updatedJourney
      };
    });

    setNewJourneyInput({ year: "2026", role: "", lc: profileData.lc });
    toast.success("Étape ajoutée et positionnée chronologiquement !");
  };

  const handleRemoveJourneyStep = (indexToRemove: number) => {
    setProfileData((prev) => ({
      ...prev,
      journey: prev.journey.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // --- Partager / Copier le AIESEC Journey ---
  const handleShareJourney = () => {
    const journeyText = `🚀 Mon AIESEC Journey (${profileData.fullName}) :\n` + 
      profileData.journey.map((j) => `• ${j.year} : ${j.role} (${j.lc})`).join("\n") +
      `\n\nRetrouvez mon profil sur AIESEC Connect !`;

    navigator.clipboard.writeText(journeyText);
    setCopiedJourney(true);
    toast.success("Parcours AIESEC copié dans le presse-papier !");
    setTimeout(() => setCopiedJourney(false), 3000);
  };

  // --- Gestion des Expériences ---
  const handleAddExperience = () => {
    if (!newExpInput.role.trim() || !newExpInput.department.trim()) {
      toast.error("Veuillez remplir au moins le rôle et le département.");
      return;
    }
    setProfileData((prev) => ({
      ...prev,
      experiences: [...prev.experiences, newExpInput]
    }));
    setNewExpInput({ role: "", department: "", period: "", description: "" });
  };

  const handleRemoveExperience = (indexToRemove: number) => {
    setProfileData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  return (
    <div className="min-h-screen bg-aiesec-background flex flex-col">
      <WebHeader />
      <div className="md:hidden"><MobileHeader title="Mon Profil" showBack onBack={() => router.push("/home")} /></div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-0 md:px-6 py-0 md:py-6 flex gap-6">
        <WebSidebar activeTab="profil" onTabChange={() => {}} />

        <section className="flex-1 max-w-2xl mx-auto w-full pb-20 md:pb-6 space-y-6">
          
          {/* Carte En-tête Profil */}
          <div className="bg-aiesec-surface border border-aiesec-border overflow-hidden shadow-sm">
            <div className="h-32 bg-linear-to-r from-aiesec-blue to-blue-600 relative">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="cursor-pointer absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                <span>{isEditing ? "Annuler" : "Éditer le profil"}</span>
              </button>
            </div>

            <div className="px-6 pb-6 relative pt-0">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-4 gap-4">
                <div className="w-24 h-24 rounded-2xl bg-aiesec-blue border-4 border-aiesec-surface flex items-center justify-center text-white text-3xl font-extrabold shadow-md">
                  {profileData.fullName ? profileData.fullName.split(" ").map((n) => n[0]).join("") : "U"}
                </div>

                {isEditing && (
                  <button
                    onClick={handleSaveProfile}
                    className="cursor-pointer bg-aiesec-blue text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-aiesec-blue-dark transition-colors flex items-center gap-2 self-start sm:self-auto shadow-md"
                  >
                    <Save className="w-4 h-4" />
                    <span>Sauvegarder</span>
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-aiesec-text-muted font-medium">Nom complet</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                      className="w-full bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-2 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs text-aiesec-text-muted font-medium">Rôle actuel</label>
                      <input
                        type="text"
                        value={profileData.role}
                        onChange={(e) => setProfileData({ ...profileData, role: e.target.value })}
                        className="w-full bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-2 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-aiesec-text-muted font-medium">Comité Local (LC)</label>
                      <input
                        type="text"
                        value={profileData.lc}
                        onChange={(e) => setProfileData({ ...profileData, lc: e.target.value })}
                        className="w-full bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-2 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-aiesec-text-muted font-medium">Pays</label>
                      <input
                        type="text"
                        value={profileData.country}
                        onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                        className="w-full bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-2 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-aiesec-text-muted font-medium">Bio</label>
                    <textarea
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-2 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <h1 className="text-xl font-bold text-aiesec-text">{profileData.fullName}</h1>
                    <p className="text-xs font-semibold text-aiesec-blue">{profileData.role}</p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-aiesec-text-muted">
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-aiesec-blue" />
                      {profileData.lc}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-aiesec-blue" />
                      {profileData.country}
                    </span>
                  </div>

                  <p className="text-xs text-aiesec-text leading-relaxed pt-2 border-t border-aiesec-border">
                    {profileData.bio}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section AIESEC Journey (Timeline triée chronologiquement) */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-aiesec-border pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-aiesec-blue" />
                <h2 className="font-bold text-aiesec-text text-base">AIESEC Journey</h2>
              </div>

              <div className="flex items-center gap-3">
                {/* Interrupteur/Toggle Visibilité Publique */}
                <button
                  onClick={() => setProfileData(prev => ({ ...prev, isJourneyPublic: !prev.isJourneyPublic }))}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    profileData.isJourneyPublic
                      ? "bg-green-500/10 text-green-600 border border-green-500/20"
                      : "bg-aiesec-background text-aiesec-text-muted border border-aiesec-border"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${profileData.isJourneyPublic ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
                  <span>{profileData.isJourneyPublic ? "Public sur mon profil" : "Masqué du profil public"}</span>
                </button>

                <button
                  onClick={handleShareJourney}
                  className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-aiesec-blue/10 hover:bg-aiesec-blue/20 text-aiesec-blue rounded-xl text-xs font-semibold transition-colors"
                >
                  {copiedJourney ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{copiedJourney ? "Copié !" : "Copier le texte"}</span>
                </button>
              </div>
            </div>

            {/* Formulaire d'ajout d'une étape Journey en mode Édition */}
            {isEditing && (
              <div className="bg-aiesec-background p-3 rounded-xl border border-aiesec-border space-y-2">
                <span className="text-[11px] font-bold text-aiesec-blue">Ajouter une étape au Journey</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Année (ex: 2026)"
                    value={newJourneyInput.year}
                    onChange={(e) => setNewJourneyInput({ ...newJourneyInput, year: e.target.value })}
                    className="bg-aiesec-surface border border-aiesec-border rounded-lg px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Rôle (ex: Team Leader)"
                    value={newJourneyInput.role}
                    onChange={(e) => setNewJourneyInput({ ...newJourneyInput, role: e.target.value })}
                    className="bg-aiesec-surface border border-aiesec-border rounded-lg px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="LC (ex: LC Abomey-Calavi)"
                    value={newJourneyInput.lc}
                    onChange={(e) => setNewJourneyInput({ ...newJourneyInput, lc: e.target.value })}
                    className="bg-aiesec-surface border border-aiesec-border rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
                <button
                  onClick={handleAddJourneyStep}
                  className="bg-aiesec-blue text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-aiesec-blue-dark transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter l&apos;étape</span>
                </button>
              </div>
            )}

            {/* Graphique Timeline */}
            <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-aiesec-blue/30">
              {profileData.journey.map((step, index) => (
                <div key={index} className="relative flex items-start gap-4">
                  <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-aiesec-blue border-4 border-aiesec-surface flex items-center justify-center" />
                  <div className="bg-aiesec-background p-3.5 rounded-xl border border-aiesec-border flex-1 flex justify-between items-center">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-aiesec-blue">{step.year}</span>
                        <span className="text-[10px] bg-aiesec-surface border border-aiesec-border px-2 py-0.5 rounded-full text-aiesec-text-muted">
                          {step.lc}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-aiesec-text">{step.role}</p>
                    </div>

                    {isEditing && (
                      <button
                        onClick={() => handleRemoveJourneyStep(index)}
                        className="text-aiesec-text-muted hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Expériences */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-aiesec-border pb-3">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-aiesec-blue" />
                <h2 className="font-bold text-aiesec-text text-base">Expériences</h2>
              </div>
            </div>

            {isEditing && (
              <div className="bg-aiesec-background p-3 rounded-xl border border-aiesec-border space-y-2">
                <span className="text-[11px] font-bold text-aiesec-blue">Ajouter une expérience</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Rôle (ex: Vice President)"
                    value={newExpInput.role}
                    onChange={(e) => setNewExpInput({ ...newExpInput, role: e.target.value })}
                    className="bg-aiesec-surface border border-aiesec-border rounded-lg px-2.5 py-1.5 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Département (ex: TM, oGV)"
                    value={newExpInput.department}
                    onChange={(e) => setNewExpInput({ ...newExpInput, department: e.target.value })}
                    className="bg-aiesec-surface border border-aiesec-border rounded-lg px-2.5 py-1.5 text-xs"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Période (ex: 2024 - 2025)"
                  value={newExpInput.period}
                  onChange={(e) => setNewExpInput({ ...newExpInput, period: e.target.value })}
                  className="w-full bg-aiesec-surface border border-aiesec-border rounded-lg px-2.5 py-1.5 text-xs"
                />
                <textarea
                  placeholder="Description des responsabilités..."
                  value={newExpInput.description}
                  onChange={(e) => setNewExpInput({ ...newExpInput, description: e.target.value })}
                  className="w-full bg-aiesec-surface border border-aiesec-border rounded-lg px-2.5 py-1.5 text-xs"
                />
                <button
                  onClick={handleAddExperience}
                  className="bg-aiesec-blue text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-aiesec-blue-dark transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter l&apos;expérience</span>
                </button>
              </div>
            )}

            <div className="space-y-4">
              {profileData.experiences.map((exp, index) => (
                <div key={index} className="border-b border-aiesec-border last:border-none pb-4 last:pb-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-bold text-aiesec-text">{exp.role}</h3>
                      <p className="text-xs text-aiesec-blue font-medium">{exp.department}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-aiesec-text-muted bg-aiesec-background px-2.5 py-1 rounded-lg border border-aiesec-border flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {exp.period}
                      </span>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveExperience(index)}
                          className="text-aiesec-text-muted hover:text-red-500 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-aiesec-text-muted leading-relaxed pt-1">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Compétences */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-6 shadow-sm space-y-4">
            <h2 className="font-bold text-aiesec-text text-base border-b border-aiesec-border pb-3">
              Compétences
            </h2>

            <div className="flex flex-wrap gap-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-aiesec-background border border-aiesec-border text-aiesec-text px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5"
                >
                  {skill}
                  {isEditing && (
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="cursor-pointer text-aiesec-text-muted hover:text-red-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Ajouter une compétence..."
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  className="flex-1 bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-1.5 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                />
                <button
                  onClick={handleAddSkill}
                  className="cursor-pointer bg-aiesec-blue text-white p-2 rounded-xl hover:bg-aiesec-blue-dark transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Section Distinctions & Recognitions */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-aiesec-border pb-3">
              <Award className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-aiesec-text text-base">Distinctions & Reconnaissances</h2>
            </div>

            <div className="space-y-2">
              {profileData.recognitions.map((rec, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/20 p-3 rounded-xl text-xs font-semibold text-aiesec-text"
                >
                  <Award className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </section>

        <WebRightPanel />
      </main>

      <div className="md:hidden"><BottomNavigation activeTab="profil" onTabChange={() => {}} /></div>
    </div>
  );
}