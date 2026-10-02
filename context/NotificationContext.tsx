"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NotificationItem, NotificationAction } from "@/data/mockNotification";
import { useData } from "./DataContext";

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
  const { acceptConnectionRequest } = useData();
  const router = useRouter();

  // 1. Chargement initial et synchronisation multi-onglets
  useEffect(() => {
    const savedNotifications = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {
        console.error("Erreur de lecture du localStorage pour les notifications", e);
      }
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_NOTIFICATIONS_KEY && e.newValue) {
        try {
          setNotifications(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Erreur de synchro des notifications :", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 2. Ajouter une notification de manière atomique
  const addNotification = (newNotif: NotificationItem) => {
    setNotifications((prev) => {
      const updated = [newNotif, ...prev];
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // 3. Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.map((notif) =>
        notif.id === id ? { ...notif, isRead: true } : notif
      );
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // 4. Tout marquer comme lu
  const markAllAsRead = () => {
    setNotifications((prev) => {
      const updated = prev.map((notif) => ({ ...notif, isRead: true }));
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // 5. Supprimer une notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) => {
      const updated = prev.filter((notif) => notif.id !== id);
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // 6. Gérer les actions interactives
  const handleAction = (notificationId: string, action: NotificationAction) => {
    switch (action.type) {
      case "LINK":
        markAsRead(notificationId);
        if (action.targetUrl) {
          router.push(action.targetUrl);
        }
        break;

      case "ACCEPT_REJECT":
        if (action.actionKey === "ACCEPT_CONNECTION") {
          const requesterId = action.params?.requesterId;
          const currentUserId = action.params?.currentUserId;

          if (requesterId && currentUserId) {
            // 1. Ajouter la connexion réciproque dans DataContext et AuthContext
            acceptConnectionRequest(requesterId, currentUserId);

            // 2. Créer la notification de confirmation destinée à l'émetteur
            const confirmationNotif: NotificationItem = {
              id: `notif-accepted-${Date.now()}`,
              recipientId: requesterId,
              sender: {
                id: currentUserId,
                fullName: action.params?.acceptorName || "Un membre",
                avatar: (action.params?.acceptorName || "A").charAt(0),
              },
              type: "connection_request",
              title: "Demande d'invitation acceptée ! 🎉",
              message: `${action.params?.acceptorName || "Le membre"} a accepté votre demande de connexion. Vous pouvez maintenant discuter.`,
              createdAt: new Date().toISOString(),
              isRead: false,
              actions: [
                {
                  id: `act-chat-${Date.now()}`,
                  label: "Envoyer un message",
                  type: "LINK",
                  variant: "primary",
                  targetUrl: `/home/chat`,
                },
              ],
            };

            // 3. Atomique : Supprimer la demande actuelle ET ajouter la confirmation
            setNotifications((prev) => {
              const filtered = prev.filter((n) => n.id !== notificationId);
              const updated = [confirmationNotif, ...filtered];
              localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updated));
              return updated;
            });
          }
        } else {
          // Si refusé, simplement supprimer la notification
          deleteNotification(notificationId);
        }
        break;

      case "JOIN_EVENT":
        markAsRead(notificationId);
        if (action.targetUrl) {
          router.push(action.targetUrl);
        }
        break;

      default:
        break;
    }
  };

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

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications doit être utilisé à l'intérieur d'un NotificationProvider");
  }
  return context;
};