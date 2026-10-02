"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MOCK_USERS, UserProfile } from "@/data/mockUsers";

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
  updateUserConnections: (updatedUsers: UserProfile[]) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clé globale pour conserver la liste complète à jour (Mock + Inscrits + Connexions)
const LOCAL_STORAGE_ALL_USERS_KEY = "aiesec_all_users_store";
const LOCAL_STORAGE_CURRENT_USER_KEY = "aiesec_current_user_id";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Charger la liste complète des utilisateurs au démarrage
  useEffect(() => {
    const savedAllUsers = localStorage.getItem(LOCAL_STORAGE_ALL_USERS_KEY);
    let allUsers = [...MOCK_USERS];

    if (savedAllUsers) {
      try {
        const parsedUsers: UserProfile[] = JSON.parse(savedAllUsers);
        if (Array.isArray(parsedUsers) && parsedUsers.length > 0) {
          // Fusionner avec MOCK_USERS pour garantir que de nouveaux mocks soient inclus si ajoutés au code
          const savedIds = new Set(parsedUsers.map((u) => u.id));
          const missingMocks = MOCK_USERS.filter((mu) => !savedIds.has(mu.id));
          allUsers = [...parsedUsers, ...missingMocks];
        }
      } catch (e) {
        console.error("Erreur de lecture des utilisateurs dans localStorage :", e);
      }
    }

    setUsersList(allUsers);
    localStorage.setItem(LOCAL_STORAGE_ALL_USERS_KEY, JSON.stringify(allUsers));

    // 2. Restaurer l'utilisateur connecté
    const savedUserId = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (savedUserId) {
      const found = allUsers.find((u) => u.id === savedUserId);
      if (found) setUser(found);
    }

    setIsLoading(false);
  }, []);

  // Méthode clé : Mettre à jour les connexions en direct dans AuthContext
  const updateUserConnections = (updatedUsersList: UserProfile[]) => {
    setUsersList(updatedUsersList);
    localStorage.setItem(LOCAL_STORAGE_ALL_USERS_KEY, JSON.stringify(updatedUsersList));

    // Mettre à jour également l'instance de l'utilisateur actif s'il est impacté
    if (user) {
      const refreshedCurrentUser = updatedUsersList.find((u) => u.id === user.id);
      if (refreshedCurrentUser) {
        setUser(refreshedCurrentUser);
      }
    }
  };

  // Connexion
  const login = (email: string) => {
    let freshUsersList = usersList;

    // Relire la base de données unifiée depuis le localStorage
    const savedAllUsers = localStorage.getItem(LOCAL_STORAGE_ALL_USERS_KEY);
    if (savedAllUsers) {
      try {
        freshUsersList = JSON.parse(savedAllUsers);
        setUsersList(freshUsersList); // Synchroniser l'état local React
      } catch (e) {
        console.error("Erreur de lecture lors du login :", e);
      }
    }

    const found = freshUsersList.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setUser(found);
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, found.id);
      return true;
    }
    return false;
  };

  // Inscription
  const register = (data: RegisterData) => {
    const existing = usersList.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      return false;
    }

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
      recognitions: data.recognitions || [],
      connections: [] // Initialisation explicite de la liste des connexions
    };

    const updatedUsers = [...usersList, newUser];
    setUsersList(updatedUsers);
    localStorage.setItem(LOCAL_STORAGE_ALL_USERS_KEY, JSON.stringify(updatedUsers));

    setUser(newUser);
    localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, newUser.id);

    return true;
  };

  // Basculer d'utilisateur
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
        updateUserConnections,
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