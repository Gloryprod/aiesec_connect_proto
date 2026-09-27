"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS, UserProfile } from "@/data/mockUsers";

// Type pour les données nécessaires lors de l'inscription
export type RegisterData = Omit<UserProfile, "id" | "avatar"> & {
  password?: string;
};

interface AuthContextType {
  user: UserProfile | null;
  usersList: UserProfile[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string) => boolean;
  register: (data: RegisterData) => boolean;
  switchUser: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USERS_KEY = "aiesec_registered_users";
const LOCAL_STORAGE_CURRENT_USER_KEY = "aiesec_current_user_id";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Charger la liste complète des utilisateurs (MOCK_USERS + inscrits via localStorage)
    const savedUsers = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
    let allUsers = [...MOCK_USERS];

    if (savedUsers) {
      try {
        const parsedUsers: UserProfile[] = JSON.parse(savedUsers);
        // Évite les doublons avec MOCK_USERS
        const customUsers = parsedUsers.filter(
          (cu) => !MOCK_USERS.some((mu) => mu.id === cu.id)
        );
        allUsers = [...MOCK_USERS, ...customUsers];
      } catch (e) {
        console.error("Erreur de lecture des utilisateurs dans localStorage", e);
      }
    }

    setUsersList(allUsers);

    // 2. Récupérer l'utilisateur actuellement connecté
    const savedUserId = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (savedUserId) {
      const found = allUsers.find((u) => u.id === savedUserId);
      if (found) setUser(found);
    } else {
      // Connecté par défaut avec le premier profil
      setUser(allUsers[0]);
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, allUsers[0].id);
    }

    setIsLoading(false);
  }, []);

  // Connexion
  const login = (email: string) => {
    const found = usersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, found.id);
      return true;
    }
    return false;
  };

  // Inscription
  const register = (data: RegisterData) => {
    // Vérifier si l'email existe déjà
    const existing = usersList.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return false;
    }

    // Générer un avatar avec les initiales
    const nameParts = data.fullName.trim().split(" ");
    const avatar = nameParts.length >= 2
      ? `${nameParts[0].charAt(0)}${nameParts[nameParts.length - 1].charAt(0)}`.toUpperCase()
      : data.fullName.slice(0, 2).toUpperCase();

    const newUser: UserProfile = {
      ...data,
      id: `usr-${Date.now()}`,
      avatar,
      skills: data.skills || [],
      experiences: data.experiences || [],
      journey: data.journey || [],
      recognitions: data.recognitions || []
    };

    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);

    // Sauvegarder les utilisateurs personnalisés dans localStorage
    const customUsers = updatedUsers.filter(
      (u) => !MOCK_USERS.some((mu) => mu.id === u.id)
    );
    localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(customUsers));

    // Connecter immédiatement le nouvel utilisateur
    setUser(newUser);
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, newUser.id);

    return true;
  };

  // Basculer d'utilisateur (pour le UserSwitcher)
  const switchUser = (userId: string) => {
    const found = usersList.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, found.id);
    }
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        usersList,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        switchUser,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return context;
};