"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NotificationItem, NotificationAction } from "@/data/mockNotification";

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (notification: NotificationItem) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  handleAction: (notificationId: string, action: NotificationAction) => void;
}

const LOCAL_STORAGE_NOTIFICATIONS_KEY = "aiesec_connect_notifications";

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const router = useRouter();

  // 1. Chargement initial depuis le localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error("Erreur de lecture du localStorage pour les notifications", e);
      }
    }
  }, []);

  // Fonction utilitaire pour mettre à jour à la fois l'état React et le localStorage
  const updateNotifications = (newList: NotificationItem[]) => {
    setNotifications(newList);
    localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(newList));
  };

  // 2. Ajouter une nouvelle notification
  const addNotification = (newNotif: NotificationItem) => {
    const updated = [newNotif, ...notifications];
    updateNotifications(updated);
  };

  // 3. Marquer une notification comme lue
  const markAsRead = (id: string) => {
    const updated = notifications.map((notif) =>
      notif.id === id ? { ...notif, isRead: true } : notif
    );
    updateNotifications(updated);
  };

  // 4. Tout marquer comme lu
  const markAllAsRead = () => {
    const updated = notifications.map((notif) => ({ ...notif, isRead: true }));
    updateNotifications(updated);
  };

  // 5. Supprimer une notification
  const deleteNotification = (id: string) => {
    const updated = notifications.filter((notif) => notif.id !== id);
    updateNotifications(updated);
  };

  // 6. Gérer les actions interactives sur les notifications
  const handleAction = (notificationId: string, action: NotificationAction) => {
    // On marque la notification comme lue lorsqu'on interagit avec
    markAsRead(notificationId);

    switch (action.type) {
      case "LINK":
        if (action.targetUrl) {
          router.push(action.targetUrl);
        }
        break;

      case "ACCEPT_REJECT":
        if (action.actionKey === "ACCEPT_CONNECTION") {
          console.log("Demande de connexion acceptée pour :", action.params?.requesterId);
          // Ajouter la logique métier (ex: ajouter aux amis/réseau)
        } else if (action.actionKey === "DECLINE_CONNECTION") {
          console.log("Demande de connexion refusée pour :", action.params?.requesterId);
        }
        // Possibilité de supprimer la notification après réponse
        deleteNotification(notificationId);
        break;

      case "JOIN_EVENT":
        if (action.targetUrl) {
          router.push(action.targetUrl);
        }
        break;

      default:
        break;
    }
  };

  // Compteur dynamique de notifications non lues
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        handleAction,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personnalisé pour consommer le Context simplement
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications doit être utilisé à l'intérieur d'un NotificationProvider");
  }
  return context;
};