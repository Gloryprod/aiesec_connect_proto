export interface CourseModule {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  content: string;
}

export interface Course {
  id: string;
  title: string;
  category: "Leadership" | "AIESEC Knowledge" | "Management" | "Soft Skills";
  level: "Débutant" | "Intermédiaire" | "Avancé";
  duration: string;
  author: string;
  authorRole: string;
  description: string;
  thumbnail: string;
  modules: CourseModule[];
  resourcesCount: number;
}

export const MOCK_COURSES: Course[] = [
  {
    id: "crs-101",
    title: "Introduction aux Valeurs & au LDM AIESEC",
    category: "AIESEC Knowledge",
    level: "Débutant",
    duration: "45 min",
    author: "MC Vice President TM",
    authorRole: "AIESEC au Bénin",
    description: "Découvrez le Leadership Development Model (LDM) d'AIESEC, nos 6 valeurs fondamentales et comment les incarner au quotidien dans vos rôles.",
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
    resourcesCount: 3,
    modules: [
      {
        id: "mod-1",
        title: "1. Histoire & Mission d'AIESEC",
        duration: "10 min",
        content: "AIESEC a été fondée en 1948 pour développer le potentiel humain et la paix mondiale..."
      },
      {
        id: "mod-2",
        title: "2. Les 4 Qualités du LDM",
        duration: "20 min",
        content: "Self-aware, Solution-oriented, World Citizen, Empowering Others."
      },
      {
        id: "mod-3",
        title: "3. Appliquer les valeurs dans son LC",
        duration: "15 min",
        content: "Striving for Excellence, Living Diversity, Enjoying Participation..."
      }
    ]
  },
  {
    id: "crs-102",
    title: "Gestion de Projet & Ventes (oGX / icX)",
    category: "Management",
    level: "Intermédiaire",
    duration: "1h 15 min",
    author: "National Team Trainer",
    authorRole: "AIESEC International Alumni",
    description: "Techniques de prospection B2B, gestion de funnel de conversion et expérience participants pour les échanges internationaux.",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80",
    resourcesCount: 5,
    modules: [
      {
        id: "mod-1",
        title: "1. Stratégie de Prospection & Partnerships",
        duration: "25 min",
        content: "Comment structurer une proposition de valeur pour les entreprises partenaires..."
      },
      {
        id: "mod-2",
        title: "2. Suivi du Customer Flow",
        duration: "30 min",
        content: "De l'Avis de candidature jusqu'au Realized et Complete."
      }
    ]
  },
  {
    id: "crs-103",
    title: "Prise de Parole en Public & Storytelling",
    category: "Soft Skills",
    level: "Débutant",
    duration: "50 min",
    author: "Armel Dossou",
    authorRole: "LC Vice President F&L",
    description: "Développez votre charisme, maîtrisez la communication non-verbale et captivez votre audience lors des réunions et conférences.",
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80",
    resourcesCount: 2,
    modules: [
      {
        id: "mod-1",
        title: "1. Structure d'un discours captivant",
        duration: "20 min",
        content: "Accroche, corps du message, appel à l'action."
      }
    ]
  }
];