// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/context/AuthContext";
// import { useNotifications } from "@/context/NotificationContext";
// import { WebHeader } from "@/components/layout/WebHeader";
// import { MobileHeader } from "@/components/layout/MobileHeader";
// import { BottomNavigation } from "@/components/layout/BottomNavigation";
// import { WebSidebar } from "@/components/layout/WebSidebar";
// import { WebRightPanel } from "@/components/layout/WebRightPanel";
// import { StoriesBar } from "@/components/feed/StoriesBar";
// import { Heart, MessageSquare, Share2, Image as ImageIcon, Send, X } from "lucide-react";
// import { useData } from "@/context/DataContext";
// import { NotificationItem } from "@/data/mockNotification";

// interface Comment {
//   id: string;
//   authorName: string;
//   content: string;
//   createdAt: string;
// }

// interface Post {
//   id: string;
//   authorId: string;
//   authorName: string;
//   authorRole: string;
//   authorAvatar: string;
//   timeAgo: string;
//   content: string;
//   isLiked: boolean;
//   likes: string[]; // Tableau contenant les IDs des utilisateurs ayant liké
//   comments: Comment[];
//   createdAt: number;
// }

// export default function HomePage() {
//   const { user, isAuthenticated, isLoading } = useAuth();
//   const { posts, addPost, toggleLike, addComment } = useData();
//   const { addNotification } = useNotifications(); // Hook des notifications
//   const router = useRouter();

//   // Redirection si non authentifié
//   useEffect(() => {
//     if (!isLoading && (!isAuthenticated || !user)) {
//       router.push("/login");
//     }
//   }, [isLoading, isAuthenticated, user, router]);

//   // États pour la création de publication
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [newPostText, setNewPostText] = useState("");

//   // État pour la section commentaire active
//   const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
//   const [commentInput, setCommentInput] = useState("");

//   if (isLoading || !user || !isAuthenticated) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-aiesec-background">
//         <div className="w-8 h-8 border-4 border-aiesec-blue border-t-transparent rounded-full animate-spin" />
//       </div>
//     );
//   }

//   // --- Actions ---

//   // Publier un nouveau message
//   const handleCreatePost = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!newPostText.trim()) return;

//     addPost(newPostText, user);
//     setNewPostText("");
//     setIsModalOpen(false);
//   };

//   // Basculer le Like + Génération de la notification
//   const handleToggleLike = (postId: string, userId: string) => {
//     const post = posts.find((p) => p.id === postId);
//     if (!post) return;

//     const willBeLiked = !post.isLiked;
//     toggleLike(postId, userId);

//     // Si l'utilisateur aime le post et qu'il n'en est pas l'auteur
//     if (willBeLiked && post.authorId !== user.id) {
//       const newNotification: NotificationItem = {
//         id: `notif-like-${Date.now()}`,
//         recipientId: post.authorId,
//         sender: {
//           id: user.id,
//           fullName: user.fullName,
//           avatar: user.fullName.charAt(0),
//           role: user.role || "Membre",
//         },
//         type: "post_like",
//         title: "Mention J'aime",
//         message: `${user.fullName} a aimé votre publication.`,
//         createdAt: new Date().toISOString(),
//         isRead: false,
//         actions: [
//           {
//             id: `act-like-${Date.now()}`,
//             label: "Voir le post",
//             type: "LINK",
//             variant: "secondary",
//             targetUrl: `/posts/${post.id}`,
//           },
//         ],
//       };

//       addNotification(newNotification);
//     }
//   };

//   // Ajouter un commentaire + Génération de la notification
//   const handleAddComment = (postId: string) => {
//     if (!commentInput.trim()) return;

//     const post = posts.find((p) => p.id === postId);
//     if (!post) return;

//     const commentText = commentInput.trim();
//     addComment(postId, commentText, user);

