import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";

export interface PostProps {
  id: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  timeAgo: string;
  content: string;
  image?: string;
  likesCount: number;
  commentsCount: number;
}

export const PostCard: React.FC<PostProps> = ({
  author,
  timeAgo,
  content,
  image,
  likesCount: initialLikes,
  commentsCount,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [hasLiked, setHasLiked] = useState(false);

  const handleLike = () => {
    setHasLiked(!hasLiked);
    setLikes(hasLiked ? likes - 1 : likes + 1);
  };

  return (
    <article className="bg-aiesec-surface border border-aiesec-border rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
      {/* En-tête de la publication */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-aiesec-surface-soft border border-aiesec-border flex items-center justify-center font-heading font-bold text-sm text-aiesec-blue shrink-0">
            {author.avatar ? (
              <img src={author.avatar} alt={author.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              author.name.substring(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm text-aiesec-navy leading-tight">
              {author.name}
            </h4>
            <p className="font-sans text-xs text-aiesec-text-secondary mt-0.5">
              {author.role} • <span className="text-aiesec-text-muted">{timeAgo}</span>
            </p>
          </div>
        </div>

        <button className="text-aiesec-text-muted hover:text-aiesec-navy p-1 rounded-lg transition-colors cursor-pointer">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Message de la publication */}
      <p className="font-sans text-sm text-aiesec-text leading-relaxed whitespace-pre-line">
        {content}
      </p>

      {/* Image optionnelle de la publication */}
      {image && (
        <div className="rounded-xl overflow-hidden border border-aiesec-border bg-aiesec-background max-h-80">
          <img src={image} alt="Contenu média" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Actions (J'aime, Commenter, Partager) */}
      <div className="pt-3 border-t border-aiesec-border flex items-center justify-between text-xs font-sans text-aiesec-text-secondary">
        <button
          onClick={handleLike}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
            hasLiked
              ? "text-aiesec-danger bg-aiesec-danger/10 font-medium"
              : "hover:bg-aiesec-surface-soft hover:text-aiesec-blue"
          }`}
        >
          <svg className="w-4 h-4" fill={hasLiked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.684a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>{likes}</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-aiesec-surface-soft hover:text-aiesec-blue transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>{commentsCount}</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-aiesec-surface-soft hover:text-aiesec-blue transition-colors cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span>Partager</span>
        </button>
      </div>
    </article>
  );
};