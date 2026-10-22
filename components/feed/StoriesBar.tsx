// "use client";

// import React, { useState, useEffect } from "react";
// import { Plus, X, ChevronLeft, ChevronRight, Image as ImageIcon, Send } from "lucide-react";
// import toast from "react-hot-toast";

// export interface StoryItem {
//   id: string;
//   type: "image" | "text";
//   content: string;
//   bgGradient?: string;
//   createdAt: string;
// }

// export interface UserStory {
//   id: string;
//   userId: string;
//   name: string;
//   avatar: string;
//   isCreate?: boolean;
//   items?: StoryItem[];
// }

// interface StoriesBarProps {
//   stories: UserStory[];
//   currentUserAvatar?: string;
//   onAddStory?: (newStoryItem: StoryItem) => void;
// }

// export const StoriesBar: React.FC<StoriesBarProps> = ({
//   stories,
//   currentUserAvatar,
//   onAddStory,
// }) => {
//   // États pour la création et la lecture
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [selectedUserStoryIndex, setSelectedUserStoryIndex] = useState<number | null>(null);
//   const [activeItemIndex, setActiveItemIndex] = useState(0);

//   // Formulaire de création
//   const [storyText, setStoryText] = useState("");
//   const [selectedGradient, setSelectedGradient] = useState("from-blue-600 to-indigo-900");

//   const gradients = [
//     "from-blue-600 to-indigo-900",
//     "from-purple-600 to-pink-500",
//     "from-emerald-500 to-teal-800",
//     "from-amber-500 to-orange-600",
//   ];

//   // Gestion de la fermeture / navigation dans le Viewer
//   const activeUserStory = selectedUserStoryIndex !== null ? stories[selectedUserStoryIndex] : null;
//   const activeItems = activeUserStory?.items || [];

//   // Défilement automatique dans la story ouverte
//   useEffect(() => {
//     if (selectedUserStoryIndex === null || activeItems.length === 0) return;

//     const timer = setTimeout(() => {
//       if (activeItemIndex < activeItems.length - 1) {
//         setActiveItemIndex((prev) => prev + 1);
//       } else if (selectedUserStoryIndex < stories.length - 1) {
//         // Passer à l'utilisateur suivant s'il y en a un
//         setSelectedUserStoryIndex((prev) => (prev !== null ? prev + 1 : null));
//         setActiveItemIndex(0);
//       } else {
//         // Fermer à la fin de toutes les stories
//         setSelectedUserStoryIndex(null);
//         setActiveItemIndex(0);
//       }
//     }, 5000); // 5 secondes par story

//     return () => clearTimeout(timer);
//   }, [selectedUserStoryIndex, activeItemIndex, activeItems.length, stories.length]);

//   const handleCreateSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!storyText.trim()) {
//       toast.error("Veuillez saisir un texte pour votre story.");
//       return;
//     }

//     const newItem: StoryItem = {
//       id: `story-${Date.now()}`,
//       type: "text",
//       content: storyText.trim(),
//       bgGradient: selectedGradient,
//       createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
//     };

//     if (onAddStory) onAddStory(newItem);
//     toast.success("Story ajoutée avec succès ! 🎉");
//     setStoryText("");
//     setIsCreateOpen(false);
//   };

//   return (
//     <>
//       {/* 1. Barre de raccourcis Stories */}
//       <div className="flex items-center gap-3 overflow-x-auto py-3 px-4 no-scrollbar rounded-2xl border border-aiesec-border bg-aiesec-surface shadow-xs">
//         {/* Option Ajouter une story (Toi) */}
//         <div
//           onClick={() => setIsCreateOpen(true)}
//           className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
//         >
//           <div className="w-14 h-14 rounded-full p-0.5 flex items-center justify-center bg-aiesec-surface-soft border-2 border-dashed border-aiesec-blue group-hover:scale-105 transition-transform">
//             <div className="w-full h-full rounded-full bg-aiesec-blue/10 flex items-center justify-center text-aiesec-blue font-bold">
//               <Plus className="w-6 h-6" />
//             </div>
//           </div>
//           <span className="text-[11px] font-sans text-aiesec-text font-semibold truncate max-w-[60px] text-center">
//             Votre story
//           </span>
//         </div>

//         {/* Liste des stories des membres */}
//         {stories.map((story, index) => {
//           if (story.isCreate) return null; // Ignorer les doublons du bouton de création

