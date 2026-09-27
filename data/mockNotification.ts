// Types de notifications supportés dans l'application
export type NotificationType =
  | "connection_request"  // Demande de connexion / suivi
  | "post_like"           // J'aime sur une publication
  | "post_comment"        // Nouveau commentaire
  | "event_invite"        // Invitation à un événement
  | "announcement"        // Annonce globale / système
  | "recognition";        // Félicitations / Distinction

// Structure de l'émetteur de la notification (un membre AIESEC)
export interface NotificationSender {
  id: string;
  fullName: string;
  avatar: string;
  role?: string;
  lc?: string;
}

// Types d'actions déclenchables depuis la notification
export type NotificationActionType =
  | "LINK"               // Redirection simple (ex: voir le profil / voir le post)
  | "ACCEPT_REJECT"      // Boutons Accepter / Refuser (ex: demande d'ami/connexion)
  | "JOIN_EVENT"         // Bouton s'inscrire / rejoindre
  | "QUICK_REPLY";       // Champ de réponse rapide (ex: commentaire)

// Définition d'une action associée à une notification
export interface NotificationAction {
  id: string;
  label: string;
  type: NotificationActionType;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  // Payload utile lors du déclenchement de l'action
  targetUrl?: string;          // Ex: "/profile/usr-123" ou "/posts/post-456"
  actionKey?: string;          // Ex: "ACCEPT_CONNECTION", "DECLINE_CONNECTION"
  params?: Record<string, any>; // Ex: { postId: "post-10", commentId: "c-1" }
}

// Entité principale : Notification
export interface NotificationItem {
  id: string;
  recipientId: string;         // ID du membre qui reçoit la notification
  sender?: NotificationSender; // Émetteur (optionnel si c'est une alerte système)
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string;           // Format ISO Date (ex: "2026-09-25T18:30:00Z")
  isRead: boolean;
  actions?: NotificationAction[]; // Liste des actions rapides disponibles
}

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    recipientId: "usr-current",
    sender: {
      id: "usr-102",
      fullName: "Tina Agbomahena",
      avatar: "TA",
      role: "Team Leader",
      lc: "LC Abomey-Calavi",
    },
    type: "connection_request",
    title: "Nouvelle demande de connexion",
    message: "Tina souhaite se connecter avec toi.",
    createdAt: "2026-09-25T17:45:00.000Z",
    isRead: false,
    actions: [
      {
        id: "act-1",
        label: "Accepter",
        type: "ACCEPT_REJECT",
        variant: "primary",
        actionKey: "ACCEPT_CONNECTION",
        params: { requesterId: "usr-102" },
      },
      {
        id: "act-2",
        label: "Refuser",
        type: "ACCEPT_REJECT",
        variant: "ghost",
        actionKey: "DECLINE_CONNECTION",
        params: { requesterId: "usr-102" },
      },
    ],
  },
  {
    id: "notif-2",
    recipientId: "usr-current",
    sender: {
      id: "usr-105",
      fullName: "Karel Dossou",
      avatar: "KD",
      role: "Vice President",
      lc: "LC Cotonou",
    },
    type: "post_like",
    title: "Mention J'aime",
    message: "Karel a aimé votre publication sur le projet Jobsy.",
    createdAt: "2026-09-25T15:20:00.000Z",
    isRead: true,
    actions: [
      {
        id: "act-3",
        label: "Voir le post",
        type: "LINK",
        variant: "secondary",
        targetUrl: "/posts/post-88",
      },
    ],
  },
  {
    id: "notif-3",
    recipientId: "usr-current",
    type: "announcement",
    title: "Annonce Générale AIESEC",
    message: "L'assemblée générale annuelle aura lieu ce samedi à 10h00.",
    createdAt: "2026-09-24T09:00:00.000Z",
    isRead: false,
    actions: [
      {
        id: "act-4",
        label: "En savoir plus",
        type: "JOIN_EVENT",
        variant: "primary",
        targetUrl: "/events/ag-2026",
      },
    ],
  },
];