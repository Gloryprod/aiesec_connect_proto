"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS, UserProfile } from "@/data/mockUsers";
import { useAuth } from "./AuthContext";

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  timeAgo: string;
  content: string;
  isLiked: boolean;
  likes: string[]; // Tableau contenant les IDs des utilisateurs ayant liké
  comments: Comment[];
  createdAt: number;
}

interface DataContextType {
  users: UserProfile[];
  posts: Post[];
  addPost: (content: string, author: UserProfile) => void;
  toggleLike: (postId: string, userId: string) => void;
  addComment: (postId: string, content: string, author: UserProfile) => void;
  getUserById: (id: string) => UserProfile | undefined;
  acceptConnectionRequest: (user1Id: string, user2Id: string) => void;
  refreshUsers: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_POSTS_KEY = "aiesec_connect_shared_posts";
const LOCAL_STORAGE_ALL_USERS_KEY = "aiesec_all_users_store";
const LOCAL_STORAGE_PENDING_KEY = "aiesec_pending_connection_requests";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { usersList, updateUserConnections } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>(usersList);

  // Garder `users` synchronisé avec le store centralisé d'AuthContext
  useEffect(() => {
    setUsers(usersList);
  }, [usersList]);

  // Chargement initial des publications
  useEffect(() => {
    // 1. Écouter les changements multi-onglets sur la clé unifiée des utilisateurs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_ALL_USERS_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          setUsers(updated);
        } catch (err) {
          console.error("Erreur de synchronisation storage:", err);
        }
      }
    };
    window.addEventListener("storage", handleStorageChange);

    // 2. Charger les publications depuis le localStorage
    const savedPosts = localStorage.getItem(LOCAL_STORAGE_POSTS_KEY);
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error("Erreur de lecture du localStorage pour les posts", e);
      }
    } else {
      // Publications initiales de démonstration
      const initialPosts: Post[] = [
        {
          id: "post-1",
          authorId: "usr-01",
          authorName: "Paul TOLOU",
          authorRole: "Team Leader • LC Abomey-Calavi",
          authorAvatar: "PT",
          timeAgo: "Il y a 2h",
          content:
            "Aujourd'hui, nous avons lancé les préparatifs pour le sommet national du leadership. Très enthousiaste à l'idée de collaborer avec tous les comités locaux ! 💙",
          likes: ["usr-02"],
          isLiked: false,
          comments: [
            {
              id: "c-1",
              authorId: "usr-02",
              authorName: "Sonia MENSAH",
              content: "Super initiative Armel ! Le LC Cotonou sera présent.",
              createdAt: "Il y a 1h"
            }
          ],
          createdAt: Date.now() - 7200000
        }
      ];
      setPosts(initialPosts);
      localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(initialPosts));
    }

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Rafraîchissement manuel si nécessaire
  const refreshUsers = () => {
    const saved = localStorage.getItem(LOCAL_STORAGE_ALL_USERS_KEY);
    if (saved) {
      try {
        setUsers(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur lors du rafraîchissement des utilisateurs:", e);
      }
    }
  };

  // Sauvegarde automatique des posts
  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    localStorage.setItem(LOCAL_STORAGE_POSTS_KEY, JSON.stringify(newPosts));
  };

  // 1. Ajouter une publication
  const addPost = (content: string, author: UserProfile) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: author.id,
      authorName: author.fullName,
      authorRole: `${author.role || "Membre"} • ${author.lc || "AIESEC"}`,
      authorAvatar: author.avatar || author.fullName.charAt(0),
      timeAgo: "À l'instant",
      content,
      isLiked: false,
      likes: [],
      comments: [],
      createdAt: Date.now()
    };
    savePosts([newPost, ...posts]);
  };

  // 2. Liker / Unliker
  const toggleLike = (postId: string, userId: string) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(userId);
        const newLikes = hasLiked
          ? post.likes.filter((id) => id !== userId)
          : [...post.likes, userId];
        return { ...post, likes: newLikes, isLiked: !hasLiked };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  // 3. Ajouter un commentaire
  const addComment = (postId: string, content: string, author: UserProfile) => {
    const updatedPosts = posts.map((post) => {
      if (post.id === postId) {
        const newComment: Comment = {
          id: `comment-${Date.now()}`,
          authorId: author.id,
          authorName: author.fullName,
          content,
          createdAt: "À l'instant"
        };
        return { ...post, comments: [...post.comments, newComment] };
      }
      return post;
    });
    savePosts(updatedPosts);
  };

  // 4. Récupérer un utilisateur par son ID
  const getUserById = (id: string) => {
    return users.find((u) => u.id === id);
  };


  const removePendingRequest = (requesterId: string, recipientId: string) => {
    if (typeof window === "undefined") return;

    const savedPendingJson = localStorage.getItem(LOCAL_STORAGE_PENDING_KEY);
    if (!savedPendingJson) return;

    try {
      const pendingMap: Record<string, string[]> = JSON.parse(savedPendingJson);

      // Si le demandeur a des demandes enregistrées
      if (pendingMap[requesterId]) {
        // Filtrer pour retirer l'ID du destinataire qui vient d'accepter
        const updatedList = pendingMap[requesterId].filter((id) => id !== recipientId);

        const updatedMap = {
          ...pendingMap,
          [requesterId]: updatedList,
        };

        // Mettre à jour le localStorage
        localStorage.setItem(LOCAL_STORAGE_PENDING_KEY, JSON.stringify(updatedMap));

        // Déclencher un événement storage pour synchroniser les composants ou onglets ouverts
        window.dispatchEvent(new Event("storage"));
      }
    } catch (e) {
      console.error("Erreur lors du nettoyage de la demande en attente :", e);
    }
  };

  // 5. Accepter la connexion entre deux membres (Mise à jour synchronisée)
  const acceptConnectionRequest = (user1Id: string, user2Id: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === user1Id) {
        const currentConnections = u.connections || [];
        if (!currentConnections.includes(user2Id)) {
          return { ...u, connections: [...currentConnections, user2Id] };
        }
      }
      if (u.id === user2Id) {
        const currentConnections = u.connections || [];
        if (!currentConnections.includes(user1Id)) {
          return { ...u, connections: [...currentConnections, user1Id] };
        }
      }
      return u;
    });

    setUsers(updatedUsers);
    
    // Propager la mise à jour à AuthContext pour rafraîchir l'utilisateur actif
    updateUserConnections(updatedUsers);
    removePendingRequest(user1Id, user2Id);
  };

  return (
    <DataContext.Provider
      value={{
        users,
        posts,
        addPost,
        toggleLike,
        addComment,
        getUserById,
        acceptConnectionRequest,
        refreshUsers
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData doit être utilisé au sein d'un DataProvider");
  }
  return context;
};