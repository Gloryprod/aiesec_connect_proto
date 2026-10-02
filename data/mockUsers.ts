export interface UserProfile {
  id: string;
  email: string;
  password: string; // Pour les tests de connexion
  fullName: string;
  role: string;
  lc: string;
  country: string;
  bio: string;
  avatar: string;
  skills: string[];
  experiences: {
    role: string;
    department: string;
    period: string;
    description: string;
  }[];
  journey: {
    year: string;
    role: string;
    lc: string;
  }[];
  recognitions: string[];
  connections?: string[];
}

export const MOCK_USERS: UserProfile[] = [
  {
    id: "usr-01",
    email: "armel.ahouadi@aiesec.net",
    password: "password123",
    fullName: "Armel AHOUADI",
    role: "Team Leader",
    lc: "LC Abomey-Calavi",
    country: "Bénin",
    bio: "Passionné par le développement du potentiel humain et l'impact social à travers le leadership de la jeunesse.",
    avatar: "AA",
    skills: ["Leadership", "Project Management", "Public Speaking", "Event Management"],
    experiences: [
      {
        role: "Team Leader",
        department: "Talent Management (TM)",
        period: "2025 - Présent",
        description: "Gestion du recrutement, de l'engagement et de la rétention des membres du comité local."
      },
      {
        role: "Team Member",
        department: "Outgoing Global Volunteer (oGV)",
        period: "2024 - 2025",
        description: "Accompagnement des jeunes dans la réalisation de leurs projets de volontariat à l'international."
      }
    ],
    journey: [
      { year: "2024", role: "Team Member", lc: "LC Abomey-Calavi" },
      { year: "2025", role: "Team Leader", lc: "LC Abomey-Calavi" }
    ],
    recognitions: ["Member of the Month — August 2026", "Top Contributor oGV 2024"],
    connections: []
  },
  {
    id: "usr-02",
    email: "sonia.mensah@aiesec.net",
    password: "password123",
    fullName: "Sonia MENSAH",
    role: "Vice President",
    lc: "LC Cotonou",
    country: "Bénin",
    bio: "Engagée pour l'apprentissage interculturel et l'autonomisation des jeunes leaders en Afrique de l'Ouest.",
    avatar: "SM",
    skills: ["International Relations", "Sales & Marketing", "Strategic Planning", "Negotiation"],
    experiences: [
      {
        role: "VP Incoming Global Talent (iGT)",
        department: "iGT",
        period: "2025 - Présent",
        description: "Développement des partenariats entreprises pour accueillir des stagiaires internationaux."
      },
      {
        role: "Team Leader",
        department: "Business Development",
        period: "2024 - 2025",
        description: "Négociation de partenariats financiers et logistiques pour les conférences locales."
      }
    ],
    journey: [
      { year: "2023", role: "Team Member", lc: "LC Cotonou" },
      { year: "2024", role: "Team Leader", lc: "LC Cotonou" },
      { year: "2025", role: "VP iGT", lc: "LC Cotonou" }
    ],
    recognitions: ["Collaboration Champion — 2025", "Best VP Performance Q1 2026"],
    connections: []
  },
  {
    id: "usr-03",
    email: "gloria.ouinsou@aiesec.net",
    password: "password123",
    fullName: "Gloria OUINSOU",
    role: "Local Committee President",
    lc: "LTS Benin",
    country: "Bénin",
    bio: "Full-stack developer & AIESECer. Je construis des ponts technologiques et humains pour un impact durable.",
    avatar: "GO",
    skills: ["Full-Stack Development", "UI/UX Design", "Team Management", "Agile Methodology"],
    experiences: [
      {
        role: "Local Committee President (LCP)",
        department: "Executive Board",
        period: "2025 - Présent",
        description: "Orientation stratégique, gouvernance et représentation institutionnelle de l'entité."
      },
      {
        role: "VP Information Technology / Marketing",
        department: "MKT/IT",
        period: "2024 - 2025",
        description: "Digitalisation des processus internes et gestion des campagnes de communication."
      }
    ],
    journey: [
      { year: "2022", role: "Member", lc: "LTS Benin" },
      { year: "2023", role: "Team Leader", lc: "LTS Benin" },
      { year: "2024", role: "VP MKT/IT", lc: "LTS Benin" },
      { year: "2025", role: "LCP", lc: "LTS Benin" }
    ],
    recognitions: ["Most Improved Entity Award 2025", "Leadership Excellence Award 2026"],
    connections: []
  }
];