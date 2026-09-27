import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = "", onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`bg-aiesec-surface border border-aiesec-border rounded-2xl p-6 shadow-sm transition-all duration-200 ${
        onClick ? "cursor-pointer hover:border-aiesec-indigo/40 hover:shadow-md" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{ title: string; subtitle?: string; action?: React.ReactNode }> = ({
  title,
  subtitle,
  action,
}) => (
  <div className="flex items-start justify-between pb-4 mb-4 border-b border-aiesec-border">
    <div>
      <h3 className="text-lg font-semibold text-aiesec-navy">{title}</h3>
      {subtitle && <p className="text-sm text-aiesec-text-secondary mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);