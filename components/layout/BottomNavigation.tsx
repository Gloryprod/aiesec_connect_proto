import React, { useState } from "react";
import Link from "next/link";
import { Network } from "lucide-react";
import { CreatePostModal } from "@/components/posts/CreatePostModal";

export type NavTab = "accueil" | "explorer" | "messages" | "profil" | "logout" | "network" ;

interface BottomNavigationProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onCreatePost?: () => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
  onCreatePost,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-aiesec-surface border-t border-aiesec-border px-3 py-2 flex items-center justify-around max-w-md mx-auto">
      {/* Accueil */}
      <Link href={"/home"}>
        <button
          onClick={() => onTabChange("accueil")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            activeTab === "accueil" ? "text-aiesec-blue font-semibold" : "text-aiesec-text-muted hover:text-aiesec-text-secondary"
          }`}
        >
          <svg className="w-5 h-5" fill={activeTab === "accueil" ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] font-sans">Accueil</span>
        </button>
      </Link>
      

      {/* Explorer */}
      <Link href={"/home/membres"}>
        <button
          onClick={() => onTabChange("explorer")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            activeTab === "explorer" ? "text-aiesec-blue font-semibold" : "text-aiesec-text-muted hover:text-aiesec-text-secondary"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span className="text-[10px] font-sans">Explorer</span>
        </button>
      </Link>

      <Link href={"/home/network"}>
        <button
          onClick={() => onTabChange("network")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            activeTab === "network" ? "text-aiesec-blue font-semibold" : "text-aiesec-text-muted hover:text-aiesec-text-secondary"
          }`}
        >
          <Network className="w-5 h-5" />
          <span className="text-[10px] font-sans">Réseau</span>
        </button>
      </Link>


      {/* Bouton Action Créer (+ Center) */}
      <button
        onClick={() => {
          onCreatePost?.();
          setIsCreateModalOpen(true);
        }}
        className="w-10 h-10 rounded-xl bg-aiesec-blue text-white flex items-center justify-center -mt-3 shadow-md hover:bg-aiesec-navy transition-all transform hover:scale-105 cursor-pointer"
        aria-label="Créer une publication"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Messages */}
      <Link href={"/home/chat"}>
        <button
          onClick={() => onTabChange("messages")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            activeTab === "messages" ? "text-aiesec-blue font-semibold" : "text-aiesec-text-muted hover:text-aiesec-text-secondary"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span className="text-[10px] font-sans">Messages</span>
        </button>
      </Link>

      {/* Profil */}
      <Link href={"/home/profile"}>
        <button
          onClick={() => onTabChange("profil")}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${
            activeTab === "profil" ? "text-aiesec-blue font-semibold" : "text-aiesec-text-muted hover:text-aiesec-text-secondary"
          }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-[10px] font-sans">Profil</span>
        </button>
      </Link>

      {/* Modale partagée */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

    </nav>
  );
};