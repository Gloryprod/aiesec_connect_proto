// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useAuth } from "@/context/AuthContext";
// import { useNotifications } from "@/context/NotificationContext";

// interface MobileHeaderProps {
//   title?: string;
//   showBack?: boolean;
//   onBack?: () => void;
// }

// export const MobileHeader: React.FC<MobileHeaderProps> = ({
//   title,
//   showBack = false,
//   onBack,
// }) => {
//   const { user } = useAuth();
//   const { notifications } = useNotifications();

//   // Filtrer les notifications pour l'utilisateur connecté et compter les non lues
//   const unreadUserCount = notifications.filter(
//     (n) => n.recipientId === user?.id && !n.isRead
//   ).length;

//   return (
//     <header className="sticky top-0 z-40 bg-aiesec-surface border-b border-aiesec-border px-4 py-3 flex items-center justify-between">
//       {showBack ? (
//         <div className="flex items-center gap-3">
//           <button
//             onClick={onBack}
//             className="p-1 rounded-full text-aiesec-navy hover:bg-aiesec-surface-soft transition-colors cursor-pointer"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>
//           {title && (
//             <h1 className="font-heading font-bold text-lg text-aiesec-navy tracking-tight">
//               {title}
//             </h1>
//           )}
//         </div>
//       ) : (
//         <div className="flex items-center gap-2">
//           {/* Logo AIESEC CONNECT Icon */}
//           <div className="relative w-auto h-10 md:h-12 flex items-center">
//             <Image
//               src="/logo_aiesec.jpg"
//               alt="Logo"
//               width={100}
//               height={15}
//               className="w-auto object-contain dark:brightness-0 dark:invert"
//               priority
//             />
//           </div>
//         </div>
//       )}

//       {/* Actions à droite (Recherche & Notifications) */}
//       <div className="flex items-center gap-1.5">
//         <button className="p-2 text-aiesec-text-secondary hover:text-aiesec-blue hover:bg-aiesec-surface-soft rounded-full transition-colors cursor-pointer">
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//         </button>

//         {/* Bouton de notifications avec badge dynamique */}
//         <Link
//           href="/home/notifications"
//           className="p-2 text-aiesec-text-secondary hover:text-aiesec-blue hover:bg-aiesec-surface-soft rounded-full transition-colors relative cursor-pointer block"
//         >
//           <svg
//             className="w-5 h-5"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth="2"
//               d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//             />
//           </svg>

//           {/* Badge affiché uniquement s'il y a des notifications non lues */}
//           {unreadUserCount > 0 && (
//             <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-aiesec-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-aiesec-surface">
//               {unreadUserCount > 9 ? "9+" : unreadUserCount}
//             </span>
//           )}
//         </Link>
//       </div>
//     </header>
//   );
// };

"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useGlobalSearch } from "@/hook/useGlobalSearch";
import { Search, X } from "lucide-react";

interface MobileHeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ title, showBack = false, onBack }) => {
  const { user } = useAuth();
  const { notifications } = useNotifications();
  const { query, setQuery, results, clearSearch } = useGlobalSearch();
  const [isSearchActive, setIsSearchActive] = useState(false);

  const unreadUserCount = notifications.filter((n) => n.recipientId === user?.id && !n.isRead).length;

  return (
    <header className="sticky top-0 z-40 bg-aiesec-surface border-b border-aiesec-border px-4 py-3 flex items-center justify-between">
      {isSearchActive ? (
        <div className="flex items-center gap-2 w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher..."
            autoFocus
            className="flex-1 bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-1.5 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
          />
          <button
            onClick={() => {
              clearSearch();
              setIsSearchActive(false);
            }}
            className="text-aiesec-text-muted p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <>
          {showBack ? (
            <div className="flex items-center gap-3">
              <button onClick={onBack} className="p-1 rounded-full text-aiesec-navy hover:bg-aiesec-surface-soft">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {title && <h1 className="font-heading font-bold text-lg text-aiesec-navy tracking-tight">{title}</h1>}
            </div>
          ) : (
            <Link href="/home" className="flex items-center gap-2">
              <Image src="/logo_aiesec.jpg" alt="Logo" width={100} height={15} className="w-auto h-8 object-contain" priority />
            </Link>
          )}

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSearchActive(true)}
              className="p-2 text-aiesec-text-secondary hover:text-aiesec-blue rounded-full"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link href="/home/notifications" className="p-2 text-aiesec-text-secondary relative block">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {unreadUserCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-1 bg-aiesec-danger text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadUserCount > 9 ? "9+" : unreadUserCount}
                </span>
              )}
            </Link>
          </div>
        </>
      )}

      {/* Résultat de recherche sur Mobile */}
      {isSearchActive && query.trim() !== "" && (
        <div className="absolute top-full left-0 right-0 bg-aiesec-surface border-b border-aiesec-border shadow-xl p-3 z-50 max-h-80 overflow-y-auto space-y-2">
          {results.members.map((m) => (
            <Link
              key={m.id}
              href={`/home/membres/${m.id}`}
              onClick={() => setIsSearchActive(false)}
              className="flex items-center gap-2 p-2 hover:bg-aiesec-background rounded-lg"
            >
              <div className="w-6 h-6 rounded-full bg-aiesec-blue/10 text-aiesec-blue font-bold text-xs flex items-center justify-center">
                {m.avatar || m.fullName.charAt(0)}
              </div>
              <span className="text-xs font-semibold text-aiesec-navy">{m.fullName}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};