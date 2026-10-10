// "use client";

// import React, { useState, useRef, useEffect } from "react";
// import { Button } from "@/components/ui/Button";
// import Image from "next/image";
// import { useAuth } from "@/context/AuthContext";
// import { useNotifications } from "@/context/NotificationContext";
// import Link from "next/link";

// export const WebHeader: React.FC = () => {
//   const { user } = useAuth();
//   const { notifications, markAsRead, handleAction, markAllAsRead } = useNotifications();

//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // 1. Filtrer les notifications concernant l'utilisateur connecté
//   const userNotifications = notifications.filter(
//     (n) => n.recipientId === user?.id
//   );

//   // 2. Compter uniquement les notifications non lues de cet utilisateur
//   const unreadUserCount = userNotifications.filter((n) => !n.isRead).length;

//   // Fermer le dropdown lorsqu'on clique en dehors
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   return (
//     <header className="sticky top-0 z-40 bg-aiesec-surface border-b border-aiesec-border px-8 py-3.5 hidden md:block">
//       <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
//         {/* Logo */}
//         <div className="relative w-auto h-10 md:h-10 flex items-center">
//           <Image
//             src="/logo2.png"
//             alt="Logo"
//             width={80}
//             height={10}
//             className="w-auto object-contain dark:brightness-0 dark:invert"
//             priority
//           />
//         </div>

//         {/* Barre de recherche centrale */}
//         <div className="flex-1 max-w-md relative">
//           <svg
//             className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-aiesec-text-muted"
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
//           <input
//             type="text"
//             placeholder="Rechercher un membre, une compétence, un projet..."
//             className="w-full pl-11 pr-4 py-2 bg-aiesec-background border border-aiesec-border rounded-xl text-sm font-sans text-aiesec-text placeholder:text-aiesec-text-muted focus:outline-none focus:border-aiesec-blue focus:bg-aiesec-surface transition-all"
//           />
//         </div>

//         {/* Profil & Actions */}
//         <div className="flex items-center gap-4">
//           <Button variant="primary" size="sm" className="hidden lg:inline-flex">
//             + Publier
//           </Button>

//           {/* Cloche de notifications & Dropdown */}
//           <div className="relative" ref={dropdownRef}>
//             <button
//               onClick={() => setIsDropdownOpen(!isDropdownOpen)}
//               className="p-2 text-aiesec-text-secondary hover:text-aiesec-blue hover:bg-aiesec-surface-soft rounded-full transition-colors relative cursor-pointer"
//               title="Notifications"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
//                 />
//               </svg>

//               {/* Badge de compteur non-lu */}
//               {unreadUserCount > 0 && (
//                 <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-aiesec-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-aiesec-surface">
//                   {unreadUserCount > 9 ? "9+" : unreadUserCount}
//                 </span>
//               )}
//             </button>

//             {/* Menu Déroulant des Notifications */}
//             {isDropdownOpen && (
//               <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-aiesec-surface border border-aiesec-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
//                 <div className="p-4 border-b border-aiesec-border flex items-center justify-between">
//                   <h3 className="font-heading font-semibold text-sm text-aiesec-navy">
//                     Notifications
//                   </h3>
//                   {unreadUserCount > 0 && (
//                     <button
//                       onClick={markAllAsRead}
//                       className="text-[11px] font-sans font-medium text-aiesec-blue hover:underline cursor-pointer"
//                     >
//                       Tout marquer comme lu
//                     </button>
//                   )}
//                 </div>

//                 <div className="max-h-80 overflow-y-auto divide-y divide-aiesec-border">
//                   {userNotifications.length === 0 ? (
//                     <div className="p-6 text-center text-aiesec-text-muted text-xs">
//                       Aucune notification pour le moment.
//                     </div>
//                   ) : (
//                     userNotifications.map((notif) => (
//                       <div
//                         key={notif.id}
//                         onClick={() => !notif.isRead && markAsRead(notif.id)}
//                         className={`p-3.5 transition-colors cursor-pointer flex gap-3 ${
//                           !notif.isRead
//                             ? "bg-aiesec-blue/5 hover:bg-aiesec-blue/10"
//                             : "hover:bg-aiesec-background"
//                         }`}
//                       >
//                         {/* Avatar Émetteur */}
//                         <div className="w-8 h-8 rounded-full bg-aiesec-surface-soft border border-aiesec-blue/20 flex items-center justify-center font-heading font-bold text-xs text-aiesec-blue shrink-0">
//                           {notif.sender?.avatar || "A"}
//                         </div>

//                         <div className="flex-1 text-xs">
//                           <p className="font-heading font-semibold text-aiesec-navy">
//                             {notif.title}
//                           </p>
//                           <p className="font-sans text-aiesec-text mt-0.5">
//                             {notif.message}
//                           </p>

//                           {/* Actions associées s'il y en a */}
//                           {notif.actions && notif.actions.length > 0 && (
//                             <div className="flex items-center gap-2 mt-2">
//                               {notif.actions.map((act) => (
//                                 <button
//                                   key={act.id}
//                                   onClick={(e) => {
//                                     e.stopPropagation();
//                                     handleAction(notif.id, act);
//                                     setIsDropdownOpen(false);
//                                   }}
//                                   className={`cursor-pointer px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
//                                     act.variant === "primary"
//                                       ? "bg-aiesec-blue text-white hover:bg-aiesec-blue/90"
//                                       : "bg-aiesec-background border border-aiesec-border text-aiesec-text hover:bg-aiesec-surface-soft"
//                                   }`}
//                                 >
//                                   {act.label}
//                                 </button>
//                               ))}
//                             </div>
//                           )}
//                         </div>

//                         {!notif.isRead && (
//                           <span className="w-2 h-2 rounded-full bg-aiesec-blue shrink-0 mt-1.5" />
//                         )}
//                       </div>
//                     ))
//                   )}
//                 </div>

//                 <div className="p-2 border-t border-aiesec-border text-center bg-aiesec-background">
//                   <Link
//                     href="/home/notifications"
//                     onClick={() => setIsDropdownOpen(false)}
//                     className="text-xs font-medium text-aiesec-blue hover:underline block py-1"
//                   >
//                     Voir toutes les notifications
//                   </Link>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Lien Profil */}
//           <Link href={`/home/profile`}>
//             <div className="flex items-center gap-2 border-l border-aiesec-border pl-4">
//               <div className="w-9 h-9 rounded-full bg-aiesec-surface-soft border border-aiesec-blue/20 flex items-center justify-center font-heading font-bold text-sm text-aiesec-blue">
//                 {user?.avatar}
//               </div>
//               <div className="hidden xl:block text-left">
//                 <p className="font-heading font-semibold text-xs text-aiesec-navy">
//                   {user?.fullName}
//                 </p>
//                 <p className="font-sans text-[10px] text-aiesec-text-secondary">
//                   {user?.role}
//                 </p>
//               </div>
//             </div>
//           </Link>
//         </div>
//       </div>
//     </header>
//   );
// };

"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { useGlobalSearch } from "@/hook/useGlobalSearch";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import Link from "next/link";
import { Search, X } from "lucide-react";

export const WebHeader: React.FC = () => {
  const { user } = useAuth();
  const { notifications, markAsRead, handleAction, markAllAsRead } = useNotifications();
  const { query, setQuery, results, clearSearch } = useGlobalSearch();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const userNotifications = notifications.filter((n) => n.recipientId === user?.id);
  const unreadUserCount = userNotifications.filter((n) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        clearSearch();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-aiesec-surface border-b border-aiesec-border px-8 py-3.5 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/home" className="relative w-auto h-10 flex items-center shrink-0">
            <Image
              src="/logo2.png"
              alt="Logo"
              width={80}
              height={10}
              className="w-auto object-contain dark:brightness-0 dark:invert"
              priority
            />
          </Link>

          {/* Barre de recherche centrale dynamique */}
          <div className="flex-1 max-w-md relative" ref={searchRef}>
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-aiesec-text-muted" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un membre, une compétence, un projet..."
              className="w-full pl-10 pr-8 py-2 bg-aiesec-background border border-aiesec-border rounded-xl text-xs font-sans text-aiesec-text placeholder:text-aiesec-text-muted focus:outline-none focus:border-aiesec-blue focus:bg-aiesec-surface transition-all"
            />
            {query && (
              <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-aiesec-text-muted">
                <X className="w-4 h-4" />
              </button>
            )}

            {/* Menu Déroulant des Résultats de Recherche */}
            {query.trim() !== "" && (
              <div className="absolute left-0 right-0 mt-2 bg-aiesec-surface border border-aiesec-border rounded-2xl shadow-xl overflow-hidden z-50 p-3 max-h-96 overflow-y-auto space-y-3">
                {!results.hasResults ? (
                  <div className="p-4 text-center text-xs text-aiesec-text-muted">
                    Aucun résultat pour &quot;{query}&quot;
                  </div>
                ) : (
                  <>
                    {/* Section Membres */}
                    {results.members.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-aiesec-text-muted uppercase px-2 mb-1 block">Membres</span>
                        <div className="space-y-1">
                          {results.members.map((m) => (
                            <Link
                              key={m.id}
                              href={`/home/membres/${m.id}`}
                              onClick={clearSearch}
                              className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-aiesec-background transition-colors"
                            >
                              <div className="w-7 h-7 rounded-full bg-aiesec-blue/10 text-aiesec-blue flex items-center justify-center font-bold text-xs">
                                {m.avatar || m.fullName.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-xs text-aiesec-navy truncate">{m.fullName}</p>
                                <p className="text-[10px] text-aiesec-text-muted truncate">{m.role} • {m.lc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Section Publications */}
                    {results.posts.length > 0 && (
                      <div className="border-t border-aiesec-border pt-2">
                        <span className="text-[10px] font-bold text-aiesec-text-muted uppercase px-2 mb-1 block">Publications</span>
                        <div className="space-y-1">
                          {results.posts.map((p) => (
                            <div key={p.id} className="p-2 rounded-xl hover:bg-aiesec-background transition-colors cursor-pointer">
                              <p className="font-semibold text-xs text-aiesec-navy truncate">{p.authorName}</p>
                              <p className="text-[11px] text-aiesec-text-muted line-clamp-1">{p.content}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Profil & Actions */}
          <div className="flex items-center gap-4">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsPostModalOpen(true)}
              className="hidden lg:inline-flex cursor-pointer"
            >
              + Publier
            </Button>

            {/* Cloche de notifications */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="p-2 text-aiesec-text-secondary hover:text-aiesec-blue hover:bg-aiesec-surface-soft rounded-full transition-colors relative cursor-pointer"
                title="Notifications"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadUserCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-aiesec-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-aiesec-surface">
                    {unreadUserCount > 9 ? "9+" : unreadUserCount}
                  </span>
                )}
              </button>

              {/* Menu Déroulant Notifications */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-aiesec-surface border border-aiesec-border rounded-2xl shadow-xl overflow-hidden z-50 animate-in fade-in duration-200">
                  <div className="p-4 border-b border-aiesec-border flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-sm text-aiesec-navy">Notifications</h3>
                    {unreadUserCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[11px] font-medium text-aiesec-blue hover:underline">
                        Tout marquer comme lu
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-aiesec-border">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 text-center text-aiesec-text-muted text-xs">Aucune notification pour le moment.</div>
                    ) : (
                      userNotifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => !notif.isRead && markAsRead(notif.id)}
                          className={`p-3.5 transition-colors cursor-pointer flex gap-3 ${
                            !notif.isRead ? "bg-aiesec-blue/5 hover:bg-aiesec-blue/10" : "hover:bg-aiesec-background"
                          }`}
                        >
                          <div className="w-8 h-8 rounded-full bg-aiesec-surface-soft border border-aiesec-blue/20 flex items-center justify-center font-bold text-xs text-aiesec-blue shrink-0">
                            {notif.sender?.avatar || "A"}
                          </div>
                          <div className="flex-1 text-xs">
                            <p className="font-semibold text-aiesec-navy">{notif.title}</p>
                            <p className="text-aiesec-text mt-0.5">{notif.message}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Lien Profil */}
            <Link href={`/home/profile`}>
              <div className="flex items-center gap-2 border-l border-aiesec-border pl-4">
                <div className="w-9 h-9 rounded-full bg-aiesec-surface-soft border border-aiesec-blue/20 flex items-center justify-center font-bold text-sm text-aiesec-blue">
                  {user?.avatar}
                </div>
                <div className="hidden xl:block text-left">
                  <p className="font-semibold text-xs text-aiesec-navy">{user?.fullName}</p>
                  <p className="text-[10px] text-aiesec-text-secondary">{user?.role}</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Modale de Publication */}
      <CreatePostModal isOpen={isPostModalOpen} onClose={() => setIsPostModalOpen(false)} />
    </>
  );
};