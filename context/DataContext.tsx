"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS, UserProfile } from "@/data/mockUsers";

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
  refreshUsers: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const LOCAL_STORAGE_POSTS_KEY = "aiesec_connect_shared_posts";
const LOCAL_STORAGE_USERS_KEY = "aiesec_registered_users";

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<UserProfile[]>(MOCK_USERS);

  // Fonction utilitaire pour charger et fusionner tous les utilisateurs
  const loadAllUsers = (): UserProfile[] => {
    let registeredUsers: UserProfile[] = [];
    if (typeof window !== "undefined") {
      const savedUsersJson = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (savedUsersJson) {
        try {
          registeredUsers = JSON.parse(savedUsersJson);
        } catch (error) {
          console.error("Erreur lors de la lecture des utilisateurs inscrits :", error);
        }
      }
    }

    // Éviter les doublons basés sur l'ID utilisateur
    const registeredIds = new Set(registeredUsers.map((u) => u.id));
    const uniqueMockUsers = MOCK_USERS.filter((u) => !registeredIds.has(u.id));

    return [...uniqueMockUsers, ...registeredUsers];
  };

  // Charger les utilisateurs et publications au montage
  useEffect(() => {
    // 1. Charger tous les utilisateurs (Mock + Inscrits)
    setUsers(loadAllUsers());

    // Ecouter les modifications de localStorage (ex: réinscription dans un autre onglet/composant)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_USERS_KEY) {
        setUsers(loadAllUsers());
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
          authorName: "Armel AHOUADI",
          authorRole: "Team Leader • LC Abomey-Calavi",
          authorAvatar: "AA",
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

  // Fonction permettant de rafraîchir manuellement la liste des utilisateurs
  const refreshUsers = () => {
    setUsers(loadAllUsers());
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

  return (
    <DataContext.Provider
      value={{
        users,
        posts,
        addPost,
        toggleLike,
        addComment,
        getUserById,
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