//           return (
//             <div
//               key={story.id}
//               onClick={() => {
//                 if (story.items && story.items.length > 0) {
//                   setSelectedUserStoryIndex(index);
//                   setActiveItemIndex(0);
//                 } else {
//                   toast("Aucune story récente.", { icon: "ℹ️" });
//                 }
//               }}
//               className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
//             >
//               <div className="w-14 h-14 rounded-full p-0.5 flex items-center justify-center bg-gradient-to-tr from-aiesec-blue to-purple-600 group-hover:scale-105 transition-transform">
//                 <img
//                   src={story.avatar || "https://via.placeholder.com/150"}
//                   alt={story.name}
//                   className="w-full h-full rounded-full object-cover border-2 border-aiesec-surface"
//                 />
//               </div>
//               <span className="text-[11px] font-sans text-aiesec-text-secondary truncate max-w-[60px] text-center">
//                 {story.name}
//               </span>
//             </div>
//           );
//         })}
//       </div>

//       {/* 2. Modale de Création de Story */}
//       {isCreateOpen && (
//         <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
//           <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative">
//             <div className="flex justify-between items-center border-b border-aiesec-border pb-3">
//               <h3 className="text-sm font-bold text-aiesec-text">Créer une Story</h3>
//               <button onClick={() => setIsCreateOpen(false)} className="text-aiesec-text-muted hover:text-aiesec-text">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Aperçu Dynamique */}
//             <div
//               className={`w-full h-56 rounded-xl bg-gradient-to-br ${selectedGradient} p-4 flex items-center justify-center text-center text-white font-bold text-sm shadow-inner relative overflow-hidden`}
//             >
//               <p className="z-10 break-words max-w-[90%]">
//                 {storyText || "Votre texte apparaîtra ici..."}
//               </p>
//             </div>

//             {/* Sélecteur de couleur de fond */}
//             <div className="flex justify-center gap-2">
//               {gradients.map((grad) => (
//                 <button
//                   key={grad}
//                   type="button"
//                   onClick={() => setSelectedGradient(grad)}
//                   className={`w-7 h-7 rounded-full bg-gradient-to-br ${grad} border-2 ${
//                     selectedGradient === grad ? "border-white scale-110 shadow-md" : "border-transparent"
//                   }`}
//                 />
//               ))}
//             </div>

//             {/* Formulaire */}
//             <form onSubmit={handleCreateSubmit} className="space-y-3">
//               <textarea
//                 rows={2}
//                 placeholder="Exprimez-vous en quelques mots..."
//                 value={storyText}
//                 onChange={(e) => setStoryText(e.target.value)}
//                 className="w-full bg-aiesec-background border border-aiesec-border rounded-xl p-3 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
//               />
//               <button
//                 type="submit"
//                 className="w-full bg-aiesec-blue text-white py-2.5 rounded-xl text-xs font-bold hover:bg-aiesec-blue-dark transition-colors flex items-center justify-center gap-2 cursor-pointer"
//               >
//                 <Send className="w-4 h-4" />
//                 <span>Publier la Story</span>
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* 3. Visionneuse Plein Écran de Story (Story Viewer) */}
//       {activeUserStory && activeItems.length > 0 && (
//         <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
//           <div className="relative w-full max-w-sm h-[85vh] bg-black rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
            
//             {/* Barres de progression en haut */}
//             <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
//               {activeItems.map((_, idx) => (
//                 <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
//                   <div
//                     className={`h-full bg-white transition-all duration-100 ${
//                       idx < activeItemIndex
//                         ? "w-full"
//                         : idx === activeItemIndex
//                         ? "w-full animate-pulse"
//                         : "w-0"
//                     }`}
//                   />
//                 </div>
//               ))}
//             </div>

//             {/* En-tête Utilisateur */}
//             <div className="absolute top-6 left-3 right-3 z-20 flex items-center justify-between text-white">
//               <div className="flex items-center gap-2">
//                 <img
//                   src={activeUserStory.avatar || "https://via.placeholder.com/150"}
//                   alt={activeUserStory.name}
//                   className="w-8 h-8 rounded-full border border-white/50 object-cover"
//                 />
//                 <div>
//                   <p className="text-xs font-bold leading-tight">{activeUserStory.name}</p>
//                   <p className="text-[10px] text-white/70">{activeItems[activeItemIndex]?.createdAt}</p>
//                 </div>
//               </div>
//               <button
//                 onClick={() => setSelectedUserStoryIndex(null)}
//                 className="p-1 bg-black/40 rounded-full hover:bg-black/70 text-white"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             {/* Contenu de la Story */}
//             <div
//               className={`w-full h-full flex items-center justify-center p-6 text-center text-white font-extrabold text-lg bg-gradient-to-br ${
//                 activeItems[activeItemIndex]?.bgGradient || "from-blue-600 to-indigo-900"
//               }`}
//             >
//               <p className="max-w-[90%] leading-relaxed">
//                 {activeItems[activeItemIndex]?.content}
//               </p>
//             </div>