//     // Envoyer une notification si l'auteur du commentaire n'est pas le propriétaire du post
//     if (post.authorId !== user.id) {
//       const newNotification: NotificationItem = {
//         id: `notif-comment-${Date.now()}`,
//         recipientId: post.authorId,
//         sender: {
//           id: user.id,
//           fullName: user.fullName,
//           avatar: user.fullName.charAt(0),
//           role: user.role || "Membre",
//         },
//         type: "post_comment",
//         title: "Nouveau commentaire",
//         message: `${user.fullName} a commenté : "${commentText.length > 30 ? commentText.substring(0, 30) + "..." : commentText}"`,
//         createdAt: new Date().toISOString(),
//         isRead: false,
//         actions: [
//           {
//             id: `act-comment-${Date.now()}`,
//             label: "Répondre",
//             type: "LINK",
//             variant: "primary",
//             targetUrl: `/posts/${post.id}`,
//           },
//         ],
//       };

//       addNotification(newNotification);
//     }

//     setCommentInput("");
//   };

//   return (
//     <div className="min-h-screen bg-aiesec-background flex flex-col">
//       <WebHeader />
//       <div className="md:hidden"><MobileHeader /></div>

//       <main className="flex-1 max-w-7xl w-full mx-auto px-0 md:px-6 py-0 md:py-6 flex gap-6">
//         <WebSidebar activeTab="accueil" onTabChange={() => {}} />

//         <section className="flex-1 max-w-xl mx-auto w-full pb-20 md:pb-6 space-y-4">
//           <StoriesBar stories={[{ id: "0", name: "Créer", avatar: "", isCreate: true }, { id: "1", name: user.fullName.split(" ")[0], avatar: "" }]} />

//           {/* Zone de création */}
//           <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-4 mx-4 md:mx-0 shadow-sm">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-aiesec-blue/10 flex items-center justify-center text-aiesec-blue font-bold">
//                 {user.fullName.charAt(0)}
//               </div>
//               <button
//                 onClick={() => setIsModalOpen(true)}
//                 className="flex-1 text-left px-4 py-2.5 bg-aiesec-background hover:bg-aiesec-surface-soft border border-aiesec-border rounded-full text-xs text-aiesec-text-muted transition-colors cursor-pointer"
//               >
//                 What&apos;s on your mind, {user.fullName.split(" ")[0]} ?
//               </button>
//             </div>
//           </div>

//           {/* Liste des Publications */}
//           <div className="px-4 md:px-0 space-y-4">
//             {posts.map((post) => (
//               <article key={post.id} className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-4 shadow-sm space-y-3">
//                 {/* En-tête auteur */}
//                 <div className="flex items-center justify-between">
//                   <div 
//                     onClick={() => router.push(`/home/membres/${post.authorId}`)}
//                     className="flex items-center gap-3 cursor-pointer group"
//                   >
//                     <div className="w-10 h-10 rounded-full bg-aiesec-blue/10 flex items-center justify-center font-bold text-aiesec-blue group-hover:ring-2 ring-aiesec-blue transition-all">
//                       {post.authorName.charAt(0)}
//                     </div>
//                     <div>
//                       <h3 className="text-sm font-bold text-aiesec-text group-hover:text-aiesec-blue transition-colors">
//                         {post.authorName}
//                       </h3>
//                       <p className="text-xs text-aiesec-text-muted">{post.authorRole} • {post.timeAgo}</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contenu */}
//                 <p className="text-sm text-aiesec-text whitespace-pre-line">{post.content}</p>

//                 {/* Barre d'interactions */}
//                 <div className="flex items-center justify-between pt-2 border-t border-aiesec-border text-xs text-aiesec-text-muted">
//                   <button 
//                     onClick={() => handleToggleLike(post.id, user.id)}
//                     className={`flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-aiesec-background transition-colors ${post.isLiked ? "text-red-500 font-semibold" : ""}`}
//                   >
//                     <Heart className={`w-4 h-4 ${post.isLiked ? "fill-red-500 text-red-500" : ""}`} />
//                     <span>{post.likes ? post.likes.length : 0} Like{(post.likes?.length || post.likes.length) > 1 ? "s" : ""}</span>
//                   </button>

