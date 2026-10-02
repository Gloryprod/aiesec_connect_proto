"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { WebHeader } from "@/components/layout/WebHeader";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { WebSidebar } from "@/components/layout/WebSidebar";
import { Send, MessageSquare, ArrowLeft } from "lucide-react";

interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
}

const LOCAL_STORAGE_CHAT_KEY = "aiesec_chat_messages";

function ChatContent() {
  const { user } = useAuth();
  const { users } = useData();
  const searchParams = useSearchParams();

  const selectedUserIdParam = searchParams.get("userId");

  // Récupérer les données fraîches de l'utilisateur connecté
  const currentUserData = users.find((u) => u.id === user?.id) || user;
  
  // Filtrer les connexions réelles
  const userConnections = users.filter((u) =>
    (currentUserData?.connections || []).includes(u.id)
  );

  const [activeRecipientId, setActiveRecipientId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<DirectMessage[]>([]);

  // 1. Définir le destinataire actif (Query Param ou Premier ami connecté)
  useEffect(() => {
    if (selectedUserIdParam) {
      setActiveRecipientId(selectedUserIdParam);
    } else if (!activeRecipientId && userConnections.length > 0) {
      setActiveRecipientId(userConnections[0].id);
    }
  }, [selectedUserIdParam, userConnections]);

  // 2. Chargement initial + Synchronisation en temps réel (multi-onglets/fenêtres)
  useEffect(() => {
    const loadMessages = () => {
      const savedMsg = localStorage.getItem(LOCAL_STORAGE_CHAT_KEY);
      if (savedMsg) {
        try {
          setMessages(JSON.parse(savedMsg));
        } catch (e) {
          console.error("Erreur de chargement des messages :", e);
        }
      }
    };

    loadMessages();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === LOCAL_STORAGE_CHAT_KEY && e.newValue) {
        try {
          setMessages(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Erreur de synchro du chat :", err);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // 3. Envoi de message avec enregistrement persistant
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeRecipientId || !user) return;

    const newMsg: DirectMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      recipientId: activeRecipientId,
      text: messageInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    localStorage.setItem(LOCAL_STORAGE_CHAT_KEY, JSON.stringify(updated));
    setMessageInput("");
  };

  const activeRecipient = users.find((u) => u.id === activeRecipientId);

  // Filtrer uniquement les échanges de la conversation active
  const conversation = messages.filter(
    (m) =>
      (m.senderId === user?.id && m.recipientId === activeRecipientId) ||
      (m.senderId === activeRecipientId && m.recipientId === user?.id)
  );

  return (
    <div className="min-h-screen bg-aiesec-background flex flex-col">
      <WebHeader />
      <div className="md:hidden">
        <MobileHeader title="Messages" showBack />
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-0 md:px-6 py-0 md:py-6 flex gap-6">
        <div className="hidden md:block shrink-0">
          <WebSidebar activeTab="messages" onTabChange={() => {}} />
        </div>

        <section className="flex-1 max-w-4xl mx-auto w-full h-[calc(100vh-120px)] bg-aiesec-surface border border-aiesec-border rounded-2xl shadow-sm flex overflow-hidden">
          
          {/* Liste des conversations à gauche */}
          <div className={`w-full md:w-80 border-r border-aiesec-border flex flex-col ${activeRecipientId ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b border-aiesec-border">
              <h2 className="font-bold text-sm text-aiesec-navy flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-aiesec-blue" />
                Conversations
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-aiesec-border">
              {userConnections.length === 0 ? (
                <div className="p-6 text-center text-xs text-aiesec-text-muted">
                  Vous n&apos;avez pas encore de connexion pour discuter.
                </div>
              ) : (
                userConnections.map((conn) => (
                  <div
                    key={conn.id}
                    onClick={() => setActiveRecipientId(conn.id)}
                    className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                      activeRecipientId === conn.id ? "bg-aiesec-blue/10" : "hover:bg-aiesec-background"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-aiesec-blue/10 border border-aiesec-blue/20 flex items-center justify-center font-bold text-xs text-aiesec-blue shrink-0">
                      {conn.avatar || conn.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-xs text-aiesec-navy truncate">{conn.fullName}</p>
                      <p className="text-[10px] text-aiesec-text-muted truncate">{conn.role || "Membre"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Zone de Chat à droite */}
          <div className={`flex-1 flex flex-col h-full bg-aiesec-background ${!activeRecipientId ? 'hidden md:flex' : 'flex'}`}>
            {activeRecipient ? (
              <>
                {/* En-tête du chat */}
                <div className="p-3.5 bg-aiesec-surface border-b border-aiesec-border flex items-center gap-3">
                  <button
                    onClick={() => setActiveRecipientId(null)}
                    className="md:hidden p-1 text-aiesec-navy"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-9 h-9 rounded-full bg-aiesec-blue text-white flex items-center justify-center font-bold text-xs">
                    {activeRecipient.avatar || activeRecipient.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-aiesec-navy">{activeRecipient.fullName}</h3>
                    <p className="text-[10px] text-aiesec-text-muted">{activeRecipient.role || "Membre"}</p>
                  </div>
                </div>

                {/* Fil des messages */}
                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {conversation.length === 0 ? (
                    <div className="text-center text-xs text-aiesec-text-muted py-8">
                      Envoyez votre premier message à {activeRecipient.fullName} ! 👋
                    </div>
                  ) : (
                    conversation.map((msg) => {
                      const isMe = msg.senderId === user?.id;
                      return (
                        <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                          <div
                            className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs ${
                              isMe
                                ? "bg-aiesec-blue text-white rounded-br-none"
                                : "bg-aiesec-surface border border-aiesec-border text-aiesec-navy rounded-bl-none"
                            }`}
                          >
                            {msg.text}
                          </div>
                          <span className="text-[9px] text-aiesec-text-muted mt-0.5 px-1">{msg.timestamp}</span>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Formulaire d'envoi */}
                <form onSubmit={handleSendMessage} className="p-3 bg-aiesec-surface border-t border-aiesec-border flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Écrire un message..."
                    className="flex-1 bg-aiesec-background border border-aiesec-border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                  />
                  <button
                    type="submit"
                    className="bg-aiesec-blue text-white p-2 rounded-xl hover:bg-aiesec-blue/90 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-aiesec-text-muted">
                <MessageSquare className="w-12 h-12 mb-2 text-aiesec-text-muted" />
                <p className="text-xs font-semibold">Sélectionnez une conversation pour commencer à discuter.</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
        <BottomNavigation activeTab="messages" onTabChange={() => {}} />
      </div>
    </div>
  );
}

export default function MessagePage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aiesec-background">
        <div className="w-8 h-8 border-4 border-aiesec-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="p-4 text-center text-xs">Chargement des messages...</div>}>
      <ChatContent />
    </Suspense>
  );
}