import { useAuth } from "@/context/AuthContext";
import { NotificationItem } from "@/data/mockNotification";
import { useNotifications } from "@/context/NotificationContext";
import { UserProfile } from "@/data/mockUsers";
import toast from "react-hot-toast";

export function useConnection(){
  const { user : currentUser } = useAuth()
  const { addNotification } = useNotifications();

  const sendConnectionRequest = (targetMember: UserProfile) => {
    if (!currentUser) {
      toast.error("Vous devez être connecté pour envoyer une demande.");
      return;
    }

    if (currentUser.id === targetMember.id) {
      toast.error("Vous ne pouvez pas vous envoyer une demande à vous-même.");
      return;
    }

    const newNotif: NotificationItem = {
      id: `notif-conn-${Date.now()}`,
      recipientId: targetMember.id,
      sender: {
        id: currentUser.id,
        fullName: currentUser.fullName,
        avatar: currentUser.avatar || currentUser.fullName.charAt(0),
        role: currentUser.role || "Membre",
        lc: currentUser.lc || "AIESEC",
      },
      type: "connection_request",
      title: "Nouvelle demande de connexion",
      message: `${currentUser.fullName} souhaite se connecter avec vous.`,
      createdAt: new Date().toISOString(),
      isRead: false,
      actions: [
        {
          id: `act-accept-${Date.now()}`,
          label: "Accepter",
          type: "ACCEPT_REJECT",
          variant: "primary",
          actionKey: "ACCEPT_CONNECTION",
          params: {
            requesterId: currentUser.id,
            currentUserId: targetMember.id,
            acceptorName: targetMember.fullName,
          },
        },
        {
          id: `act-decline-${Date.now()}`,
          label: "Refuser",
          type: "ACCEPT_REJECT",
          variant: "ghost",
          actionKey: "DECLINE_CONNECTION",
          params: { requesterId: currentUser.id },
        },
      ],
    };

    addNotification(newNotif);
    toast.success(`Demande de connexion envoyée à ${targetMember.fullName} !`);
  };
  
  return {sendConnectionRequest};
}