//                   <button 
//                     onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)}
//                     className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-aiesec-background transition-colors"
//                   >
//                     <MessageSquare className="w-4 h-4" />
//                     <span>{post.comments.length} Commentaire{post.comments.length > 1 ? "s" : ""}</span>
//                   </button>

//                   <button className="flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-aiesec-background transition-colors">
//                     <Share2 className="w-4 h-4" />
//                     <span>Partager</span>
//                   </button>
//                 </div>

//                 {/* Section Commentaires */}
//                 {activeCommentPostId === post.id && (
//                   <div className="pt-3 border-t border-aiesec-border space-y-3">
//                     <div className="space-y-2 max-h-40 overflow-y-auto">
//                       {post.comments.map((comment) => (
//                         <div key={comment.id} className="bg-aiesec-background p-2.5 rounded-xl text-xs space-y-1">
//                           <span className="font-bold text-aiesec-text">{comment.authorName}</span>
//                           <p className="text-aiesec-text-muted">{comment.content}</p>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex gap-2">
//                       <input
//                         type="text"
//                         placeholder="Écrire un commentaire..."
//                         value={commentInput}
//                         onChange={(e) => setCommentInput(e.target.value)}
//                         className="flex-1 bg-aiesec-background border border-aiesec-border rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
//                       />
//                       <button
//                         onClick={() => handleAddComment(post.id)}
//                         className="bg-aiesec-blue text-white p-2 rounded-xl hover:bg-aiesec-blue-dark transition-colors"
//                       >
//                         <Send className="w-3.5 h-3.5" />
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </article>
//             ))}
//           </div>
//         </section>

//         <WebRightPanel />
//       </main>

//       {/* Modale de création de publication */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-aiesec-surface border border-aiesec-border w-full max-w-lg rounded-2xl p-5 space-y-4 shadow-xl">
//             <div className="flex justify-between items-center border-b border-aiesec-border pb-3">
//               <h3 className="font-bold text-aiesec-text">Créer une publication</h3>
//               <button onClick={() => setIsModalOpen(false)} className="text-aiesec-text-muted hover:text-aiesec-text">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <textarea
//               rows={4}
//               value={newPostText}
//               onChange={(e) => setNewPostText(e.target.value)}
//               placeholder="What's on your mind?"
//               className="w-full bg-aiesec-background border border-aiesec-border rounded-xl p-3 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
//             />

//             <div className="flex justify-between items-center pt-2">
//               <button className="flex items-center gap-2 text-xs text-aiesec-text-muted hover:text-aiesec-blue">
//                 <ImageIcon className="w-4 h-4" />
//                 <span>Ajouter une image</span>
//               </button>

//               <button
//                 onClick={handleCreatePost}
//                 className="bg-aiesec-blue text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-aiesec-blue-dark transition-colors"
//               >
//                 Publier
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="md:hidden"><BottomNavigation activeTab="accueil" onTabChange={() => {}} /></div>
//     </div>
//   );
// }

"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useNotifications } from "@/context/NotificationContext";
import { WebHeader } from "@/components/layout/WebHeader";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { WebSidebar } from "@/components/layout/WebSidebar";
import { WebRightPanel } from "@/components/layout/WebRightPanel";
import { StoriesBar } from "@/components/feed/StoriesBar";
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

export default function HomePage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { posts, toggleLike, addComment } = useData();
  const { addNotification } = useNotifications();
  const router = useRouter();

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
      const newNotification: NotificationItem = {
        id: `notif-like-${Date.now()}`,
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
            id: `act-like-${Date.now()}`,
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
          <StoriesBar stories={[{ id: "0", name: "Créer", avatar: "", isCreate: true }, { id: "1", name: user.fullName.split(" ")[0], avatar: "" }]} />

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