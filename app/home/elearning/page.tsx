"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { WebHeader } from "@/components/layout/WebHeader";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { WebSidebar } from "@/components/layout/WebSidebar";
import { WebRightPanel } from "@/components/layout/WebRightPanel";
import { 
  GraduationCap, 
  Clock, 
  BookOpen, 
  Search, 
  PlayCircle, 
  CheckCircle2, 
  X, 
  Share2,
} from "lucide-react";
import { MOCK_COURSES, Course } from "@/data/mockCourses";
import toast from "react-hot-toast";

export default function ELearningPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // Redirection si non connecté
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

  // Filtrage des cours
  const filteredCourses = MOCK_COURSES.filter((course) => {
    const matchesCategory = selectedCategory === "Tous" || course.category === selectedCategory;
    const matchesQuery = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const categories = ["Tous", "AIESEC Knowledge", "Leadership", "Management", "Soft Skills"];

  const toggleModuleCompletion = (moduleId: string) => {
    if (completedModules.includes(moduleId)) {
      setCompletedModules(completedModules.filter((id) => id !== moduleId));
    } else {
      setCompletedModules([...completedModules, moduleId]);
      toast.success("Module validé ! 🎉");
    }
  };

  const handleShareCourse = (course: Course) => {
    const shareText = `🎓 Découvre la formation "${course.title}" sur AIESEC Connect !\n\nDurée: ${course.duration} | Niveau: ${course.level}`;
    navigator.clipboard.writeText(shareText);
    toast.success("Lien de la formation copié !");
  };

  return (
    <div className="min-h-screen bg-aiesec-background flex flex-col">
      <WebHeader />
      <div className="md:hidden"><MobileHeader title="E-Learning" /></div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-0 md:px-6 py-0 md:py-6 flex gap-6">
        <WebSidebar activeTab="learning" onTabChange={() => {}} />

        <section className="flex-1 max-w-2xl mx-auto w-full pb-20 md:pb-6 space-y-6">
          
          {/* En-tête Bannières E-learning */}
          <div className="bg-linear-to-r from-aiesec-blue to-blue-700 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
            <div className="relative z-10 space-y-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase">
                AIESEC Academy
              </span>
              <h1 className="text-xl font-extrabold">Renforcez vos compétences</h1>
              <p className="text-xs text-blue-100 max-w-md leading-relaxed">
                Accédez à des formations exclusives conçues par des formateurs certifiés pour booster votre parcours AIESEC et professionnel.
              </p>
            </div>
            <GraduationCap className="absolute -right-4 -bottom-4 w-36 h-36 text-white/10" />
          </div>

          {/* Barre de Recherche & Filtres */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-aiesec-text-muted absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-aiesec-surface border border-aiesec-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-aiesec-text focus:outline-none focus:ring-1 focus:ring-aiesec-blue"
              />
            </div>

            {/* Pills de Catégories */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? "bg-aiesec-blue text-white"
                      : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-muted hover:text-aiesec-text"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grille des Formations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-aiesec-surface border border-aiesec-border rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
              >
                <div className="h-32 relative bg-aiesec-border">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 right-2 bg-aiesec-surface/90 backdrop-blur-md text-aiesec-blue text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {course.level}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-aiesec-blue uppercase tracking-wider">
                      {course.category}
                    </span>
                    <h3 className="text-sm font-bold text-aiesec-text line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-aiesec-text-muted line-clamp-2">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-aiesec-border flex items-center justify-between text-[11px] text-aiesec-text-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-aiesec-blue" />
                      {course.duration}
                    </span>
                    <button
                      onClick={() => setSelectedCourse(course)}
                      className="bg-aiesec-blue/10 hover:bg-aiesec-blue/20 text-aiesec-blue px-3 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Suivre</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <WebRightPanel />
      </main>

      {/* Modale de Consultation du Cours */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-aiesec-surface border border-aiesec-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-4 border-b border-aiesec-border flex items-center justify-between sticky top-0 bg-aiesec-surface z-10">
              <div>
                <span className="text-[10px] font-bold text-aiesec-blue">{selectedCourse.category}</span>
                <h2 className="text-sm font-bold text-aiesec-text">{selectedCourse.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 text-aiesec-text-muted hover:text-aiesec-text rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-5 flex-1">
              <p className="text-xs text-aiesec-text leading-relaxed">{selectedCourse.description}</p>

              <div className="bg-aiesec-background p-3 rounded-xl border border-aiesec-border flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-aiesec-text">{selectedCourse.author}</p>
                  <p className="text-[10px] text-aiesec-text-muted">{selectedCourse.authorRole}</p>
                </div>
                <button
                  onClick={() => handleShareCourse(selectedCourse)}
                  className="p-2 bg-aiesec-surface border border-aiesec-border rounded-lg hover:bg-aiesec-background text-aiesec-blue transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Liste des Modules */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-aiesec-text flex items-center gap-1.5">
                  <PlayCircle className="w-4 h-4 text-aiesec-blue" /> Modules du cours
                </h3>

                {selectedCourse.modules.map((mod) => {
                  const isDone = completedModules.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      className="bg-aiesec-background border border-aiesec-border p-3 rounded-xl space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-aiesec-text">{mod.title}</span>
                        <button
                          onClick={() => toggleModuleCompletion(mod.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                            isDone
                              ? "bg-green-500/10 text-green-600 border border-green-500/20"
                              : "bg-aiesec-surface border border-aiesec-border text-aiesec-text-muted hover:text-aiesec-text"
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{isDone ? "Terminé" : "Marquer comme fait"}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-aiesec-text-muted leading-normal">{mod.content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden"><BottomNavigation activeTab="learning" onTabChange={() => {}} /></div>
    </div>
  );
}