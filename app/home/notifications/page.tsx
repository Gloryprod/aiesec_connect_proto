"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { NotificationType } from "@/data/mockNotification";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { WebHeader } from "@/components/layout/WebHeader";
import { WebSidebar } from "@/components/layout/WebSidebar";

export default function NotificationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    handleAction,
  } = useNotifications();
  const router = useRouter();
  

  // Redirection si non authentifié
    useEffect(() => {
      if (!isLoading && (!isAuthenticated || !user)) {
        router.push("/login");
      }
    }, [isLoading, isAuthenticated, user, router]);

  const [activeFilter, setActiveFilter] = useState<"ALL" | "UNREAD" | NotificationType>("ALL");

  // Filtrer les notifications de l'utilisateur connecté
  const userNotifications = notifications.filter(
    (n) => n.recipientId === user?.id
  );

  // Appliquer le filtre sélectionné
  const filteredNotifications = userNotifications.filter((notif) => {
    if (activeFilter === "UNREAD") return !notif.isRead;
    if (activeFilter !== "ALL") return notif.type === activeFilter;
    return true;
  });

  const unreadCount = userNotifications.filter((n) => !n.isRead).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aiesec-background">
        <div className="w-8 h-8 border-4 border-aiesec-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aiesec-background flex flex-col">
      {/* Header Desktop */}
      <WebHeader />

      {/* Header Mobile */}
      <div className="md:hidden sticky top-0 z-40">
        <MobileHeader title="Notifications" showBack />
      </div>

      {/* Conteneur Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-6 py-4 md:py-6 flex gap-6">
        {/* Sidebar Desktop */}
        <div className="hidden md:block shrink-0">
          <WebSidebar activeTab="accueil" onTabChange={() => {}} />
        </div>

        {/* Section de Contenu Principal */}
        <section className="flex-1 max-w-2xl mx-auto w-full pb-24 md:pb-10 space-y-4">
          {/* Titre & Contrôles principaux (Masqué sur mobile car déjà dans le MobileHeader) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-4 md:mb-6">
            <div>
              <h1 className="text-xl md:text-2xl font-heading font-bold text-aiesec-navy">
                Notifications
              </h1>
              <p className="text-xs text-aiesec-text-secondary mt-0.5">
                Restez informé de vos activités, opportunités et connexions AIESEC.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs font-medium text-aiesec-blue hover:underline self-start sm:self-auto cursor-pointer pt-1 sm:pt-0"
              >
                Tout marquer comme lu ({unreadCount})
              </button>
            )}
          </div>

          {/* Barre de filtres (Faites défiler horizontalement sur mobile sans casser les marges) */}
          <div className="-mx-4 px-4 md:mx-0 md:px-0 flex items-center gap-2 overflow-x-auto pb-2 mb-4 scrollbar-none">
            <button
              onClick={() => setActiveFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === "ALL"
                  ? "bg-aiesec-blue text-white shadow-sm"
                  : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-secondary hover:bg-aiesec-surface-soft"
              }`}
            >
              Toutes ({userNotifications.length})
            </button>

            <button
              onClick={() => setActiveFilter("UNREAD")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === "UNREAD"
                  ? "bg-aiesec-blue text-white shadow-sm"
                  : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-secondary hover:bg-aiesec-surface-soft"
              }`}
            >
              Non lues ({unreadCount})
            </button>

            <button
              onClick={() => setActiveFilter("connection_request")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === "connection_request"
                  ? "bg-aiesec-blue text-white shadow-sm"
                  : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-secondary hover:bg-aiesec-surface-soft"
              }`}
            >
              Réseau & Connexions
            </button>

            <button
              onClick={() => setActiveFilter("announcement")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === "announcement"
                  ? "bg-aiesec-blue text-white shadow-sm"
                  : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-secondary hover:bg-aiesec-surface-soft"
              }`}
            >
              Annonces
            </button>

            <button
              onClick={() => setActiveFilter("event_invite")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === "event_invite"
                  ? "bg-aiesec-blue text-white shadow-sm"
                  : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-secondary hover:bg-aiesec-surface-soft"
              }`}
            >
              Événements
            </button>
          </div>

          {/* Liste des notifications */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-8 md:p-12 text-center">
                <div className="w-12 h-12 rounded-full bg-aiesec-surface-soft text-aiesec-text-muted flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="font-heading font-semibold text-sm text-aiesec-navy">
                  Aucune notification pour le moment
                </p>
                <p className="text-xs text-aiesec-text-muted mt-1">
                  Vous n&apos;avez aucune notification correspondant à ce filtre.
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                  className={`p-3.5 md:p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 md:gap-4 cursor-pointer relative ${
                    !notif.isRead
                      ? "bg-aiesec-surface border-aiesec-blue/30 shadow-sm"
                      : "bg-aiesec-surface/60 border-aiesec-border opacity-90 hover:opacity-100"
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Avatar / Initiale */}
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-aiesec-surface-soft border border-aiesec-blue/20 flex items-center justify-center font-heading font-bold text-xs md:text-sm text-aiesec-blue shrink-0 mt-0.5">
                      {notif.sender?.avatar || "A"}
                    </div>

                    {/* Contenu textuel */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 pr-6 md:pr-0">
                        <h4 className="font-heading font-semibold text-xs md:text-sm text-aiesec-navy truncate">
                          {notif.title}
                        </h4>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-aiesec-blue shrink-0" />
                        )}
                      </div>
                      <p className="font-sans text-xs text-aiesec-text mt-1 leading-relaxed break-words">
                        {notif.message}
                      </p>
                      <span className="text-[10px] text-aiesec-text-muted mt-1.5 block">
                        {notif.createdAt || "Récemment"}
                      </span>

                      {/* Actions associées (Boutons interactifs) */}
                      {notif.actions && notif.actions.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          {notif.actions.map((action) => (
                            <button
                              key={action.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAction(notif.id, action);
                              }}
                              className={`px-3 py-1.5 text-xs rounded-xl font-medium transition-all cursor-pointer ${
                                action.variant === "primary"
                                  ? "bg-aiesec-blue text-white hover:bg-aiesec-blue/90 shadow-sm"
                                  : "bg-aiesec-background border border-aiesec-border text-aiesec-text hover:bg-aiesec-surface-soft"
                              }`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bouton de suppression (En haut à droite sur mobile et desktop) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif.id);
                    }}
                    className="p-1.5 text-aiesec-text-muted hover:text-aiesec-danger rounded-lg transition-colors cursor-pointer shrink-0 -mr-1 -mt-1"
                    title="Supprimer la notification"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      {/* Navigation Mobile en bas de page */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNavigation activeTab="accueil" onTabChange={() => {}} />
      </div>
    </div>
  );
}