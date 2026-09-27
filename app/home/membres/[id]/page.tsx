"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { WebHeader } from "@/components/layout/WebHeader";
import { WebSidebar } from "@/components/layout/WebSidebar";
import { ArrowLeft, UserPlus, Check, Award, Briefcase, Star } from "lucide-react";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useData } from "@/context/DataContext";

export default function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  
  const { id } = use(params);
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const { getUserById } = useData();
  const member = getUserById(id) ?? null;

  console.log(member)

  return (
    <div className="min-h-screen bg-aiesec-background flex flex-col">
      <WebHeader />
      <div className="md:hidden"><MobileHeader /></div>
      

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-6 flex gap-6">
        <WebSidebar onTabChange={() => {}} />

        <section className="flex-1 max-w-3xl mx-auto space-y-6">
          <button 
            onClick={() => router.back()}
            className="cursor-pointer flex items-center gap-2 text-xs font-semibold text-aiesec-text-muted hover:text-aiesec-blue transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>

          {/* Carte En-tête Profil */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-20 h-20 rounded-full bg-aiesec-blue/10 flex items-center justify-center font-bold text-2xl text-aiesec-blue border-2 border-aiesec-blue">
                {member?.fullName.charAt(0)}
              </div>
              <div className="flex-1 space-y-1">
                <h1 className="text-xl font-bold text-aiesec-text">{member?.fullName}</h1>
                <p className="text-xs text-aiesec-text-muted font-medium">
                  {member?.role} • {member?.lc} ({member?.country})
                </p>
                <p className="text-xs text-aiesec-text pt-2">{member?.bio}</p>
              </div>
              <button
                onClick={() => setIsConnected(!isConnected)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  isConnected 
                    ? "bg-green-500/10 text-green-600 border border-green-500/20" 
                    : "bg-aiesec-blue text-white hover:bg-aiesec-blue-dark"
                }`}
              >
                {isConnected ? (
                  <>
                    <Check className="w-4 h-4" /> Connecté
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" /> Se connecter
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Section Skills */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-aiesec-text flex items-center gap-2">
              <Star className="w-4 h-4 text-aiesec-blue" /> Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {member?.skills.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-aiesec-background border border-aiesec-border rounded-lg text-xs text-aiesec-text">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Section Experiences */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-aiesec-text flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-aiesec-blue" /> Experiences
            </h2>
            <div className="space-y-3">
              {member?.experiences.map((exp, index) => (
                <div key={index} className="border-l-2 border-aiesec-blue pl-3 py-1 space-y-1">
                  <h3 className="text-xs font-bold text-aiesec-text">{exp.role} - {exp.department}</h3>
                  <p className="text-[11px] text-aiesec-text-muted">{exp.period}</p>
                  <p className="text-xs text-aiesec-text">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section Recognitions */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-5 shadow-sm space-y-3">
            <h2 className="text-sm font-bold text-aiesec-text flex items-center gap-2">
              <Award className="w-4 h-4 text-aiesec-blue" /> Recognitions
            </h2>
            <div className="space-y-2">
              {member?.recognitions.map((rec, index) => (
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