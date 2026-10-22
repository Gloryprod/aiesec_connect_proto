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

// 1. Incrémenter cette version chaque fois que le fichier mockUsers.ts est modifié
const MOCK_DATA_VERSION = "v1.3";

// Clé globale pour conserver la liste complète à jour (Mock + Inscrits + Connexions)
const LOCAL_STORAGE_ALL_USERS_KEY = "aiesec_all_users_store";
const LOCAL_STORAGE_CURRENT_USER_KEY = "aiesec_current_user_id";
const LOCAL_STORAGE_VERSION_KEY = "aiesec_mock_version";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [usersList, setUsersList] = useState<UserProfile[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Initialisation intelligente avec fusion & versioning
  useEffect(() => {
    const savedVersion = localStorage.getItem(LOCAL_STORAGE_VERSION_KEY);
    const savedAllUsersStr = localStorage.getItem(LOCAL_STORAGE_ALL_USERS_KEY);

    let finalUsersList: UserProfile[] = [...MOCK_USERS];

    if (savedAllUsersStr) {
      try {
        const savedUsers: UserProfile[] = JSON.parse(savedAllUsersStr);

        if (Array.isArray(savedUsers) && savedUsers.length > 0) {
          const usersMap = new Map<string, UserProfile>();

          // 1. Charger en priorité les utilisateurs du localStorage (pour conserver les modifs de profil, skills, etc.)
          savedUsers.forEach((u) => usersMap.set(u.id, u));

          // 2. Parcourir les MOCK_USERS du code source
          MOCK_USERS.forEach((mockUser) => {
            const existing = usersMap.get(mockUser.id);
            if (!existing) {
              // C'est un TOUT NOUVEAU mock ajouté dans le code source : on l'ajoute !
              usersMap.set(mockUser.id, mockUser);
            } 
            // Note : Si 'existing' existe déjà, on NE L'ÉCRASE PAS avec 'mockUser' 
            // pour que les modifications de profil de l'utilisateur soient précieusement conservées.
          });

          finalUsersList = Array.from(usersMap.values());
          localStorage.setItem(LOCAL_STORAGE_VERSION_KEY, MOCK_DATA_VERSION);
        }
      } catch (e) {
        console.error("Erreur de lecture des utilisateurs dans localStorage :", e);
      }
    } else {
      // Premier lancement sur ce navigateur
      localStorage.setItem(LOCAL_STORAGE_VERSION_KEY, MOCK_DATA_VERSION);
    }

    setUsersList(finalUsersList);
    localStorage.setItem(LOCAL_STORAGE_ALL_USERS_KEY, JSON.stringify(finalUsersList));

    // 2. Restaurer l'utilisateur connecté
    const savedUserId = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
    if (savedUserId) {
      const found = finalUsersList.find((u) => u.id === savedUserId);
      if (found) setUser(found);
    }

    setIsLoading(false);
  }, []);

  // Méthode clé : Mettre à jour les connexions en direct dans AuthContext
  const updateUserConnections = (updatedUsersList: UserProfile[]) => {
    // Nettoyer les doublons par sécurité avec un Map
    const uniqueMap = new Map<string, UserProfile>();
    updatedUsersList.forEach((u) => uniqueMap.set(u.id, u));
    const cleanList = Array.from(uniqueMap.values());

    setUsersList(cleanList);
    localStorage.setItem(LOCAL_STORAGE_ALL_USERS_KEY, JSON.stringify(cleanList));

    if (user) {
      const refreshedCurrentUser = cleanList.find((u) => u.id === user.id);
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