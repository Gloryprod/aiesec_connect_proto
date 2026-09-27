# Instructions Design System — AIESEC Connect

Ce projet utilise **Next.js (App Router)** et **Tailwind CSS v4**.

## Règles d'utilisation du Design System

### 1. Couleurs (STRICTEMENT RÉSERVÉES)
Utilise TOUJOURS les classes Tailwind personnalisées définies dans le fichier CSS. Ne génère JAMAIS de couleurs hexadécimales brutes ni les couleurs par défaut de Tailwind quand une couleur du DS existe.

- **Brand:**
  - `bg-aiesec-navy`, `text-aiesec-navy`, `border-aiesec-navy` (#172b78)
  - `bg-aiesec-blue`, `text-aiesec-blue` (#263de0)
  - `bg-aiesec-indigo`, `text-aiesec-indigo` (#4f46e5)
  - `bg-aiesec-purple`, `text-aiesec-purple` (#6536e8)
  - `bg-aiesec-purple-light`, `text-aiesec-purple-light` (#8b5cf6)

- **Backgrounds & Surfaces:**
  - Background principal: `bg-aiesec-background` (#f5f6fc)
  - Cartes & Modales: `bg-aiesec-surface` (#ffffff)
  - Subsections & Highlights: `bg-aiesec-surface-soft` (#eef0ff)
  - Bordures: `border-aiesec-border` (#e8ecf5)

- **Typography Colors:**
  - Titres et texte principal: `text-aiesec-text`
  - Texte secondaire: `text-aiesec-text-secondary`
  - Textes discrets / Placeholders: `text-aiesec-text-muted`

- **Status:**
  - `bg-aiesec-success` / `text-aiesec-success` (#16a34a)
  - `bg-aiesec-warning` / `text-aiesec-warning` (#f59e0b)
  - `bg-aiesec-danger` / `text-aiesec-danger` (#e11d48)
  - `bg-aiesec-info` / `text-aiesec-info` (#0ea5e9)

### 2. Normes d'intégration des Composants UI
- Utilise **React Server Components** par défaut. N'ajoute `'use client'` que si une interactivité (state, event handler) est nécessaire.
- Priorise des coins arrondis doux (`rounded-xl` ou `rounded-2xl`).
- Préfère des ombres légères et subtiles pour faire ressortir `bg-aiesec-surface` du fond `bg-aiesec-background`.