"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { WebHeader } from "@/components/layout/WebHeader";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { WebSidebar } from "@/components/layout/WebSidebar";
import { WebRightPanel } from "@/components/layout/WebRightPanel";
import { StoriesBar, StoryItem, UserStory } from "@/components/feed/StoriesBar";
import { CreatePostModal } from "@/components/posts/CreatePostModal";
import { PostType } from "@/hook/useCreatePost";
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Send, 
  Calendar, 
  Award, 
  Rocket, 
  MessageSquareText,  
  Sparkles,
  Layers
} from "lucide-react";
import { useData } from "@/context/DataContext";
import { NotificationItem } from "@/data/mockNotification";

const LOCAL_STORAGE_STORIES_KEY = "aiesec_stories_store";

// Mock initial si le localStorage est vide
// const MOCK_INITIAL_STORIES: UserStory[] = [
//   {
//     id: "st-1",
//     userId: "usr-1",
//     name: "Tina",
//     avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
//     items: [
//       {
//         id: "i-1",
//         type: "text",
//         content: "Prêt pour la conférence nationale ce week-end ! 🚀",
//         bgGradient: "from-blue-600 to-indigo-900",
//         createdAt: "Il y a 1h",
//       },
//     ],
//   },
//   {
//     id: "st-2",
//     userId: "usr-2",
//     name: "Armel",
//     avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
//     items: [
//       {
//         id: "i-2",
//         type: "text",
//         content: "Nouveau projet oGX lancé avec succès ! 🎉",
//         bgGradient: "from-emerald-500 to-teal-800",
//         createdAt: "Il y a 3h",
//       },
//     ],
//   },
// ];

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { posts, toggleLike, addComment } = useData();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const notificationIdRef = useRef(0);

  const [storiesList, setStoriesList] = useState<UserStory[]>([]);

  // 1. Charger les stories depuis le localStorage au démarrage
  useEffect(() => {
    const savedStories = localStorage.getItem(LOCAL_STORAGE_STORIES_KEY);
    if (savedStories) {
      try {
        setStoriesList(JSON.parse(savedStories));
      } catch (e) {
        console.error("Erreur de chargement des stories :", e);
        setStoriesList([]);
      }
    } else {
      setStoriesList([]);
      localStorage.setItem(LOCAL_STORAGE_STORIES_KEY, JSON.stringify([]));
    }
  }, []);

  // 2. Ajouter une story et mettre à jour le localStorage
  const handleAddStory = (newItem: StoryItem) => {
    if (!user) return;

  setStoriesList((prevStories) => {
    // Vérifier si l'utilisateur a déjà une liste de stories active
    const existingIndex = prevStories.findIndex((s) => s.userId === user.id);

    let updatedList: UserStory[];

    if (existingIndex !== -1) {
      // Si l'utilisateur a déjà des stories, on empile le nouveau texte dans ses items
      updatedList = prevStories.map((s, idx) =>
        idx === existingIndex
          ? { ...s, items: [...(s.items || []), newItem] }
          : s
      );
    } else {
      // Sinon, on crée un nouveau bloc de story pour cet utilisateur en tête de liste
      const newUserStory: UserStory = {
        id: `story-group-${user.id}`,
        userId: user.id,
        name: user.fullName || "Moi",
        avatar: user.avatar || "",
        items: [newItem],
      };
      updatedList = [newUserStory, ...prevStories];
    }

    // Sauvegarde immédiate dans le localStorage
    localStorage.setItem(LOCAL_STORAGE_STORIES_KEY, JSON.stringify(updatedList));
    return updatedList;
  });
};

  // Redirection si non authentifié
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, user, router]);

  // État du filtre actif pour le Fil d'Actualité
  const [activeFilter, setActiveFilter] = useState<"all" | PostType>("all");

  // États pour la création de publication
  const [isModalOpen, setIsModalOpen] = useState(false);

  // État pour la section commentaire active
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState("");

  // Helper pour classifier le type de post à partir du contenu
  const getPostCategory = (content: string): PostType => {
    if (content.includes("📅 **ÉVÉNEMENT") || content.includes("📍 Lieu :")) return "event";
    if (content.includes("🏆 **RECONNAISSANCE")) return "recognition";
    if (content.includes("🚀 **DÉFI / PROJET")) return "project";
    return "post";
  };

  // Filtrage dynamique des publications
  const filteredPosts = useMemo(() => {
    if (activeFilter === "all") return posts;
    return posts.filter((p) => getPostCategory(p.content) === activeFilter);
  }, [posts, activeFilter]);

  if (isLoading || !user || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aiesec-background">
        <div className="w-8 h-8 border-4 border-aiesec-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --- Actions ---

  const handleToggleLike = (postId: string, userId: string) => {
    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const willBeLiked = !post.isLiked;
    toggleLike(postId, userId);

    if (willBeLiked && post.authorId !== user.id) {
      const notificationId = ++notificationIdRef.current;
      const newNotification: NotificationItem = {
        id: `notif-like-${notificationId}`,
        recipientId: post.authorId,
        sender: {
          id: user.id,
          fullName: user.fullName,
          avatar: user.fullName.charAt(0),
          role: user.role || "Membre",
        },
        type: "post_like",
        title: "Mention J'aime",
        message: `${user.fullName} a aimé votre publication.`,
        createdAt: new Date().toISOString(),
        isRead: false,
        actions: [
          {
            id: `act-like-${notificationId}`,
            label: "Voir le post",
            type: "LINK",
            variant: "secondary",
            targetUrl: `/posts/${post.id}`,
          },
        ],
      };

      addNotification(newNotification);
    }
  };

  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return;

    const post = posts.find((p) => p.id === postId);
    if (!post) return;

    const commentText = commentInput.trim();
    addComment(postId, commentText, user);

    if (post.authorId !== user.id) {
      const newNotification: NotificationItem = {
        id: `notif-comment-${Date.now()}`,
        recipientId: post.authorId,
        sender: {
          id: user.id,
          fullName: user.fullName,
          avatar: user.fullName.charAt(0),
          role: user.role || "Membre",
        },
        type: "post_comment",
        title: "Nouveau commentaire",
        message: `${user.fullName} a commenté : "${commentText.length > 30 ? commentText.substring(0, 30) + "..." : commentText}"`,
        createdAt: new Date().toISOString(),
        isRead: false,
        actions: [
          {
            id: `act-comment-${Date.now()}`,
            label: "Répondre",
            type: "LINK",
            variant: "primary",
            targetUrl: `/posts/${post.id}`,
          },
        ],
      };

      addNotification(newNotification);
    }

    setCommentInput("");
  };

  return (
    <div className="min-h-screen bg-aiesec-background flex flex-col">
      <WebHeader />
      <div className="md:hidden"><MobileHeader /></div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-0 md:px-6 py-0 md:py-6 flex gap-6">
        <WebSidebar activeTab="accueil" onTabChange={() => {}} />

        <section className="flex-1 max-w-xl mx-auto w-full pb-20 md:pb-6 space-y-4">
          <StoriesBar stories={storiesList} onAddStory={handleAddStory} />

          {/* Zone de création de publication */}
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-4 mx-4 md:mx-0 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-aiesec-blue/10 flex items-center justify-center text-aiesec-blue font-bold">
                {user.fullName.charAt(0)}
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 text-left px-4 py-2.5 bg-aiesec-background hover:bg-aiesec-surface-soft border border-aiesec-border rounded-full text-xs text-aiesec-text-muted transition-colors cursor-pointer"
              >
                Qu&apos;avez-vous à partager, {user.fullName.split(" ")[0]} ?
              </button>
            </div>
          </div>

          {/* Barre d'onglets de filtrage des publications */}
          <div className="px-4 md:px-0">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveFilter("all")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === "all"
                    ? "bg-aiesec-blue text-white shadow-sm"
                    : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-muted hover:text-aiesec-text"
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tous</span>
              </button>

              <button
                onClick={() => setActiveFilter("post")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === "post"
                    ? "bg-aiesec-blue text-white shadow-sm"
                    : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-muted hover:text-aiesec-text"
                }`}
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>Posts</span>
              </button>

              <button
                onClick={() => setActiveFilter("event")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === "event"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-muted hover:text-aiesec-text"
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                <span>Événements</span>
              </button>

              <button
                onClick={() => setActiveFilter("recognition")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === "recognition"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-muted hover:text-aiesec-text"
                }`}
              >
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Awards</span>
              </button>

              <button
                onClick={() => setActiveFilter("project")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeFilter === "project"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-muted hover:text-aiesec-text"
                }`}
              >
                <Rocket className="w-3.5 h-3.5 text-purple-500" />
                <span>Défis & Projets</span>
              </button>
            </div>
          </div>

          {/* Liste des Publications filtrées */}
          <div className="px-4 md:px-0 space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => {
                const category = getPostCategory(post.content);

                return (
                  <article 
                    key={post.id} 
                    className={`bg-aiesec-surface border rounded-2xl p-4 shadow-sm space-y-3 transition-all ${
                      category === "event" 
                        ? "border-emerald-500/30" 
                        : category === "recognition" 
                        ? "border-amber-500/30 bg-amber-500/5" 
                        : category === "project" 
                        ? "border-purple-500/30" 
                        : "border-aiesec-border"
                    }`}
                  >
                    {/* Badge de Type de publication */}
                    {category !== "post" && (
                      <div className="flex items-center justify-between pb-2 border-b border-aiesec-border/50">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                          category === "event" 
                            ? "bg-emerald-500/10 text-emerald-600" 
                            : category === "recognition" 
                            ? "bg-amber-500/10 text-amber-600" 
                            : "bg-purple-500/10 text-purple-600"
                        }`}>
                          {category === "event" && <Calendar className="w-3 h-3" />}
                          {category === "recognition" && <Sparkles className="w-3 h-3" />}
                          {category === "project" && <Rocket className="w-3 h-3" />}
                          {category === "event" ? "Événement AIESEC" : category === "recognition" ? "Reconnaissance / Award" : "Défi & Projet"}
                        </span>
                      </div>
                    )}

                    {/* En-tête auteur */}
                    <div className="flex items-center justify-between">
                      <div 
                        onClick={() => router.push(`/home/membres/${post.authorId}`)}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className="w-10 h-10 rounded-full bg-aiesec-blue/10 flex items-center justify-center font-bold text-aiesec-blue group-hover:ring-2 ring-aiesec-blue transition-all shrink-0">
                          {post.authorName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-aiesec-text group-hover:text-aiesec-blue transition-colors">
                            {post.authorName}
                          </h3>
                          <p className="text-xs text-aiesec-text-muted">{post.authorRole} • {post.timeAgo}</p>
                        </div>
                      </div>
                    </div>

                    {/* Contenu formaté */}
                    <p className="text-sm text-aiesec-text whitespace-pre-line leading-relaxed">{post.content}</p>

                    {/* Barre d'interactions */}
                    <div className="flex items-center justify-between pt-2 border-t border-aiesec-border text-xs text-aiesec-text-muted">
                      <button 
                        onClick={() => handleToggleLike(post.id, user.id)}
                        className={`flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-aiesec-background transition-colors cursor-pointer ${post.isLiked ? "text-red-500 font-semibold" : ""}`}
                      >
                        <Heart className={`w-4 h-4 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
                        <span>{post.likes ? post.likes.length : 0} Like{(post.likes?.length || 0) > 1 ? "s" : ""}</span>
                      </button>

                      <button 
                        onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
                        className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-aiesec-background transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.comments.length} Commentaire{post.comments.length > 1 ? "s" : ""}</span>
                      </button>

                      <button className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-aiesec-background transition-colors cursor-pointer">
                        <Share2 className="w-4 h-4" />
                        <span>Partager</span>
                      </button>
                    </div>

                    {/* Section Commentaires */}
                    {activeCommentPostId === post.id && (
                      <div className="pt-3 border-t border-aiesec-border space-y-3">
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="bg-aiesec-background p-2.5 rounded-xl text-xs space-y-1">
                              <span className="font-bold text-aiesec-text">{comment.authorName}</span>
                              <p className="text-aiesec-text-muted">{comment.content}</p>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Écrire un commentaire..."
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="flex-1 bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            className="bg-aiesec-blue text-white p-2 rounded-xl hover:bg-aiesec-blue-dark transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })
            ) : (
              <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-8 text-center space-y-2">
                <Layers className="w-8 h-8 text-aiesec-text-muted mx-auto" />
                <p className="text-xs text-aiesec-text-muted font-medium">
                  Aucune publication dans la catégorie &quot;{activeFilter}&quot;.
                </p>
              </div>
            )}
          </div>
        </section>

        <WebRightPanel />
      </main>

      {/* Modale de création de publication multi-formats */}
      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="md:hidden">
        <BottomNavigation 
          activeTab="accueil" 
          onTabChange={() => {}} 
          onCreatePost={() => setIsModalOpen(true)}
        />
      </div>
    </div>
  );
}