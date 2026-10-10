"use client";

import React, { useState } from "react";
import { X, Calendar, Award, Rocket, MessageSquareText } from "lucide-react";
import { useCreatePost, PostType } from "@/hook/useCreatePost";
import { Button } from "@/components/ui/Button";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const [activeType, setActiveType] = useState<PostType>("post");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [locationOrDeadline, setLocationOrDeadline] = useState("");

  const { submitPost, isSubmitting } = useCreatePost(() => {
    setContent("");
    setTitle("");
    setLocationOrDeadline("");
    onClose();
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPost({
      type: activeType,
      content,
      eventTitle: title,
      eventLocation: activeType === "event" ? locationOrDeadline : undefined,
      projectDeadline: activeType === "project" ? locationOrDeadline : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-aiesec-surface border border-aiesec-border w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modale */}
        <div className="flex items-center justify-between border-b border-aiesec-border pb-3">
          <h2 className="font-heading font-bold text-base text-aiesec-navy">Créer une publication</h2>
          <button onClick={onClose} className="p-1 text-aiesec-text-muted hover:text-aiesec-text rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sélecteur de Types de Publication */}
        <div className="grid grid-cols-4 gap-2 bg-aiesec-background p-1.5 rounded-xl border border-aiesec-border">
          <button
            type="button"
            onClick={() => setActiveType("post")}
            className={`py-2 flex flex-col items-center gap-1 rounded-lg text-[10px] font-semibold transition-all ${
              activeType === "post" ? "bg-aiesec-surface text-aiesec-blue shadow-sm" : "text-aiesec-text-muted"
            }`}
          >
            <MessageSquareText className="w-4 h-4" />
            <span>Post</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType("event")}
            className={`py-2 flex flex-col items-center gap-1 rounded-lg text-[10px] font-semibold transition-all ${
              activeType === "event" ? "bg-aiesec-surface text-aiesec-blue shadow-sm" : "text-aiesec-text-muted"
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-500" />
            <span>Événement</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType("recognition")}
            className={`py-2 flex flex-col items-center gap-1 rounded-lg text-[10px] font-semibold transition-all ${
              activeType === "recognition" ? "bg-aiesec-surface text-aiesec-blue shadow-sm" : "text-aiesec-text-muted"
            }`}
          >
            <Award className="w-4 h-4 text-amber-500" />
            <span>Award</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveType("project")}
            className={`py-2 flex flex-col items-center gap-1 rounded-lg text-[10px] font-semibold transition-all ${
              activeType === "project" ? "bg-aiesec-surface text-aiesec-blue shadow-sm" : "text-aiesec-text-muted"
            }`}
          >
            <Rocket className="w-4 h-4 text-purple-500" />
            <span>Projet/Défi</span>
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {(activeType === "event" || activeType === "project") && (
            <input
              type="text"
              placeholder={activeType === "event" ? "Titre de l'événement..." : "Nom du Projet / Défi..."}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-aiesec-background border border-aiesec-border rounded-xl px-3.5 py-2 text-xs font-semibold text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
              required
            />
          )}

          {activeType === "event" && (
            <input
              type="text"
              placeholder="Lieu ou Lien (ex: Salle Collab / Google Meet)..."
              value={locationOrDeadline}
              onChange={(e) => setLocationOrDeadline(e.target.value)}
              className="w-full bg-aiesec-background border border-aiesec-border rounded-xl px-3.5 py-2 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
            />
          )}

          <textarea
            rows={4}
            placeholder={
              activeType === "recognition"
                ? "Décris les raisons de cette reconnaissance..."
                : "Qu'as-tu à partager avec le réseau AIESEC ?"
            }
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full bg-aiesec-background border border-aiesec-border rounded-xl p-3.5 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue resize-none"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-aiesec-text-muted hover:text-aiesec-text"
            >
              Annuler
            </button>
            <Button variant="primary" type="submit" isLoading={isSubmitting} size="sm">
              Publier
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};