//             {/* Boutons de navigation gauche / droite */}
//             {activeItemIndex > 0 && (
//               <button
//                 onClick={() => setActiveItemIndex((prev) => prev - 1)}
//                 className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-20"
//               >
//                 <ChevronLeft className="w-6 h-6" />
//               </button>
//             )}

//             {activeItemIndex < activeItems.length - 1 && (
//               <button
//                 onClick={() => setActiveItemIndex((prev) => prev + 1)}
//                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-20"
//               >
//                 <ChevronRight className="w-6 h-6" />
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

"use client";

import React, { useState, useEffect } from "react";
import { Plus, X, ChevronLeft, ChevronRight, Send } from "lucide-react";
import toast from "react-hot-toast";

export interface StoryItem {
  id: string;
  type: "image" | "text";
  content: string;
  bgGradient?: string;
  createdAt: string;
}

export interface UserStory {
  id: string;
  userId: string;
  name: string;
  avatar?: string; // Contient les initiales (ex: "GO", "AD")
  isCreate?: boolean;
  items?: StoryItem[];
}

interface StoriesBarProps {
  stories: UserStory[];
  onAddStory?: (newStoryItem: StoryItem) => void;
}

// Fonction pour générer des couleurs/dégradés uniques selon le nom du membre
const getAvatarColor = (name: string) => {
  const gradients = [
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
    "from-emerald-500 to-teal-600",
    "from-amber-500 to-orange-600",
    "from-rose-500 to-red-600",
    "from-cyan-500 to-blue-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

// Helper pour extraire proprement les initiales
const getInitials = (name: string, fallbackAvatar?: string) => {
  if (fallbackAvatar && fallbackAvatar.length <= 3) return fallbackAvatar.toUpperCase();
  if (!name) return "A";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export const StoriesBar: React.FC<StoriesBarProps> = ({
  stories,
  onAddStory,
}) => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedUserStoryIndex, setSelectedUserStoryIndex] = useState<number | null>(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);

  const [storyText, setStoryText] = useState("");
  const [selectedGradient, setSelectedGradient] = useState("from-blue-600 to-indigo-900");

  const gradients = [
    "from-blue-600 to-indigo-900",
    "from-purple-600 to-pink-500",
    "from-emerald-500 to-teal-800",
    "from-amber-500 to-orange-600",
  ];

  const activeUserStory = selectedUserStoryIndex !== null ? stories[selectedUserStoryIndex] : null;
  const activeItems = activeUserStory?.items || [];

  // Défilement automatique dans la story ouverte
  useEffect(() => {
    if (selectedUserStoryIndex === null || activeItems.length === 0) return;

    const timer = setTimeout(() => {
      if (activeItemIndex < activeItems.length - 1) {
        setActiveItemIndex((prev) => prev + 1);
      } else if (selectedUserStoryIndex < stories.length - 1) {
        setSelectedUserStoryIndex((prev) => (prev !== null ? prev + 1 : null));
        setActiveItemIndex(0);
      } else {
        setSelectedUserStoryIndex(null);
        setActiveItemIndex(0);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [selectedUserStoryIndex, activeItemIndex, activeItems.length, stories.length]);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyText.trim()) {
      toast.error("Veuillez saisir un texte pour votre story.");
      return;
    }

    const newItem: StoryItem = {
      id: `story-${Date.now()}`,
      type: "text",
      content: storyText.trim(),
      bgGradient: selectedGradient,
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (onAddStory) onAddStory(newItem);
    toast.success("Story ajoutée avec succès ! 🎉");
    setStoryText("");
    setIsCreateOpen(false);
  };

  return (
    <>
      {/* 1. Barre de raccourcis Stories */}
      <div className="flex items-center gap-3 overflow-x-auto py-3 px-4 no-scrollbar border border-aiesec-border bg-aiesec-surface shadow-xs">
        {/* Bouton Ajouter une story */}
        <div
          onClick={() => setIsCreateOpen(true)}
          className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full p-0.5 flex items-center justify-center bg-aiesec-surface-soft border-2 border-dashed border-aiesec-blue group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full bg-aiesec-blue/10 flex items-center justify-center text-aiesec-blue font-bold">
              <Plus className="w-6 h-6" />
            </div>
          </div>
          <span className="text-[11px] font-sans text-aiesec-text font-semibold truncate max-w-15 text-center">
            Votre story
          </span>
        </div>

        {/* Liste des stories des membres */}
        {stories.map((story, index) => {
          if (story.isCreate) return null;

          const initials = getInitials(story.name, story.avatar);
          const colorGradient = getAvatarColor(story.name);

          return (
            <div
              key={story.id}
              onClick={() => {
                if (story.items && story.items.length > 0) {
                  setSelectedUserStoryIndex(index);
                  setActiveItemIndex(0);
                } else {
                  toast("Aucune story récente.", { icon: "ℹ️" });
                }
              }}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
            >
              {/* Cercle dégradé externe (bORDURE STYLES STORY) */}
              <div className="w-14 h-14 rounded-full p-0.5 flex items-center justify-center bg-linear-to-tr from-aiesec-blue to-purple-600 group-hover:scale-105 transition-transform">
                {/* Pastille des initiales avec fond coloré dynamique */}
                <div
                  className={`w-full h-full rounded-full bg-linear-to-br ${colorGradient} text-white flex items-center justify-center font-bold text-xs border-2 border-aiesec-surface shadow-xs`}
                >
                  {initials}
                </div>
              </div>
              <span className="text-[11px] font-sans text-aiesec-text-secondary truncate max-w-15 text-center">
                {story.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* 2. Modale de Création de Story */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-aiesec-border pb-3">
              <h3 className="text-sm font-bold text-aiesec-text">Créer une Story</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-aiesec-text-muted hover:text-aiesec-text cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Aperçu Dynamique */}
            <div
              className={`w-full h-56 rounded-xl bg-linear-to-br ${selectedGradient} p-4 flex items-center justify-center text-center text-white font-bold text-sm shadow-inner relative overflow-hidden`}
            >
              <p className="z-10 wrap-break-words max-w-[90%]">
                {storyText || "Votre texte apparaîtra ici..."}
              </p>
            </div>

            {/* Palette de fond */}
            <div className="flex justify-center gap-2">
              {gradients.map((grad) => (
                <button
                  key={grad}
                  type="button"
                  onClick={() => setSelectedGradient(grad)}
                  className={`w-7 h-7 rounded-full bg-linear-to-br ${grad} border-2 cursor-pointer ${
                    selectedGradient === grad ? "border-white scale-110 shadow-md" : "border-transparent"
                  }`}
                />
              ))}
            </div>

            {/* Formulaire */}
            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <textarea
                rows={2}
                placeholder="Exprimez-vous en quelques mots..."
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                className="w-full bg-aiesec-background border border-aiesec-border rounded-xl p-3 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
              />
              <button
                type="submit"
                className="w-full bg-aiesec-blue text-white py-2.5 rounded-xl text-xs font-bold hover:bg-aiesec-blue-dark transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Publier la Story</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Visionneuse Plein Écran (Story Viewer) */}
      {activeUserStory && activeItems.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
          <div className="relative w-full max-w-sm h-[85vh] bg-black rounded-2xl overflow-hidden flex flex-col justify-between shadow-2xl">
            {/* Barres de progression */}
            <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
              {activeItems.map((_, idx) => (
                <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-white transition-all duration-100 ${
                      idx < activeItemIndex
                        ? "w-full"
                        : idx === activeItemIndex
                        ? "w-full animate-pulse"
                        : "w-0"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* En-tête Utilisateur dans le Viewer */}
            <div className="absolute top-6 left-3 right-3 z-20 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full bg-linear-to-br ${getAvatarColor(
                    activeUserStory.name
                  )} text-white flex items-center justify-center font-bold text-xs border border-white/50`}
                >
                  {getInitials(activeUserStory.name, activeUserStory.avatar)}
                </div>
                <div>
                  <p className="text-xs font-bold leading-tight">{activeUserStory.name}</p>
                  <p className="text-[10px] text-white/70">{activeItems[activeItemIndex]?.createdAt}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUserStoryIndex(null)}
                className="p-1 bg-black/40 rounded-full hover:bg-black/70 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenu de la Story */}
            <div
              className={`w-full h-full flex items-center justify-center p-6 text-center text-white font-extrabold text-lg bg-linear-to-br ${
                activeItems[activeItemIndex]?.bgGradient || "from-blue-600 to-indigo-900"
              }`}
            >
              <p className="max-w-[90%] leading-relaxed">
                {activeItems[activeItemIndex]?.content}
              </p>
            </div>

            {/* Navigation */}
            {activeItemIndex > 0 && (
              <button
                onClick={() => setActiveItemIndex((prev) => prev - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-20 cursor-pointer"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {activeItemIndex < activeItems.length - 1 && (
              <button
                onClick={() => setActiveItemIndex((prev) => prev + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/50 text-white rounded-full z-20 cursor-pointer"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};