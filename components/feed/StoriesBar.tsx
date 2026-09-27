import React from "react";

interface Story {
  id: string;
  name: string;
  avatar: string;
  isCreate?: boolean;
}

export const StoriesBar: React.FC<{ stories: Story[] }> = ({ stories }) => {
  return (
    <div className="flex items-center gap-3 overflow-x-auto py-3 px-4 no-scrollbar border-b border-aiesec-border bg-aiesec-surface">
      {stories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
          <div
            className={`w-14 h-14 rounded-full p-0.5 flex items-center justify-center ${
              story.isCreate
                ? "bg-aiesec-surface-soft border-2 border-dashed border-aiesec-blue"
                : "bg-gradient-to-tr from-aiesec-purple to-aiesec-blue"
            }`}
          >
            {story.isCreate ? (
              <div className="w-full h-full rounded-full bg-aiesec-surface-soft flex items-center justify-center text-aiesec-blue">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            ) : (
              <img
                src={story.avatar}
                alt={story.name}
                className="w-full h-full rounded-full object-cover border-2 border-aiesec-surface"
              />
            )}
          </div>
          <span className="text-[11px] font-sans text-aiesec-text-secondary truncate max-w-[60px] text-center">
            {story.name}
          </span>
        </div>
      ))}
    </div>
  );
};