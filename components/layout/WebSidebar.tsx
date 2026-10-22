import React from "react";
import { NavTab } from "./BottomNavigation";
import {useAuth} from "@/context/AuthContext";
import Link from "next/link";
import { LogOut, Network, BookOpen } from "lucide-react";

interface WebSidebarProps {
  activeTab?: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export const WebSidebar: React.FC<WebSidebarProps> = ({ activeTab, onTabChange }) => {
    const { user, logout } = useAuth();
  const menuItems = [
    {
      id: "accueil" as NavTab,
      label: "Accueil",
      href: "/home",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      id: "explorer" as NavTab,
      label: "Explorer",
      href: "/home/membres",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: "network" as NavTab,
      label: "Réseau",
      href: "/home/network",
      icon: (
        <Network></Network>
      ),
    },
    {
      id: "messages" as NavTab,
      label: "Chat",
      href: "/home/chat",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
    },
    {
      id: "learning" as NavTab,
      label: "Espace E-Learning",
      href: "/home/elearning",
      icon: (
        <BookOpen className="w-5 h-5" />
      ),
    },
    {
      id: "profil" as NavTab,
      label: "Mon Profil",
      href: "/home/profile",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: "logout" as NavTab,
      label: "Déconnexion",  
      href:"#",
      icon: (
        <LogOut className="text-red-500"></LogOut>
      ),
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden md:block space-y-6 sticky top-20 self-start">
      {/* Carte Mini Profil */}
      <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-4 shadow-sm text-center">
        <Link href={"/home/profile"}>
          <div className="w-16 h-16 rounded-full bg-aiesec-surface-soft border-2 border-aiesec-blue mx-auto flex items-center justify-center font-heading font-bold text-xl text-aiesec-blue mb-3">
            {user?.avatar}
          </div>
          <h3 className="font-heading font-bold text-base text-aiesec-navy">{user?.fullName}</h3>
          <p className="font-sans text-xs text-aiesec-text-secondary mt-0.5">{user?.role} • {user?.lc}</p>
        </Link>
      </div>

      {/* Menu principal */}
      <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-3 shadow-sm space-y-1">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <Link
              href={item.href}
              key={item.id}
              onClick={() => { onTabChange(item.id); if (item.id === "logout") logout(); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-heading text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "bg-aiesec-surface-soft text-aiesec-blue"
                  : "text-aiesec-text-secondary hover:bg-aiesec-background hover:text-aiesec-navy"
              }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {/* {item.badge && (
                <span className="bg-aiesec-blue text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )} */}
            </Link>
          );
        })}
      </div>
    </aside>
  );
};