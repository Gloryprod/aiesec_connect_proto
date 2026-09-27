import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "purple" | "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "blue",
  size = "md",
}) => {
  const variants = {
    blue: "bg-aiesec-surface-soft text-aiesec-blue border-aiesec-blue/20",
    purple: "bg-aiesec-purple/10 text-aiesec-purple border-aiesec-purple/20",
    success: "bg-aiesec-success/10 text-aiesec-success border-aiesec-success/20",
    warning: "bg-aiesec-warning/10 text-aiesec-warning border-aiesec-warning/20",
    danger: "bg-aiesec-danger/10 text-aiesec-danger border-aiesec-danger/20",
    info: "bg-aiesec-info/10 text-aiesec-info border-aiesec-info/20",
    neutral: "bg-aiesec-background text-aiesec-text-secondary border-aiesec-border",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border transition-colors ${variants[variant]} ${sizes[size]}`}
    >
      {children}
    </span>
  );
};