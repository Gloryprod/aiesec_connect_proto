"use client";

import { useState, useMemo } from "react";
import { useData, Post } from "@/context/DataContext";
import { UserProfile } from "@/data/mockUsers";

export interface SearchResults {
  members: UserProfile[];
  posts: Post[];
  hasResults: boolean;
}

export function useGlobalSearch() {
  const { users, posts } = useData();
  const [query, setQuery] = useState("");

  const results = useMemo<SearchResults>(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return { members: [], posts: [], hasResults: false };
    }

    // 1. Filtrer les membres (nom, rôle, comité, compétences)
    const filteredMembers = users.filter((u) => {
      const matchName = u.fullName?.toLowerCase().includes(trimmed);
      const matchRole = u.role?.toLowerCase().includes(trimmed);
      const matchLc = u.lc?.toLowerCase().includes(trimmed);
      const matchSkills = u.skills?.some((s) => s.toLowerCase().includes(trimmed));
      return matchName || matchRole || matchLc || matchSkills;
    });

    // 2. Filtrer les publications (contenu, auteur, type)
    const filteredPosts = posts.filter((p) => {
      const matchContent = p.content?.toLowerCase().includes(trimmed);
      const matchAuthor = p.authorName?.toLowerCase().includes(trimmed);
      return matchContent || matchAuthor;
    });

    return {
      members: filteredMembers.slice(0, 5), // Limite à 5 résultats rapides
      posts: filteredPosts.slice(0, 5),
      hasResults: filteredMembers.length > 0 || filteredPosts.length > 0,
    };
  }, [query, users, posts]);

  return {
    query,
    setQuery,
    results,
    clearSearch: () => setQuery(""),
  };
}