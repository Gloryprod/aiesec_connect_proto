"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight, UserPlus } from "lucide-react";

export const WebRightPanel: React.FC = () => {
  const { users } = useData();
  const { user: currentUser } = useAuth();
  const router = useRouter();

  // Filtrer pour ne pas afficher l'utilisateur actuellement connecté
  const filteredUsers = users.filter((u) => u.id !== currentUser?.id);

  // Prendre une sélection dynamique de membres à recommander (ex: les 3 à 4 premiers)
  const suggestedMembers = filteredUsers.slice(0, 4);

  return (
    <aside className="w-72 shrink-0 hidden lg:block space-y-6 sticky top-20 self-start">
      {/* Membres recommandés */}
      <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-bold text-sm text-aiesec-navy">
            Membres recommandés
          </h3>
          <Link
            href="/home/membres"
            className="text-[11px] font-semibold text-aiesec-blue hover:underline flex items-center gap-1"
          >
            <span>Voir tout</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="space-y-3">
          {suggestedMembers.length > 0 ? (
            suggestedMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-2 p-1.5 rounded-xl hover:bg-aiesec-background transition-colors group cursor-pointer"
                onClick={() => router.push(`/home/membres/${member.id}`)}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-aiesec-blue/10 border border-aiesec-blue/20 flex items-center justify-center font-heading font-bold text-xs text-aiesec-blue group-hover:ring-2 ring-aiesec-blue transition-all">
                    {member.fullName
                      ? member.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                      : "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-heading font-semibold text-xs text-aiesec-navy truncate leading-none group-hover:text-aiesec-blue transition-colors">
                      {member.fullName}
                    </p>
                    <p className="font-sans text-[10px] text-aiesec-text-secondary truncate mt-0.5">
                      {member.role || "Membre"} • {member.lc || "AIESEC"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  className="!px-2.5 !py-1 text-[11px] shrink-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Logique de demande de connexion
                  }}
                >
                  Connecter
                </Button>
              </div>
            ))
          ) : (
            <p className="text-xs text-aiesec-text-muted text-center py-2">
              Aucun membre à recommander pour le moment.
            </p>
          )}
        </div>

        {/* Bouton global vers la page de découverte avec filtres */}
        <Button
          variant="outline"
          size="sm"
          className="w-full text-xs font-semibold flex items-center justify-center gap-2 mt-2"
          onClick={() => router.push("/home/membres")}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Découvrir le réseau</span>
        </Button>
      </div>
    </aside>
  );
};