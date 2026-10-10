"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export type PostType = "post" | "event" | "recognition" | "project";

export interface CreatePostPayload {
  type: PostType;
  content: string;
  // Champs spécifiques selon le type
  eventTitle?: string;
  eventDate?: string;
  eventLocation?: string;
  recognizedUserId?: string;
  projectDeadline?: string;
}

export function useCreatePost(onSuccess?: () => void) {
  const { user } = useAuth();
  const { addPost } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitPost = async (payload: CreatePostPayload) => {
    if (!user) {
      toast.error("Vous devez être connecté pour publier.");
      return;
    }

    if (!payload.content.trim() && !payload.eventTitle) {
      toast.error("Le contenu de la publication ne peut pas être vide.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Formater le contenu selon le type de publication
      let formattedContent = payload.content;

      if (payload.type === "event") {
        formattedContent = `📅 **ÉVÉNEMENT : ${payload.eventTitle}**\n📍 Lieu : ${payload.eventLocation || "En ligne"}\n📆 Date : ${payload.eventDate || "Prochainement"}\n\n${payload.content}`;
      } else if (payload.type === "project") {
        formattedContent = `🚀 **DÉFI / PROJET : ${payload.eventTitle}**\n⏳ Date limite : ${payload.projectDeadline || "A déterminer"}\n\n${payload.content}`;
      } else if (payload.type === "recognition") {
        formattedContent = `🏆 **RECONNAISSANCE**\n\n${payload.content}`;
      }

      // Utiliser addPost de DataContext
      addPost(formattedContent, user);
      toast.success("Publication créée avec succès ! 🎉");
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors de la création de la publication.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitPost, isSubmitting };
}