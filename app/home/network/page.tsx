"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { WebHeader } from "@/components/layout/WebHeader";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { WebSidebar } from "@/components/layout/WebSidebar";
import { MessageSquare, Users, Building2 } from "lucide-react";

export default function NetworkPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { users } = useData();
  const router = useRouter();

  // Redirection si non authentifié
      useEffect(() => {
        if (!isLoading && (!isAuthenticated || !user)) {
        router.push("/login");
        }
    }, [isLoading, isAuthenticated, user, router]);

  const currentUserData = users.find((u) => u.id === user?.id) || user;
  const userConnectionsIds = currentUserData?.connections || [];

  // Récupérer la liste des profils des membres connectés
  const connectedMembers = users.filter((u) => userConnectionsIds.includes(u.id));

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
      <div className="md:hidden"><MobileHeader title="Mon Réseau" showBack /></div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-4 md:py-6 flex gap-6">
        <div className="hidden md:block shrink-0">
          <WebSidebar activeTab="explorer" onTabChange={() => {}} />
        </div>

        <section className="flex-1 max-w-3xl mx-auto w-full pb-20 md:pb-6 space-y-6">
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-6 shadow-sm flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-aiesec-navy">Mon Réseau & Amis</h1>
              <p className="text-xs text-aiesec-text-secondary mt-0.5">
                Retrouvez tous les membres AIESEC avec qui vous êtes connecté.
              </p>
            </div>
            <span className="bg-aiesec-blue/10 text-aiesec-blue text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
              <Users className="w-4 h-4" />
              {connectedMembers.length} Connexion{connectedMembers.length > 1 ? "s" : ""}
            </span>
          </div>

          {connectedMembers.length === 0 ? (
            <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-aiesec-text-muted mx-auto" />
              <p className="font-bold text-sm text-aiesec-navy">Vous n'avez pas encore de connexion.</p>
              <p className="text-xs text-aiesec-text-muted max-w-sm mx-auto">
                Explorez la communauté AIESEC et envoyez des invitations pour agrandir votre réseau !
              </p>
              <button
                onClick={() => router.push("/members")}
                className="bg-aiesec-blue text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-aiesec-blue/90 transition-colors"
              >
                Découvrir des membres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {connectedMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-4 shadow-sm flex items-center justify-between gap-3 hover:border-aiesec-blue/30 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full bg-aiesec-blue/10 border border-aiesec-blue/20 flex items-center justify-center font-bold text-sm text-aiesec-blue shrink-0">
                      {member.avatar || member.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-xs text-aiesec-navy truncate">{member.fullName}</h3>
                      <p className="text-[11px] text-aiesec-blue font-medium truncate">{member.role || "Membre"}</p>
                      <p className="text-[10px] text-aiesec-text-muted flex items-center gap-1 truncate mt-0.5">
                        <Building2 className="w-3 h-3 text-aiesec-blue" />
                        {member.lc || "AIESEC"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => router.push(`/message?userId=${member.id}`)}
                    className="p-2.5 bg-aiesec-blue text-white hover:bg-aiesec-blue/90 rounded-xl transition-colors shrink-0 cursor-pointer"
                    title="Envoyer un message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNavigation activeTab="network" onTabChange={() => {}} />
      </div>
    </div>
  );
}