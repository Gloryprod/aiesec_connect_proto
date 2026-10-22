"use client";

import React, { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import { WebHeader } from "@/components/layout/WebHeader";
import { WebSidebar } from "@/components/layout/WebSidebar";
import { UserPlus, MessageSquare, Award, Briefcase, Star, Sparkles, Share2 } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { useConnection } from "@/hook/sendConnection";

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAuth();
  const { getUserById, users } = useData();
  const member = getUserById(id);
  const { sendConnectionRequest } = useConnection();

  // Filtrer les connexions réelles
  const userConnections = users.filter((u) =>
    (user?.connections || []).includes(u.id)
  );

  const isConnected = userConnections.some((connection) => connection.id === id);

  // Redirection si non authentifié
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aiesec-background">
        <div className="w-8 h-8 border-4 border-aiesec-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si c'est le profil de l'utilisateur connecté, rediriger vers sa propre page de profil
  if (user?.id === member?.id) {
    router.push("/home/profile");
    return null;
  }

  // Tri chronologique des étapes du Journey du membre
  const sortedJourney = member?.journey 
    ? [...member.journey].sort((a, b) => parseInt(a.year || "0") - parseInt(b.year || "0"))
    : [];

  // Partager le Journey de ce membre
  const handleShareJourney = () => {
    if (!member || sortedJourney.length === 0) return;
    const journeyText = `🚀 AIESEC Journey de ${member.fullName} :\n` + 
      sortedJourney.map((j) => `• ${j.year} : ${j.role} (${j.lc})`).join("\n") +
      `\n\nDécouvrez son profil sur AIESEC Connect !`;

    navigator.clipboard.writeText(journeyText);
    toast.success("Parcours copié dans le presse-papier !");
  };

  return (
    <div className="min-h-screen bg-aiesec-background flex flex-col">
      <WebHeader />
      <div className="md:hidden"><MobileHeader /></div>
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 flex gap-6">
        <WebSidebar onTabChange={() => {}} />

        <section className="flex-1 max-w-4xl mx-auto w-full px-4 py-4 md:px-0 pb-20 md:pb-6 space-y-6">
          
          {/* Carte En-tête Profil */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-20 h-20 rounded-full bg-aiesec-blue/10 flex items-center justify-center font-bold text-2xl text-aiesec-blue border-2 border-aiesec-blue shrink-0">
                {member?.fullName ? member.fullName.charAt(0) : "U"}
              </div>
              <div className="flex-1 space-y-1">
                <h1 className="text-xl font-bold text-aiesec-text">{member?.fullName}</h1>
                <p className="text-xs text-aiesec-text-muted font-medium">
                  {member?.role} • {member?.lc} ({member?.country})
                </p>
                <p className="text-xs text-aiesec-text pt-2">{member?.bio}</p>
              </div>

              {/* Bouton d'action dynamique */}
              {isConnected ? (
                <button
                  onClick={() => router.push(`/home/chat`)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-aiesec-blue text-white hover:bg-aiesec-blue-dark transition-colors cursor-pointer shadow-xs shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Envoyer un message</span>
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (member) sendConnectionRequest(member);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-aiesec-blue text-white hover:bg-aiesec-blue-dark transition-colors cursor-pointer shadow-xs shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Se connecter</span>
                </button>
              )}
            </div>
          </div>

          {/* Section AIESEC Journey (Timeline publique si autorisée) */}
          {member?.isJourneyPublic && sortedJourney.length > 0 && (
            <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-aiesec-border pb-3">
                <h2 className="text-sm font-bold text-aiesec-text flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-aiesec-blue" /> AIESEC Journey
                </h2>
                <button
                  onClick={handleShareJourney}
                  className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-aiesec-blue/10 hover:bg-aiesec-blue/20 text-aiesec-blue rounded-xl text-xs font-semibold transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Partager</span>
                </button>
              </div>

              <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-aiesec-blue/30">
                {sortedJourney.map((step, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-aiesec-blue border-4 border-aiesec-surface flex items-center justify-center" />
                    <div className="bg-aiesec-background p-3 rounded-xl border border-aiesec-border flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-aiesec-blue">{step.year}</span>
                        <span className="text-[10px] bg-aiesec-surface border border-aiesec-border px-2 py-0.5 rounded-full text-aiesec-text-muted">
                          {step.lc}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-aiesec-text">{step.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section Skills */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-aiesec-text flex items-center gap-2">
              <Star className="w-4 h-4 text-aiesec-blue" /> Compétences
            </h2>
            <div className="flex flex-wrap gap-2">
              {member?.skills?.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-aiesec-background border border-aiesec-border rounded-lg text-xs text-aiesec-text">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Section Experiences */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-aiesec-text flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-aiesec-blue" /> Expériences
            </h2>
            <div className="space-y-3">
              {member?.experiences?.map((exp, index) => (
                <div key={index} className="border-l-2 border-aiesec-blue pl-3 py-1 space-y-1">
                  <h3 className="text-xs font-bold text-aiesec-text">{exp.role} — <span className="text-aiesec-blue">{exp.department}</span></h3>
                  <p className="text-[11px] text-aiesec-text-muted">{exp.period}</p>
                  <p className="text-xs text-aiesec-text">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Recognitions */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-aiesec-text flex items-center gap-2">
              <Award className="w-4 h-4 text-aiesec-blue" /> Distinctions
            </h2>
            <div className="space-y-2">
              {member?.recognitions?.map((rec, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-aiesec-background rounded-xl text-xs font-semibold text-aiesec-text">
                  🏆 <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="md:hidden"><BottomNavigation activeTab="accueil" onTabChange={() => {}} /></div>
    </div>
  );
}