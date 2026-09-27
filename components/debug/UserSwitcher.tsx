"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/data/mockUsers";

export const UserSwitcher: React.FC = () => {
  const { user, usersList, switchUser } = useAuth();

  if (!user) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50 bg-aiesec-navy text-white p-3 rounded-2xl shadow-2xl border border-white/20 text-xs flex flex-col gap-2 max-w-xs">
      <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
        <span className="font-heading font-bold text-[10px] uppercase text-aiesec-blue tracking-wider">
          🛠️ Test Switcher
        </span>
        <span className="text-[10px] opacity-70">MVP Mode</span>
      </div>

      <p className="text-[11px]">Connecté en tant que :</p>

      <div className="flex flex-col gap-1">
        { usersList.map((u: UserProfile) => (
          <button
            key={u.id}
            onClick={() => switchUser(u.id)}
            className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl text-left transition-all cursor-pointer ${
              user.id === u.id
                ? "bg-aiesec-blue text-white font-semibold"
                : "bg-white/10 hover:bg-white/20 text-white/80"
            }`}
          >
            <span className="truncate">{u.fullName}</span>
            <span className="text-[9px] opacity-80 ml-2">{u.lc.replace("AIESEC in ", "")}</span>
          </button>
        ))}
      </div>
    </div>
  );
};